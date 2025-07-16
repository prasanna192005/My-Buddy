import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import SideBarComp from './SideBarComp';
import FlipCard from './FlipCard';
import { ThemeContext } from '../ThemeContext';
import AutoClosePopup from './Popup';

function Connect() {
  const { theme } = useContext(ThemeContext);
  const [people, setPeople] = useState([]);
  const [popupVisible, setPopupVisible] = useState(true);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    fetchPeople();
    showInfoPopup(); 
  }, []);

  async function fetchPeople() {
    try {
      const res = await axios.get('http://localhost:8000/connect/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          "Content-Type": 'application/json'
        }
      });
      if (res.data) {
        setPeople(res.data.students);
      }
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  }

  function showInfoPopup() {
    setPopupMessage('Welcome to the Connect page! Here you can find and connect with various people to collaborate and share knowledge.'); // Custom message
    setPopupVisible(true);
  }

  function closePopup() {
    setPopupVisible(false);
  }

  function showAgain() {
  
    setPopupMessage('Welcome to the Connect page! Here you can find and connect with various people to collaborate and share knowledge.'); // Same message or customize as needed
    setPopupVisible(true);
    console.log('phirse');
  }

  return (
    <div className={`flex ${theme === 'light' ? '' : 'bg-black text-white'}`}>
      <SideBarComp />
      <div className={`flex-grow p-4 m-3 mt-24`}>
        <h2 className="text-3xl text-center text-orange-400 font-bold mb-8">Connect with People</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {people.length > 0 ? (
            people.map(person => (
              <div 
                key={person.id} 
                onClick={() => {
                  setPopupMessage(`Details about ${person.name}`);
                  setPopupVisible(true); // Ensure it becomes visible on click
                }}
              >
                <FlipCard user={person} />
              </div>
            ))
          ) : (
            <p>No people to show</p>
          )}
        </div>
      
        <AutoClosePopup 
          message={popupMessage} 
          isVisible={popupVisible} 
          onClose={closePopup} 
          showAgain={showAgain} 
        />
      </div>
    </div>
  );
}

export default Connect;
