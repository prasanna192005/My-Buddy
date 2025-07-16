import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChatPDF from './pages/ChatPdf';
import { useContext } from 'react';
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

function App() {
  const { user, ready } = useContext(UserContext);

  if (!ready) {
    return <div className='flex items-center w-full h-full justify-center gap-2 text-lg'><ImSpinner3 className='text-lg' />Loading...</div>;
  }

  return (
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
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
      </Routes>
  );
}

export default App;
