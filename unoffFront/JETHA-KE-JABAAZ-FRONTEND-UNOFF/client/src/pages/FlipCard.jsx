import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { ImUserPlus } from "react-icons/im";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";

const FlipCard = ({ user }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const CardFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };

  const sendFriendRequest = async (receiver_id) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/connect/send_friend_request/${receiver_id}/`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (res.data) {
        setRequestSent(true);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-64 cursor-pointer">
      <div className="flip-card w-64 h-64 rounded-md" onClick={CardFlip}>
        <motion.div
          className="flip-card-inner w-full h-full relative"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          onAnimationComplete={() => setIsAnimating(false)}
        >
          <div className="flip-card-front w-full h-full absolute flex flex-col items-center justify-center bg-gradient-to-b from-purple-300 to-indigo-400 rounded-md shadow-lg" style={{ backfaceVisibility: 'hidden' }}>
            <div className="w-28 h-28 mt-3 rounded-full overflow-hidden">
              {user.profile_image ? (
                <img src={`http://localhost:8000${user.profile_image}`} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <FaUserCircle size={112} className="text-black" />
              )}
            </div>
            <h2 className="mt-6 text-2xl text-white font-bold">{user.username}</h2>
            <motion.button
              className={`flex items-center p-2 m-2  rounded-lg text-white transition-all duration-300 ease-in-out transform ${requestSent ? 'bg-green-600 hover:bg-green-700' : 'bg-violet-800 hover:bg-violet-900'} ${isHovered ? 'px-4' : 'px-2'}`}
              onClick={(e) => {
                e.stopPropagation();
                sendFriendRequest(user.id);
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={requestSent}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {requestSent ? (
                <>
                  <IoCheckmarkDoneCircleSharp size={35} className="mr-2" />
                  {isHovered && <span>Request Sent</span>}
                </>
              ) : (
                <>
                  <ImUserPlus size={24} className="mr-2" />
                  {isHovered && <span>Send Request</span>}
                </>
              )}
            </motion.button>
          </div>
          <div className="flip-card-back w-full h-full absolute flex flex-col items-center justify-center bg-gradient-to-b from-cyan-200 to-blue-400 rounded-md shadow-lg" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <h2 className="text-xl font-bold">{user.username}</h2>
            <p className="mt-2 text-gray-700">{user.email}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FlipCard;
