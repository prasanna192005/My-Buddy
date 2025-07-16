import { useState } from 'react';
import loginImg from '../assets/Robot.jpg';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaStar } from "react-icons/fa6";

function Register() {
    const [course, setCourse] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username , setUsername] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const response = await axios.post('http://localhost:8000/signup/', { course , username , email , password });
        if (response.data) {
            setRedirect(true);
        }
    }
    if (redirect) {
        return <Navigate to='/' />;
    }

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 flex flex-col p-8 ml-20">
                <div className="flex mb-5">
                    <h1 className="text-3xl font-extrabold">MyBuddy</h1>
                </div>
                <span className='text-[10px] h-[18px] rounded-full bg-gradient-to-r bg-orange-100 text-red-600 flex items-center justify-center mr-16 mt-6 mb-3 '><FaStar className='text-yellow-600 text-md m-2'/> Get FREE access to MyBuddy Dost for 4 hours on Signup</span>
                <h1 className="text-4xl font-bold mb-2 tracking-wide" style={{fontFamily:""}}>Become a part<br />
                    of <span className='text-blue-700 text-4xl font-bold'>MyBuddy</span></h1>
                <div className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <Link to="/" className="text-blue-500 hover:underline">
                        Login Now
                    </Link>
                </div>
                <form className="max-w-md w-full mt-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-xs font-semibold mb-1">
                            Select Course
                        </label>
                        <div className="flex space-x-4 justify-between text-md">
                            <label className="flex items-center justify-center border border-gray-400 p-3 rounded-md space-x-2">
                                <input
                                    type="radio"
                                    name="course"
                                    value="JEE"
                                    checked={course === 'JEE'}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className="form-radio"
                                />
                                <span>JEE</span>
                            </label>
                            <label className="flex items-center border justify-center border-gray-400 p-3 rounded-md space-x-2 ">
                                <input
                                    type="radio"
                                    name="course"
                                    value="NEET"
                                    checked={course === 'NEET'}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className="form-radio"
                                />
                                <span>NEET</span>
                            </label>
                            <label className="flex items-center border justify-center border-gray-400 p-3 rounded-md space-x-2 ">
                                <input
                                    type="radio"
                                    name="course"
                                    value="BOARD"
                                    checked={course === 'BOARD'}
                                    onChange={(e) => setCourse(e.target.value)}
                                    className="form-radio"
                                />
                                <span>BOARD</span>
                            </label>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-gray-700 text-xs font-semibold mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="John Doe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-xs font-semibold mb-1">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="your@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6 relative">
                        <label htmlFor="password" className="block text-gray-700 text-xs font-semibold  mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                            required
                        />
                        <span
                            className="absolute right-3 top-3 cursor-pointer"
                            onClick={handlePasswordVisibility}
                        >
                            {showPassword ? <BsEyeSlash className="text-gray-500 mt-5" /> : <BsEye className="text-gray-500 mt-5" />}
                        </span>
                    </div>
                    <div className="flex items-center ">
                        <button type="submit" className="bg-blue-700 text-white py-4 px-8 flex rounded-xl max-w-sm mx-auto h-auto shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400">
                            Start Now<FaLongArrowAltRight className='mt-1.5 ml-2' />
                        </button>
                    </div>
                </form>
            </div>
            <div className="w-1/2">
                <img src={loginImg} alt="Login" className="w-full h-full object-cover" />
            </div>
        </div>
    );
}

export default Register;