"use client";

import Image from "next/image";

export default function Message({ text, sender }: { text: string; sender: "bot" | "user" }) {
    return (
        <div className={`chat-message-container ${sender}`}>
            {sender === "bot" && (
                <Image src="/momo.png" alt="Momo" width={40} height={40} className="message-momo" />
            )}
            <div className={`chat-message ${sender}`}>{text}</div>
        </div>
    );
}
