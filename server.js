require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files (index.html, css, js)

app.get('/api/question', async (req, res) => {
    const audience = req.query.audience || 'all';
    try {
        const question = await getQuestionFromAPI(audience);
        res.json({ question: question });
    } catch (error) {
        console.error("Error fetching question:", error);
        res.status(500).json({ error: 'Failed to fetch question from API' });
    }
});

async function getQuestionFromAPI(audience) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set in .env file.");
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const prompt = {
        contents: [{
            parts: [{
                text: `I want you to act as an icebreaker question generator that produces unique prompts.
Your input will include an audience category (e.g., Friends, Family, Workplace) and a list of previously asked questions.
For each request, generate one concise, creative, and engaging question appropriate for the specified audience.
Ensure the generated question has not appeared in the provided list of prior questions.
Respond with exactly one sentence containing only the question, without any additional explanation or formatting.
Your questions should draw inspiration from inclusive and thought-provoking topics to spark meaningful conversation.
Avoid repeating content by referencing a wide range of question styles, such as scenario prompts, personal preferences, and hypothetical challenges.
Maintain sensitivity and suitability for the chosen audience, ensuring no potentially uncomfortable or overly personal topics are included.
Example output: "What's one skill you've always wanted to learn that would totally surprise your friends?"
Begin your role now, using the audience category: ${audience}.`
            }]
        }]
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prompt)
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const question = data.candidates[0].content.parts[0].text;
        return question;

    } catch (error) {
        console.error("Error fetching question from Gemini API:", error);
        throw error;
    }
}


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
