require("dotenv").config();
const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const cors = require("cors"); // Import the cors middleware
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { extractTextFromPdf } = require("./utils/pdfToText");
const { generatePrompt } = require("./utils/generatePrompt");

const app = express();
const port = 5000;

// Enable CORS for all routes
app.use(cors({ origin: "*" }));

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

//
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Endpoint to upload a PDF and extract its text
 */
app.post("/api/extract", upload.single("resume"), async (req, res) => {
  const predefinedKeys = [
    "fullname",
    "email",
    "phone",
    "address",
    "skills",
    "experience",
    "education",
  ];

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const extractedText = await extractTextFromPdf(req.file);

    //     const prompt = `
    // You are a resume parsing assistant. Extract and structure the following information from this text in JSON format with these keys:
    // "fullname", "email", "phone", "address", "skills", "experience", "education". If a key's value is missing, set it as null. If any other problem occurs return an object with defined keys and null values. be precie on interpreting the text return values for key if u are sure they are  related to the key for if there is little chance of them being related to the key then set it as null. add to key if there us surity that the value is related to the key. and just return the json object only no need for formatting just return the json object text only.
    // Here is the text:
    // ${extractedText}
    // `;

    const prompt = generatePrompt(extractedText);

    const result = await model.generateContent(prompt);
    console.log(`result`, result.response.text());

    let structuredData;
    try {
      structuredData = JSON.parse(result.response.text());
      console.log("🚀 ~ app.post ~ structuredData 1:", structuredData);
    } catch (error) {
      console.log("error come in the parsing");
      structuredData = predefinedKeys.reduce(
        (acc, key) => ({ ...acc, [key]: null }),
        {}
      );
    }
    console.log("🚀 ~ app.post ~ structuredData 2:", structuredData);

    const finalData = {};
    predefinedKeys.forEach((key) => {
      finalData[key] = structuredData[key] || null;
    });
    console.log("🚀 ~ app.post ~ finalData:", finalData);

    res.json({
      pdfData: finalData, // Extracted text
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to extract text from PDF" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
