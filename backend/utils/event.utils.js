const convertHTMLToPDF = require("pdf-puppeteer");
const {uploadBuffer} = require("../helpers/cloudinary.helper");

class EventUtils {
    static generateSummaryFile = async (event) => {
        const summaryHtml = `<div>
                <span>${event.name}</span>
                <br>
                <span>${event.description}</span>
                <br>
                <span>${new Date(event.scheduledDateTime)}</span>
            </div>`

        return new Promise(async (resolve, reject) => {
            try {
                await convertHTMLToPDF(summaryHtml, async (file) => {
                    const uploadDir = 'event/summary';

                    const pdfFile = await uploadBuffer(file, {dir: uploadDir});

                    resolve(pdfFile)
                })
            } catch (e) {
                reject(e.message)
            }
        })
    };
}

module.exports = EventUtils