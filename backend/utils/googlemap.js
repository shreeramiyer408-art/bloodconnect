// Builds Google Maps links for a blood bank. We rely on Google's own address
// search for the "view" link instead of our own lat/lng, since Google's
// geocoding of a full street address is more reliable than a hand-plotted
// pin — this guarantees the user always lands on the right building.

export function googleMapsViewUrl(bank) {
  const query = encodeURIComponent(`${bank.name}, ${bank.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function googleMapsDirectionsUrl(bank) {
  const destination = encodeURIComponent(`${bank.name}, ${bank.address}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}