const path = require('path');
const { v4: uuidv4 } = require('uuid');
const CustomError = require("../classes/customError");  //Este paquete nos permitirá crear un archivo con nombre único.
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL);

/**
 *
 * @param requestFiles
 * @param settings
 * @param {string[]} settings.fileExtension - Extensiones permitidas en los archivos
 * @param {string} settings.dir - Directorio donde se guardarán los archivos
 * @param {number?} settings.sizeLimit - Peso limite de cada archivo (en MB).
 * @param {number?} settings.numberLimit - Cantidad limite de archivos que deberian subirse. * @returns {Promise<*>}
 */
const uploadFiles = async (requestFiles, settings) => {
    const filesUploaded = new Map();
    const files = Object.entries(requestFiles);
    const maxBytesSize = settings.sizeLimit * (1024 * 1024) || (1024 * 1024); // 1024^2 B = 1MB

    const fileExtsValid = files.every(([key, file]) => {
        const fileNameArray = file.name.split('.');
        const fileExt = fileNameArray[fileNameArray.length - 1];

        return settings.fileExtension.includes(fileExt)
    });

    const fileQuantityExceeded = settings.numberLimit !== undefined && files.length > settings.numberLimit;
    const fileSizeExceeded = !files.every(([key, file]) => file.size <= maxBytesSize);

    if (!fileExtsValid) {
        throw new CustomError('Los archivos subidos no tienen las extensiones correctas.')
    } else if (fileQuantityExceeded) {
        throw new CustomError(`Se han subido demasiados archivos. (Max. ${settings.numberLimit}})`)
    } else if (fileSizeExceeded) {
        throw new CustomError(`Se han subido archivos demasiado pesados. (Max. ${Math.round(maxBytesSize / 1024)} MB)`)
    }

    for (const [key, file] of files) {
        const { tempFilePath } = file

        const uploaded = await cloudinary.uploader.upload(tempFilePath, {
            folder: settings.dir,
        });

        filesUploaded.set(key, uploaded)
    }

    return filesUploaded
}

/**
 *
 * @param {Buffer} buffer
 * @param settings
 * @param {string} settings.dir - Directorio donde se guardarán los archivos
 * @returns {Promise<*>}
 */
const uploadBuffer = async (buffer, settings) => {
    try {
        return await new Promise((resolve) => {
            cloudinary.uploader.upload_stream({folder: settings.dir}, (error, uploadResult) => {
                return resolve(uploadResult);
            }).end(buffer);
        })
    } catch (error) {
        throw error
    }
}

module.exports = {
    uploadFiles,
    uploadBuffer
}