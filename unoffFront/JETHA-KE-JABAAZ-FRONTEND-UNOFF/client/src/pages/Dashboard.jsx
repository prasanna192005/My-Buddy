import React, { useContext, useEffect, useState } from 'react';
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
import { Tilt } from 'react-tilt'
import { BackgroundGradientAnimationDemo } from '../Back';
import { UserContext } from '../UserContext';
import FlipCard from './FlipCard';
import ConnectionCard from './ConnectionCard';
import axios from 'axios';

const defaultOptions = {
	reverse:        false,  // reverse the tilt direction
	max:            35,     // max tilt rotation (degrees)
	perspective:    1000,   // Transform perspective, the lower the more extreme the tilt gets.
	scale:          1.1,    // 2 = 200%, 1.5 = 150%, etc..
	speed:          1000,   // Speed of the enter/exit transition
	transition:     true,   // Set a transition on enter/exit.
	axis:           null,   // What axis should be disabled. Can be X or Y.
	reset:          true,    // If the tilt effect has to be reset on exit.
	easing:         "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
}

function Dashboard() {
  const { theme} = useContext(ThemeContext);
  const {user} = useContext(UserContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [friends, setFriends] = useState([]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  async function fetchFriends() {
    const res = await axios.get('http://localhost:8000/profile/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (res.data) {
      
      setFriends(res.data.user.friends);
      const friendRequests = res.data.user.received_friend_requests
      .filter(req => req.status === 'pending') 
      .map(req => ({
        id: req.id,
        sender: req.sender
      }));
    }
  }

  return (
    <div className="flex font-[Inter] font-semibold">
      <SideBarComp />
      <div className={`p-4 w-full flex flex-col mt-[76px] ${theme === 'light' ? '' : 'bg-black text-white'}`}>
        {/* Upper Section */}
       
      <div className="bg-orange-600 rounded-2xl p-6 mb-6 flex flex-col gap-2 items-center md:flex-row">
        
          <div className="text-center md:text-left md:flex-1 ml-8 ">
            <h2 className="text-white text-3xl font-bold mb-2">Test series (New Syllabus)</h2>
            <p className="text-white mb-4">JEE Mains and Advanced 2025</p>
            <a href="#" className="text-white underline text-xs">Know more</a>
            <Tilt options={defaultOptions} style={{ height: 60, width: 250 }}>
            <div className='flex mt-6'>
              <Link to="/test" className="bg-white text-orange-500 py-2 px-4 rounded-lg font-semibold cursor-pointer hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out">
                Take test series
              </Link>
            </div>
            </Tilt>
          </div>
          
          <div className="mt-4 md:mt-0 bottom-0">
            <img src={Big} className="w-80 h-40 mr-28" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-4 ml-2">Meet Your DOSTS 👋</h3>
        {!user.is_mentor && (
          <div className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 ${theme === 'light' ? '' : 'text-black'}`}>
          <Tilt options={defaultOptions} style={{ height: 60, width: 420 }}>
          <Link to="/notes" className="bg-gradient-to-br from-[#A531DC] to-[#4300B1]  hover:bg-orange-500 p-4 rounded-3xl flex items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <img src={card1} alt="Study Material DOST" className="w-40 h-40 mx-4" />
            <div>
              <h4 className="text-2xl font-bold text-white">My Notes</h4>
            </div>
          </Link>
          </Tilt>
          <Tilt options={defaultOptions} style={{ height: 60, width: 420 }}>
          <Link to="/practice-dost" className="bg-gradient-to-br from-[#FF896D] to-[#D02020] p-4 rounded-3xl flex items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <img src={card2} alt="Practice DOST" className="w-40 h-40 mx-4" />
            <div>
              <h4 className="text-2xl font-bold text-white">Practice DOST</h4>
            </div>
          </Link>
          </Tilt>
          <Link to="/chat" className="bg-gradient-to-br from-[#FFD439] to-[#FF7A00] p-4 rounded-3xl flex items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <img src={card4} alt="Backlog Remover DOST" className="w-40 h-40 mx-4" />
            <div>
              <h4 className="text-2xl font-bold text-white">Talk to your DOST</h4>
            </div>
          </Link>
        </div>)} 
        <div className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${theme === 'light' ? '' : 'text-black'}`}>
          <Link to="/connect" className="bg-gradient-to-br from-[#3793FF] to-[#0017E4] p-4 rounded-3xl flex items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <img src={card3} alt="Formula Sheet DOST" className="w-40 h-40 mx-4" />
            <div>
              <h4 className="text-2xl font-bold text-white">Connect with your DOST</h4>
            </div>
          </Link>
          
          <Link to="/resource" className="bg-gradient-to-br from-[#FFED46] to-[#FF7EC7] p-4 rounded-3xl flex items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <img src={card5} alt="Revision DOST" className="w-40 h-40 mx-4" />
            <div>
              <h4 className="text-2xl font-bold text-white">Resource DOST</h4>
            </div>
          </Link>
          <Link to="/dashboard/pdf" className="bg-gradient-to-br from-[#7CF7FF] to-[#4B73FF] p-4 rounded-3xl flex items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <img src={card6} alt="Speed Booster DOST" className="w-40 h-40 mx-4" />
            <div>
              <h4 className="text-2xl font-bold text-white">Speed Booster DOST</h4>
            </div>
          </Link>
        </div>
        <div> 
          <h3 className="text-2xl font-bold mb-4 ml-2">Meet Your Connections 👋</h3>
          <div className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4 ${theme === 'light' ? '' : 'text-black'}`}>
            {friends.length === 0 ? (
              <p>No friends found</p>
            ) : (
              friends.map((friend) => (
                <ConnectionCard key={friend.id} user={friend} />
              ))           
            )}
          </div>
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
