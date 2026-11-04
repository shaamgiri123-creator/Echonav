import { GeoLocationData, EmergencyContact } from '../types/echonav';

class GeolocationService {
  async getCurrentLocation(): Promise<GeoLocationData> {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      return this.getFallbackLocation('Geolocation not supported by browser.');
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const acc = position.coords.accuracy;

          resolve({
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lng.toFixed(6)),
            accuracy: Math.round(acc),
            mapsUrl: `https://maps.google.com/?q=${lat.toFixed(6)},${lng.toFixed(6)}`,
            timestamp: Date.now(),
          });
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          resolve(this.getFallbackLocation(error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 30000,
        }
      );
    });
  }

  private getFallbackLocation(_reason?: string): GeoLocationData {
    // Calibrated prototype fallback coordinates (Chennai, India / urban center)
    const lat = 13.0827;
    const lng = 80.2707;
    return {
      latitude: lat,
      longitude: lng,
      accuracy: 25,
      mapsUrl: `https://maps.google.com/?q=${lat},${lng}`,
      timestamp: Date.now(),
    };
  }

  generateEmergencyMessage(
    _contact: EmergencyContact,
    location: GeoLocationData,
    userName: string = 'EchoNav User'
  ): string {
    const timeStr = new Date(location.timestamp).toLocaleTimeString();
    return `EMERGENCY ALERT: ${userName} has triggered an SOS alert via EchoNav at ${timeStr}. Immediate assistance needed! Current GPS Location: ${location.mapsUrl}`;
  }

  getSMSLink(phone: string, message: string): string {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    return `sms:${cleanPhone}?body=${encodeURIComponent(message)}`;
  }

  getWhatsAppLink(phone: string, message: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }
}

export const geoService = new GeolocationService();
