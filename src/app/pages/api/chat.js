// pages/api/chat.js
import axios from 'axios';

const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
const apiKey = process.env.GROQ_API_KEY;

export default async function handler(req, res) {
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

        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({
            message: error.message,
            ...(error.response?.data && { data: error.response.data })
        });
    }
}