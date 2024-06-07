const path = require('path');
const { v4: uuidv4 } = require('uuid');  //Este paquete nos permitirá crear un archivo con nombre único.
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL);

/**
 *
 * @param requestFiles
 * @param settings
 * @param {string[]} settings.fileExtension - Extensiones permitidas en los archivos
 * @param {string} settings.dir - Directorio donde se guardarán los archivos
 * @returns {Promise<*>}
 */
const uploadFiles = async (requestFiles, settings) => {
    try {
        const filesUploaded = new Map();
        const files = Object.entries(requestFiles);

        const filesValid = files.every(([key, file]) => {
            const fileNameArray = file.name.split('.');
            const fileExt = fileNameArray[fileNameArray.length - 1];

            return settings.fileExtension.includes(fileExt)
        });

        if (!filesValid) {
            throw new Error('Los archivos subidos no tienen las extensiones correctas.')
        }

        for (const [key, file] of files) {
            const { tempFilePath } = file

            const uploaded = await cloudinary.uploader.upload(tempFilePath, {
                folder: settings.dir,
            });

            filesUploaded.set(key, uploaded)
        }

        console.log('names', filesUploaded)

        return filesUploaded
    } catch (error) {
        console.warn(error)
        return false;
    }
}



module.exports = {
    uploadFiles
}