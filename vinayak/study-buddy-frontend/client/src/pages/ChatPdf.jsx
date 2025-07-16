import { useContext, useState } from "react";
import ChatpdfSidebar from './ChatpdfSidebar';
import { AiOutlineRobot } from "react-icons/ai";
import axios from "axios";
import { ThemeContext } from "../ThemeContext";

function ChatPdf() {
  const { theme } = useContext(ThemeContext);
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/ask_question/', { question });
      setReply(response.data.response);
      console.log(reply)
    } catch (error) {
      console.error('Error submitting question:', error);
      setReply('Failed to get response');
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`flex h-screen ${theme === 'light' ? '' : 'bg-black text-white'}`}>
      <ChatpdfSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <main className={`flex-grow p-6  flex justify-center items-center ml-80`}>
        <div className="flex flex-col items-center text-center">
          <header className="flex items-center mb-6">
            <h1 className="text-3xl font-bold mr-2">Multi-PDF's</h1>
            <span className="text-3xl">📚</span>
            <h1 className="text-3xl font-bold mx-2">- Chat Agent</h1>
            <AiOutlineRobot className="text-3xl" />
          </header>
          <p className="text-md mb-4">Ask a Question from the PDF Files uploaded .. ✍️📤</p>
          <div className="w-full max-w-md">
            <input 
              type="text" 
              value={question} 
              onChange={handleQuestionChange} 
              placeholder="What are the pros of clustering" 
              className="w-full p-2 border rounded mb-4 text-black" 
            />
            <button 
              onClick={handleSubmit} 
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
          <div className="mt-6 w-full max-w-md border p-2 bg-gradient-to-r rounded-md from-cyan-100 to-blue-300">
            <p className="font-semibold m-1">Reply:</p>
            <p className="mt-2 text-md">{reply}</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ChatPdf;
