"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
}

const GREETING: ChatMessage = {
  id: "greeting",
  role: "bot",
  text: "Hi there! 👋 I'm the MillenniumDigital assistant. Ask me about shipping, bulk/RFQ pricing, warranty, or order tracking.",
};

const CANNED_RESPONSES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["price", "cost", "discount", "bulk"],
    reply: "For bulk pricing, our RFQ/BOM tool gives volume discounts of 5% above 5,000 units, 10% above 10,000, and 16% above 20,000 units. Head to the RFQ tab to get a quote!",
  },
  {
    keywords: ["ship", "delivery", "deliver"],
    reply: "We offer free delivery on prepaid orders above ₹2,000, with most in-stock items dispatched within 24-48 hours.",
  },
  {
    keywords: ["return", "warranty", "refund"],
    reply: "Every product page lists its warranty period under the Warranty tab. Returns are accepted within 7 days for unused items in original packaging.",
  },
  {
    keywords: ["order", "track", "status"],
    reply: "You can track any order's status — Processing, Confirmed, Shipped, or Delivered — from the Order Details tab in the top navigation.",
  },
  {
    keywords: ["rfq", "quote"],
    reply: "Upload a BOM (.xlsx/.csv) or add parts manually on the RFQ/BOM page, and our sourcing team typically responds within 1-2 business days.",
  },
  {
    keywords: ["hi", "hello", "hey"],
    reply: "Hello! How can I help — product availability, bulk pricing, shipping, or something else?",
  },
];

function getCannedReply(input: string): string {
  const lower = input.toLowerCase();
  const match = CANNED_RESPONSES.find((r) => r.keywords.some((k) => lower.includes(k)));
  return match?.reply ?? "Thanks for reaching out! Our support team will follow up shortly. In the meantime, feel free to browse our catalog or start an RFQ for bulk pricing.";
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = getCannedReply(text);
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "bot", text: reply }]);
      setTyping(false);
    }, 900);
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="mb-4 flex h-[28rem] w-[22rem] max-w-[90vw] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="relative flex items-center gap-3 overflow-hidden gradient-brand px-4 py-3.5 text-white">
              <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10 animate-blob" />
              <div className="pointer-events-none absolute -left-8 bottom-0 h-20 w-20 rounded-full bg-white/10 animate-blob-delay" />
              <motion.div
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20"
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bot className="h-5 w-5" />
              </motion.div>
              <div className="relative flex-1">
                <p className="font-heading text-sm font-extrabold">MillenniumDigital Assistant</p>
                <p className="flex items-center gap-1 text-[11px] text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online now
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="relative rounded-full p-1.5 hover:bg-white/15">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="relative flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-rose-50 via-fuchsia-50/60 to-slate-50/40 p-4">
              <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
                <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-brand-primary/30 blur-3xl animate-blob" />
                <div className="absolute -right-10 top-1/2 h-28 w-28 rounded-full bg-brand-secondary/30 blur-3xl animate-blob-delay" />
                <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-brand-accent/30 blur-3xl animate-blob" />
              </div>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                      m.role === "user" ? "bg-gradient-to-br from-brand-primary to-brand-accent text-white" : "border border-slate-200 bg-white text-slate-700"
                    )}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-slate-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={sendMessage} className="relative flex items-center gap-2 border-t border-slate-200 bg-white p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="w-full rounded-full border-2 border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-brand-primary focus:shadow-[0_0_0_4px_rgba(155,27,92,0.12)]"
              />
              <button
                type="submit"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white shadow-md transition hover:shadow-lg"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full gradient-brand text-white shadow-2xl"
        aria-label="Open chat"
      >
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full bg-brand-primary"
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {open ? <X className="relative h-6 w-6" /> : <MessageCircle className="relative h-6 w-6" />}
        {!open && (
          <motion.span
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-[10px] font-bold text-white"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <Sparkles className="h-3 w-3" />
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}
