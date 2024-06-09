const convertHTMLToPDF = require("pdf-puppeteer");
const {uploadBuffer} = require("../helpers/cloudinary.helper");

class EventUtils {
    static generateSummaryFile = async (event) => {
        console.log(event)

        const summaryHtml = `<div>
                <span>${event.name}</span>
                <br>
                <span>${event.description}</span>
                <br>
                <span>${new Date(event.scheduledDateTime)}</span>
            </div>`

        await convertHTMLToPDF(summaryHtml, async (file) => {
            const uploadDir = 'event/summary';

            return await uploadBuffer(file, {dir: uploadDir})
        })
    };
}

module.exports = EventUtils