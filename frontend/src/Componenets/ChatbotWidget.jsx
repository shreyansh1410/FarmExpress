import { useMemo, useState } from "react";
import axios from "axios";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { BASE_URL } from "../utils/constants";

const starterMessages = [
  {
    role: "assistant",
    text: "Hi! I am your FarmXpress AI assistant. Ask me about scheduling, route merging, or account help.",
  },
];

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const historyForApi = useMemo(
    () => messages.map((message) => ({ role: message.role, text: message.text })),
    [messages]
  );

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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[340px] h-[500px] bg-gray-900 border border-gray-700 shadow-2xl rounded-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <div className="flex items-center gap-2 text-white">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">FarmXpress AI</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-gray-950">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-auto bg-emerald-600 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && (
              <div className="bg-gray-800 text-gray-300 rounded-xl px-3 py-2 text-sm w-fit">
                Thinking...
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-700 bg-gray-900 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") sendMessage();
              }}
              placeholder="Ask about delivery planning..."
              className="input input-bordered w-full bg-gray-800 border-gray-700 text-white"
            />
            <button
              type="button"
              disabled={loading}
              onClick={sendMessage}
              className="btn btn-success btn-square"
            >
              <Send className="w-4 h-4" />
            </button>
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
