// // pages/api/chat.js
// import axios from 'axios';

// const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
// const apiKey = process.env.GROQ_API_KEY;

// export default async function handler(req, res) {
//     if (req.method !== 'POST') {
//         res.setHeader('Allow', ['POST']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//         return;
//     }

//     const { question, prompt } = req.body;

//     try {
//         const response = await axios.post(apiUrl, {
//             model: 'llama3-70b-8192',
//             messages: [
//                 {
//                     role: 'system',
//                     content: prompt
//                 },
//                 {
//                     role: 'user',
//                     content: question
//                 }
//             ]
//         }, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${apiKey}`
//             }
//         });

//         // Return the response from the Groq API
//         res.status(200).json(response.data);
//     } catch (error) {
//         res.status(error.response?.status || 500).json({
//             message: error.message,
//             ...(error.response?.data && { data: error.response.data })
//         });
//     }
// }

import axios from 'axios';
import Cors from 'cors';

// Initialize the cors middleware
const cors = Cors({
    methods: ['POST', 'OPTIONS'], // Allow POST and OPTIONS methods
    origin: (origin, callback) => {
        const allowedOrigins = ['http://localhost:5173', 'https://dictarticle.vercel.app'];
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
const apiKey = process.env.GROQ_API_KEY;

export default async function handler(req, res) {
    // Run the middleware
    await runMiddleware(req, res, cors);

    if (req.method === 'OPTIONS') {
        res.status(200).end(); // Respond OK to preflight requests
        return;
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { question, prompt } = req.body;

    try {
        const response = await axios.post(apiUrl, {
            model: 'llama3-70b-8192',
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: question
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });

        // Return the response from the Groq API
        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
            ...(error.response?.data && { data: error.response.data })
        });
    }
}