import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Mic, MicOff, Volume2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dawn-chat`;

const LANG_LABELS: Record<string, string> = {
  en: "English",
  es: "Español",
  hi: "हिन्दी",
  zh: "中文",
  pt: "Português",
};

export default function DawnChatbot() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: `Hi! I'm Dawn, your BridgePath guide. 🌅\n\nI can help you navigate banking, documents, and your first 30 days in the USA. How can I help you today?` },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = useCallback(async (allMessages: Msg[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: allMessages }),
    });

    if (!resp.ok || !resp.body) {
      const errorData = await resp.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to connect to Dawn");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > allMessages.length) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    let streamDone = false;
    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") { streamDone = true; break; }
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) upsertAssistant(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    const userMsg: Msg = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(updated);
    } catch (e: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Sorry, I couldn't connect right now. Please try again. ${e.message || ""}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSpeechToText = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Speech recognition is not supported in your browser. Try Chrome or Edge." }]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;

    const langMap: Record<string, string> = { en: "en-US", es: "es-ES", hi: "hi-IN", zh: "zh-CN", pt: "pt-BR" };
    recognition.lang = langMap[lang] || "en-US";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
          style={{ background: "linear-gradient(135deg, hsl(210 60% 35%), hsl(210 70% 50%))" }}
          aria-label="Open Dawn chatbot"
        >
          <MessageCircle size={24} className="text-white" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)] rounded-2xl shadow-2xl border border-border bg-card flex flex-col overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border" style={{ background: "hsl(210 60% 20%)" }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: "hsl(210 70% 50%)" }}>
                🌅
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Dawn</p>
                <p className="text-[10px] text-white/60">BridgePath Assistant • {LANG_LABELS[lang]}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-xl px-3 py-2 text-sm text-muted-foreground">
                  <span className="animate-pulse">Dawn is thinking…</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSpeechToText}
                className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                  isListening ? "bg-destructive/20 text-destructive" : "hover:bg-muted text-muted-foreground"
                }`}
                title={isListening ? "Stop listening" : "Speech to text"}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Ask Dawn anything…"
                className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all"
              >
                <Send size={16} />
              </button>
            </div>
            {isListening && (
              <p className="text-[10px] text-destructive mt-1 flex items-center gap-1">
                <Volume2 size={10} className="animate-pulse" /> Listening in {LANG_LABELS[lang]}…
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
