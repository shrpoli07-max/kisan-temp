import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFarmer } from '@/contexts/FarmerContext';
import { MapPin, Users, IndianRupee } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues in React
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const farmerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Buyer {
  id: number;
  name: string;
  type: string;
  distance: string;
  priceDiff: string;
  crops: string;
  rating: number;
  lat: number;
  lng: number;
}

export default function MiddlemanMap() {
  const { language } = useLanguage();
  const { profile } = useFarmer();
  
  const [center, setCenter] = useState<[number, number]>([18.0, 79.58]); // Default: Warangal
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeoAndGenerateBuyers = async () => {
      let lat = 18.0;
      let lng = 79.58;
      
      try {
        if (profile) {
            const query = `${profile.district || 'Warangal'}, ${profile.state || 'Telangana'}, India`;
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (data && data.length > 0) {
              lat = parseFloat(data[0].lat);
              lng = parseFloat(data[0].lon);
            }
        }
        setCenter([lat, lng]);

        // Generate dynamic localized buyers spread randomly within a 15km radius
        const dynamicBuyers: Buyer[] = [
          { id: 1, name: 'Local FPO Collective', type: 'FPO', distance: '4 km', priceDiff: '+18%', crops: 'Cotton, Chilli', rating: 4.5, lat: lat + 0.02, lng: lng + 0.03 },
          { id: 2, name: 'e-NAM Trading Hub', type: 'e-NAM', distance: '12 km', priceDiff: '+22%', crops: 'All crops', rating: 4.2, lat: lat - 0.05, lng: lng + 0.01 },
          { id: 3, name: 'State Farmers Co-op', type: 'Cooperative', distance: '8 km', priceDiff: '+15%', crops: 'Rice, Maize', rating: 4.0, lat: lat + 0.04, lng: lng - 0.06 },
          { id: 4, name: 'Direct Market Wholesale', type: 'Direct', distance: '6 km', priceDiff: '+25%', crops: 'Tomato, Onion', rating: 4.7, lat: lat - 0.01, lng: lng - 0.04 },
          { id: 5, name: 'Agri Processing Unit', type: 'Direct', distance: '15 km', priceDiff: '+20%', crops: 'Soybean', rating: 3.9, lat: lat + 0.08, lng: lng + 0.07 },
        ];
        
        setBuyers(dynamicBuyers);
      } catch (err) {
        console.error("Geocoding failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeoAndGenerateBuyers();
  }, [profile]);

  return (
    <div className="space-y-4 md:ml-60">
      <h2 className="font-display text-xl font-bold">
        {language === 'en' ? 'Direct Buyer Network' : language === 'hi' ? 'सीधा खरीदार नेटवर्क' : 'ప్రత్యక్ష కొనుగోలుదారుల నెట్‌వర్క్'}
      </h2>
      <p className="text-sm text-muted-foreground">
        {language === 'en' ? 'Skip the middleman — locate direct buyers near you based on your GPS profile' : language === 'hi' ? 'बिचौलिये को छोड़ें — अपनी जीपीएस प्रोफ़ाइल के आधार पर आस-पास के सीधे खरीदारों का पता लगाएं' : 'దళారీని దాటి — మీ సమీపంలోని కొనుగోలుదారులను గుర్తించండి'}
      </p>

      {/* Interactive Map */}
      <div className="kisan-card p-0 overflow-hidden relative" style={{ height: '400px' }}>
        {loading ? (
             <div className="h-full w-full bg-muted/60 animate-pulse flex items-center justify-center">
                <p className="text-muted-foreground font-semibold">Loading Live Maps...</p>
             </div>
        ) : (
          <MapContainer center={center} zoom={11} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Farmer Location */}
            <Marker position={center} icon={farmerIcon}>
              <Popup>
                <div className="font-bold text-success">{profile?.name || 'Your Farm'}</div>
                <div className="text-xs">{profile?.landSize || 3} Acres</div>
              </Popup>
            </Marker>
            
            {/* 15km Radius Circle */}
            <Circle center={center} radius={15000} pathOptions={{ color: 'hsl(var(--primary))', fillColor: 'hsl(var(--primary))', fillOpacity: 0.1 }} />

            {/* Buyers */}
            {buyers.map(b => (
              <Marker key={b.id} position={[b.lat, b.lng]} icon={customIcon}>
                <Popup>
                  <div className="font-bold">{b.name}</div>
                  <div className="text-xs text-muted-foreground mb-1">{b.type} · {b.crops}</div>
                  <div className="text-xs font-bold text-success text-[10px] bg-success/10 p-1 rounded inline-block">Pays {b.priceDiff} more</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Buyer list */}
      <div className="kisan-card">
        <h3 className="mb-3 font-display text-sm font-semibold flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          {language === 'en' ? 'Nearby Buyers & FPOs' : language === 'hi' ? 'आसपास के खरीदार' : 'సమీపంలోని కొనుగోలుదారులు & FPOలు'}
        </h3>
        <div className="space-y-2">
          {buyers.map((b) => (
            <div key={b.id} className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{b.name}</p>
                  <p className="text-xs text-muted-foreground">{b.type} · {b.distance} · {b.crops}</p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end gap-0.5">
                <span className="kisan-badge-success text-xs">{b.priceDiff}</span>
                <span className="text-[10px] text-muted-foreground">⭐ {b.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
