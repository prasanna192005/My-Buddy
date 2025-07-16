import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChatPDF from './pages/ChatPdf';
import { useContext, useState } from 'react';
import { UserContext } from './UserContext';
import Practice from './pages/Practice';
import { ImSpinner3 } from "react-icons/im";
import Profile from './pages/Profile';
import Connect from './pages/Connect';
import Chat from './pages/Chat';
import Notes from './pages/Notes';
import Test from './pages/Test';
import TestGenerate from './pages/TestGenerate';
import Resource from './pages/Resource';
import JoinRoomPage from './pages/JoinRoomPage';
import JoinCallPage from './pages/JoinCallPage';
import Hero from './Hero';
import TextEditor from './pages/TextEditor';
import {v4 as uuidV4} from 'uuid';
import Charts from './pages/Charts';

function App() {
  const { user, ready } = useContext(UserContext);
  const location = useLocation();
  const [direction, setDirection] = useState('next'); // Control the direction of the animation

  if (!ready) {
    return <div className='flex items-center w-full h-full justify-center gap-2 text-lg'><ImSpinner3 className='text-lg' />Loading...</div>;
  }

  const handleNavigate = (to) => {
    if (to === '/register') {
      setDirection('next');
    } else if (to === '/') {
      setDirection('prev');
    }
  };

  return (
    <div className={`app-container ${direction}`}>
      
      <Routes location={location} key={location.key}>
        <Route path="/" element={<Hero/>}/>
        <Route path='/login' element={<Login onNavigate={() => handleNavigate('/register')} />} />
        <Route path='/register' element={<Register onNavigate={() => handleNavigate('/')} />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to='/' replace />} />
        <Route path="/dashboard/pdf" element={user ? <ChatPDF /> : <Navigate to='/' replace />} />
        <Route path="/practice-dost" element={user ? <Practice /> : <Navigate to='/' replace />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to='/' replace />} />
        <Route path="/connect" element={user ? <Connect /> : <Navigate to='/' replace />} />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to='/' replace />} />
        <Route path="/notes" element={user ? <Notes /> : <Navigate to='/' replace />} />
        <Route path="/test" element={user ? <Test /> : <Navigate to='/' replace />} />
        <Route path="/gentest" element={user ? <TestGenerate /> : <Navigate to='/' replace />} />
        <Route path="/resource" element={user ? <Resource /> : <Navigate to='/' replace />} />
        <Route path="/joinroom" element={<JoinRoomPage/>}/>
        <Route path="/room/:roomId" element={<JoinCallPage/>}/>
        <Route path="/document" element={<Navigate to={`/documents/${uuidV4()}`}/>}/>
        <Route path="/documents/:id" element={<TextEditor/>}/>
        <Route path='/results' element={<Charts/>}/>
      </Routes>
    </div>
  );
}

export default App;
