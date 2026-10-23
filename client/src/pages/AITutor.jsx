import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import { Bot, Send, User, Sparkles, ShieldAlert } from 'lucide-react';

export default function AITutor() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: isAr
        ? 'مرحباً! أنا المساعد الذكي للإسعافات الأولية فـ EduFanor. كيف يمكنني مساعدتك اليوم؟'
        : 'Hello! I am your EduFanor AI First Aid Tutor. How can I assist you today?'
    }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: isAr
            ? 'تذكر دائماً: في حالات الطوارئ الحادة، اتصل بالإسعاف فوراً (150 أو 15) ثم ابدأ خطوات الإسعاف الأولية المعتمدة.'
            : 'Always remember: in severe emergencies, call emergency services immediately before starting first aid steps.'
        }
      ]);
    }, 1000);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F8F4FC] dark:bg-[#150D18] text-[#2C1B33] dark:text-[#F8F4FC]">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8 flex flex-col justify-between max-w-[1200px]">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#EFE8F4] dark:border-[#35213D] pb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#3B2042] text-white flex items-center justify-center font-bold text-xl">
            🤖
          </div>
          <div>
            <h1 className="text-lg font-black text-[#3B2042] dark:text-white">EduFanor AI Tutor</h1>
            <p className="text-xs text-[#796882]">
              {isAr ? 'مساعد تعليمي تفاعلي للتدريب على الإسعافات الأولية' : 'Interactive First Aid Practice Assistant'}
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 my-6 space-y-4 overflow-y-auto max-h-[60vh] p-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? (isAr ? 'flex-row' : 'flex-row-reverse') : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  msg.sender === 'bot' ? 'bg-[#3B2042] text-white' : 'bg-[#8A6BBE] text-white'
                }`}
              >
                {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div
                className={`max-w-md p-4 rounded-2xl text-xs font-semibold leading-relaxed ${
                  msg.sender === 'bot'
                    ? 'bg-white dark:bg-[#211526] border border-[#EFE8F4] dark:border-[#35213D] text-[#2C1B33] dark:text-[#F8F4FC]'
                    : 'bg-[#3B2042] text-white'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAr ? 'اكتب سؤالك هنا...' : 'Ask your question here...'}
            className={`w-full py-3.5 ${isAr ? 'pr-5 pl-12' : 'pl-5 pr-12'} bg-white dark:bg-[#211526] border border-[#EFE8F4] dark:border-[#35213D] rounded-full text-xs font-bold outline-none focus:ring-2 focus:ring-[#8A6BBE] shadow-sm`}
          />
          <button
            type="submit"
            className={`absolute top-2 ${isAr ? 'left-2' : 'right-2'} p-2.5 rounded-full bg-[#3B2042] text-white hover:bg-[#2A1630] transition-colors`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </main>
    </div>
  );
}