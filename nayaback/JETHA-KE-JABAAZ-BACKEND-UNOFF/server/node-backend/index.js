const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const ws = require('ws');
const fs = require('fs');
const path = require('path');
const axios = require('axios'); // For making HTTP requests to Supabase
//const whisper = require('openai-whisper-api'); // Placeholder for Whisper API
const supabase = require('@supabase/supabase-js');
const Message = require('./models/message');
const { exec } = require('child_process');


dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Mongoose Connected');
  })
  .catch((err) => {
    console.error('Error Connecting:', err);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));

const jwtSec = 'django-insecure-3fr_%q88m)p8-yp1c7^af^%(hox8p*9nl2i20goum(+m$%5sg_';
const bcryptSalt = bcrypt.genSaltSync(10);

const supabaseUrl = "https://ugpifdpzvmupzfdejpbv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVncGlmZHB6dm11cHpmZGVqcGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwMjgzNDEsImV4cCI6MjA0MzYwNDM0MX0.0PHU_w4FXGb_TOj5wYIIAHLtT1ficXlbOWMCuc7BJdw";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

const server = app.listen(4000, () => {
  console.log('Server is running on port 4000');
});

// Route for transcribing audio

app.post('/transcribe', async (req, res) => {
  const { audioFileName } = req.body; // Get audio file name from the frontend
  console.log('Received audio file name:', audioFileName); // Log the file name to verify

  try {
    // Construct the full public URL using the file name
    const audioUrl = `https://ugpifdpzvmupzfdejpbv.supabase.co/storage/v1/object/public/Audio/${audioFileName}`;
    console.log('Constructed audio URL:', audioUrl);

    // Download the audio file from the constructed Supabase URL
    const response = await axios({
      url: audioUrl,
      method: 'GET',
      responseType: 'stream',
    });

    const audioFilePath = path.join(__dirname, 'downloaded_audio.wav'); // Save audio file locally

    // Pipe the audio data into a local file
    const writer = fs.createWriteStream(audioFilePath);
    response.data.pipe(writer);

    writer.on('finish', () => {
      // Call Whisper for transcription once the file is downloaded
      exec(`python transcribe.py ${audioFilePath}`, (error, stdout, stderr) => {
        if (error) {
          console.error('Error executing Whisper:', error);
          return res.status(500).send('Error processing audio');
        }

        const transcript = stdout.trim(); // Capture the output from the Python script
        res.json({ transcript });

        // Optionally, delete the downloaded file after transcription
        fs.unlink(audioFilePath, (unlinkError) => {
          if (unlinkError) console.error('Error deleting file:', unlinkError);
        });
      });
    });

    writer.on('error', (err) => {
      console.error('Error writing audio file:', err);
      res.status(500).send('Error saving audio file');
    });

  } catch (error) {
    console.error('Error downloading audio:', error);
    res.status(500).send('Error downloading audio file');
  }
});
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

// Messages Route
app.get('/messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await getUserDataFromRequest(req);

    const recipientIdHex = Number(userId).toString(16).padStart(24, '0');
    const senderIdHex = Number(userData.id).toString(16).padStart(24, '0');

    const recipientId = new mongoose.Types.ObjectId(recipientIdHex);
    const senderId = new mongoose.Types.ObjectId(senderIdHex);

    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.headers.authorization?.split(' ')[1]; // Token from Bearer header
    if (token) {
      jwt.verify(token, jwtSec, (err, userData) => {
        if (err) {
          console.error('JWT verification error:', err);
          return reject(err);
        }
        resolve(userData);
      });
    } else {
      reject(new Error('No token provided'));
    }
  });
}

const wss = new ws.WebSocketServer({ server });

wss.on('connection', (connection, req) => {
  function notifyAboutOnlinePeople() {
    const onlineUsers = [...wss.clients].filter(c => c.userId).map(c => ({
      userId: c.userId,
      username: c.username,
    }));
    console.log(onlineUsers);
    wss.clients.forEach(client => {
      client.send(JSON.stringify({ online: onlineUsers }));
    });
  }

  connection.isAlive = true;

  const pingInterval = setInterval(() => {
    connection.ping();
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false;
      clearInterval(pingInterval);
      connection.terminate();
      notifyAboutOnlinePeople();
    }, 3000);
  }, 10000);

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer);
    connection.isAlive = true;
  });

  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const token = urlParams.get('token');

  if (token) {
    jwt.verify(token, jwtSec, (err, userData) => {
      if (err) {
        console.error('JWT verification error:', err);
        connection.close(); // Close the connection if JWT verification fails
        return;
      }

      const { id, username } = userData;
      connection.userId = id;
      connection.username = username;
      console.log('New connection established:', connection.username);

      notifyAboutOnlinePeople();

      connection.on('message', async (message) => {
        const { recipient, text } = JSON.parse(message.toString());

        if (recipient && text && connection.userId) {
          const recipientIdHex = Number(recipient).toString(16).padStart(24, '0');
          const senderIdHex = Number(connection.userId).toString(16).padStart(24, '0');

          const senderObjectId = new mongoose.Types.ObjectId(senderIdHex);
          const recipientObjectId = new mongoose.Types.ObjectId(recipientIdHex);

          const messageDoc = await Message.create({
            sender: senderObjectId,
            recipient: recipientObjectId,
            text: text,
          });

          [...wss.clients]
            .filter(c => c.userId === recipient || c.userId === connection.userId)
            .forEach(c => c.send(JSON.stringify({
              text,
              sender: senderObjectId,
              recipient,
              _id: messageDoc._id,
            })));
        } else {
          console.log('Message data missing or invalid.');
        }
      });
    });
  } else {
    console.log('No token provided, closing connection.');
    connection.close();
  }
});
