// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { PDFExtract, PDFExtractOptions } from "pdf.js-extract";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const predefinedKeys = [
//   "fullname",
//   "email",
//   "phone",
//   "address",
//   "skills",
//   "experience",
//   "education",
// ];

// const pdfExtract = new PDFExtract();
// const options: PDFExtractOptions = {};

// async function extractTextFromPdf(buffer: Buffer): Promise<string> {
//     console.log(`buffer from function`, buffer);
//   return new Promise((resolve, reject) => {
//     pdfExtract.extractBuffer(buffer, options, (err, data) => {
//       if (err) reject(err);
//       console.log(`data`, data);
//       const text = data.pages
//         .map((page) => page.texts.map((text) => text.text).join(" "))
//         .join("\n");
//       resolve(text);
//     });
//   });
// }

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("resume");
//     console.log(`file`, file);

//     if (!file || !(file instanceof Blob)) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     const buffer =  Buffer.from(await file.arrayBuffer());
//     console.log(`buffer`, buffer);
//     const extractedText = await extractTextFromPdf(buffer);

//     const prompt = `
// You are a resume parsing assistant. Extract and structure the following information from this text in JSON format with these keys:
// "fullname", "email", "phone", "address", "skills", "experience", "education". If a key's value is missing, set it as null.
// Here is the text:
// ${extractedText}
// `;

//     const result = await model.generateContent(prompt);

//     let structuredData;
//     try {
//       structuredData = JSON.parse(result.response.text());
//     } catch (error: unknown) {
//      structuredData = predefinedKeys.reduce(
//        (acc, key) => ({ ...acc, [key]: null }),
//        {}
//      );
//      if (error instanceof Error) {
//        throw new Error(error.message);
//      }
//     }

//     const finalData: Record<string, string | null> = {};
//     predefinedKeys.forEach((key) => {
//       finalData[key] = structuredData[key] || null;
//     });

