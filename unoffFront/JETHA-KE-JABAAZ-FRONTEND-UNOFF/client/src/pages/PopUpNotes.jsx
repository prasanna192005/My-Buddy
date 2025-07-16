import React, { useState, useEffect } from "react";
import axios from 'axios';
import { IoMdShare, IoMdArrowDropdown } from "react-icons/io";

function PopUpNotes({ handleClose, notes }) {
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    handleUser();
  }, []);

  async function handleUser() {
    const res = await axios.get('http://localhost:8000/connect/friends/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (res.data.friends) {
      setUsers(res.data.friends);
    }
  }

  const handleUserSelect = (user) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(user)) {
        return prevSelected.filter((u) => u !== user);
      } else {
        return [...prevSelected, user];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sharedWithIds = selectedUsers.map((user) => user.id);
    const res = await axios.post('http://localhost:8000/notes/create/', { title, shared_with: sharedWithIds, content }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (res.data) {
      notes();
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gradient-to-r from-orange-200 to-red-200 text-black p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Notes</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Share with</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-2 border border-gray-300 bg-white rounded mt-1 flex justify-between items-center"
              >
                {selectedUsers.length > 0 ? selectedUsers.map(user => user.username).join(', ') : "Select Friends to share notes"}
                <IoMdArrowDropdown size={20} />
              </button>
              {isDropdownOpen && (
                <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded shadow-lg z-10">
                  {users.map((user) => (
                    <div key={user.id} className="p-2 hover:bg-gray-200 cursor-pointer flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user)}
                        onChange={() => handleUserSelect(user)}
                        className="mr-2"
                      />
                      {user.username}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Content</label>
            <textarea
              className="w-full h-40 p-3 border border-gray-300 rounded"
              placeholder="Write your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PopUpNotes;
