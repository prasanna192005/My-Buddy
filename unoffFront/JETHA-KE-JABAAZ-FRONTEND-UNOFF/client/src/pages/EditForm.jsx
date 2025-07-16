import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";

function EditForm({handleClose}) {
    const {login} = useContext(UserContext)
    const [email , setEmail] = useState('');
    const [username , setUsername] = useState('')

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await axios.put('http://localhost:8000/profile/update/' , {username , email} ,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        });
        if(res.data){
            login(res.data)
            alert('Profile Updated Successfully')
            handleClose()
        }
    }
    return(
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black  bg-opacity-50">
            <div className="bg-gradient-to-r from-orange-200 to-red-200 text-black p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Edit Your Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Username</label>
                        <input 
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            required
                        />
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
    )
}

export default EditForm;