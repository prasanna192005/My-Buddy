import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import SideBarComp from './SideBarComp';
import card1 from '../assets/card1.svg';
import card2 from '../assets/card2.svg';
import card3 from '../assets/card3.svg';
import card4 from '../assets/card4.svg';
import card5 from '../assets/card5.svg';
import card6 from '../assets/card6.svg';
import Big from '../assets/BigCard.svg';
import { ThemeContext } from '../ThemeContext';
import Chatbot from './Chatbot';

function Dashboard() {
  const { theme } = useContext(ThemeContext);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="flex">
      <SideBarComp />
      <div className={`p-4 w-full mt-[76px] ${theme === 'light' ? '' : 'bg-black text-white'}`}>
        {/* Upper Section */}
        <div className="bg-orange-600 rounded-2xl p-6 mb-6 flex flex-col items-center md:flex-row">
          <div className="text-center md:text-left md:flex-1 ml-8 ">
            <h2 className="text-white text-3xl font-bold mb-2">Test series (New Syllabus)</h2>
            <p className="text-white mb-4">JEE Mains and Advanced 2024</p>
            <a href="#" className="text-white underline text-xs">Know more</a>
            <div className='flex mt-6'>
              <Link to="/test" className="bg-white text-orange-500 py-2 px-4 rounded-lg font-semibold cursor-pointer hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out">
                Take test series
              </Link>
            </div>
          </div>
          <div className="mt-4 md:mt-0 bottom-0">
            <img src={Big} className="w-80 h-40 mr-28" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-4">Meet Your DOSTS</h3>
        <div className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 ${theme === 'light' ? '' : 'text-black'}`}>
          <Link to="/notes" className="bg-yellow-100 p-4 rounded-3xl flex items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <img src={card1} alt="Study Material DOST" className="w-40 h-40 mx-4" />
            <div>
              <h4 className="text-sm font-semibold">Study Material DOST</h4>
            </div>
          </Link>
          <Link to="/practice-dost" className="bg-green-100 p-4 rounded-3xl flex items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <img src={card2} alt="Practice DOST" className="w-40 h-40 mx-4" />
            <div>
              <h4 className="text-sm font-semibold">Practice DOST</h4>
            </div>
          </Link>
          <Link to="/connect" className="bg-purple-100 p-4 rounded-3xl flex items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <img src={card3} alt="Formula Sheet DOST" className="w-40 h-40 mx-4" />
            <div>
              <h4 className="text-sm font-semibold">Connect with your DOST</h4>
            </div>
          </Link>
        </div>
        <div className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${theme === 'light' ? '' : 'text-black'}`}>
          <Link to="/chat" className="bg-orange-50 p-4 rounded-3xl flex items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <img src={card4} alt="Backlog Remover DOST" className="w-40 h-40 mx-4" />
            <div>
              <h4 className="text-sm font-semibold">Talk to your DOST</h4>
            </div>
          </Link>
          <Link to="/resource" className="bg-pink-50 p-4 rounded-3xl flex items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <img src={card5} alt="Revision DOST" className="w-40 h-40 mx-4" />
            <div>
              <h4 className="text-sm font-semibold">Resource DOST</h4>
            </div>
          </Link>
          <Link to="/dashboard/pdf" className="bg-indigo-50 p-4 rounded-3xl flex items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <img src={card6} alt="Speed Booster DOST" className="w-40 h-40 mx-4" />
            <div>
              <h4 className="text-sm font-semibold">Speed Booster DOST</h4>
            </div>
          </Link>
        </div>
      </div>
      <div>
        <button onClick={toggleChat} className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11s1.343 3 3 3 3-1.343 3-3zm-4 8h8a4 4 0 004-4V8a4 4 0 00-4-4H8a4 4 0 00-4 4v7a4 4 0 004 4z" />
          </svg>
        </button>
        {isChatOpen && <Chatbot />}
      </div>
    </div>
  );
}

export default Dashboard;
