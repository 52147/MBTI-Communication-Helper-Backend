require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const apiKey = process.env.OPENAI_API_KEY; // Use environment variable for API key

// Endpoint to get chat completion
app.post("/generate-response", (req, res) => {
  console.log(req.body); 

  // Extract data from req.body
  const { userCharacter, userMBTI, otherCharacter, otherMBTI, situation } =
    req.body;

  // Format the data into messages
  const messages = [
    {
      role: "user",
      content: `I am a ${userCharacter} with MBTI type ${userMBTI}.`,
    },
    {
      role: "user",
      content: `I am interacting with a ${otherCharacter} who is an ${otherMBTI}.`,
    },
    {
      role: "user",
      content: `Situation: ${situation} this is other person did to me`,
    },
    {
      role: "user",
      content:
        "Tell me what sentence that i can say under this situation and based on our mbti",
    },
  ];

  // Make the API call to OpenAI
  axios
    .post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )
    .then((apiResponse) => {
      // Access the response text
      const responseText = apiResponse.data.choices[0].message.content;
      console.log(responseText);

      // Send the response text back to the frontend
      res.json({ response: responseText });
    })
    .catch((error) => {
      console.error("Error:", error.response.data);
      res.status(500).send("Error in generating response");
    });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
