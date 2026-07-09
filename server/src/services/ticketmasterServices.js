export async function fetchTicketmasterEvents() {
    try {
        const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events/?apikey=${process.env.TICKET_MASTER_KEY}&size=50&countryCode=US&page=0&classificationName=Music`);

        const data = await res.json();

        return data._embedded?.events || [];
    } catch (err) {
        console.error("Error fetching events from Ticketmaster:", err);
    }
}