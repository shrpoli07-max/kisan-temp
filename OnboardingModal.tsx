import { useState, useEffect } from 'react';
import { useFarmer } from './FarmerContext';
import { useLanguage } from './LanguageContext';
import { MapPin, User, Pickaxe, ArrowRight } from 'lucide-react';
import { Button } from './button';
import locationData from './utils/states-districts.json';

const statesData = locationData.states;

export default function OnboardingModal() {
  const { profile, saveProfile } = useFarmer();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [stateName, setStateName] = useState(statesData[0].state);
  const [district, setDistrict] = useState(statesData[0].districts[0]);
  const [landSize, setLandSize] = useState('3');

  useEffect(() => {
    if (!profile) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [profile]);

  if (!open) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    saveProfile({
      name,
      state: stateName,
      district,
      landSize: parseFloat(landSize) || 3
    });
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-background border border-border/50 p-6 shadow-2xl animate-scale-in">
        <div className="text-center mb-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <span className="text-3xl">🌱</span>
          </div>
          <h2 className="font-display text-2xl font-bold">
            {language === 'en' ? 'Welcome to Kisan IQ' : language === 'hi' ? 'किसान IQ में आपका स्वागत है' : 'కిసాన్ IQ కు స్వాగతం'}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {language === 'en' 
              ? 'Tell us about your farm to get AI-personalized market & crop forecasts.' 
              : 'AI-ఆధారిత మార్కెట్ & పంట అంచనాలను పొందడానికి మీ వ్యవసాయ వివరాలను తెలియజేయండి.'}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="h-3 w-3" /> {language === 'en' ? 'Farmer Name' : 'రైతు పేరు'}
            </label>
            <input 
              type="text" 
              className="w-full h-12 rounded-xl bg-muted/50 border-transparent px-4 focus:bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder={language === 'en' ? 'Enter your name' : 'మీ పేరు నమోదు చేయండి'}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> {language === 'en' ? 'State' : 'రాష్ట్రం'}
              </label>
              <select 
                className="w-full h-12 rounded-xl bg-muted/50 border-transparent px-4 focus:bg-background focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                value={stateName}
                onChange={(e) => {
                  const newState = e.target.value;
                  setStateName(newState);
                  const newDistricts = statesData.find(s => s.state === newState)?.districts || [];
                  setDistrict(newDistricts[0] || '');
                }}
              >
                {statesData.map((s) => (
                  <option key={s.state} value={s.state}>{s.state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {language === 'en' ? 'District' : 'జిల్లా'}</span>
              </label>
              <select 
                className="w-full h-12 rounded-xl bg-muted/50 border-transparent px-4 focus:bg-background focus:ring-2 focus:ring-primary outline-none transition-all appearance-none"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                {(statesData.find(s => s.state === stateName)?.districts || []).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Pickaxe className="h-3 w-3" /> {language === 'en' ? 'Land Size (Acres)' : 'భూమి విస్తీర్ణం (ఎకరాలు)'}
            </label>
            <input 
              type="number" 
              className="w-full h-12 rounded-xl bg-muted/50 border-transparent px-4 focus:bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="e.g. 3.5"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
            />
          </div>

          <Button 
            className="w-full h-12 rounded-xl font-display font-bold text-base mt-2" 
            onClick={handleSave}
            disabled={!name.trim() || !landSize}
          >
            {language === 'en' ? 'Start AI Analysis' : 'AI విశ్లేషణ ప్రారంభించండి'} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
