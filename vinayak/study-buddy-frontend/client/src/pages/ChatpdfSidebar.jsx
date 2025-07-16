import { useContext, useState, useEffect } from "react";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import robot from '../assets/Robot.jpg';
import { FaFileDownload } from "react-icons/fa";
import axios from "axios";
import { ThemeContext } from "../ThemeContext";

function ChatpdfSidebar({ isOpen, toggleSidebar }) {
    const { theme } = useContext(ThemeContext);
    const [expanded, setExpanded] = useState(isOpen);
    const [pdfs, setPdfs] = useState([]);
    const [compUp , setCompUp] = useState(false)

    useEffect(() => {
        setExpanded(isOpen);
    }, [isOpen]);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setPdfs(files);        
    };

    const handleUpload = async () => {
        const formData = new FormData();
        pdfs.forEach((pdf, index) => {
            formData.append(`pdf_files`, pdf); // Ensure this matches your Django backend
        });

        try {
            const response = await axios.post('http://localhost:8000/api/upload_pdfs/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setCompUp(true)
            console.log('Upload successful', response.data);
            alert('Upload successful')
        } catch (error) {
            console.error('Error uploading PDFs', error);
        }
    };

    return (
        <aside className={`fixed h-screen ${theme === 'light' ? '' : 'bg-black text-white'} transition-all duration-300 ${expanded ? 'w-96' : 'w-20'}`}>
            <nav className="h-full flex flex-col border-r shadow-sm p-4">
                <div className="flex justify-end">
                    <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-gray-100">
                        {expanded ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
                    </button>
                </div>
                <div className={`flex flex-col items-center ${expanded ? "opacity-100" : "opacity-0 overflow-hidden"} transition-opacity duration-300`}>
                    <img src={robot} alt="Robot" className="mb-5 h-72" />
                    <div className="text-center">
                        <h1 className={`text-2xl flex items-center justify-center gap-4 font-bold mb-4 leading-5 ${expanded ? '' : 'hidden'}`}>
                            <FaFileDownload size={35} className="text-yellow-400" />
                            PDF File's Section
                        </h1>
                        <div className={`${expanded ? 'bg-gray-100' : 'bg-gray-400'} rounded-xl w-80 p-1 ml-3`}>
                            <div className="text-xs">Drag and drop the file here</div>
                            <input 
                                type="file" 
                                multiple 
                                onChange={handleFileChange} 
                                className={`m-4 ml-16 w-full h-full  ${expanded ? '' : 'hidden'} ` } 
                            />
                            <div className="my-3 flex items-center justify-center">
                                {compUp ? (
                                    <div className="border-2 text-sm rounded-lg border-green-500 p-1 bg-green-200">Processed</div>
                                ) : (
                                    <div className="border-2 text-sm rounded-lg border-red-600 p-1 bg-red-300">Not Processed</div>
                                )}
                            </div>
                        </div>
                        <p className={`text-xs  m-4 ${expanded ? '' : 'hidden'}`}>Upload your PDF Files & Click on the Upload Button</p>
                        <div className="flex items-center justify-center mt-2">
                            <button 
                                className={`bg-gradient-to-r from-orange-200 to-orange-300 mb-1 text-white gap-2 flex py-2 px-4 rounded-lg w-80 items-center justify-center hover:bg-gradient-to-r hover:from-orange-300 hover:to-orange-400 ${expanded ? '' : 'hidden'}`} 
                                onClick={handleUpload}
                            >
                                Upload PDFs
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </aside>
    );
}

export default ChatpdfSidebar;
