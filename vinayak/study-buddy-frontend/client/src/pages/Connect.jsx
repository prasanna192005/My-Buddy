import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import SideBarComp from './SideBarComp';
import FlipCard from './FlipCard';
import { ThemeContext } from '../ThemeContext';

function Connect() {
  const {theme} = useContext(ThemeContext)
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetchPeople();
  }, []);

  async function fetchPeople() {
    const res = await axios.get('http://localhost:8000/connect/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": 'application/json'
      }
    });
    if (res.data) {
      setPeople(res.data.students);
    }
  }

  return (
    <div className={`flex ${theme === 'light' ? '' : 'bg-black text-white'}`}>
      <SideBarComp />
      <div className={`flex-grow p-4 m-3 mt-24 `}>
        <h2 className="text-3xl text-center text-orange-400 font-bold mb-8">Connect with People</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {people.length > 0 ? (
            people.map(person => (
              <FlipCard key={person.id} user={person} />
            ))
          ) : (
            <p>No people to show</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Connect;
