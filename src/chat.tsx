import React, { useEffect, useRef, useState } from "react";

export default function Chat({ sender }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);
  const bottomRef = useRef();

  useEffect(() => {
    socketRef.current = new WebSocket("wss://pnpk6q-3000.csb.app");

    socketRef.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "history") {
        setMessages(msg.data);
      } else if (msg.type === "message") {
        setMessages((prev) => [...prev, msg.data]);
      }
    };

    return () => socketRef.current.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socketRef.current.send(JSON.stringify({ type: "message", sender, text }));
    setText("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white p-4 rounded shadow h-[70vh] overflow-y-auto">
        <div className="flex flex-col space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.sender === sender
                  ? "bg-blue-100 self-end ml-auto"
                  : "bg-gray-200 self-start"
              }`}
            >
              <div className="text-sm font-medium text-gray-800">
                {msg.sender}
              </div>
              <div className="text-base">{msg.text}</div>
              <div className="text-xs text-gray-500 text-right">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div ref={bottomRef} />
      </div>
      <div className="mt-2 flex">
        <input
          type="text"
          className="border p-2 flex-1 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
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
