import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sprout, FlaskConical, IndianRupee } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

import { Slider } from '@/components/ui/slider';

import { crops } from './utils/crops';

const recommendations: Record<string, { targetN: number; targetP: number; targetK: number; mix: { name: string; qty: string; cost: number }[]; cheapAlt: { name: string; qty: string; cost: number }[]; savings: number }> = {
  tomato: {
    targetN: 120, targetP: 60, targetK: 80,
    mix: [
      { name: 'Urea (46-0-0)', qty: '170 kg/ha', cost: 1020 },
      { name: 'DAP (18-46-0)', qty: '130 kg/ha', cost: 3510 },
      { name: 'MOP (0-0-60)', qty: '42 kg/ha', cost: 756 },
    ],
    cheapAlt: [
      { name: 'Urea (46-0-0)', qty: '170 kg/ha', cost: 1020 },
      { name: 'SSP (0-16-0)', qty: '262 kg/ha', cost: 2096 },
      { name: 'MOP (0-0-60)', qty: '42 kg/ha', cost: 756 },
    ],
    savings: 27,
  },
  cotton: {
    targetN: 100, targetP: 50, targetK: 50,
    mix: [
      { name: 'Urea (46-0-0)', qty: '126 kg/ha', cost: 756 },
      { name: 'DAP (18-46-0)', qty: '109 kg/ha', cost: 2943 },
      { name: 'MOP (0-0-60)', qty: '0 kg/ha', cost: 0 },
    ],
    cheapAlt: [
      { name: 'Urea (46-0-0)', qty: '126 kg/ha', cost: 756 },
      { name: 'SSP (0-16-0)', qty: '200 kg/ha', cost: 1600 },
      { name: 'MOP (0-0-60)', qty: '0 kg/ha', cost: 0 },
    ],
    savings: 36,
  },
  rice: {
    targetN: 80, targetP: 40, targetK: 40,
    mix: [
      { name: 'Urea (46-0-0)', qty: '83 kg/ha', cost: 498 },
      { name: 'DAP (18-46-0)', qty: '87 kg/ha', cost: 2349 },
      { name: 'MOP (0-0-60)', qty: '0 kg/ha', cost: 0 },
    ],
    cheapAlt: [
      { name: 'Urea (46-0-0)', qty: '83 kg/ha', cost: 498 },
      { name: 'SSP (0-16-0)', qty: '137 kg/ha', cost: 1096 },
      { name: 'MOP (0-0-60)', qty: '0 kg/ha', cost: 0 },
    ],
    savings: 44,
  },
  wheat: {
    targetN: 120, targetP: 60, targetK: 40,
    mix: [{ name: 'Urea', qty: '150 kg/ha', cost: 900 }, { name: 'DAP', qty: '130 kg/ha', cost: 3500 }, { name: 'MOP', qty: '66 kg/ha', cost: 1100 }],
    cheapAlt: [{ name: 'Urea', qty: '150 kg/ha', cost: 900 }, { name: 'SSP', qty: '375 kg/ha', cost: 3000 }, { name: 'MOP', qty: '66 kg/ha', cost: 1100 }],
    savings: 10,
  },
  maize: {
    targetN: 120, targetP: 60, targetK: 40,
    mix: [{ name: 'Urea', qty: '180 kg/ha', cost: 1080 }, { name: 'DAP', qty: '130 kg/ha', cost: 3510 }, { name: 'MOP', qty: '66 kg/ha', cost: 1200 }],
    cheapAlt: [{ name: 'Urea', qty: '180 kg/ha', cost: 1080 }, { name: 'SSP', qty: '375 kg/ha', cost: 3000 }, { name: 'MOP', qty: '66 kg/ha', cost: 1200 }],
    savings: 11,
  },
  sugarcane: {
    targetN: 250, targetP: 100, targetK: 100,
    mix: [{ name: 'Urea', qty: '320 kg/ha', cost: 1920 }, { name: 'DAP', qty: '217 kg/ha', cost: 5859 }, { name: 'MOP', qty: '166 kg/ha', cost: 3000 }],
    cheapAlt: [{ name: 'Urea', qty: '320 kg/ha', cost: 1920 }, { name: 'SSP', qty: '625 kg/ha', cost: 5000 }, { name: 'MOP', qty: '166 kg/ha', cost: 3000 }],
    savings: 8,
  },
  soybean: {
    targetN: 20, targetP: 80, targetK: 40,
    mix: [{ name: 'Urea', qty: '0 kg/ha', cost: 0 }, { name: 'DAP', qty: '174 kg/ha', cost: 4698 }, { name: 'MOP', qty: '66 kg/ha', cost: 1200 }],
    cheapAlt: [{ name: 'Urea', qty: '0 kg/ha', cost: 0 }, { name: 'SSP', qty: '500 kg/ha', cost: 4000 }, { name: 'MOP', qty: '66 kg/ha', cost: 1200 }],
    savings: 12,
  },
  onion: {
    targetN: 100, targetP: 50, targetK: 50,
    mix: [{ name: 'Urea', qty: '130 kg/ha', cost: 780 }, { name: 'DAP', qty: '108 kg/ha', cost: 2916 }, { name: 'MOP', qty: '83 kg/ha', cost: 1500 }],
    cheapAlt: [{ name: 'Urea', qty: '130 kg/ha', cost: 780 }, { name: 'SSP', qty: '312 kg/ha', cost: 2500 }, { name: 'MOP', qty: '83 kg/ha', cost: 1500 }],
    savings: 8,
  },
  mango: {
    targetN: 730, targetP: 180, targetK: 680,
    mix: [{ name: 'Urea', qty: '1500 g/tree', cost: 80 }, { name: 'DAP', qty: '400 g/tree', cost: 10 }, { name: 'MOP', qty: '1100 g/tree', cost: 30 }],
    cheapAlt: [{ name: 'Urea', qty: '1500 g/tree', cost: 80 }, { name: 'SSP', qty: '1100 g/tree', cost: 8 }, { name: 'MOP', qty: '1100 g/tree', cost: 30 }],
    savings: 2,
  }
};

