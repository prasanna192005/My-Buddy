import { createContext, useContext, useState } from 'react';
import loginImg from '../assets/Robot.jpg';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { FaLongArrowAltRight } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../UserContext';




function Login() {

    const {login} = useContext(UserContext)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [redirect, setRedirect] = useState(false);


    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const response = await axios.post('http://localhost:8000/login/', { email, password } , { headers: { 'Content-Type': 'application/json' } });

        if (response.data && response.data.token) {
            const token = response.data.token
            localStorage.setItem('token' , token);
            const decoded = jwtDecode(token);
            const { email, username , id } = decoded;
            console.log(id);
            const userData = { email, username , id };
            login(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setRedirect(true);
        }
    }
    if (redirect) {
        return <Navigate to= '/dashboard' />;
    }

    return (
        <div className="flex min-h-screen">
            <div className="w-1/2 flex flex-col p-8 ml-20">
                <div className="flex mb-10">
                    <h1 className="text-3xl font-extrabold">MyBuddy</h1>
                </div>
                <h1 className="text-4xl font-bold mb-4 tracking-wide">Welcome! 👋</h1>
                <div className="text-gray-600 mb-5  text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Register Now
                    </Link>
                </div>
                <form className="max-w-md w-full mt-6" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700  text-xs mb-1">
                            Email Address
                        </label>
                        <input
                            id="input"
                            type="text"
                            placeholder="Enter your email id"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6 relative">
                        <label htmlFor="password" className="block text-gray-700 text-xs mb-1">
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
                        <button type="submit" className="bg-blue-700 text-white py-4 px-8 flex rounded-xl max-w-sm mx-auto h-auto shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400 ">
                            Continue<FaLongArrowAltRight className='mt-1.5 ml-2' />
                        </button>
                    </div>
                </form>
            </div>
            <div className="w-1/2 h-screen">
                <img src={loginImg} alt="Login" className="w-full h-full object-cover" />
            </div>
        </div>
    );
}

export default Login;