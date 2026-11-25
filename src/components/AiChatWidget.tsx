import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'model',
    text: 'Namaste! Main Mangal Web ka AI assistant hoon. Websites, Shopify stores, Meta Ads, ya WhatsApp automation ke baare mein kuch bhi poochhein (English ya Hindi mein).',
  },
];

const QUICK_PROMPTS = [
  'Meta Ads for clothing store',
  'Dental clinic website & booking',
  'WhatsApp automation setup',
];

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    setErrorMsg(null);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Could not get a response right now.');
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `m-${Date.now()}`,
            role: 'model',
            text: data.reply,
          },
        ]);
      }
    } catch {
      setErrorMsg('Network error reaching the AI assistant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          data-testid="ai-chat-launcher"
          aria-label="Open Mangal Web AI Assistant"
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Ask Mangal Web AI</span>
        </button>
      ) : (
        <div
          role="dialog"
          aria-label="Mangal Web AI Assistant"
          data-testid="ai-chat-panel"
          className="flex h-[440px] w-[340px] sm:w-[370px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-4 py-3 text-white">
            <div>
              <div className="text-xs font-semibold">Mangal Web Assistant</div>
              <div className="text-[11px] text-slate-300">
                Websites · Shopify · Meta Ads · Automation
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close AI assistant"
              className="rounded-lg p-1 text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-700 text-white'
                      : 'border border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-500">
                  Thinking...
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Quick prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto border-t border-slate-100 bg-white px-3 py-2">
            {QUICK_PROMPTS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700 hover:border-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-2.5"
          >
            <label htmlFor="ai-chat-input" className="sr-only">
              Ask a question
            </label>
            <input
              id="ai-chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
