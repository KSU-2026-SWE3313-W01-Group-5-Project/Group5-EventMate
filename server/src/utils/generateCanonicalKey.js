import crypto from "crypto";

export default async function generateCanonicalKey(tmEvent) {
    const venueData = tmEvent._embedded?.venues?.[0];
    const classificationData = tmEvent.classifications?.[0];

    const input = [
        tmEvent.name?.trim().toLowerCase(),
        venueData?.id,
        classificationData?.segment?.name,
        classificationData?.genre?.name,
    ].join("|");

    return crypto
        .createHash("sha256")
        .update(input)
        .digest("hex");
}