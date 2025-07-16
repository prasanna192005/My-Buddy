import React, { useContext, useEffect, useRef, useState } from 'react';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { UserContext } from '../UserContext';

const supabaseUrl = 'https://ugpifdpzvmupzfdejpbv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVncGlmZHB6dm11cHpmZGVqcGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwMjgzNDEsImV4cCI6MjA0MzYwNDM0MX0.0PHU_w4FXGb_TOj5wYIIAHLtT1ficXlbOWMCuc7BJdw';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const JoinCallPage = () => {
    const { roomId } = useParams();
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);
    const audioUrlRef = useRef(null);
    const [transcription, setTranscription] = useState("");
    const [wordsArray, setWordsArray] = useState([]);  // State to hold the array of words
    const [abusiveWordsFound, setAbusiveWordsFound] = useState([]); // State to hold abusive words found
    const recognitionRef = useRef(null);
    const fullTranscriptionRef = useRef("");
    const { user } = useContext(UserContext);

    const abusive_words = [
        "idiot", "moron", "stupid", "fool", "dumb", "loser", "pathetic", "jerk", 
        "arrogant", "selfish", "bastard", "ignorant", "worthless", "scumbag", 
        "coward", "trash", "nasty", "disgusting", "annoying", "creep", "filthy"
    ];

    // Function to identify abusive words
    const identifyAbusiveWords = () => {
        const matchedAbusiveWords = wordsArray.filter(word => abusive_words.includes(word.toLowerCase()));
        setAbusiveWordsFound(matchedAbusiveWords);
    };

    useEffect(() => {
        // Identify abusive words whenever wordsArray changes
        if (wordsArray.length > 0) {
            identifyAbusiveWords();
        }
    }, [wordsArray]);

    const myMeeting = async (element) => {
        const appID = 752328650;
        const serverSecret = "bc3c943a1b05e2b2f9c54aeaf271da25";
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            roomId,
            Date.now().toString(),
            'Your name'
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
        });

        startAudioRecording();
    };

    const startAudioRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                audioUrlRef.current = URL.createObjectURL(audioBlob);
                audioChunks.current = [];

                uploadAudioToSupabase(audioBlob);
                stopSpeechRecognition();
                setTranscription(fullTranscriptionRef.current);
            };

            mediaRecorderRef.current.start();
            startSpeechRecognition();
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopAudioRecording = async () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            await sendTranscriptionToBackend(fullTranscriptionRef.current);
        }
    };

    const playRecordedAudio = () => {
        if (audioUrlRef.current) {
            const audio = new Audio(audioUrlRef.current);
            audio.play();
        } else {
            console.log("No audio recorded yet.");
        }
    };

    const uploadAudioToSupabase = async (audioBlob) => {
        const fileName = `public/audio-${Date.now()}.wav`;
        const { data, error } = await supabase
            .storage
            .from('Audio')
            .upload(fileName, audioBlob, {
                cacheControl: '3600',
                upsert: false,
                contentType: 'audio/wav'
            });

        const audioMetadata = {
            user_id: user.id,
            room_number: roomId,
            file_path: fileName,
            created_at: new Date().toISOString(),
        };

        const { error: dbError } = await supabase
            .from('audio_records')
            .insert([audioMetadata]);

        if (error) {
            console.error('Error uploading audio to Supabase:', error.message);
        } else {
            console.log('Audio uploaded to Supabase:', data);
        }
    };

    // Start speech recognition using the Web Speech API
    const startSpeechRecognition = () => {
        if (!('webkitSpeechRecognition' in window)) {
            console.error("SpeechRecognition API not supported in this browser.");
            return;
        }

        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    fullTranscriptionRef.current += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }
        };

        recognition.onend = () => {
            console.log("Final Transcription: ", fullTranscriptionRef.current);
            const words = fullTranscriptionRef.current.trim().split(/\s+/);
            setWordsArray(words);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopSpeechRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const sendTranscriptionToBackend = async (transcription) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/abusive/', {
                transcription: transcription
            });

            const { cleaned_answer, abusive_word_count } = response.data;
            console.log('Cleaned Answer:', cleaned_answer);
            console.log('Number of Abusive Words:', abusive_word_count);
        } catch (error) {
            console.error('Error sending transcription to backend:', error.message);
        }
    };

    useEffect(() => {
        return () => {
            stopAudioRecording();
        };
    }, []);

    return (
        <div className='flex flex-col justify-center items-center h-screen gap-8'>
            <div ref={myMeeting} className='p-4 rounded-xl'></div>
            <div className='flex gap-4 text-xl'>
                <button onClick={stopAudioRecording} className='bg-red-500 rounded-xl p-2'>Stop Recording</button>
                <button onClick={playRecordedAudio} className='bg-green-500 rounded-xl p-2'>Play Recorded Audio</button>
            </div>
            {/* {transcription && <div className="transcription">Transcription: {transcription}</div>}
            {wordsArray.length > 0 && (
                // <div className="words-array">
                //     <h3 className="font-bold text-lg mt-4">Transcribed Words:</h3>
                //     <p className="bg-gray-100 p-4 rounded-lg">{wordsArray.join(", ")}</p>
                // </div>
            )} */}
            {abusiveWordsFound.length > 0 && (
                <div className="abusive-words mt-6 bg-yellow-100 p-4 rounded-lg">
                    <h3 className="font-bold text-lg">Abusive Words Detected:</h3>
                    <h4 className="font-bold text-lg">*You could be banned if abuse detected:</h4>
                    <ul className="list-disc list-inside text-red-500">
                        {abusiveWordsFound.map((word, index) => (
                            <li key={index}>{word}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default JoinCallPage
