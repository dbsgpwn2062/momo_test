import React from "react";

const ChatButton: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 flex flex-col items-center">
      <button className="w-16 h-16 bg-gray-100 border rounded-full flex items-center justify-center shadow-md">
        <span className="text-3xl">😊</span>
      </button>
    </div>
  );
};

export default ChatButton;