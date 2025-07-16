import React from 'react';

const ConnectionCard = ({ user }) => {
  return (
    <div className="max-w-sm w-full lg:max-w-full lg:flex p-4 border rounded-lg shadow-lg bg-white">
      <img src={`http://localhost:8000${user.profile_image}`} className="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" />
      <div className="p-4 flex flex-col justify-between leading-normal">
        <div className="mb-8">
          <p className="text-sm text-gray-600 flex items-center">
            ID: {user.id}
          </p>
          <div className="text-gray-900 font-bold text-xl mb-2">{user.username}</div>
          <p className="text-gray-700 text-base">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;
