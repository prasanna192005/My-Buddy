import axios from "axios";
import { useEffect, useState } from "react";
import { CiSaveDown1 } from "react-icons/ci";
import { MdCancel } from "react-icons/md";
import { IoMdArrowDropdown } from "react-icons/io";

function ShareNotes({ note, handleClose, handleEdit }) {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (note.shared_with) {
      setSelectedUsers(note.shared_with);
    }
  }, [note.shared_with]);

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
      if (prevSelected.some(selectedUser => selectedUser.username === user.username)) {
        return prevSelected.filter((u) => u.username !== user.username);
      } else {
        return [...prevSelected, user];
      }
    });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const userId = selectedUsers.map((user) => (user.id));
    const res = await axios.post(`http://localhost:8000/notes/${note.id}/share/`, { users:userId }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (res.data) {
      alert("Note Shared Successfully");
      handleEdit();
    }
  }

  useEffect(() => {
    handleUser();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gradient-to-r from-cyan-200 to-purple-200 text-black p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add more Friends to Share with</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                        checked={selectedUsers.some(selectedUser => selectedUser.id === user.id)}
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
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              <MdCancel size={20} />
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <CiSaveDown1 size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShareNotes;
