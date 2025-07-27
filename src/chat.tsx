import { useEffect, useRef, useState } from "react";

type Message = {
  sender: string;
  text: string;
  timestamp: string;
};

export default function Chat({ sender }: { sender: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const socketRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socketRef.current = new WebSocket("wss://chat-backend-kg2j.onrender.com");

    socketRef.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "history") {
        setMessages(msg.data);
      } else if (msg.type === "message") {
        setMessages((prev) => [...prev, msg.data]);
      }
    };

    return () => socketRef.current?.close();
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
    <div className="h-screen overflow-hidden">
      {/* Fixed Header */}
      <header className="bg-blue-600 text-white text-center py-4 shadow-md text-2xl font-bold fixed top-0 left-0 right-0 w-full z-10">
        AnyChat
      </header>

      {/* Main container under header */}
      <div className="pt-20 h-[100vh] flex flex-col max-w-2xl mx-auto w-full px-4">
        {/* Scrollable message container (expanded a bit more downwards) */}
        <div className="flex-1 p-4 bg-white rounded shadow-sm scrollable-container min-h-[70%]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.sender === sender ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-xl max-w-xs break-words ${
                  msg.sender === sender
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <span className="block font-semibold">{msg.sender}</span>
                <span>{msg.text}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Fixed input section */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            className="flex-1 border rounded-xl px-4 py-2 outline-none shadow-sm focus:ring focus:ring-blue-200"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
