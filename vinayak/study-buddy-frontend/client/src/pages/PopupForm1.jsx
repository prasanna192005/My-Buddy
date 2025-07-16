import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import axios from "axios";

function PopupForm1({ handleClose , onAssignmentAdded }) {
    const [subject, setSubject] = useState("");
    const [chapter, setChapter] = useState("");
    const [deadline, setDeadline] = useState("");
    const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
    const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);

    const subjects = ["Physics", "Maths", "Chemistry", "Biology"];
    const chapters = {
        Physics: ["Rotational motion", "Gravitation", "Oscillation"],
        Maths: ["Probability", "Complex Numbers", "Permutation & Combination"],
        Chemistry: ["Alcohols", "Nuclear Chemistry", "Biochemistry"],
        Biology: ["Reproduction", "Plant Kingdom", "Cell division & Cell Cycle"]
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const res = await axios.post('http://localhost:8000/todolist/create_assignments/' , {subject , chapter , deadline} , {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        })
        if(res.data){
            alert("Assignment added successfully")
            handleClose();
            onAssignmentAdded();
        }
    };

    const handleSubjectChange = (selectedSubject) => {
        setSubject(selectedSubject);
        setChapter("");
    };

    const handleChapterChange = (selectedChapter) => {
        setChapter(selectedChapter);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black  bg-opacity-50">
            <div className="bg-gradient-to-r from-orange-200 to-red-200 text-black p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Add Assignment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Subject</label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                                className="w-full p-2 border border-gray-300 rounded mt-1 flex justify-between items-center"
                            >
                                {subject || "Select Subject"}
                                <IoMdArrowDropdown size={20} />
                            </button>
                            {isSubjectDropdownOpen && (
                                <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded shadow-lg z-10">
                                    {subjects.map((sub) => (
                                        <div
                                            key={sub}
                                            onClick={() => {
                                                handleSubjectChange(sub);
                                                setIsSubjectDropdownOpen(false);
                                            }}
                                            className="p-2 hover:bg-gray-200 cursor-pointer"
                                        >
                                            {sub}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {subject && (
                        <div>
                            <label className="block text-sm font-medium">Chapter</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsChapterDropdownOpen(!isChapterDropdownOpen)}
                                    className="w-full p-2 border border-gray-300 rounded mt-1 flex justify-between items-center"
                                >
                                    {chapter || "Select Chapter"}
                                    <IoMdArrowDropdown size={20} />
                                </button>
                                {isChapterDropdownOpen && (
                                    <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded shadow-lg z-10">
                                        {chapters[subject].map((chap) => (
                                            <div
                                                key={chap}
                                                onClick={() => {
                                                    handleChapterChange(chap);
                                                    setIsChapterDropdownOpen(false);
                                                }}
                                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                            >
                                                {chap}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium">Deadline</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
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
    );
}

export default PopupForm1;
