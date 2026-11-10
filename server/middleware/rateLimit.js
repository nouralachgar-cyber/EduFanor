const buckets = new Map();

const MAX_KEYS = 5000;

function sweepExpired(now) {
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
    if (buckets.size <= MAX_KEYS) break;
  }
}

function rateLimit({ windowMs = 60 * 1000, max = 30, scope = 'general' } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    if (buckets.size > MAX_KEYS) sweepExpired(now);

    const identity = String(req.user?._id || req.ip || 'anonymous');
    const key = `${scope}:${identity}`;
    let bucket = buckets.get(key);
    if (!bucket || now > bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }
    bucket.count += 1;

    if (bucket.count > max) {
      const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        message: 'Too many AI requests. Please wait a moment and try again.',
        code: 'RATE_LIMITED',
      });
    }
    return next();
  };
}

module.exports = { rateLimit };
