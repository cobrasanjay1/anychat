import { useEffect, useRef, useState, RefObject } from "react";

type Message = {
  sender: string;
  text: string;
  timestamp: number;
};

type Props = {
  sender: string;
};

export default function Chat({ sender }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("wss://chat-backend-kg2j.onrender.com/");

    socketRef.current.onmessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "history") {
        setMessages(msg.data);
      } else if (msg.type === "message") {
        setMessages((prev) => [...prev, msg.data]);
      }
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socketRef.current?.send(JSON.stringify({ type: "message", sender, text }));
    setText("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-4 rounded shadow h-[70vh] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <span className="font-semibold">{msg.sender}</span>:{" "}
            <span>{msg.text}</span>
            <div className="text-sm text-gray-400">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="mt-2 flex">
        <input
          type="text"
          className="border p-2 flex-1 rounded-l"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-r"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
