export default function generateDescription(event) {
    const segment = event.classifications?.[0]?.segment?.name;

    const name = event.name;
    const genre = event.classifications?.[0]?.genre?.name || "live";
    const subgenre = event.classifications?.subgenre?.name || genre;
    const venue = event._embedded?.venues?.[0];
    const city = venue.city?.name;
    const state = venue.state?.name || "";
    const localDate = event.dates?.start?.localDate;
    const localTime = event.dates?.start?.localTime;

    if (segment === "Music") {
        return `${name} is a ${genre} music event taking place at ${venue.name} in ${city}, ${state} on ${localDate} at ${localTime}. Fans of ${genre} and ${subgenre} music can look forward to a live performance experience featuring the energy and atmosphere that make these events so popular. Whether you are a longtime fan or simply looking to discover something new, this event offers an opportunity to enjoy live entertainment in one of the area's notable venues.`
    }

    if (segment === "Sports") {
        return `${name} is a ${genre} sporting event scheduled for ${localDate} at ${localTime} at ${venue.name} in ${city}, ${state}. Sports fans can expect a competitive atmosphere as athletes and teams take the stage in this ${subgenre} event. Attendees will have the opportunity to experience the excitement of live competition, connect with fellow fans, and enjoy the unique energy that comes with watching sports in person.`
    }

    if (segment === "Arts & Theatre") {
        return `${name} is a ${subgenre} performance taking place at ${venue.name} in ${city}, ${state} on ${localDate} at ${localTime}. This event showcases the creativity and talent associated with the world of ${genre}. Whether you enjoy theatrical productions, artistic performances, or cultural experiences, attendees can expect an engaging presentation in a venue designed to bring audiences closer to the performance.`
    }

    if (segment === "Miscellaneous") {
        return `${name} is a special event being held at ${venue.name} in ${city}, ${state} on ${localDate} at ${localTime}. As part of the ${genre} category, this event offers attendees a unique experience that may not fit into traditional entertainment categories. Guests can look forward to an engaging atmosphere, opportunities to explore new interests, and an event designed to bring people together around a shared activity or experience.`
    }

    return `${name} is an upcoming event taking place at ${venue.name} in ${city}, ${state} on ${localDate} at ${localTime}. Attendees can look forward to a memorable experience and the opportunity to enjoy a live event in one of the area's featured venues.`

}