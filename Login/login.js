// Backend: Express.js + Firebase Authentication
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
require('dotenv').config();

admin.initializeApp({ credential: admin.credential.cert(require('./firebase-admin.json')) });
const app = express();
app.use(cors());
app.use(express.json());

// Verify Firebase Token & Generate JWT
app.post('/login', async (req, res) => {
    const { firebaseToken } = req.body;
    try {
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        const userId = decodedToken.uid;
        const jwtToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ jwtToken });
    } catch (error) {
        res.status(401).json({ error: 'Invalid Firebase Token' });
    }
});

app.listen(4747, () => console.log('Server running on port 4747'));

// Frontend: Next.js with Firebase Authentication
import { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '../firebase';

const auth = getAuth(firebaseApp);

export default function Login() {
    const [email, setEmail] = useState('pannupong jarakhon');
    const [password, setPassword] = useState('beam471919!!');

    const loginWithProvider = async (provider) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();
            const response = await fetch('http://localhost:4747/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firebaseToken: token })
            });
            const data = await response.json();
            localStorage.setItem('jwtToken', data.jwtToken);
            alert('Login Successful!');
        } catch (error) {
            console.error(error);
            alert('Login Failed');//alert
        }
    };

    const loginWithEmail = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            const response = await fetch('http://localhost:4747/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firebaseToken: token })
            });
            const data = await response.json();
            localStorage.setItem('jwtToken', data.jwtToken);
            alert('Login Successful!');
        } catch (error) {
            console.error(error);
            alert('Login Failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />   
        </div>
    );
}
