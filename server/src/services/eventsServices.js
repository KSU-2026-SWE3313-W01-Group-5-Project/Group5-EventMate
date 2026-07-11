import {fetchTicketmasterEvents} from "./ticketmasterServices.js";
import normalizeEvent from "./normalizeEvent.js";
import {EventModel} from "../../db/models/EventModel.js";
import {VenueModel} from "../../db/models/VenueModel.js";
import generateCanonicalKey from "../utils/generateCanonicalKey.js";

export async function handleSync(classifications) {
    for (let classification of classifications) {
        console.log("Syncing classification:", classification);
        const rawEvents = await fetchTicketmasterEvents(classification);

        let newEvents = 0;
        let updatedEvents = 0;

        for (const rawEvent of rawEvents) {
            try {
                const canonicalKey = await generateCanonicalKey(rawEvent);

                const existingEvent = await EventModel.findByCanonicalKey(canonicalKey);

                if (!existingEvent) {
                    const {event, venue} = normalizeEvent(rawEvent, canonicalKey);

                    event.venue_id = await VenueModel.upsert(venue);
                    await EventModel.insert(event);

                    newEvents++;
                } else {
                    await EventModel.insertOccurrence(existingEvent, rawEvent.dates?.start?.dateTime);

                    updatedEvents++;
                }
            } catch (err) {
                console.error("Failed syncing event:", rawEvent?.id, err.message);
            }
        }

        console.log(`Synced classification: ${classification} with ${newEvents} new events and ${updatedEvents} updated events!`);
    }
}