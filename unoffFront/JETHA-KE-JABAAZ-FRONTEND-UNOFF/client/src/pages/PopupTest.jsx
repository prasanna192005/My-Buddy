import { useEffect, useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PopupTest({ handleClose, onAdded }) {
    const [subject, setSubject] = useState(null);
    const [subdomain, setSubdomain] = useState(null);
    const [chapter, setChapter] = useState(null);
    const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
    const [isChapterDropdownOpen, setIsChapterDropdownOpen] = useState(false);
    const [isSubdomainDropdownOpen, setIsSubdomainDropdownOpen] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [subdomains, setSubdomains] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [selectedSubdomains, setSelectedSubdomains] = useState([]);
    const [selectedChapters, setSelectedChapters] = useState([]);
    const [duration, setDuration] = useState(30);
    const navigate = useNavigate();

    async function fetchSubs() {
        const res = await axios.get('http://localhost:8000/testseries/subjects/', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (res.data) {
            setSubjects(res.data);
        }
    }

    async function fetchSubdomain(id) {
        const res = await axios.get(`http://localhost:8000/testseries/subdomains/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return res.data;
    }

    async function fetchChap(id) {
        const res = await axios.get(`http://localhost:8000/testseries/chapters/${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return res.data;
    }

    useEffect(() => {
        fetchSubs();
    }, []);

    useEffect(() => {
        if (selectedSubjects.length > 0) {
            Promise.all(selectedSubjects.map(sub => fetchSubdomain(sub.id)))
                .then(subdArrays => {
                    const combinedSubdomains = subdArrays.flat();
                    setSubdomains(combinedSubdomains);
                });
        } else {
            setSubdomains([]);
        }
    }, [selectedSubjects]);
    console.log(subdomains);

    useEffect(() => {
        if (selectedSubdomains.length > 0) {
            Promise.all(selectedSubdomains.map(sub => fetchChap(sub.id)))
                .then(chapArrays => {
                    const combinedChapters = chapArrays.flat();
                    setChapters(combinedChapters);
                });
        } else {
            setChapters([]);
        }
    }, [selectedSubdomains]);

    const handleDurationChange = (event) => {
        setDuration(parseInt(event.target.value));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        localStorage.setItem('test_duration' , duration);
        const chapId = selectedChapters.map(c => c.id);

        const res = await axios.post('http://localhost:8000/testseries/generate_test/', { chapter_ids: chapId, duration }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (res) {
            alert('Test Created Successfully');
            localStorage.setItem('test_id', res.data.id);
            navigate('/gentest'); 
            handleClose();
        }
    }

    const handleCheckboxChange = (setter, selectedItems, item) => {
        if (selectedItems.includes(item)) {
            setter(selectedItems.filter(i => i !== item));
        } else {
            setter([...selectedItems, item]);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-gradient-to-r from-orange-200 to-red-200 text-black p-6 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Add Test</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Subject</label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsSubjectDropdownOpen(!isSubjectDropdownOpen)}
                                className="w-full p-2 border border-gray-300 rounded mt-1 flex justify-between items-center"
                            >
                                {selectedSubjects.length > 0 ? selectedSubjects.map(sub => sub.name).join(", ") : "Select Subject"}
                                <IoMdArrowDropdown size={20} />
                            </button>
                            {isSubjectDropdownOpen && (
                                <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded shadow-lg z-10">
                                    {subjects.map((sub) => (
                                        <div key={sub.id} className="p-2 hover:bg-gray-200 cursor-pointer flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedSubjects.includes(sub)}
                                                onChange={() => handleCheckboxChange(setSelectedSubjects, selectedSubjects, sub)}
                                                className="mr-2"
                                            />
                                            {sub.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {selectedSubjects.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium">Subdomain</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsSubdomainDropdownOpen(!isSubdomainDropdownOpen)}
                                    className="w-full p-2 border border-gray-300 rounded mt-1 flex justify-between items-center"
                                >
                                    {selectedSubdomains.length > 0 ? selectedSubdomains.map(sub => sub.name).join(", ") : "Select Subdomain"}
                                    <IoMdArrowDropdown size={20} />
                                </button>
                                {isSubdomainDropdownOpen && (
                                    <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded shadow-lg z-10">
                                        {subdomains.map((sub) => (
                                            <div key={sub.id} className="p-2 hover:bg-gray-200 cursor-pointer flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubdomains.includes(sub)}
                                                    onChange={() => handleCheckboxChange(setSelectedSubdomains, selectedSubdomains, sub)}
                                                    className="mr-2"
                                                />
                                                {sub.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {selectedSubdomains.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium">Chapter</label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsChapterDropdownOpen(!isChapterDropdownOpen)}
                                    className="w-full p-2 border border-gray-300 rounded mt-1 flex justify-between items-center"
                                >
                                    {selectedChapters.length > 0 ? selectedChapters.map(chap => chap.name).join(", ") : "Select Chapter"}
                                    <IoMdArrowDropdown size={20} />
                                </button>
                                {isChapterDropdownOpen && (
                                    <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded shadow-lg z-10">
                                        {chapters.map((chap) => (
                                            <div key={chap.id} className="p-2 hover:bg-gray-200 cursor-pointer flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedChapters.includes(chap)}
                                                    onChange={() => handleCheckboxChange(setSelectedChapters, selectedChapters, chap)}
                                                    className="mr-2"
                                                />
                                                {chap.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium">Duration</label>
                        <div className="flex space-x-4 mt-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value={15}
                                    checked={duration === 15}
                                    onChange={handleDurationChange}
                                    className="mr-2"
                                />
                                15 min
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value={30}
                                    checked={duration === 30}
                                    onChange={handleDurationChange}
                                    className="mr-2"
                                />
                                30 min
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value={60}
                                    checked={duration === 60}
                                    onChange={handleDurationChange}
                                    className="mr-2"
                                />
                                60 min
                            </label>
                        </div>
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

export default PopupTest;
