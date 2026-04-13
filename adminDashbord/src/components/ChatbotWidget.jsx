import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function ChatbotWidget() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const endOfMessagesRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  
  // Local state for messages so it resets or updates contextually
  const [messages, setMessages] = useState([]);

  // Generate contextual AI welcome message based on route
  useEffect(() => {
    let contextualWelcome = "Hello! I'm your MicroInvest Assistant. Ask me about how crowdfunding works or escrow rules.";
    
    if (location.pathname.includes("/project/")) {
      contextualWelcome = "I see you're analyzing a specific investment opportunity. Need a quick project summary, an explanation of the remaining budget, or a risk analysis?";
    } else if (location.pathname.includes("submit-project")) {
      contextualWelcome = "I'm here to help you structure your proposal! Want me to scan for missing info or suggest ways to make your project more attractive to investors?";
    } else if (location.pathname.includes("promoter")) {
      contextualWelcome = "Welcome back, Promoter. Want a quick summary of your active projects or tips on raising funds faster?";
    } else if (location.pathname.includes("investor")) {
         contextualWelcome = "Welcome to your Portfolio. Do you need help understanding your estimated ROI or looking for new diversifications?";
    }

    setMessages([
      {
        sender: "bot",
        text: contextualWelcome,
        isContextual: true
      },
    ]);
  }, [location.pathname]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { sender: "user", text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate thinking delay with "isTyping"
    setMessages((prev) => [...prev, { sender: "bot", text: "...", isTyping: true }]);

    setTimeout(() => {
      // Remove typing indicator
      setMessages((prev) => prev.filter(m => !m.isTyping));

      let botReply = "I am an MVP intelligent agent. I assist with basic FAQs, project summaries, and risk analysis structuring.";
      const lowerInput = userMessage.text.toLowerCase();

      // FAQ Logic
      if (lowerInput.includes("invest") || lowerInput.includes("how")) {
        botReply = "To invest: Browse the Marketplace, select a project, use the Simulator, and confirm. Your funds go to a secured escrow account.";
      } else if (lowerInput.includes("escrow") || lowerInput.includes("secure") || lowerInput.includes("risk")) {
        botReply = "Risks are mitigated using an Escrow milestone system. Capital is frozen and released progressively as the promoter physically finishes construction phases.";
      } 
      // Contextual Logic: Project Verification
      else if (location.pathname.includes("submit-project") && (lowerInput.includes("check") || lowerInput.includes("missing"))) {
        botReply = "Looking at your form: Make sure to attach the 'Architectural Plans', as that heavily boosts investor confidence. Adding a detailed 'Financial Forecast' PDF is also suggested!";
      } 
      // Contextual Logic: Investor Summary
      else if (location.pathname.includes("/project/") && (lowerInput.includes("summary") || lowerInput.includes("explain"))) {
        botReply = "This project aims to raise funds for structural development. It offers a projected 8.5% annual yield. The primary risk involves slight construction delays, mitigated by local zoning pre-approvals.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 1200);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-xl hover:shadow-indigo-500/30 transition hover:-translate-y-1 hover:scale-105"
        >
          <Sparkles size={24} className="animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex w-[340px] flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl ring-1 ring-slate-900/5 sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex relative h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/10 shadow-inner">
                <Bot size={20} />
                <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-indigo-600"></span>
              </div>
              <div>
                <h3 className="text-[15px] font-bold">MicroInvest Spring AI</h3>
                <p className="text-xs text-white/80 font-medium tracking-wide">Contextual Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex h-96 flex-col gap-4 overflow-y-auto p-5 bg-slate-50/50">
            <div className="text-center text-xs font-semibold text-slate-400 mb-2 uppercase tracking-widest">Today</div>
            
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex w-full items-end gap-2 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full shadow-sm border ${
                    msg.sender === "user"
                      ? "bg-slate-100 text-slate-500 border-slate-200"
                      : "bg-indigo-50 text-indigo-500 border-indigo-100"
                  }`}
                >
                  {msg.sender === "user" ? <User size={13} /> : <Sparkles size={13} />}
                </div>
                
                <div
                  className={`relative max-w-[75%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "rounded-br-sm bg-slate-800 text-white"
                      : msg.isContextual 
                        ? "rounded-bl-sm bg-gradient-to-br from-indigo-50 to-fuchsia-50 border border-indigo-100/50 text-slate-700"
                        : "rounded-bl-sm bg-white border border-slate-100 text-slate-700"
                  }`}
                >
                  {msg.isTyping ? (
                    <div className="flex gap-1 py-1">
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400"></div>
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={endOfMessagesRef} className="h-1" />
          </div>

          {/* Input Area */}
          <div className="bg-white p-4 border-t border-slate-100">
            <form onSubmit={handleSendMessage} className="flex relative items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask your assistant..."
                className="w-full rounded-[20px] border border-slate-200 bg-slate-50 pl-4 pr-12 py-3.5 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-xl text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-0 transition-opacity"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
