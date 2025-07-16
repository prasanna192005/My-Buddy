import axios from 'axios';
import React, { useState, useEffect, useContext, useRef } from 'react';
import Background from '../assets/back.jpg';
import { MdSend } from "react-icons/md";
import { ThemeContext } from '../ThemeContext';
import { FaMoon } from "react-icons/fa";
import { IoIosSunny } from "react-icons/io";
import background1 from '../assets/back1.jpg';
import { FaUserCircle } from "react-icons/fa";
import uniqBy from 'lodash/uniqBy'; 
import { UserContext } from '../UserContext';
function Chat() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [ws, setWs] = useState(null);
  const divUnderMessages = useRef();
  const [loading, setLoading] = useState(true);
  const [onlinePeople, setOnlinePeople] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    const ws = new WebSocket(`ws://localhost:4000?token=${token}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      setWs(ws);
    };

    ws.addEventListener('message', handleMessage);
  }, []);

  function handleMessage(e) {
    const messageData = JSON.parse(e.data);
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    } else if ('text' in messageData) {
      setMessages(prev => uniqBy([...prev, { ...messageData }], '_id'));
    }
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      if (userId !== user.id) {
        people[userId] = username;
      }
    });
    setOnlinePeople(people);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const message = {
      recipient: selectedUser.id,
      text: newMessageText,
      sender: user.id,
    };

    ws.send(JSON.stringify(message));
    setNewMessageText('');
  }

  useEffect(() => {
    if (divUnderMessages.current) {
      divUnderMessages.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      setLoading(true);
      axios.get(`http://localhost:4000/messages/${selectedUser.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setMessages(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching messages:', err);
        setLoading(false);
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    axios.get('http://localhost:8000/connect/friends/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => {
      if (res.data.friends) {
        setUsers(res.data.friends);
      }
    })
    .catch(err => {
      console.error('Error fetching users:', err);
    });
  }, []);

  const IdHex = Number(user.id).toString(16).padStart(24, '0');

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gradient-to-tr from-cyan-200 via-purple-300 to-violet-400 p-4">
        <div className="w-full flex justify-between">
          <input
            type="text"
            placeholder="Search people, groups and messages"
            className="px-4 py-2 mb-4 border border-gray-300 rounded w-full focus:outline-none focus:border-blue-500"
          />
          <button className="ml-2 p-2">
            {theme === 'light' ? <FaMoon size={24} onClick={toggleTheme} /> : <IoIosSunny size={24} onClick={toggleTheme} />}
          </button>
        </div>
        <ul>
          {users.map((user, index) => (
            <li
              key={index}
              className={`flex items-center p-2 bg-gray-200 rounded-lg mb-2 cursor-pointer hover:bg-gray-300 ${selectedUser && selectedUser.id === user.id ? 'bg-gray-400' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              <div className="relative">
                {user.profile_image ? (
                  <img
                    src={`http://localhost:8000${user.profile_image}`}
                    alt={user.username}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                ) : (
                  <FaUserCircle className="w-10 h-10 mr-4 text-gray-500" />
                )}
                <span className={`absolute bottom-0 right-3 w-3 h-3 rounded-full border-2 border-white ${onlinePeople[user.id] ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-bold text-xl truncate">{user.username}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col p-4 relative ${theme === 'light' ? '' : 'bg-black text-white'}`}>
        <div
          className={`absolute inset-0 bg-cover bg-center ${theme === 'light' ? 'opacity-40' : 'opacity-30'}`}
          style={{ backgroundImage: theme === 'light' ? `url(${Background})` : `url(${background1})` }}
        ></div>
        {selectedUser ? (
          <div className="relative flex flex-col h-full">
            <div className="flex items-center mb-4 p-2 border-b border-gray-500 bg-opacity-70 rounded-lg">
              {user.profile_image ? (
                <img
                  src={`http://localhost:8000${user.profile_image}`}
                  alt={user.username}
                  className="w-10 h-10 rounded-full mr-4"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 mr-4 text-gray-500" />
              )}
              <h2 className="text-xl font-bold">{selectedUser.username}</h2>
            </div>
            <div className="flex-1 bg-opacity-80 p-4 rounded-lg overflow-auto">
              {loading ? (
                <div>Loading messages...</div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex mb-4 ${msg.sender.toString() === IdHex.toString() ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`bg-gradient-to-r border ${msg.sender.toString() === IdHex.toString() ? 'from-green-300 to-green-100 text-black' : 'from-blue-500 to-cyan-200 text-black'} p-2 rounded-xl w-auto max-w-xs`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={divUnderMessages}></div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <input
                value={newMessageText}
                type="text"
                placeholder="Type a message"
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-400 rounded focus:outline-none focus:border-blue-500"
              />
              <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white p-2 rounded-lg">
                <MdSend size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-2xl">Select a user to chat with</div>
        )}
      </div>
    </div>
  );
}

export default Chat;

