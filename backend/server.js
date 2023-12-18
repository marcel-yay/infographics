const express = require('express');
const cors = require('cors'); // Import the 'cors' middleware
const axios = require('axios');
const bodyParser = require('body-parser');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Use the 'cors' middleware
app.use(bodyParser.json());

// Example endpoint to handle the form submission
app.post('/generate-infographics', async (req, res) => {
    try {
        const { color1, color2, color3, url } = req.body;

        // Crawl the website and extract the main content's text
        const bodyText = await crawlWebsite(url);

        // Concatenate the text with the prompt for OpenAI
        const prompt = `Which information from the following text can be used for an infographic? (For example lists, quotes, or step-by-step-guides). Categorize the information and return the response a) in JSON FORMAT, b) GERMAN, c) JSON STARTING with '>>>' and JSON ENDING with '<<<' aso that the data can be easily processed and prepared. The "graphics" key should contain an array with all possible infographics objects. Within the object, the key "type" defines whether it is "list", "quote" or "step-by-step-guide". The "heading" is the heading of the infographic and, depending on the type, you will find one or more strings for creating the graphic in the "content" key. The text is as follows:`;

        const openaiResponse = await sendToOpenAI(prompt + bodyText);

        console.log(openaiResponse)

        // Process the OpenAI response as needed
        const infographicsData = processOpenAIResponse(openaiResponse);

        // Return the processed data to the frontend
        res.json({ infographicsData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to crawl the website and extract the main content's text
async function crawlWebsite(url, maxWords = 800) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // Select specific HTML tags and concatenate their text content
        const bodyText = $('body').find('h1, h2, h3, p, ul, ol, li').text();

        // Remove white spaces (including newlines and extra spaces)
        const cleanedText = bodyText.replace(/\s+/g, ' ').trim();

        // Split the cleaned text into words
        const words = cleanedText.split(' ');

        // Limit the words to the specified maximum
        const limitedText = words.slice(0, maxWords).join(' ');

        return limitedText;
    } catch (error) {
        console.error('Error crawling website:', error);
        throw error;
    }
}

// Function to send data to OpenAI API
async function sendToOpenAI(data) {
    try {
        const openaiApiKey = 'XXX'; // Replace with your OpenAI API key
        const apiUrl = 'https://api.openai.com/v1/completions';
        const model = 'gpt-3.5-turbo-instruct'

        const prompt = data;
        const requestBody = {
          prompt: prompt,
          max_tokens: 2096,
          model: model
        };

        console.log(prompt);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openaiApiKey}`,
            },
            body: JSON.stringify(requestBody),
        });

        const gptResponse = await response.json();
        const text = gptResponse.choices[0].text

        const regex = />>>(.*?)<<</;
        const match = text.match(regex);

        // Check if there's a match and extract the content
        const extractedContent = match ? match[1].trim() : null;

        return extractedContent
    } catch (error) {
        console.error('Error sending data to OpenAI:', error);
        throw error;
    }
}

// Function to process the OpenAI response
function processOpenAIResponse(response) {
    // Add your logic to process the OpenAI response and structure it as needed
    // For example, categorize the information into lists, quotes, or step-by-step guides
    // Return the processed data in the required format
    return {
        graphics: [
            {
                type: 'list',
                heading: 'List Heading',
                content: ['Item 1', 'Item 2', 'Item 3'],
            },
            {
                type: 'quote',
                heading: 'Quote Heading',
                content: ['This is a quote.'],
            },
            {
                type: 'step-by-step-guide',
                heading: 'Guide Heading',
                content: ['Step 1: Do this', 'Step 2: Do that', 'Step 3: Finish'],
            },
        ],
    };
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});