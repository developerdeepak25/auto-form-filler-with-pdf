import PdfParse from "pdf-parse";

export async function extractTextFromPdf(file) {
  try {
    // Extract text from the uploaded PDF
    const pdfBuffer = file.buffer;
    const data = await PdfParse(pdfBuffer);
    return data.text || "";
  } catch (err) {
    console.error("Error extracting PDF text:", err);
    throw err;
  }
}
