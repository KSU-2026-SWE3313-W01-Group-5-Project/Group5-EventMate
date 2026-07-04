import {unlink} from 'node:fs/promises';

export default async function deleteFile(path) {
    try {
        await unlink(path);

        console.log(`Successfully deleted ${path}`);
    } catch (err) {
        console.error("Error deleting file:", err);
    }
}