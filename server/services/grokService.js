const axios = require('axios');

const GROK_API_BASE = 'https://api.x.ai/v1';
const REQUEST_TIMEOUT_MS = 90 * 1000;

const MODEL_CANDIDATES = [
  'grok-4-fast-non-reasoning',
  'grok-4-fast-reasoning',
  'grok-4',
  'grok-3',
  'grok-2-1212',
];

class AiServiceError extends Error {
  constructor(message, code = 'AI_ERROR', status = 502) {
    super(message);
    this.name = 'AiServiceError';
    this.code = code;
    this.status = status;
  }
}

const apiKey = () => (process.env.GROK_API_KEY || '').trim();

const isConfigured = () => Boolean(apiKey());

let modelCache = { model: null, resolvedAt: 0, available: null };

function pickChatModel(ids) {
  const envModel = (process.env.GROK_MODEL || '').trim();
  if (envModel) return envModel;
  const preferred = MODEL_CANDIDATES.find((candidate) => ids.includes(candidate));
  if (preferred) return preferred;
  const generic = ids.find(
    (id) => /^grok/i.test(id) && !/vision|image|embed|code|input/i.test(id)
  );
  return generic || null;
}

async function listModels({ force = false } = {}) {
  const now = Date.now();
  if (!force && modelCache.available && now - modelCache.resolvedAt < 10 * 60 * 1000) {
    return modelCache.available;
  }
  if (!isConfigured()) {
    throw new AiServiceError('AI service is not configured on the server.', 'AI_NOT_CONFIGURED', 503);
  }
  try {
    const response = await axios.get(`${GROK_API_BASE}/models`, {
      headers: { Authorization: `Bearer ${apiKey()}` },
      timeout: 15000,
      validateStatus: () => true,
    });
    if (response.status === 401) {
      throw new AiServiceError('The configured AI key was rejected by xAI.', 'AI_KEY_INVALID', 502);
    }
    if (response.status >= 400) {
      throw new AiServiceError('xAI rejected the model discovery request.', 'AI_UPSTREAM_ERROR', 502);
    }
    const ids = (response.data?.data || [])
      .map((item) => (typeof item === 'string' ? item : item?.id))
      .filter(Boolean);
    modelCache = {
      model: modelCache.model,
      resolvedAt: now,
      available: ids,
    };
    return ids;
  } catch (error) {
    if (error instanceof AiServiceError) throw error;
    if (error.code === 'ECONNABORTED') {
      throw new AiServiceError('The AI service did not respond in time.', 'AI_UPSTREAM_ERROR', 504);
    }
    throw new AiServiceError('Unable to reach the AI service.', 'AI_UPSTREAM_ERROR', 502);
  }
}

async function resolveModel({ force = false } = {}) {
  const now = Date.now();
  if (!force && modelCache.model && now - modelCache.resolvedAt < 10 * 60 * 1000) {
    return modelCache.model;
  }
  const envModel = (process.env.GROK_MODEL || '').trim();
  if (envModel) {
    modelCache = { model: envModel, resolvedAt: now, available: modelCache.available };
    return envModel;
  }
  const ids = await listModels({ force });
  const chosen = pickChatModel(ids);
  if (!chosen) {
    throw new AiServiceError('No chat-capable Grok model is available for this key.', 'AI_NO_MODEL', 502);
  }
  modelCache = { model: chosen, resolvedAt: now, available: ids };
  return chosen;
}

async function chatCompletion({
  messages,
  model,
  maxTokens = 1400,
  temperature = 0.6,
  json = false,
} = {}) {
  if (!isConfigured()) {
    throw new AiServiceError('AI service is not configured on the server.', 'AI_NOT_CONFIGURED', 503);
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new AiServiceError('AI request is missing messages.', 'AI_BAD_REQUEST', 400);
  }

  let chosenModel = model || (await resolveModel());
  let attemptJson = json;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
    }
    const payload = {
      model: chosenModel,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: false,
    };
    if (attemptJson) payload.response_format = { type: 'json_object' };

    try {
      const response = await axios.post(`${GROK_API_BASE}/chat/completions`, payload, {
        headers: {
          Authorization: `Bearer ${apiKey()}`,
          'Content-Type': 'application/json',
        },
        timeout: REQUEST_TIMEOUT_MS,
        validateStatus: () => true,
      });
      const status = response.status;
      const data = response.data;

      if (status >= 200 && status < 300) {
        const content = data?.choices?.[0]?.message?.content;
        if (typeof content !== 'string' || !content.trim()) {
          throw new AiServiceError('The AI returned an empty response.', 'AI_EMPTY_RESPONSE', 502);
        }
        const usage = data?.usage || null;
        return {
          content,
          model: chosenModel,
          usage:
            usage && Number.isFinite(Number(usage.total_tokens))
              ? { totalTokens: Number(usage.total_tokens) }
              : null,
        };
      }

      if (status === 401 || status === 403) {
        throw new AiServiceError('The configured AI key was rejected by xAI.', 'AI_KEY_INVALID', 502);
      }
      if (status === 400 && attemptJson) {
        attemptJson = false;
        continue;
      }
      if (status === 400) {
        throw new AiServiceError('xAI rejected the AI request payload.', 'AI_BAD_REQUEST', 502);
      }
      if (status === 404) {
        if (!model && attempt < 2) {
          chosenModel = await resolveModel({ force: true });
          continue;
        }
        throw new AiServiceError('The requested AI model is unavailable for this key.', 'AI_NO_MODEL', 502);
      }
      if (status === 429) {
        if (attempt < 2) continue;
        throw new AiServiceError('The AI service is rate limited. Please try again shortly.', 'AI_RATE_LIMITED', 429);
      }
      if (status >= 500) {
        if (attempt < 2) continue;
        throw new AiServiceError('The AI service is temporarily unavailable.', 'AI_UPSTREAM_ERROR', 502);
      }
      throw new AiServiceError('The AI request failed.', 'AI_UPSTREAM_ERROR', 502);
    } catch (error) {
      if (error instanceof AiServiceError) {
        if (error.code === 'AI_RATE_LIMITED' && attempt < 2) continue;
        throw error;
      }
      if (error.code === 'ECONNABORTED') {
        throw new AiServiceError('The AI took too long to respond. Please try again.', 'AI_TIMEOUT', 504);
      }
      throw new AiServiceError('Unable to reach the AI service.', 'AI_UPSTREAM_ERROR', 502);
    }
  }

  throw new AiServiceError('The AI service is temporarily unavailable.', 'AI_UPSTREAM_ERROR', 502);
}

function parseJsonContent(content) {
  if (!content) return null;
  let text = content.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    text = text.slice(start, end + 1);
  }
  try {
    return JSON.parse(text);
  } catch {
    try {
      return JSON.parse(text.replace(/,\s*([}\]])/g, '$1'));
    } catch {
      return null;
    }
  }
}

module.exports = {
  AiServiceError,
  isConfigured,
  listModels,
  resolveModel,
  chatCompletion,
  parseJsonContent,
};
