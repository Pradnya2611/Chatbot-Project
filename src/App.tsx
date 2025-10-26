import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [response, setResponse] = useState<string>(
    "Hi there! How can I assist you?"
  );
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (!value) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await axios.post("http://localhost:5000/chatbot", {
        question: value,
      });
      setResponse(res.data);
    } catch (err) {
      console.error(err);
      setResponse("⚠️ Error fetching response from backend.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Function to format markdown-like text manually
  const formatResponse = (text: string): string => {
    if (!text) return "";

    // Replace **bold**
    let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    // Replace *italic*
    formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Replace - lists
    formatted = formatted.replace(/^- (.*)$/gm, "<li>$1</li>");

    // Wrap lists with <ul> tags (only if <li> exists)
    if (formatted.includes("<li>")) {
      formatted = formatted.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");
    }

    // Replace newlines with <br/>
    formatted = formatted.replace(/\n/g, "<br/>");

    return formatted;
  };

  return (
    <div className="container">
      <h2>🤖 AI Chatbot</h2>

      <div className="input-section">
        <input
          type="text"
          value={value}
          onChange={onChange}
          disabled={loading}
          placeholder="Type your question here..."
        />
        <button onClick={handleSubmit} disabled={loading || !value}>
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>

      <div className="response-box">
        {loading ? (
          <p className="loading">⏳ Please wait, fetching response...</p>
        ) : (
          <>
            <h3>💬 Chatbot Response:</h3>
            {/* ✅ Render formatted HTML safely */}
            <p
              dangerouslySetInnerHTML={{ __html: formatResponse(response) }}
            ></p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
