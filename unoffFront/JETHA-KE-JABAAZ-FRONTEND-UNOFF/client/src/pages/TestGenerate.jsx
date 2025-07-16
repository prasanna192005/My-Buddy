import { useState, useEffect, useRef } from "react";
import SideBarComp from "./SideBarComp";
import { FaLongArrowAltLeft, FaLongArrowAltRight, FaBell } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";

function TestGenerate() {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [ans, setAns] = useState([]);
    const [score, setScore] = useState(null);
    const [viewRes, setViewResults] = useState([]);
    const [result, setResult] = useState(false);
    const [totalTimeInSeconds, setTotalTimeInSeconds] = useState(parseInt(localStorage.getItem('test_duration'), 10) * 60);

    const timerRef = useRef(null);

    useEffect(() => {
        const id = localStorage.getItem('test_id');
        fetchQuestions(id);
        fetchDetails(id);
        startTimer();
        return () => clearInterval(timerRef.current); // Cleanup on component unmount
    }, []);

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTotalTimeInSeconds((prevTime) => {
                if (prevTime === 0) {
                    clearInterval(timerRef.current);
                    handleSubmit(); // Auto-submit when time is up
                    return prevTime;
                }
                return prevTime - 1;
            });
        }, 1000);
    };

    async function fetchQuestions(id) {
        try {
            const res = await axios.get(`http://localhost:8000/testseries/get_test_questions/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data) {
                setQuestions(res.data);
            }
        } catch (error) {
            console.error("Error fetching questions", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchDetails(id) {
        try {
            const res = await axios.get(`http://localhost:8000/testseries/get_test_detail/${id}/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.data) {
                setViewResults(res.data.answers);
                setScore(res.data.score)
            }
        } catch (error) {
            console.error("Error fetching details", error);
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    async function handleSubmit() {
        clearInterval(timerRef.current); // Stop the timer on submit
        const answers = questions.map((question, index) => ({
            question_id: question.id,
            selected_option: ans[index]
        }));

        try {
            const res = await axios.post(`http://localhost:8000/testseries/submit_test/${localStorage.getItem('test_id')}/`, { answers }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res) {
                setScore(res.data.score);
                fetchDetails(localStorage.getItem('test_id'));
                localStorage.removeItem('test_duration');
            }
        } catch (error) {
            console.error("Error submitting answers", error);
        }
    }

    const len = questions.length;
    const currQuestion = questions[currentQuestionIndex];
    const options = currQuestion ? [currQuestion.option1, currQuestion.option2, currQuestion.option3, currQuestion.option4] : [];

    const handlePrevClick = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleNextClick = () => {
        if (currentQuestionIndex < len - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleAnswer = (optionLabel) => {
        const newAns = [...ans];
        newAns[currentQuestionIndex] = optionLabel;
        setAns(newAns);
    };

    const getOptionStyle = (optionLabel, questionId) => {
        const currentResult = viewRes.find(result => result.question.id === questionId);
        if (currentResult) {
            if (currentResult.selected_option === optionLabel) {
                return currentResult.correct ? "bg-green-200" : "bg-red-200";
            } else if (currentResult.question.correct_option === optionLabel) {
                return "bg-green-200";
            }
        }
        return "";
    };

    const progressWidth = ((currentQuestionIndex + 1) / len) * 100;

    const minutes = Math.floor(totalTimeInSeconds / 60);
    const seconds = totalTimeInSeconds % 60;

    return (
        <div className="flex h-screen">
            <SideBarComp />
            <div className="flex-1 p-4 mt-24 flex">
                <div className="w-1/4 h-full flex items-center flex-col justify-between">
                    <div className="w-full h-3/5 border p-3 mx-2 rounded-md">
                        <h2 className="font-semibold text-md mb-2">Choose a question</h2>
                        <div className="grid grid-cols-4 mt-5">
                            {questions.map((q, index) => (
                                <div
                                    key={index}
                                    className={`w-12 h-12 mb-3 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer ${index === currentQuestionIndex ? 'bg-gray-400' : ''}`}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                >
                                    <div>{index + 1}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-end justify-center w-full gap-8 mb-12">
                        <Link to='/test' onClick={handleSubmit} className="bg-white border-2 border-orange-100 text-orange-500 py-3 px-4 rounded-lg font-semibold cursor-pointer hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out">
                            Back
                        </Link>
                        {score ? 
                            <button onClick={() => setResult(true)} className="bg-white border-2 border-orange-100 text-orange-500 py-3 px-4 rounded-lg font-semibold cursor-pointer hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out">
                                View Results
                            </button>
                            :
                            <button onClick={handleSubmit} className="bg-white border-2 border-orange-100 text-orange-500 py-3 px-4 rounded-lg font-semibold cursor-pointer hover:bg-orange-500 hover:text-white transition-all duration-300 ease-in-out">
                                Submit
                            </button>
                        }
                    </div>
                </div>
                <div className="w-3/4 h-full py-5">
                    <div className="flex items-center justify-start mx-4 mb-5 gap-8">
                        <h1 className="font-bold text-xl">Question {currentQuestionIndex + 1} of {len}</h1>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-300" style={{ width: `${progressWidth}%` }}></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mx-4 mb-12">
                        <p className="bg-teal-50 p-2 rounded-2xl ml-4 flex items-center"><FaBell size={12} className="mr-2" />Mark the most appropriate option.<br /> Only one option is correct.</p>
                        <h1 className="p-3 font-bold m-2 mr-3 rounded-full text-2xl border-2 bg-teal-100">
                            {minutes < 10 ? "0" + minutes : minutes}:{seconds < 10 ? "0" + seconds : seconds}
                        </h1>
                    </div>
                    <div className="mb-5 border p-4 mx-4 shadow-sm rounded-xl">
                        <h2 className="text-lg">{currQuestion ? currQuestion.text : 'Loading...'}</h2>
                    </div>
                    <div className="p-2 mx-4 grid grid-cols-2 gap-4">
                        {options.map((option, index) => {
                            const optionLabel = `option${index + 1}`;
                            return (
                                <div key={index} className={`mb-5 border p-2 rounded-xl ${getOptionStyle(optionLabel, currQuestion.id)}`}>
                                    <label className="flex items-center">
                                        <input 
                                            type="radio" 
                                            name={`option-${currentQuestionIndex}`} 
                                            value={option} 
                                            onChange={() => handleAnswer(optionLabel)} 
                                            checked={ans[currentQuestionIndex] === optionLabel}
                                            className="mr-2" 
                                            disabled={result} 
                                        />
                                        {option}
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between m-4 mt-5">
                        <button
                            onClick={handlePrevClick}
                            disabled={currentQuestionIndex === 0}
                            className="bg-blue-700 text-white py-4 px-8 flex items-center rounded-xl max-w-sm shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400 disabled:bg-gray-400"
                        >
                            <FaLongArrowAltLeft className='mr-2' /> Previous
                        </button>
                        <button
                            onClick={handleNextClick}
                            disabled={currentQuestionIndex === len - 1}
                            className="bg-blue-700 text-white py-4 px-8 flex items-center rounded-xl max-w-sm shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-400 disabled:bg-gray-400"
                        >
                            Next <FaLongArrowAltRight className='ml-2' />
                        </button>
                    </div>
                    {score && <div className="flex items-center justify-center ">
                        <div
                            className="bg-orange-600 mb-8 text-white py-4 px-8 flex items-center rounded-xl max-w-sm shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:bg-orange-700"
                        >
                            Score : {score} points
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default TestGenerate;