export default function FertilizerOptimizer() {
  const { language } = useLanguage();
  const [crop, setCrop] = useState('tomato');
  
  // Interactive Soil Inputs instead of dummy data
  const [soilN, setSoilN] = useState([42]);
  const [soilP, setSoilP] = useState([18]);
  const [soilK, setSoilK] = useState([55]);
  const rec = recommendations[crop] || recommendations['tomato'];
  const stdCost = rec.mix.reduce((s, m) => s + m.cost, 0);
  const altCost = rec.cheapAlt.reduce((s, m) => s + m.cost, 0);

  return (
    <div className="space-y-4 md:ml-60">
      <h2 className="font-display text-xl font-bold">
        {language === 'en' ? 'Fertilizer Optimizer' : 'ఎరువుల ఆప్టిమైజర్'}
      </h2>
      <p className="text-sm text-muted-foreground">
        {language === 'en' ? 'Get exact fertilizer mix based on your soil and target crop' : 'మీ నేల మరియు లక్ష్య పంట ఆధారంగా ఖచ్చితమైన ఎరువుల మిశ్రమం పొందండి'}
      </p>

      {/* Current soil Interactive Inputs */}
      <div className="kisan-card">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-primary" />
            <h3 className="font-display text-sm font-semibold">{language === 'en' ? 'Input Current Soil NPK' : 'ప్రస్తుత నేల NPK నమోదు చేయండి'}</h3>
          </div>
          <span className="text-[10px] text-muted-foreground uppercase">{language === 'en' ? 'Slide to adjust' : 'సర్దుబాటు చేయడానికి జారండి'}</span>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-info">Nitrogen (N)</span>
              <span className="font-display font-medium">{soilN[0]} / {rec.targetN} kg/ha</span>
            </div>
            <Slider value={soilN} onValueChange={setSoilN} min={0} max={250} step={1} className="" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-warning">Phosphorus (P)</span>
              <span className="font-display font-medium">{soilP[0]} / {rec.targetP} kg/ha</span>
            </div>
            <Slider value={soilP} onValueChange={setSoilP} min={0} max={150} step={1} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-success">Potassium (K)</span>
              <span className="font-display font-medium">{soilK[0]} / {rec.targetK} kg/ha</span>
            </div>
            <Slider value={soilK} onValueChange={setSoilK} min={0} max={150} step={1} />
          </div>
        </div>
      </div>

      {/* Crop selector */}
      <div className="kisan-card">
        <label className="mb-1 block text-xs font-medium text-muted-foreground">{language === 'en' ? 'Target Crop' : 'లక్ష్య పంట'}</label>
        <Select value={crop} onValueChange={setCrop}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {crops.map(c => <SelectItem key={c.value} value={c.value}>{c.label[language]}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Standard mix */}
      <div className="kisan-card">
        <div className="mb-3 flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-secondary" />
          <h3 className="font-display text-sm font-semibold">{language === 'en' ? 'Recommended Mix' : 'సిఫారసు మిశ్రమం'}</h3>
        </div>
        <div className="space-y-2">
          {rec.mix.map((m, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div>
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.qty}</p>
              </div>
              <span className="font-display text-sm font-bold">₹{m.cost.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 border-t border-border text-sm font-semibold">
            <span>{language === 'en' ? 'Total Cost' : 'మొత్తం ఖర్చు'}</span>
            <span className="font-display">₹{stdCost.toLocaleString()}/ha</span>
          </div>
        </div>
      </div>

      {/* Cheapest alternative */}
      <div className="kisan-card-glass border-2 border-success">
        <div className="mb-3 flex items-center gap-2">
          <IndianRupee className="h-5 w-5 text-success" />
          <h3 className="font-display text-sm font-semibold text-success">{language === 'en' ? 'Cheapest Alternative' : 'చౌకైన ప్రత్యామ్నాయం'}</h3>
        </div>
        <div className="space-y-2">
          {rec.cheapAlt.map((m, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div>
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="text-xs text-muted-foreground">{m.qty}</p>
              </div>
              <span className="font-display text-sm font-bold">₹{m.cost.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 border-t border-border text-sm font-semibold">
            <span>{language === 'en' ? 'Total Cost' : 'మొత్తం ఖర్చు'}</span>
            <span className="font-display text-success">₹{altCost.toLocaleString()}/ha</span>
          </div>
        </div>
      </div>

      <div className="kisan-card-glass kisan-gradient-hero text-primary-foreground">
        <h3 className="font-display text-base font-semibold mb-1">💰 {language === 'en' ? 'Save' : 'ఆదా'} {rec.savings}%</h3>
        <p className="text-2xl font-display font-bold">₹{(stdCost - altCost).toLocaleString()}/ha</p>
        <p className="text-sm opacity-90">
          {language === 'en' ? 'by using SSP instead of DAP — same nutrient value' : 'DAP బదులు SSP వాడి — అదే పోషక విలువ'}
        </p>
      </div>
    </div>
  );
}
