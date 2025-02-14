"use client";

import { useState } from "react";
import Message from "./Message";
import ChatInput from "./ChatInput";
import "@/styles/chatbot.css";

interface ChatMessage {
  id: number;
  text: string;
  sender: "bot" | "user";
}

interface ChatbotProps {
  onClose?: () => void;
}

export default function Chatbot({ onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: "안녕하세요! momo입니다 😊", sender: "bot" }
  ]);

  const categories = [
    { id: "ending", text: "🎬 결말해석" },
    { id: "genre", text: "🎭 장르별 영화" },
    { id: "character", text: "🗣️ 등장인물" },
    { id: "guide", text: "📖 간단 앱 설명서" }
  ];

  // ✅ Django의 Chatbot API 호출
  const fetchChatbotResponse = async (userMessage: string) => {
    if (!userMessage.trim()) {
      console.error("❌ 전송할 메시지가 없습니다.");
      return "전송할 메시지가 없습니다.";
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/bedrock/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),  // ✅ Django의 API가 받는 형식에 맞춤
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data = await response.json();
      return data.response || "응답을 받을 수 없습니다.";
    } catch (error) {
      console.error("❌ Django API 호출 오류:", error);
      return "죄송합니다. 응답을 가져올 수 없습니다. 😢";
    }
  };

  // ✅ 카테고리 버튼 클릭 시 챗봇 응답 요청
  const handleCategoryClick = async (categoryText: string) => {
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      text: categoryText,
      sender: "user",
    };

    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);

    const botReply = await fetchChatbotResponse(categoryText);

    const botResponse: ChatMessage = {
      id: messages.length + 2,
      text: botReply,
      sender: "bot",
    };

    setMessages((prev: ChatMessage[]) => [...prev, botResponse]);
  };

  // ✅ 사용자가 직접 메시지 입력 시 API 호출
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: messages.length + 1,
      text,
      sender: "user",
    };

    setMessages((prev: ChatMessage[]) => [...prev, userMessage]);

    const botReply = await fetchChatbotResponse(text);

    const botResponse: ChatMessage = {
      id: messages.length + 2,
      text: botReply,
      sender: "bot",
    };

    setMessages((prev: ChatMessage[]) => [...prev, botResponse]);
  };

  return (
    <div className="chatbot">
      <div className="chat-header">
        <span className="chat-title">momo-chat</span>
        {onClose && (
          <button className="chatbot-close-btn" onClick={onClose}>
            ✖
          </button>
        )}
      </div>

      <div className="chat-messages">
        <div className="chat-message-container bot">
          <Message text="안녕하세요! momo입니다 😊" sender="bot" />
        </div>

        <div className="chat-category-container">
          {categories.map((category) => (
            <button key={category.id} className="chat-category-button" onClick={() => handleCategoryClick(category.text)}>
              {category.text}
            </button>
          ))}
        </div>

        {messages.slice(1).map((msg) => (
          <div key={msg.id} className={`chat-message-container ${msg.sender}`}>
            <Message text={msg.text} sender={msg.sender} />
          </div>
        ))}
      </div>

      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}
