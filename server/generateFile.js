const fs = require('fs').promises; // Use the .promises API
const path = require('path'); // For constructing paths reliably

// Ensure the 'code' directory exists

const dirPath = path.join(__dirname, 'code');


if (!require('fs').existsSync(dirPath)) {
    require('fs').mkdirSync(dirPath, { recursive: true });
}


async function generateFile(fileFormat, fileContent) {
    // await makePath();
    const uname = Date.now();
    const filename = `${uname}.${fileFormat}`;
    const filepath = path.join(dirPath, filename);

    try {
        await fs.writeFile(filepath, fileContent); // Use await with the promise version
        return filepath; // Return the path of the created file on success
    } catch (err) {
        console.error(`Error writing file ${filepath}:`, err);
        // You might want to throw the error or return a specific error indicator
        // For example, throw err; or return null; or return { error: "Failed to write file" };
        throw new Error(`Failed to write file: ${err.message}`); // Or return a specific error object
    }
}

module.exports = {
    generateFile,
};