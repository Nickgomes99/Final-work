// Service to fetch neighborhood images using Mapbox Static Images API
// Toronto Open Data doesn't provide neighborhood images, so we use Mapbox satellite/street imagery

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Complete coordinates for all Toronto neighborhoods from torontoWards data
const neighborhoodCoordinates = {
  // Downtown Core & Waterfront
  "Downtown Core": { lat: 43.6426, lng: -79.3871 },
  "Financial District": { lat: 43.6532, lng: -79.3832 },
  "The Annex": { lat: 43.6697, lng: -79.3956 },

  // East End
  "The Danforth": { lat: 43.6868, lng: -79.3373 },
  "The Beaches": { lat: 43.6676, lng: -79.2917 },
  "Flemingdon Park": { lat: 43.7435, lng: -79.2889 },
  Leaside: { lat: 43.725, lng: -79.3619 },

  // North
  Midtown: { lat: 43.7076, lng: -79.4145 },
  "North York Centre": { lat: 43.7615, lng: -79.4154 },
  "Don Mills": { lat: 43.7759, lng: -79.3484 },

  // West End
  Parkdale: { lat: 43.6464, lng: -79.4619 },
  "Corso Italia": { lat: 43.6764, lng: -79.4584 },
  Weston: { lat: 43.6966, lng: -79.5165 },
  "Jane & Finch": { lat: 43.7359, lng: -79.5346 },

  // Etobicoke
  Islington: { lat: 43.6435, lng: -79.5646 },
  Mimico: { lat: 43.6032, lng: -79.5039 },
  Rexdale: { lat: 43.7453, lng: -79.5787 },

  // Scarborough
  "Scarborough Town Centre": { lat: 43.7108, lng: -79.2653 },
  Agincourt: { lat: 43.774, lng: -79.2329 },
  Malvern: { lat: 43.7799, lng: -79.2597 },
  Guildwood: { lat: 43.7476, lng: -79.1886 },
  Rouge: { lat: 43.8045, lng: -79.1223 },
};

export async function fetchNeighborhoodImage(neighborhoodName) {
  if (!MAPBOX_TOKEN) {
    console.warn("Mapbox token not configured. Using fallback image.");
    return null;
  }

  try {
    // Get coordinates for the neighborhood
    const coords = neighborhoodCoordinates[neighborhoodName] || {
      lat: 43.6532,
      lng: -79.3832,
    }; // Default: Toronto City Hall

    // Mapbox Static Images API - using satellite-streets style for maximum detail
    // Format: /styles/v1/{username}/{style_id}/static/{lon},{lat},{zoom},{bearing},{pitch}/{width}x{height}{@2x}
    // zoom: 17 for street-level detail (maximum useful zoom), pitch: 0 for top-down view
    const mapboxImageUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${coords.lng},${coords.lat},17,0,0/800x400@2x?access_token=${MAPBOX_TOKEN}`;

    return {
      url: mapboxImageUrl,
      alt: `Detailed aerial view of ${neighborhoodName}, Toronto`,
      credit: {
        photographer: "Mapbox © OpenStreetMap",
        link: `https://www.mapbox.com/`,
      },
    };
  } catch (error) {
    console.error("Error fetching neighborhood image:", error);
    return null;
  }
}
