import {fetchTicketmasterEvents} from "./ticketmasterServices.js";
import normalizeEvent from "./normalizeEvent.js";
import {EventModel} from "../../db/models/EventModel.js";
import {VenueModel} from "../../db/models/VenueModel.js";
import generateCanonicalKey from "../utils/generateCanonicalKey.js";
import {createPool} from "../../db/index.js";

const pool = createPool()

export async function syncEvents() {
    const rawEvents = await fetchTicketmasterEvents();

    for (const rawEvent of rawEvents) {
        try {
            const canonicalKey = await generateCanonicalKey(rawEvent);

            const existingEvent = await EventModel.findByCanonicalKey(canonicalKey);

            if (!existingEvent) {
                const {event, venue} = normalizeEvent(rawEvent, canonicalKey);

                event.venue_id = await VenueModel.upsert(venue);
                await EventModel.insert(event);
            } else {
                console.log("found existing event and inserting new occurrence at id:" + existingEvent.id);
                await EventModel.insertOccurrence(existingEvent, rawEvent.dates?.start?.dateTime);
            }
        } catch (err) {
            console.error("Failed syncing event:", rawEvent?.id, err.message);
        }
    }
}