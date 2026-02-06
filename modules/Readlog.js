export async function readLogFile(fileName) {
    try {
        const response = await fetch(`../logs/${fileName}`);
        if (!response.ok) throw new Error('File not found');
        const text = await response.text();
        return text.replace(/\r?\n/g, '\\n');
    } catch (err) {
        return `ERROR: Could not open log file "${fileName}". Check if it exists.`;
    }
}