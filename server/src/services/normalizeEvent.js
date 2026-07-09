import generateDescription from "../utils/generateDescription.js";

export default function normalizeEvent(tmEvent, canonicalKey) {
    const venueData = tmEvent._embedded?.venues?.[0];
    const classificationData = tmEvent.classifications?.[0];

    console.log({
        name: tmEvent.name,
        type: tmEvent.type,
        classifications: tmEvent.classifications,
        promoter: tmEvent.promoter,
        attractions: tmEvent._embedded?.attractions,
        products: tmEvent.products,
    });

    const image = tmEvent.images?.find(img => img.ratio === "16_9" && img.width >= 1024) ?? tmEvent.images?.[0];

    const venue = {
        id: venueData.id,
        name: venueData.name,

        city: venueData.city,
        state: venueData.state,
        country: venueData.country,

        location: venueData.location,
    };

    const event = {
        id: tmEvent.id,
        canonical_key: canonicalKey,

        name: tmEvent.name,
        description: generateDescription(tmEvent),

        start_datetime: tmEvent.dates?.start?.dateTime,
        timezone: tmEvent.dates?.timezone,
        status: tmEvent.dates?.status,

        image_url: image?.url,

        venue_id: null,

        segment: classificationData.segment,
        genre: classificationData.genre,
        subgenre: classificationData.subGenre,

        occurrences: [tmEvent.dates?.start?.dateTime]
    };

    return { event, venue };
}