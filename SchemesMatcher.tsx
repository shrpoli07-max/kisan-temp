import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFarmer } from '@/contexts/FarmerContext';
import { FileText, CheckCircle2, IndianRupee, ExternalLink } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

import locationData from './utils/states-districts.json';

const states = locationData.states.map(s => ({
  value: s.state.toLowerCase(),
  label: { en: s.state, te: s.state, hi: s.state }
}));

import { crops as baseCrops } from './utils/crops';

const crops = [
  { value: 'any', label: { en: 'Any Crop', te: 'ఏదైనా పంట', hi: 'कोई भी फसल' } },
  ...baseCrops
];

import { matchSchemes, type Scheme } from './utils/schemeEngine';

export default function SchemesMatcher() {
  const { language } = useLanguage();
  const { profile } = useFarmer();

  const [state, setState] = useState('telangana');
  const [crop, setCrop] = useState('any');
  const [land, setLand] = useState([3]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{ exactMatches: Scheme[], partialMatches: Scheme[], isExact: boolean } | null>(null);
  const [aiRationale, setAiRationale] = useState('');

  useEffect(() => {
    if (profile) {
      if (states.find(s => s.value === profile.state.toLowerCase())) {
         setState(profile.state.toLowerCase());
      } else {
         setState('telangana');
      }
      
      setLand([profile.landSize]);
    }
  }, [profile]);

  const handleFindSchemes = async () => {
    setIsSearching(true);
    setShowResults(false);
    setAiRationale('');
    
    // 1. Core Rule Engine
    const matched = matchSchemes(state, crop, land[0]);
    setResults(matched);

    // 2. AI Rationale 
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (apiKey) {
         const prompt = `Act as an AgTech consultant. A farmer from ${state} with ${land[0]} acres of land is checking schemes. We found ${matched.exactMatches.length + matched.partialMatches.length} schemes for them. Write a short, encouraging 2-sentence note in ${language === 'en' ? 'English' : language === 'hi' ? 'Hindi' : 'Telugu'} explaining why they are eligible and what they should do next.`;
         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
         });
         const data = await response.json();
         setAiRationale(data.candidates[0].content.parts[0].text);
      }
    } catch (e) { console.error(e); }

    setIsSearching(false);
    setShowResults(true);
  };

  return (
    <div className="space-y-4 md:ml-60">
      <h2 className="font-display text-xl font-bold">
        {language === 'en' ? 'Government Schemes' : 'ప్రభుత్వ పథకాలు'}
      </h2>
      <p className="text-sm text-muted-foreground">
        {language === 'en' ? 'Find schemes you\'re eligible for based on your profile' : 'మీ ప్రొఫైల్ ఆధారంగా మీకు అర్హత ఉన్న పథకాలను కనుగొనండి'}
      </p>

      <div className="kisan-card-glass space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{language === 'en' ? 'State' : 'రాష్ట్రం'}</label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{states.map(s => <SelectItem key={s.value} value={s.value}>{s.label[language]}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">{language === 'en' ? 'Crop' : 'పంట'}</label>
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{crops.map(c => <SelectItem key={c.value} value={c.value}>{c.label[language]}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-medium text-muted-foreground">{language === 'en' ? 'Landholding' : 'భూ కమతం'}</label>
            <span className="font-display text-sm font-bold">{land[0]} {language === 'en' ? 'acres' : 'ఎకరాలు'}</span>
          </div>
          <Slider value={land} onValueChange={setLand} min={1} max={20} step={1} />
        </div>
        <Button className="w-full" onClick={handleFindSchemes} disabled={isSearching}>
          {isSearching
            ? (language === 'en' ? 'Searching...' : 'శోధిస్తోంది...')
            : (language === 'en' ? 'Find Schemes' : 'పథకాలు కనుగొనండి')
          }
        </Button>
      </div>

      {showResults && results && (
        <div className="animate-fade-in space-y-4">
          <div className={`kisan-card bg-glass text-primary-foreground ${results.isExact ? 'kisan-gradient-hero' : 'bg-gradient-to-br from-warning/80 to-warning'}`}>
            <h3 className="font-display text-base font-semibold mb-1">
              {results.isExact
                ? (language === 'en' ? '🎯 Perfect Matches Found' : '🎯 ఖచ్చితమైన పథకాలు కనుగొనబడ్డాయి')
                : (language === 'en' ? '⚠️ No Exact Match Found' : '⚠️ ఖచ్చితమైన సరిపోలిక కనుగొనబడలేదు')}
            </h3>
            <p className="text-3xl font-display font-bold">
              {results.exactMatches.length > 0 ? results.exactMatches.length : results.partialMatches.length} {language === 'en' ? 'schemes' : 'పథకాలు'}
            </p>
            {!results.isExact && (
              <p className="text-sm mt-1 opacity-90">
                {language === 'en' ? 'Showing most relevant alternatives based on your inputs.' : 'మీ ఇన్‌పుట్‌ల ఆధారంగా అత్యంత సంబంధిత ప్రత్యామ్నాయాలను చూపుతోంది.'}
              </p>
            )}
          </div>

          {aiRationale && (
            <div className="rounded-xl border border-warning/50 bg-warning/10 p-4 relative overflow-hidden">
               <div className="absolute -right-4 -top-4 text-warning/20 bg-warning/20 rounded-full h-16 w-16"></div>
               <p className="text-sm font-semibold text-warning-foreground"><span className="text-xl mr-1">🤖</span> {language === 'en' ? 'AI Assessment:' : language === 'hi' ? 'AI आकलन:' : 'AI అంచనా:'}</p>
               <p className="text-sm mt-1">{aiRationale}</p>
            </div>
          )}

          <div className="space-y-3">
            {(results.exactMatches.length > 0 ? results.exactMatches : results.partialMatches).map((s) => (
              <div key={s.id} className="kisan-card border-l-4 border-l-primary animate-float-up">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {results.isExact ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <FileText className="h-5 w-5 text-warning" />
                    )}
                    <h4 className="font-display text-sm font-semibold">{s.name}</h4>
                  </div>
                  <span className="kisan-badge-success bg-primary/10 text-primary border border-primary/20">{s.benefit}</span>
                </div>
                <p className="text-sm text-muted-foreground">{s.desc[language as 'en' | 'te']}</p>
                <div className="mt-3 flex gap-2">
                  {s.states !== 'all' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">📍 State</span>}
                  {s.crops !== 'all' && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">🌾 Crop specific</span>}
                  {s.maxLand !== undefined && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">📏 Small Farmers</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
