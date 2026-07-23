export default function doHaversineFormula(lat1, lng1, lat2, lng2, radius = 3958.8) {
    const toRadians = (degrees) => degrees * Math.PI / 180;

    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lng2 - lng1);

    const a = Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return radius * c;
}