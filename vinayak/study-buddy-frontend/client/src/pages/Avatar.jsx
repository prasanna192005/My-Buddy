import axios from 'axios';
import { useState } from 'react';

function Avatar({ avatars, handleClose , handleAvatar }) {
    const [selectedAvatar, setSelectedAvatar] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (selectedAvatar) {
                let file;

                if (typeof selectedAvatar === 'string') {
                    const response = await fetch(selectedAvatar, { cache: 'no-cache' });
                    const blob = await response.blob();
                    file = new File([blob], selectedAvatar.substring(selectedAvatar.lastIndexOf('/') + 1), { type: blob.type });
                } else {
                    file = selectedAvatar;
                }

                const formData = new FormData();
                formData.append('profile_image', file, file.name);

    
                const res = await axios.post('http://localhost:8000/profile/image/', formData, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (res.data && res.data.profile_image) {
                    handleAvatar(res.data.profile_image)
                    localStorage.setItem("Avatar" , res.data.profile_image )
                    handleClose();
                } else {
                    console.error('Failed to save avatar.');
                }
            } else {
                console.error('No avatar selected.');
            }
        } catch (error) {
            console.error('Error saving avatar:', error);
        }
    };

    const handleAvatarClick = (avatar) => {
        setSelectedAvatar(avatar);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-gradient-to-r from-orange-200 to-red-200 text-black p-4 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4 text-center text-orange-400">Add Your Avatar</h2>
                <div className="max-h-80 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid md:grid-cols-3 mt-2 mr-1 sm:grid-cols-2 gap-4">
                            {avatars.map((avatar, index) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer rounded-full overflow-hidden ${
                                        selectedAvatar === avatar ? 'ring-4 ring-blue-500' : ''
                                    }`}
                                    onClick={() => handleAvatarClick(avatar)}
                                >
                                    <img src={avatar} alt={`Avatar ${index}`} className="w-full" />
                                </div>
                            ))}
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
        </div>
    );
}

export default Avatar;
