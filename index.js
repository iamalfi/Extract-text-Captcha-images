const Jimp = require("jimp");
const Tesseract = require("tesseract.js");
async function ImageAndRecognizeText(imagePath) {
    try {
        const result = await Tesseract.recognize(imagePath, "eng");
        // console.log(result.text);
        return result.text;
    } catch (error) {
        // console.error(error);
        return error;
    }
}

async function readImageAndRecognizeText(imagePath) {
    try {
        const image = await Jimp.read(imagePath);

        // Autocrop the image to the area containing the text
        image.autocrop();

        // Resize the image to improve OCR accuracy
        image.resize(800, Jimp.AUTO);
        // Invert the colors
        image.invert();
        // Convert the image to grayscale and enhance contrast
        image.grayscale().contrast(1);

        // Convert the image to a PNG format
        const pngImage = await image.getBufferAsync(Jimp.MIME_PNG);

        // Use Tesseract.js to recognize the text from the PNG image
        const result = await Tesseract.recognize(pngImage, {
            lang: "eng",
            tessedit_char_whitelist: "0123456789", // Only recognize digits
        });

        // console.log(result.text.trim()); // Trim extra spaces and line breaks from the output
        return result.text.trim();
    } catch (error) {
        // console.log(error);
        return error;
    }
}

async function main() {
    const english = await ImageAndRecognizeText(
        "https://i.ibb.co/jTKYQqP/Captcha-United.png"
    );

    const number = await readImageAndRecognizeText(
        "https://i.ibb.co/R4BB4DW/Captcha-Bajaj.jpg"
    );
    console.log(`English_Text: ${english}, Number: ${number}`);
}
main();
