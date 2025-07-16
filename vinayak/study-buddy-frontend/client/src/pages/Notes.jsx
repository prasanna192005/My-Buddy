import React, { useState, useEffect } from 'react';
import SideBarComp from './SideBarComp';
import PopUpNotes from './PopUpNotes';
import axios from 'axios';
import { FaLightbulb, FaShareAlt } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import EditNotes from './EditNotes';
import { HiFolderPlus } from "react-icons/hi2";
import ShareNotes from './ShareNotes';
import DisplayNote from './DisplayNote';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [pop, setPop] = useState(false);
  const [popEdit, setPopEdit] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [popShare, setPopShare] = useState(false);
  const [popNote, setPopNote] = useState(false);

  const handleUpdate = () => {
    setPopEdit(!popEdit);
    setEditNote(null);
    fetchNotes();
  };

  const handleSh = () => {
    setPopShare(!popShare);
    setEditNote(null);
    fetchNotes();
  };

  const handleNotes = () => {
    setPopNote(!popNote);
    setEditNote(null);
    fetchNotes();
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:8000/notes/${id}/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data) {
        fetchNotes();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setPopEdit(true);
  };
  const handleClick = (note) => {
    setEditNote(note);
    setPopNote(true);
  };

  const handlePop = () => {
    setPop(!pop);
  };

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:8000/notes/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data) {
        setNotes(res.data);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleShare = (note) => {
    setEditNote(note);
    setPopShare(true);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="flex h-screen">
      <SideBarComp />
      <div className="flex-1 p-6 mt-24">
        <div className='flex items-center justify-center'>
          <div onClick={handlePop} className="bg-gray-100 w-1/2 text-black p-4 rounded-xl flex items-center justify-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
            <HiFolderPlus size={40} className="mr-4 text-blue-600" />
            <div>
              <h4 className="text-md font-semibold">Add Notes</h4>
            </div>
          </div>
        </div>
        {pop && <PopUpNotes handleClose={handlePop} notes={fetchNotes} />}
        <div className="w-full flex justify-center">
          <div className="max-w-6xl w-full p-4">
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-center text-orange-500">My Notes</h2>
            <div className={notes.length > 0 ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border rounded-lg py-8 px-6" : "flex justify-center items-center h-full p-4"}>
              {notes.length > 0 ? notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  Share={() => handleShare(note)}
                  Delete={() => handleDelete(note.id)}
                  Edit={() => handleEdit(note)}
                  onClick={() => handleClick(note)}
                />
              )) :
                <div className='flex items-center justify-center rounded-lg p-4'>
                  <div className=''>
                    <FaLightbulb size={180} className='font-bold text-center mb-4' />
                    <p className='text-center font-light'>Notes you add appear here</p>
                  </div>
                </div>}
            </div>
          </div>
        </div>
        {popEdit && <EditNotes note={editNote} handleClose={handleUpdate} handleEdit={fetchNotes} />}
        {popShare && <ShareNotes note={editNote} handleClose={handleSh} handleEdit={fetchNotes} />}
        {popNote && <DisplayNote handleClose={handleNotes} note={editNote} />}
      </div>
    </div>
  );
}

const NoteItem = ({ note, Delete, Share, Edit, onClick }) => (
  <div className="p-6 rounded-lg bg-gradient-to-tr from-blue-500 via-cyan-200 to-sky-400 shadow-lg flex flex-col justify-between transition-transform duration-300 hover:scale-105 cursor-pointer">
    <h3 onClick={onClick} className="text-lg font-semibold text-center mb-2">{note.title}</h3>
    {note.image && note.image.length > 0 && <img src={note.image[0]} alt='img' className='w-full p-3 mb-2' />}
    <p onClick={onClick} className="text-sm font-light text-center text-gray-400 mb-4">{note.content}</p>
    <div className="flex justify-between items-center mt-4 pt-4 border-t border-white border-opacity-40">
      <button
        onClick={Share}
        className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition duration-200 text-white"
        title="Share"
      >
        <FaShareAlt size={20} />
      </button>
      <button
        onClick={Delete}
        className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition duration-200 text-white"
        title="Delete"
      >
        <MdDelete size={20} />
      </button>
      <button
        onClick={Edit}
        className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-40 transition duration-200 text-white"
        title="Edit"
      >
        <MdEdit size={20} />
      </button>
    </div>
  </div>
);

export default Notes;
