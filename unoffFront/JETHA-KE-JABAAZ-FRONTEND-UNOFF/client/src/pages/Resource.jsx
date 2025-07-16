import { useContext, useState, useEffect } from "react";
import SideBarComp from "./SideBarComp";
import { ThemeContext } from "../ThemeContext";
import { MdScience } from "react-icons/md";
import { TbMathSymbols } from "react-icons/tb";
import { GiChemicalDrop } from "react-icons/gi";
import { FaLongArrowAltRight } from "react-icons/fa";
import axios from "axios";
import { FaYoutube } from "react-icons/fa6";
import { BiSolidFilePdf } from "react-icons/bi";

function Resource() {
    const { theme } = useContext(ThemeContext);
    const [sci, setSci] = useState(false);
    const [maths, setMaths] = useState(false);
    const [chem, setChem] = useState(false);
    const [sciChap, setSciChap] = useState([]);
    const [chemChap, setChemChap] = useState([]);
    const [mathsChap, setMathsChap] = useState([]);
    const [resources, setResources] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);

    useEffect(() => {
        fetchChapters();
    }, []);

    async function fetchChapters() {
        try {
            const res = await axios.get('http://localhost:8000/testseries/all_chapters/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            setSciChap(res.data.filter((c) => c.subdomain.subject.name === "Science").map(c => ({
                id: c.id,
                name: c.name
            })));
            setChemChap(res.data.filter((c) => c.subdomain.subject.name === "Chemistry").map(c => ({
                id: c.id,
                name: c.name
            })));
            setMathsChap(res.data.filter((c) => c.subdomain.subject.name === "Maths").map(c => ({
                id: c.id,
                name: c.name
            })));
        } catch (error) {
            console.error("Error fetching chapters:", error);
        }
    }

    async function handleGenerate() {
        if (!selectedChapter) {
            alert("Please select a subject & chapter.");
            return;
        }

        try {
            const res = await axios.get(`http://localhost:8000/resources/resources/?chapter=${selectedChapter.id}` , {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setResources(res.data.map((r) => ({
                pdf: r.pdf_file,
                yt: r.url,
            })));
        } catch (error) {
            console.error("Error fetching resources:", error);
        }
    }

    function getYoutubeVideoID(url) {
        const regExp = /^.*(youtu.be\/|v\/|embed\/|watch\?v=|watch\?.+&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    const cardClass =
        "h-40 bg-gray-700 text-white p-4 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105";

    const radioClass =
        "flex items-center justify-center border border-gray-400 p-3 rounded-md space-x-2 cursor-pointer transition-all hover:bg-blue-100";

    return (
        <div className={`flex w-full ${theme === "light" ? "" : "bg-black text-white"}`}>
            <SideBarComp />
            <div className="flex flex-col mt-24 w-full px-10 py-10">
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 mb-8">
                    <div onClick={() => setSci(!sci)} className={cardClass}>
                        <MdScience size={40} className="mr-4 text-blue-600" />
                        <h4 className="text-md font-semibold">Science</h4>
                    </div>
                    <div onClick={() => setMaths(!maths)} className={cardClass}>
                        <TbMathSymbols size={40} className="mr-4 text-blue-600" />
                        <h4 className="text-md font-semibold">Maths</h4>
                    </div>
                    <div onClick={() => setChem(!chem)} className={cardClass}>
                        <GiChemicalDrop size={40} className="mr-4 text-blue-600" />
                        <h4 className="text-md font-semibold">Chemistry</h4>
                    </div>
                </div>

                {sci && (
                    <div className="w-full bg-orange-100 border p-10 rounded-md shadow-md mb-8">
                        <h2 className="text-2xl text-center font-semibold mb-6">Science Resources</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                            {sciChap.length > 0 ? (
                                sciChap.map((chap) => (
                                    <label key={chap.id} className={radioClass}>
                                        <input
                                            type="radio"
                                            name="chapter"
                                            value={chap.name}
                                            checked={selectedChapter?.id === chap.id}
                                            onChange={() => setSelectedChapter(chap)}
                                            className="form-radio"
                                        />
                                        <span>{chap.name}</span>
                                    </label>
                                ))
                            ) : (
                                <p>No chapters available</p>
                            )}
                        </div>
                    </div>
                )}

                {maths && (
                    <div className="w-full bg-orange-100 border p-10 rounded-md shadow-md mb-8">
                        <h2 className="text-2xl text-center font-semibold mb-6">Maths Resources</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                            {mathsChap.length > 0 ? (
                                mathsChap.map((chap) => (
                                    <label key={chap.id} className={"m-4 " + radioClass}>
                                        <input
                                            type="radio"
                                            name="chapter"
                                            value={chap.name}
                                            checked={selectedChapter?.id === chap.id}
                                            onChange={() => setSelectedChapter(chap)}
                                            className="form-radio "
                                        />
                                        <span>{chap.name}</span>
                                    </label>
                                ))
                            ) : (
                                <p>No chapters available</p>
                            )}
                        </div>
                    </div>
                )}

                {chem && (
                    <div className="w-full bg-orange-100 border p-10 rounded-md shadow-md mb-8">
                        <h2 className="text-2xl text-center font-semibold mb-6">Chemistry Resources</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                            {chemChap.length > 0 ? (
                                chemChap.map((chap) => (
                                    <label key={chap.id} className={radioClass}>
                                        <input
                                            type="radio"
                                            name="chapter"
                                            value={chap.name}
                                            checked={selectedChapter?.id === chap.id}
                                            onChange={() => setSelectedChapter(chap)}
                                            className="form-radio"
                                        />
                                        <span>{chap.name}</span>
                                    </label>
                                ))
                            ) : (
                                <p>No chapters available</p>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-center mt-6">
                    <button
                        type="button"
                        className="bg-blue-600 text-white py-4 px-10 flex items-center rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                        onClick={handleGenerate}
                    >
                        Generate
                        <FaLongArrowAltRight className="ml-3" />
                    </button>
                </div>

                {resources.length > 0 && (
                    <div className="w-full mt-10">
                        <h3 className="text-xl font-semibold mb-4">Resources</h3>
                        <div className="flex flex-col space-y-4">
                            {resources.map((res, index) => (
                                <div key={index} className="border p-4 flex items-center justify-between rounded-md">
                                    {res.yt ? (
                                        <div className="mb-4">
                                            <FaYoutube size={100} className="text-red-500" />
                                            <iframe
                                                width="560"
                                                height="315"
                                                src={`https://www.youtube.com/embed/${getYoutubeVideoID(res.yt)}`}
                                                title="YouTube video player"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    ) : null}
                                    {res.pdf ? (
                                        <div className="p-4">
                                            <BiSolidFilePdf size={50} className="text-blue-400"/>
                                            <a
                                                href={res.pdf.startsWith('http') ? res.pdf : `http://localhost:8000${res.pdf}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 underline"
                                            >
                                                View PDF
                                            </a>
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Resource;
