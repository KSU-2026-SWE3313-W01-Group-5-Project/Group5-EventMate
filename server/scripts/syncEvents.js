import { syncEvents } from '../src/services/syncEvents.js'
import "../src/utils/env.js"

console.log("Syncing Events");

try {
    syncEvents();
    console.log("Synced events successfully!");
} catch (err) {
    console.error("Error syncing events:", err);
}