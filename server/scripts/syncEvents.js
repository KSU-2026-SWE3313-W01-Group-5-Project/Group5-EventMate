import { handleSync } from '../src/services/eventsServices.js'
import "../src/utils/env.js"
import * as syncTypes from '../src/utils/syncTypes.js'

const MODES = {
    music: syncTypes.MUSIC_CLASSIFICATIONS,
    sports: syncTypes.SPORTS_CLASSIFICATIONS,
    arts: syncTypes.ARTS_CLASSIFICATIONS,

    quick: syncTypes.EVENT_TYPES,
    full: [...syncTypes.MUSIC_CLASSIFICATIONS, ...syncTypes.SPORTS_CLASSIFICATIONS, ...syncTypes.ARTS_CLASSIFICATIONS]
}

async function syncEvents() {
    const args = process.argv.slice(2);

    const modeArg = args.find(arg => arg.startsWith("--mode="));
    const mode = modeArg?.split("=")[1];

    try {
        if (mode && MODES[mode]) {
            await handleSync(MODES[mode]);
            console.log("Synced events successfully using mode:", mode);
        } else {
            console.error("Invalid mode: ", mode);
        }
    } catch (err) {
        console.error("Error syncing events:", err);
    }
}

await syncEvents();