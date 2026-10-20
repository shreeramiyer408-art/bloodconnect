export function googleMapsViewUrl(bank) {
  const query = encodeURIComponent(`${bank.name}, ${bank.address}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function googleMapsDirectionsUrl(bank) {
  const destination = encodeURIComponent(`${bank.name}, ${bank.address}`);
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
}