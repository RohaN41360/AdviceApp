import axios from "axios";
import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [data, setData] = useState("In order to get, you have to give.");
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  // const [adviceNumber, setAdviceNumber] = useState(0);
  const [topic, setTopic] = useState("");
  const [personalizedAdvice, setPersonalizedAdvice] = useState("");
  const [isPersonalizedLoading, setIsPersonalizedLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility

  const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_KEY; // Replace with your actual API key

  const getadvice = async () => {
    setIsLoading(true);
    setAnimate(false);
    try {
      const result = await axios.get("https://api.adviceslip.com/advice");
      setData(result.data.slip.advice);
      // setAdviceNumber(result.data.slip.id);
      setAnimate(true);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const getPersonalizedAdvice = async () => {
    if (!topic.trim()) return;
    
    setIsPersonalizedLoading(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Give me a thoughtful and inspiring advice about ${topic}. Keep it concise and meaningful, around 2-3 sentences.`
            }]
          }]
        })
      });

      const data = await response.json();
        
      if (data.error) {
        throw new Error(data.error.message || 'API Error');
      }

      // Check for different possible response structures
      let adviceText = '';
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        adviceText = data.candidates[0].content.parts[0].text;
      } else if (data.promptFeedback?.block) {
        adviceText = "I apologize, but I cannot provide advice on this topic.";
      } else {
        console.error('Unexpected response structure:', data);
        adviceText = "Sorry, couldn't generate advice at the moment. Please try again.";
      }

      setPersonalizedAdvice(adviceText);
      setIsModalOpen(true); // Open the modal when advice is ready
      setTopic(""); // Clear the topic input  
    } catch (error) {
      console.error('Error fetching personalized advice:', error);
      setPersonalizedAdvice("Sorry, couldn't generate advice at the moment. Please try again.");
    }
    setIsPersonalizedLoading(false);
  };

  useEffect(() => {
    setAnimate(true);
    getadvice();
  }, []);

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setPersonalizedAdvice(""); // Clear the advice when closing the modal
  };

  return (
    <div className="App">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <div className="floating-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
        <div className="shape shape4"></div>
      </div>
      <div className="content">
        <div className="advice-header">
          <span className="advice-label">Wise Words</span>
          <div className="divider"></div>
        </div>
        <div className={`advice-container ${animate ? 'fade-in' : ''}`}>
          <h1>"{data}"</h1>
        </div>
        <div className="button-container">
          <button 
            className={`button ${isLoading ? 'loading' : ''}`} 
            onClick={getadvice}
            disabled={isLoading}
          >
            <span>{isLoading ? 'Getting Advice...' : 'Get Advice'}</span>
            <div className="button-glow"></div>
          </button>
        </div>

        <div className="divider"></div>

        <div className="personalized-section">
          <span className="advice-label">Unlock Wise Words tailored to your request</span>
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter a topic (e.g., career, relationships, health)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="topic-input"
            />
            <button 
              className={`button ${isPersonalizedLoading ? 'loading' : ''}`}
              onClick={getPersonalizedAdvice}
              disabled={isPersonalizedLoading || !topic.trim()}
            >
              <span>{isPersonalizedLoading ? 'Generating...' : 'Get Wise Words'}</span>
              <div className="button-glow"></div>
            </button>
          </div>
        </div>

        {/* Modal for Personalized Advice */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>"{personalizedAdvice}"</h2>
              <button className="close-button" onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
