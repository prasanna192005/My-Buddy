import { createContext, useContext, useState } from 'react';
import loginImg from '../assets/Robot.jpg';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { FaLongArrowAltRight } from "react-icons/fa";
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../UserContext';
import { BackgroundGradientAnimationDemo } from '../Back';

function Login() {
    const { login } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const response = await axios.post('http://localhost:8000/login/', { email, password }, { headers: { 'Content-Type': 'application/json' } });

        if (response.data && response.data.token) {
            const token = response.data.token;
            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);
            const { email, username, id } = decoded;
            const userData = { email, username, id };
            login(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            setRedirect(true);
        }
    }
    
    if (redirect) {
        return <Navigate to='/dashboard' />;
    }

    return (
        <div className="flex min-h-screen bg-black text-white font-[Inter]">
            <div className="flex items-center justify-center w-1/2 p-8">
                <div className="flex flex-col">
                    <div className="flex mb-10">
                        <h1 className="text-3xl font-extrabold">MyBuddy</h1>
                    </div>
                    <h1 className="text-4xl font-bold mb-4 tracking-wide">Welcome! 👋</h1>
                    <div className="text-gray-400 mb-5 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-400 hover:underline">
                            Register Now
                        </Link>
                    </div>
                    <form className="max-w-md w-full mt-6" onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-300 text-xs mb-1">
                                Email Address
                            </label>
                            <input
                                id="input"
                                type="text"
                                placeholder="Enter your email id"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="px-3 py-2 w-full border rounded-md bg-gray-800 text-white focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6 relative">
                            <label htmlFor="password" className="block text-gray-300 text-xs mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="px-3 py-2 w-full border rounded-md bg-gray-800 text-white focus:outline-none focus:border-blue-500"
                                required
                            />
                            <span
                                className="absolute right-3 top-3 cursor-pointer"
                                onClick={handlePasswordVisibility}
                            >
                                {showPassword ? <BsEyeSlash className="text-gray-400 mt-5" /> : <BsEye className="text-gray-400 mt-5" />}
                            </span>
                        </div>
                        <div className="flex items-center">
                        <button className="ml-12 relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-12 py-4 text-sm font-medium text-white backdrop-blur-3xl">
   Continue
  </span>
</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="w-1/2 h-screen">
                {/* <img src={loginImg} alt="Login" className="w-full h-full object-cover" /> */}
                <BackgroundGradientAnimationDemo/>
            </div>
        </div>
    );
}

export default Login;
