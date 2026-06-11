import { useState } from 'react';
import { useLanguage } from './LanguageContext';
import { TrendingUp, Star, Shield, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const soilTypes = [
  { value: 'black', label: { en: 'Black Soil', te: 'నల్ల నేల' } },
  { value: 'red', label: { en: 'Red Soil', te: 'ఎర్ర నేల' } },
  { value: 'alluvial', label: { en: 'Alluvial Soil', te: 'ఒండ్రు నేల' } },
  { value: 'laterite', label: { en: 'Laterite Soil', te: 'లాటరైట్ నేల' } },
  { value: 'arid', label: { en: 'Arid/Desert Soil', te: 'ఎడారి నేల' } },
  { value: 'mountain', label: { en: 'Mountain Soil', te: 'పర్వత నేల' } },
];

const seasons = [
  { value: 'kharif', label: { en: 'Kharif (Jun-Oct)', te: 'ఖరీఫ్ (జూన్-అక్టో)' } },
  { value: 'rabi', label: { en: 'Rabi (Nov-Mar)', te: 'రబీ (నవం-మార్చి)' } },
  { value: 'zaid', label: { en: 'Zaid (Mar-Jun)', te: 'జాయిద్ (మార్చి-జూన్)' } },
];

const cropData: Record<string, { name: { en: string; te: string }; profit: number; risk: string; confidence: number; bestMonth: string }[]> = {
  'black-kharif': [
    { name: { en: 'Cotton', te: 'పత్తి' }, profit: 52000, risk: 'low', confidence: 88, bestMonth: 'Oct' },
    { name: { en: 'Soybean', te: 'సోయాబీన్' }, profit: 45000, risk: 'low', confidence: 85, bestMonth: 'Sep' },
    { name: { en: 'Chilli', te: 'మిర్చి' }, profit: 42000, risk: 'medium', confidence: 78, bestMonth: 'Nov' },
    { name: { en: 'Pigeon Pea', te: 'కందులు' }, profit: 38000, risk: 'low', confidence: 82, bestMonth: 'Dec' },
    { name: { en: 'Maize', te: 'మొక్కజొన్న' }, profit: 30000, risk: 'medium', confidence: 72, bestMonth: 'Sep' },
  ],
  'red-kharif': [
    { name: { en: 'Groundnut', te: 'వేరుశనగ' }, profit: 48000, risk: 'low', confidence: 86, bestMonth: 'Oct' },
    { name: { en: 'Tomato', te: 'టమాటా' }, profit: 45000, risk: 'medium', confidence: 80, bestMonth: 'Nov' },
    { name: { en: 'Finger Millet', te: 'రాగులు' }, profit: 35000, risk: 'low', confidence: 84, bestMonth: 'Sep' },
    { name: { en: 'Chilli', te: 'మిర్చి' }, profit: 38000, risk: 'medium', confidence: 76, bestMonth: 'Nov' },
    { name: { en: 'Sunflower', te: 'పొద్దుతిరుగుడు' }, profit: 28000, risk: 'medium', confidence: 70, bestMonth: 'Oct' },
  ],
  'alluvial-rabi': [
    { name: { en: 'Wheat', te: 'గోధుమ' }, profit: 40000, risk: 'low', confidence: 90, bestMonth: 'Mar' },
    { name: { en: 'Mustard', te: 'ఆవాలు' }, profit: 38000, risk: 'low', confidence: 85, bestMonth: 'Feb' },
    { name: { en: 'Potato', te: 'బంగాళదుంప' }, profit: 44000, risk: 'medium', confidence: 78, bestMonth: 'Feb' },
    { name: { en: 'Onion', te: 'ఉల్లిపాయ' }, profit: 42000, risk: 'high', confidence: 65, bestMonth: 'Mar' },
    { name: { en: 'Chickpea', te: 'శనగలు' }, profit: 36000, risk: 'low', confidence: 82, bestMonth: 'Mar' },
  ],
};

// Generate 12-month calendar data
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const calendarData = months.map((m, i) => ({
  month: m,
  profit: [15,12,18,10,8,22,35,40,48,52,38,20][i] * 1000,
}));

export default function CropRanker() {
  const { t, language } = useLanguage();
  const [soil, setSoil] = useState('black');
  const [season, setSeason] = useState('kharif');

  const key = `${soil}-${season}`;
  const results = cropData[key] || cropData['black-kharif'];

  return (
    <div className="space-y-4 md:ml-60">
      <h2 className="font-display text-xl font-bold">{t('cropRanker')}</h2>
      <p className="text-sm text-muted-foreground">
        {language === 'en' ? 'Find the most profitable crop for your soil and season' : 'మీ నేల మరియు సీజన్‌కు అత్యంత లాభదాయకమైన పంటను కనుగొనండి'}
      </p>

      <div className="kisan-card-glass grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            {language === 'en' ? 'Soil Type' : 'నేల రకం'}
          </label>
          <Select value={soil} onValueChange={setSoil}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {soilTypes.map(s => <SelectItem key={s.value} value={s.value}>{s.label[language]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            {language === 'en' ? 'Season' : 'సీజన్'}
          </label>
          <Select value={season} onValueChange={setSeason}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {seasons.map(s => <SelectItem key={s.value} value={s.value}>{s.label[language]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Rankings */}
      <div className="space-y-2">
        {results.map((crop, i) => (
          <div key={i} className="kisan-card-glass flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                #{i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold">{crop.name[language]}</p>
                <p className="text-xs text-muted-foreground">₹{crop.profit.toLocaleString()} {t('perAcre')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-right">
              <div className="flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-warning" />
                  <span className="text-xs font-bold">{crop.confidence}%</span>
                </div>
                <span className={`text-[10px] ${crop.risk === 'low' ? 'kisan-badge-success' : crop.risk === 'medium' ? 'kisan-badge-warning' : 'kisan-badge-danger'}`}>
                  {t(crop.risk)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 12-month profit calendar */}
      <div className="kisan-card">
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-display text-sm font-semibold">
            {language === 'en' ? '12-Month Profit Calendar' : '12-నెలల లాభ క్యాలెండర్'}
          </h3>
        </div>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={calendarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="profit" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
