"use client";

import { useState } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import "@/styles/chatbot.css";

interface ChatbotProps {
  onClose?: () => void; // ✅ onClose props 추가
}

export default function Chatbot({ onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<{ id: number; text: string; sender: "bot" | "user" }[]>([
    { id: 1, text: "안녕하세요! 무엇을 도와드릴까요? 😊", sender: "bot" }
  ]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage = { id: messages.length + 1, text, sender: "user" as "user" };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse = { id: messages.length + 2, text: "챗봇 응답: " + text, sender: "bot" as "bot" };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="chatbot">
      {/* ✅ 헤더 내부에 닫기 버튼 추가 */}
      <div className="chat-header">
  <span className="chat-title">momo-chat</span> {/* ✅ 가운데 정렬 */}
  {onClose && (
    <button className="chatbot-close-btn" onClick={onClose}>
      ✖
    </button>
  )}
</div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <Message key={msg.id} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