//     return NextResponse.json({
//       result: finalData,
//     });
//   } catch (error) {
//     console.error("Error processing resume:", error);
//     return NextResponse.json({ error: "An error occurred" }, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import * as pdfjsLib from "pdfjs-dist";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // Ensure worker is loaded (you might need to configure webpack/next.config.js)
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const predefinedKeys = [
//   "fullname",
//   "email",
//   "phone",
//   "address",
//   "skills",
//   "experience",
//   "education",
// ];

// async function extractTextFromPdf(buffer: Buffer): Promise<string> {
//   const pdf = await pdfjsLib.getDocument(buffer).promise;
//   let fullText = "";

//   for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//     const page = await pdf.getPage(pageNum);
//     const textContent = await page.getTextContent();
//     const pageText = textContent.items.map((item: any) => item.str).join(" ");
//     fullText += pageText + "\n";
//   }

//   return fullText;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("resume");

//     if (!file || !(file instanceof Blob)) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());
//     const extractedText = await extractTextFromPdf(buffer);

//     const prompt = `
// You are a resume parsing assistant. Extract and structure the following information from this text in JSON format with these keys:
// "fullname", "email", "phone", "address", "skills", "experience", "education". If a key's value is missing, set it as null.
// Here is the text:
// ${extractedText}
// `;

//     const result = await model.generateContent(prompt);

//     let structuredData;
//     try {
//       structuredData = JSON.parse(result.response.text());
//     } catch (error) {
//       structuredData = predefinedKeys.reduce(
//         (acc, key) => ({ ...acc, [key]: null }),
//         {}
//       );
//     }

//     const finalData: Record<string, string | null> = {};
//     predefinedKeys.forEach((key) => {
//       finalData[key] = structuredData[key] || null;
//     });

//     return NextResponse.json({
//       result: finalData,
//     });
//   } catch (error) {
//     console.error("Error processing resume:", error);
//     return NextResponse.json({ error: "An error occurred" }, { status: 500 });
//   }
// }

// import { NextRequest, NextResponse } from "next/server";
// import { promises as fs } from "fs";
// import { v4 as uuidv4 } from "uuid";
// import PDFParser from "pdf2json";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import path from "path";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const predefinedKeys = [
//   "fullname",
//   "email",
//   "phone",
//   "address",
//   "skills",
//   "experience",
//   "education",
// ];
// async function extractTextFromPdf(file: File): Promise<string> {
//   const fileName = `${uuidv4()}.pdf`;
//   console.log(`fileName`, fileName);

//   // Use path.join to resolve the absolute path
//   const uploadDir = path.join(process.cwd(), "uploads");
//   const tempFilePath = path.join(uploadDir, fileName);
//   console.log(`tempFilePath`, tempFilePath);

//   // Ensure that the uploads directory exists
//   await fs.mkdir(uploadDir, { recursive: true });

//   const fileBuffer = Buffer.from(await file.arrayBuffer());
//   await fs.writeFile(tempFilePath, fileBuffer);

//   return new Promise((resolve, reject) => {
//     const pdfParser = new PDFParser();

//     pdfParser.on("pdfParser_dataError", (errData) => {
//       reject(new Error(errData.parserError));
//     });

//     pdfParser.on("pdfParser_dataReady", (pdfData) => {
//       console.log(`pdfData`, pdfData);

//       console.log("JSON", JSON.stringify(pdfData));

//       console.log(`pdfParser`, pdfParser);
//       const text = (pdfParser as any).getRawTextContent();
//       console.log(`text`, text);
//       fs.unlink(tempFilePath); // cleanup
//       resolve(text);
//     });

//     pdfParser.loadPDF(tempFilePath);
//   });
// }
// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("resume") as File | null;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     const extractedText = await extractTextFromPdf(file);
//     console.log(`extractedText`, extractedText);

//     const prompt = `
// You are a resume parsing assistant. Extract and structure the following information from this text in JSON format with these keys: 
// "fullname", "email", "phone", "address", "skills", "experience", "education". If a key's value is missing, set it as null.
// Here is the text:
// ${extractedText}
// `;

//     // const result = await model.generateContent(prompt);
//     // console.log(`result`, result.response.text());
    

//     // let structuredData;
//     // try {
//     //   structuredData = JSON.parse(result.response.text());
//     // } catch (error) {
//     //   structuredData = predefinedKeys.reduce(
//     //     (acc, key) => ({ ...acc, [key]: null }),
//     //     {}
//     //   );
//     // }

//     // const finalData: Record<string, string | null> = {};
//     // predefinedKeys.forEach((key) => {
//     //   finalData[key] = structuredData[key] || null;
//     // });

//     return NextResponse.json({
//       // result: finalData,
//       result: extractedText,
//     });
//   } catch (error) {
//     console.error("Error processing resume:", error);
//     return NextResponse.json({ error: "An error occurred" }, { status: 500 });
//   }
// }



// import { NextRequest, NextResponse } from "next/server";
// import { promises as fs } from "fs";
// import { v4 as uuidv4 } from "uuid";
// import PDFParser from "pdf2json";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import path from "path";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const predefinedKeys = [
//   "fullname",
//   "email",
//   "phone",
//   "address",
//   "skills",
//   "experience",
//   "education",
// ];

// async function extractTextFromPdf(file: File): Promise<string> {
//   const fileName = `${uuidv4()}.pdf`;
//   console.log(`fileName`, fileName);

//   // Use path.join to resolve the absolute path
//   const uploadDir = path.join(process.cwd(), "uploads");
//   const tempFilePath = path.join(uploadDir, fileName);
//   console.log(`tempFilePath`, tempFilePath);

//   // Ensure that the uploads directory exists
//   await fs.mkdir(uploadDir, { recursive: true });

//   const fileBuffer = Buffer.from(await file.arrayBuffer());
//   await fs.writeFile(tempFilePath, fileBuffer);

//   return new Promise((resolve, reject) => {
//     const pdfParser = new PDFParser();

//     pdfParser.on("pdfParser_dataError", (errData) => {
//       reject(new Error(errData.parserError));
//     });

//     pdfParser.on("pdfParser_dataReady", (pdfData) => {
//       console.log(`pdfData`, pdfData);

//       console.log("JSON", JSON.stringify(pdfData));

//       console.log(`pdfParser`, pdfParser);
//       const text = (pdfParser as any).getRawTextContent();
//       console.log(`text`, text);
//       fs.unlink(tempFilePath); // cleanup
//       resolve(text);
//     });

//     pdfParser.loadPDF(tempFilePath);
//   });
// }
// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("resume") as File | null;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     const extractedText = await extractTextFromPdf(file);
//     console.log(`extractedText`, extractedText);

//     const prompt = `
// You are a resume parsing assistant. Extract and structure the following information from this text in JSON format with these keys: 
// "fullname", "email", "phone", "address", "skills", "experience", "education". If a key's value is missing, set it as null.
// Here is the text:
// ${extractedText}
// `;

//     // const result = await model.generateContent(prompt);
//     // console.log(`result`, result.response.text());
    

//     // let structuredData;
//     // try {
//     //   structuredData = JSON.parse(result.response.text());
//     // } catch (error) {
//     //   structuredData = predefinedKeys.reduce(
//     //     (acc, key) => ({ ...acc, [key]: null }),
//     //     {}
//     //   );
//     // }

//     // const finalData: Record<string, string | null> = {};
//     // predefinedKeys.forEach((key) => {
//     //   finalData[key] = structuredData[key] || null;
//     // });

//     return NextResponse.json({
//       // result: finalData,
//       result: extractedText,
//     });
//   } catch (error) {
//     console.error("Error processing resume:", error);
//     return NextResponse.json({ error: "An error occurred" }, { status: 500 });
//   }
// }




// import { NextRequest, NextResponse } from "next/server";
// import { promises as fs } from "fs";
// import { v4 as uuidv4 } from "uuid";
// import pdfExtract from "pdf-text-extract";
// import path from "path";

// const predefinedKeys = [
//   "fullname",
//   "email",
//   "phone",
//   "address",
//   "skills",
//   "experience",
//   "education",
// ];

// async function extractTextFromPdf(file: File): Promise<string> {
//   const fileName = `${uuidv4()}.pdf`;
//   console.log(`fileName`, fileName);

//   // Use path.join to resolve the absolute path
//   const uploadDir = path.join(process.cwd(), "uploads");
//   const tempFilePath = path.join(uploadDir, fileName);
//   console.log(`tempFilePath`, tempFilePath);

//   // Ensure that the uploads directory exists
//   await fs.mkdir(uploadDir, { recursive: true });

//   const fileBuffer = Buffer.from(await file.arrayBuffer());
//   await fs.writeFile(tempFilePath, fileBuffer);

//   return new Promise((resolve, reject) => {
//     pdfExtract(tempFilePath, (err, data) => {
//       // Cleanup the temporary file
//       fs.unlink(tempFilePath);

//       if (err) {
//         reject(err);
//         return;
//       }

//       // Join the text content from all pages
//       const text = data?.join(" ") || "";
//       resolve(text);
//     });
//   });
// }

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("resume") as File | null;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     const extractedText = await extractTextFromPdf(file);
//     console.log(`extractedText`, extractedText);

//     const prompt = `
// You are a resume parsing assistant. Extract and structure the following information from this text in JSON format with these keys: 
// "fullname", "email", "phone", "address", "skills", "experience", "education". If a key's value is missing, set it as null.
// Here is the text:
// ${extractedText}
// `;

//     const result = await model.generateContent(prompt);
//     console.log(`result`, result.response.text());

//     // Uncomment to handle AI model output if used
//     let structuredData;
//     try {
//       structuredData = JSON.parse(result.response.text());
//     } catch (error) {
//       structuredData = predefinedKeys.reduce(
//         (acc, key) => ({ ...acc, [key]: null }),
//         {}
//       );
//     }

//     const finalData: Record<string, string | null> = {};
//     predefinedKeys.forEach((key) => {
//       finalData[key] = structuredData[key] || null;
//     });

//     return NextResponse.json({
//       result: finalData,
//       // result: extractedText,
//     });
//   } catch (error) {
//     console.error("Error processing resume:", error);
//     return NextResponse.json({ error: "An error occurred" }, { status: 500 });
//   }
// }
