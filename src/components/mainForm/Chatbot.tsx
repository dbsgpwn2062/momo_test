"use client";
import { useState, useEffect, useRef } from "react";
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
    {
      id: 1,
      text: "안녕하세요! momo입니다 :미소짓는_상기된_얼굴: 무엇을 도와드릴까요?",
      sender: "bot",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // :흰색_확인_표시: 카테고리 버튼 목록
  const categories = [
    { id: "ending", text: ":클래퍼: 결말해석" },
    { id: "genre", text: ":공연: 장르별 영화" },
    { id: "character", text: ":말하고_있는_머리_그림자: 등장인물" },
    { id: "guide", text: ":펼쳐진_책: 간단 앱 설명서" },
  ];
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const fetchChatbotResponse = async (userMessage: string) => {
    if (!userMessage.trim() || loading) return;
    setLoading(true);
    try {
      const response = await fetch("/api/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_text: userMessage }),
      });
      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }
      const data = await response.json();
      return data.response || "응답을 받을 수 없습니다.";
    } catch (error) {
      console.error(":x: Next.js API 호출 오류:", error);
      return "죄송합니다. 응답을 가져올 수 없습니다. :울다:";
    } finally {
      setLoading(false);
    }
  };
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMessage: ChatMessage = {
      id: messages.length + 1,
      text,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    const botReply = await fetchChatbotResponse(text);
    const botResponse: ChatMessage = {
      id: messages.length + 2,
      text: botReply,
      sender: "bot",
    };
    setMessages((prev) => [...prev, botResponse]);
  };
  return (
    <div className="chatbot" onClick={(e) => e.stopPropagation()}>
      <div className="chat-header">
        <span className="chat-title">momo-chat</span>
        {onClose && (
          <button className="chatbot-close-btn" onClick={onClose}>
            :두꺼운_곱셈_기호:
          </button>
        )}
      </div>
      {/* :흰색_확인_표시: 첫 메시지와 카테고리를 함께 감싸는 컨테이너 */}
      <div className="chat-first-container">
        <div className="chat-first-message">
          <img src="/momo.png" alt="momo" className="message-momo" />
          <div className="chat-bubble">
            안녕하세요! momo입니다 :미소짓는_상기된_얼굴: 무엇을 도와드릴까요?
          </div>
        </div>
        {/* :흰색_확인_표시: 첫 메시지 바로 아래에 카테고리 버튼 추가 */}
        <div className="chat-category-container">
          {categories.map((category) => (
            <button
              key={category.id}
              className="chat-category-button"
              onClick={() => handleSendMessage(category.text)}
            >
              {category.text}
            </button>
          ))}
        </div>
      </div>
      <div className="chat-messages">
        {messages.slice(1).map((msg) => (
          <div key={msg.id} className={`chat-message-container ${msg.sender}`}>
            <div className="chat-bubble">{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-message-container bot">
            <div className="chat-bubble">
              :모래가_내려오고_있는_모래시계: momo가 답변을 작성 중입니다...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input-container">
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="메시지를 입력하세요..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(inputRef.current!.value);
              inputRef.current!.value = "";
            }
          }}
        />
        <button
          className="chat-send-btn"
          onClick={() => {
            handleSendMessage(inputRef.current!.value);
            inputRef.current!.value = "";
          }}
        ></button>
      </div>
    </div>
  );
}
