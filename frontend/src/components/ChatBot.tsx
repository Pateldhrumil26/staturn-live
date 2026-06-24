import { useState } from "react";
import { FaRobot } from "react-icons/fa";
import axios from "axios";

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState("");

  const sendMessage = async () => {
    const res = await axios.post(
      "http://localhost:5000/api/chat/",
      {
        message,
      }
    );

    setAnswer(res.data.answer);
  };

  return (
    <>
      {/* Floating Button */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg"
      >
        <FaRobot size={25} />
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 w-80 bg-white rounded-lg shadow-lg p-4">
          <h2 className="font-bold mb-3">
            Saturn Light Assistant
          </h2>

          <input
            type="text"
            placeholder="Ask anything..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            className="border w-full p-2"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
          >
            Send
          </button>

          <p className="mt-3 text-sm">
            {answer}
          </p>
        </div>
      )}
    </>
  );
}

export default ChatBot;