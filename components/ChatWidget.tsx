"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useChatStore } from "@/lib/stores/chat-store";
import { cn } from "@/lib/cn";

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
}

const GREETING: ChatMessage = {
  id: "greeting",
  role: "bot",
  text: "Hi there! 👋 I'm Milo, your intelligent semiconductor sourcing assistant. Ask me about shipping, bulk/RFQ pricing, warranty, or order tracking.",
};

/**
 * A small animated robot face — blinking eyes, a pulsing antenna, and a mouth bar
 * that chatters while `speaking` is true — used as Milo's identity throughout the widget.
 */
function MiloFace({ size = 20, speaking = false }: { size?: number; speaking?: boolean }) {
  return (
    <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <span className="absolute -top-2 left-1/2 h-2 w-px -translate-x-1/2 bg-white/70" />
      <motion.span
        className="absolute -top-3 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand-accent"
        animate={speaking ? { opacity: [1, 0.4, 1], scale: [1, 1.45, 1] } : { opacity: [1, 0.35, 1], scale: [1, 1.3, 1] }}
        transition={{ duration: speaking ? 0.5 : 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="flex h-full w-full flex-col items-center justify-center gap-[2px] rounded-[7px] bg-white/25">
        <span className="flex items-center gap-[3px]">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-white"
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.85, 0.9, 0.95, 1], ease: "easeInOut" }}
          />
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-white"
            animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
            transition={{ duration: 3.4, repeat: Infinity, times: [0, 0.85, 0.9, 0.95, 1], ease: "easeInOut" }}
          />
        </span>
        <motion.span
          className="h-[3px] w-2.5 rounded-full bg-white/90"
          animate={speaking ? { scaleY: [0.4, 1.6, 0.5, 1.3, 0.4] } : { scaleY: 0.4 }}
          transition={speaking ? { duration: 0.45, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
        />
      </span>
    </span>
  );
}

/**
 * A larger robot figure that lives in the background of the message area — the same
 * blinking-eyes / talking-mouth language as MiloFace, scaled up so it visibly reacts
 * while Milo is speaking, instead of the icon in the header being the only tell.
 */
function MiloCharacter({ speaking }: { speaking: boolean }) {
  return (
    <svg viewBox="0 0 200 240" className="pointer-events-none absolute bottom-2 right-2 h-48 w-40 text-brand-primary" aria-hidden>
      <line x1="100" y1="8" x2="100" y2="32" stroke="currentColor" strokeWidth="7" strokeLinecap="round" opacity="0.1" />
      <circle cx="100" cy="8" r="9" fill="currentColor" opacity="0.1" />
      <rect x="38" y="32" width="124" height="102" rx="30" fill="currentColor" opacity="0.1" />
      <rect x="22" y="146" width="156" height="88" rx="26" fill="currentColor" opacity="0.1" />

      <motion.circle
        cx="82"
        cy="78"
        r="8"
        fill="currentColor"
        opacity="0.28"
        style={{ originX: 0.5, originY: 0.5 }}
        animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
        transition={{ duration: 3.6, repeat: Infinity, times: [0, 0.85, 0.9, 0.95, 1], ease: "easeInOut" }}
      />
      <motion.circle
        cx="118"
        cy="78"
        r="8"
        fill="currentColor"
        opacity="0.28"
        style={{ originX: 0.5, originY: 0.5 }}
        animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
        transition={{ duration: 3.6, repeat: Infinity, times: [0, 0.85, 0.9, 0.95, 1], ease: "easeInOut" }}
      />

      <motion.rect
        x="80"
        y="104"
        width="40"
        height="8"
        rx="4"
        fill="currentColor"
        opacity="0.28"
        style={{ originX: 0.5, originY: 0.5 }}
        animate={speaking ? { scaleY: [0.5, 2.3, 0.6, 1.8, 0.5] } : { scaleY: 0.5 }}
        transition={speaking ? { duration: 0.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
      />

      <motion.circle
        cx="100"
        cy="188"
        r="10"
        fill="currentColor"
        opacity="0.16"
        animate={speaking ? { opacity: [0.16, 0.5, 0.16], r: [10, 13, 10] } : { opacity: 0.12, r: 10 }}
        transition={speaking ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
      />
    </svg>
  );
}

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
    keywords: ["point", "loyalty", "tier", "reward"],
    reply: "You earn 1 loyalty point per ₹100 spent. Member starts at 0, Preferred unlocks at 1,000 points, and Premier at 5,000 — check My Account for your progress.",
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

/** Only ever called from effects/handlers (never during render), so it's safe for this to
 * differ between server and client — it never drives what gets rendered. */
function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function ChatWidget() {
  const { open, toggleChat, closeChat } = useChatStore();
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasGreetedRef = useRef(false);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // Milo goes quiet the moment the panel closes, instead of finishing a reply into an empty room.
  useEffect(() => {
    if (!open && speechSupported()) window.speechSynthesis.cancel();
  }, [open]);

  useEffect(() => {
    return () => {
      if (speechSupported()) window.speechSynthesis.cancel();
    };
  }, []);

  function speak(text: string, force = false) {
    if (!speechSupported() || (!voiceEnabled && !force)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.03;
    utterance.pitch = 1.15;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => /en-US|en-GB|en-IN/i.test(v.lang));
    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  // Greet out loud the first time the panel opens — never again on reopen, so it doesn't nag.
  useEffect(() => {
    if (open && !hasGreetedRef.current) {
      hasGreetedRef.current = true;
      speak(GREETING.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- speak() is stable enough for this one-shot greeting
  }, [open]);

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
      speak(reply);
    }, 900);
  }

  return (
    <div className="fixed z-40 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="mb-4 flex h-[28rem] max-h-[75dvh] w-[22rem] max-w-[90vw] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="relative flex items-center gap-3 overflow-hidden gradient-brand px-4 py-3.5 text-white">
              <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10 animate-blob" />
              <div className="pointer-events-none absolute -left-8 bottom-0 h-20 w-20 rounded-full bg-white/10 animate-blob-delay" />
              <motion.div
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20"
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                {speaking && (
                  <motion.span
                    className="absolute inset-0 rounded-full ring-2 ring-white/70"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                <MiloFace size={18} speaking={speaking} />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-brand-primary bg-emerald-400" />
              </motion.div>
              <div className="relative flex-1">
                <p className="font-heading text-sm font-extrabold">Meet Milo 🤖</p>
                <p className="text-[11px] text-white/80">{speaking ? "Speaking..." : "Your intelligent semiconductor sourcing assistant"}</p>
              </div>
              <button
                onClick={() => {
                  setVoiceEnabled((v) => {
                    if (v) window.speechSynthesis.cancel();
                    return !v;
                  });
                }}
                className="relative rounded-full p-1.5 hover:bg-white/15"
                aria-label={voiceEnabled ? "Mute Milo's voice" : "Unmute Milo's voice"}
                title={voiceEnabled ? "Mute voice" : "Unmute voice"}
              >
                {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button onClick={closeChat} className="relative rounded-full p-1.5 hover:bg-white/15" aria-label="Close chat">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="relative flex-1 space-y-3 overflow-y-auto bg-gradient-to-b from-rose-50 via-fuchsia-50/60 to-slate-50/40 p-4">
              <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-40">
                <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-brand-primary/30 blur-3xl animate-blob" />
                <div className="absolute -right-10 top-1/2 h-28 w-28 rounded-full bg-brand-secondary/30 blur-3xl animate-blob-delay" />
                <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-brand-accent/30 blur-3xl animate-blob" />
              </div>
              <MiloCharacter speaking={speaking} />
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "group/bubble flex max-w-[85%] items-end gap-1.5 rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
                      m.role === "user" ? "bg-gradient-to-br from-brand-primary to-brand-accent text-white" : "border border-slate-200 bg-white text-slate-700"
                    )}
                  >
                    <span>{m.text}</span>
                    {m.role === "bot" && (
                      <button
                        onClick={() => speak(m.text, true)}
                        className="shrink-0 rounded-full p-1 text-slate-300 opacity-0 transition hover:bg-brand-primary/10 hover:text-brand-primary group-hover/bubble:opacity-100"
                        aria-label="Hear this reply"
                        title="Hear this reply"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                      </button>
                    )}
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
                placeholder="Ask Milo a question..."
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
        onClick={toggleChat}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full gradient-brand text-white shadow-2xl"
        aria-label={open ? "Close chat with Milo" : "Chat with Milo"}
      >
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full bg-brand-primary"
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        {open ? <X className="relative h-6 w-6" /> : <MiloFace size={28} />}
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
