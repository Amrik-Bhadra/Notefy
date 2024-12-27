require("dotenv").config();

const config = require('./config.json');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const { authenticateToken } = require('./utilities');

mongoose.connect(config.connectionString)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

const User = require('./models/user.model');
const Note = require('./models/note.model');
// const UserAuthen = require('./routes/user_authen');
// const NotesRoute = require('./routes/notes_routes');
const PORT = process.env.PORT || 3000;
const otpStore = {};
const { sendOTP } = require('./functions/mailerSetup');


const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.json({ data: "hello" });
});

// Create account route
app.post("/create_account", async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Name: ', name);
    console.log('Email: ', email);

    try {
        const isUser = await User.findOne({ email: email });

        if (isUser) {
            return res.status(400).json({ error: true, message: "User already exists" });
        }

        // hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const accessToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(201).json({
            error: false,
            user: { id: user._id, name: user.name, email: user.email },
            accessToken,
            message: "Account Created Successfully!"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: true, message: "Server Error" });
    }
});

// login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const userInfo = await User.findOne({ email: email });
        if (!userInfo) {
            return res.status(400).json({ error: true, message: "User Not Found!" });
        }

        // Compare the hashed password
        const isPasswordValid = await bcrypt.compare(password, userInfo.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: true, message: "Invalid Credentials" });
        }

        const otp = Math.floor(10000 + Math.random() * 90000).toString();
        otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };
        await sendOTP(email, otp);

        return res.json({
            error: false,
            message: "OTP Send for 2FA",
            email,
        });
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ error: true, message: "Server Error" });
    }
});

app.post("/verify_otp", async (req, res) => {
    const { otp, email } = req.body;
    try {
        // Find user by email
        const userInfo = await User.findOne({ email: email });
        if (!userInfo) {
            return res.status(400).json({ error: true, message: "User Not Found!" });
        }

        if (otp === otpStore[email].otp) {
            delete otpStore[email];
            // Create a JWT token
            const user = { user: userInfo };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

            return res.json({
                error: false,
                message: "LoggedIn Successfully",
                email,
                accessToken
            });
        } else {
            return res.json({ error: true, message: "Wrong OTP entered" });
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: "Server Error" });
    }
})

// Get user details
app.get("/get_user_details", authenticateToken, async (req, res) => {
    try {
        // Ensure the structure of req.user is correct as per your authenticateToken middleware
        const { user } = req.user;

        // Fetch user details from the database
        const userInfo = await User.findById(user._id);

        if (!userInfo) {
            return res.status(404).json({ error: true, message: "User Not Found" });
        }

        // Return user details
        return res.json({
            userData: {
                name: userInfo.name,
                email: userInfo.email,
            },
            message: "User Data Retrieved Successfully!",
        });
    } catch (error) {
        console.error("Error fetching user details:", error); // Log the error
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

// add notes route
app.post('/add_notes', authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;
    console.log(user);

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note Added Successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        })
    }
});

// route to edit notes
app.put('/edit_notes/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;
    console.log('Note id: ', noteId);
    console.log('title: ', title);
    console.log('user id: ', user._id);

    if (!title && !content && !tags) {
        return res.status(400).json({ error: true, message: "No Changes done!" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(400).json({ error: true, message: "Note not found!" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note Updated Successfully!",
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
})


// route to get all notes
app.get('/get_all_notes', authenticateToken, async (req, res) => {
    const { user } = req.user;
    // console.log('Route called by user: ', user);

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.json({
            error: false,
            notes,
            message: "All notes retrieved!"
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server error" });
    }
});

// delete Notes
app.delete('/delete_note/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });
        return res.json({
            error: false,
            message: "Note Deleted Successfully!",
        });
    } catch (error) {
        return res.status(500).json({ error: false, message: "Internal Server Error" });
    }
});

// update isPinned
app.put("/update_note_pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {

        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        note.isPinned = !note.isPinned;
        await note.save();

        return res.status(200).json({
            error: false,
            note,
            message: `Note ${note.isPinned ? "Pinned" : "Unpinned"} successfully!`,
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});


// search note
app.get('/search_note', authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: true, message: "Searched query is required" });
    }

    try {
        const matchingNote = await Note.find({
            userId: user?._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
            ],
        });

        return res.json({ error: false, notes: matchingNote, message: "Notes found!" });

    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
})

app.listen(PORT, () => {
    console.log(`App is listening to port no ${PORT}`);
});
