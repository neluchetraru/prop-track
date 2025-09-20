import { useState } from "react";

interface Location {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    country: string;
    postalCode: string;
}

export function useGeocoding() {
    const [isLoading, setIsLoading] = useState(false);

    const searchLocation = async (query: string): Promise<Location | null> => {
        setIsLoading(true);
        try {
            // In a real app, you would use a geocoding service like Google Places API
            // For now, we'll use a mock implementation
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    query
                )}`
                , {
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
                    }
                }

            );
            const data = await response.json();
            console.log("data", data);
            if (data && data[0]) {
                const location = data[0];
                const addressObj = location.address || {};
                console.log('Nominatim address object:', addressObj);
                // Build street address
                let street = '';
                if (addressObj.house_number && addressObj.road) {
                    street = `${addressObj.house_number} ${addressObj.road}`;
                } else {
                    street =
                        addressObj.road ||
                        addressObj.pedestrian ||
                        addressObj.footway ||
                        addressObj.street ||
                        addressObj.residential ||
                        location.display_name ||
                        '';
                }
                return {
                    latitude: parseFloat(location.lat),
                    longitude: parseFloat(location.lon),
                    address: street,
                    city:
                        addressObj.city ||
                        addressObj.town ||
                        addressObj.village ||
                        addressObj.hamlet ||
                        addressObj.municipality ||
                        addressObj.county ||
                        "",
                    country: addressObj.country || "",
                    postalCode: addressObj.postcode || "",
                };
            }
            return null;
        } catch (error) {

            console.error("Error searching location:", error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        searchLocation,
        isLoading,
    };
} 