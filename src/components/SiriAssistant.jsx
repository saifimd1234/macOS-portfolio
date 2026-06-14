import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";

const GREETING = {
  role: "assistant",
  content: "Hi! I'm Saifi's assistant 👋 Ask me about his projects, skills, or how to get in touch.",
};

const SUGGESTIONS = [
  "What has Saifi built?",
  "What's his tech stack?",
  "How can I contact him?",
];

const SiriAssistant = () => {
  const [open, setOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Load pop-up: appears shortly after the page loads, once per session.
  useEffect(() => {
    if (sessionStorage.getItem("siriPopupSeen")) return;
    const t = setTimeout(() => setShowPopup(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Keep the conversation scrolled to the latest message.
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  // Focus the input when the panel opens.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const dismissPopup = () => {
    setShowPopup(false);
    sessionStorage.setItem("siriPopupSeen", "1");
  };

  const openPanel = () => {
    dismissPopup();
    setOpen(true);
  };

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      // Send only the real user/assistant turns (skip the canned greeting).
      const payload = next.filter((m, i) => !(i === 0 && m === GREETING));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="siri">
      {/* On-load pop-up bubble */}
      {showPopup && !open && (
        <div className="siri-popup" role="status">
          <button
            type="button"
            className="siri-popup-close"
            onClick={dismissPopup}
            aria-label="Dismiss"
          >
            <X className="size-3" />
          </button>
          <p>👋 Hey! Ask me anything about Saifi.</p>
          <button type="button" className="siri-popup-cta" onClick={openPanel}>
            Start chatting
          </button>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div className="siri-panel" role="dialog" aria-label="Saifi's assistant">
          <header className="siri-panel-head">
            <span className="siri-orb siri-orb-sm" aria-hidden="true" />
            <div>
              <p className="siri-title">Siri</p>
              <p className="siri-subtitle">Saifi's portfolio assistant</p>
            </div>
            <button
              type="button"
              className="siri-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="size-4" />
            </button>
          </header>

          <div className="siri-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`siri-msg siri-msg-${m.role}`}>
                {m.content}
              </div>
            ))}

            {loading && (
              <div className="siri-msg siri-msg-assistant siri-typing">
                <span />
                <span />
                <span />
              </div>
            )}

            {error && <div className="siri-error">{error}</div>}

            {messages.length === 1 && !loading && (
              <div className="siri-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="siri-input">
            <input
              ref={inputRef}
              type="text"
              value={input}
              placeholder="Ask about Saifi…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Siri orb */}
      <button
        type="button"
        className={`siri-orb siri-launcher ${open ? "is-open" : ""}`}
        onClick={() => (open ? setOpen(false) : openPanel())}
        aria-label={open ? "Close assistant" : "Open assistant"}
      >
        {open && <X className="size-5 siri-launcher-x" />}
      </button>
    </div>
  );
};

export default SiriAssistant;
