import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Droplets, AlertTriangle, Calendar, CloudRain } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const predictions = [
  { day: 'Today', moisture: 62, need: 'none', rain: 10, alert: false },
  { day: 'Tomorrow', moisture: 55, need: 'light', rain: 15, alert: false },
  { day: 'Day 3', moisture: 40, need: 'heavy', rain: 5, alert: true },
];

const schedule = [
  { time: 'Tomorrow 6 AM', duration: '20 min', zone: 'Zone A — Tomato', type: 'Drip' },
  { time: 'Day 3 5:30 AM', duration: '45 min', zone: 'Zone B — Cotton', type: 'Sprinkler' },
  { time: 'Day 3 6 PM', duration: '30 min', zone: 'Zone A — Tomato', type: 'Drip' },
];

export default function WaterStress() {
  const { language } = useLanguage();
  const [irrigationType, setIrrigationType] = useState('drip');

  return (
    <div className="space-y-4 md:ml-60">
      <h2 className="font-display text-xl font-bold">
        {language === 'en' ? 'Water Stress Predictor' : 'నీటి ఒత్తిడి అంచనా'}
      </h2>
      <p className="text-sm text-muted-foreground">
        {language === 'en' ? '3-day irrigation forecast based on soil moisture + weather' : 'నేల తేమ + వాతావరణం ఆధారంగా 3-రోజుల నీటిపారుదల అంచనా'}
      </p>

      {/* Inputs */}
      <div className="kisan-card-glass mb-4">
        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {language === 'en' ? 'Select Irrigation Type' : 'నీటిపారుదల రకాన్ని ఎంచుకోండి'}
        </label>
        <Select value={irrigationType} onValueChange={setIrrigationType}>
          <SelectTrigger className="h-12 rounded-xl bg-background"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="drip">{language === 'en' ? 'Drip Irrigation' : 'బిందు సేద్యం (Drip)'}</SelectItem>
            <SelectItem value="sprinkler">{language === 'en' ? 'Sprinkler System' : 'స్ప్రేల నీటిపారుదల'}</SelectItem>
            <SelectItem value="flood">{language === 'en' ? 'Flood / Canal' : 'కాలువ నీరు / ఫ్లడ్'}</SelectItem>
            <SelectItem value="rainfed">{language === 'en' ? 'Rainfed (No Irrigation)' : 'వర్షాధారిత వ్యవసాయం'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alert */}
      <div className="flex items-start gap-2 rounded-lg bg-[hsl(var(--danger)/0.08)] p-3 text-sm kisan-badge-danger">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{language === 'en' ? '⚠️ Critical water stress expected Day 3 — irrigate Zone B before noon' : '⚠️ 3వ రోజు తీవ్ర నీటి ఒత్తిడి — మధ్యాహ్నం లోపు జోన్ B కి నీరు పెట్టండి'}</span>
      </div>

      {/* 3-day predictions */}
      <div className="grid gap-3 sm:grid-cols-3">
        {predictions.map((p, i) => (
          <div key={i} className={`kisan-card-glass ${p.alert ? 'border-2 border-danger' : ''}`}>
            <p className="text-xs font-medium text-muted-foreground mb-2">{p.day}</p>
            <div className="flex items-center gap-2 mb-2">
              <Droplets className={`h-5 w-5 ${p.moisture > 50 ? 'text-info' : 'text-danger'}`} />
              <span className="font-display text-lg font-bold">{p.moisture}%</span>
            </div>
            <Progress value={p.moisture} className="mb-2 h-2" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <CloudRain className="h-3 w-3" /> {p.rain}%
              </span>
              <span className={`font-medium ${p.need === 'none' ? 'text-success' : p.need === 'light' ? 'text-warning' : 'text-danger'}`}>
                {p.need === 'none' ? '✓ OK' : p.need === 'light' ? '💧 Light' : '🚨 Heavy'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Watering Schedule */}
      <div className="kisan-card">
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-display text-sm font-semibold">
            {language === 'en' ? 'Suggested Watering Schedule' : 'సూచించిన నీటిపారుదల షెడ్యూల్'}
          </h3>
        </div>
        <div className="space-y-2">
          {schedule.map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-muted p-3">
              <div>
                <p className="text-sm font-semibold">{s.time}</p>
                <p className="text-xs text-muted-foreground">{s.zone}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold font-display">{s.duration}</p>
                <p className="text-xs text-muted-foreground">{s.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="kisan-card-glass kisan-gradient-hero text-primary-foreground">
        <h3 className="font-display text-base font-semibold mb-1">💧 {language === 'en' ? 'Water Saving Tip' : 'నీటి ఆదా చిట్కా'}</h3>
        <p className="text-sm opacity-90">
          {language === 'en'
            ? 'Switch to drip irrigation for tomatoes to save 40% water and improve yield by 15%.'
            : 'టమాటాలకు డ్రిప్ ఇరిగేషన్‌కు మారి 40% నీరు ఆదా చేయండి, 15% దిగుబడి పెంచండి.'}
        </p>
      </div>
    </div>
  );
}
