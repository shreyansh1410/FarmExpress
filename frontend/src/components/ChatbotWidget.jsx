import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Bot, MessageCircle, Minimize2, Send, Sparkles } from "lucide-react";
import { BASE_URL } from "../utils/constants";

const starterMessages = [
  {
    role: "assistant",
    text: "Hi! I am your CargoMatch AI assistant. Ask me about scheduling, route merging, or account help.",
  },
];

const quickPrompts = [
  "How do I add a truck?",
  "How can I merge routes?",
  "How to edit profile details?",
];

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef(null);

  const historyForApi = useMemo(
    () => messages.map((message) => ({ role: message.role, text: message.text })),
    [messages]
  );

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/ai/chat`, {
        message: trimmed,
        history: historyForApi,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.data.reply || "I am unable to answer right now. Please try again.",
        },
      ]);
    } catch (error) {
      const backendMessage =
        error?.response?.data?.details ||
        error?.response?.data?.error ||
        "I could not reach the AI service right now. Please try again shortly.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: backendMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    if (loading) return;
    setInput(promptText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="flex h-[min(72vh,560px)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl border border-base-300/70 bg-base-100/95 text-base-content shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-base-300/60 px-4 py-3">
            <div className="flex items-center gap-2 text-base-content">
              <Bot className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold">CargoMatch AI</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                <Sparkles className="h-3 w-3" />
                Online
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 text-base-content/70 transition-colors hover:bg-base-200/70 hover:text-base-content"
              title="Minimize"
              aria-label="Minimize chat assistant"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
          </div>

          <div ref={messagesContainerRef} className="flex-1 space-y-3 overflow-y-auto bg-base-100/70 p-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-content"
                    : "bg-base-200 text-base-content"
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && (
              <div className="w-fit rounded-xl bg-base-200 px-3 py-2 text-sm text-base-content/75">
                Thinking...
              </div>
            )}
          </div>

          <div className="border-t border-base-300/60 bg-base-100/90 p-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-full border border-base-300/70 bg-base-200/70 px-2.5 py-1 text-xs text-base-content/80 transition-colors hover:bg-base-200 hover:text-base-content"
                  onClick={() => handleQuickPrompt(prompt)}
                  disabled={loading}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about delivery planning..."
                rows={1}
                className="textarea textarea-bordered min-h-12 w-full resize-none border-base-300 bg-base-100 text-base-content placeholder:text-base-content/55"
              />
              <button
                type="button"
                disabled={loading || !input.trim()}
                onClick={sendMessage}
                className="btn btn-success btn-square"
                title="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="btn btn-success rounded-full shadow-xl h-14 w-14 p-0"
          aria-label="Open AI chat assistant"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default ChatbotWidget;
