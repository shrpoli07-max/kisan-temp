import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrendingUp, TrendingDown, CheckCircle2, Clock, AlertCircle, Zap, Users, Snowflake, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { AnimatedCounter } from '@/components/AnimatedCounter';

import { useQuery } from '@tanstack/react-query';
import { supabase } from './utils/supabase';
import { crops } from './utils/crops';

const priceData = [
  { week: 'W1', price: 2200, predicted: null },
  { week: 'W2', price: 2400, predicted: null },
  { week: 'W3', price: 2100, predicted: null },
  { week: 'W4', price: 2600, predicted: null },
  { week: 'Now', price: 2800, predicted: 2800 },
  { week: '+1W', price: null, predicted: 3100 },
  { week: '+2W', price: null, predicted: 3400 },
  { week: '+3W', price: null, predicted: 3200 },
  { week: '+4W', price: null, predicted: 2900 },
];

// Fetched from Supabase DB now

export default function SellAdvisor() {
  const { t, language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: dbResult, refetch } = useQuery({
    queryKey: ['sellAdvice', selectedCrop],
    queryFn: async () => {
      const { data, error } = await supabase.from('sell_advice').select('*').eq('crop_id', selectedCrop).single();
      if (error || !data) return null;
      return {
        decision: data.decision,
        confidence: data.confidence,
        reason: { en: data.reason_en, te: data.reason_te },
        bestWeek: data.best_week,
        expectedPrice: data.expected_price,
        potentialGain: data.potential_gain
      };
    },
    enabled: false
  });

  const handleAdvice = async () => {
    if (!selectedCrop) return;
    setIsAnalyzing(true);
    await refetch();
    setIsAnalyzing(false);
    setShowResult(true);
  };

  const result = dbResult || { decision: 'wait', confidence: 50, reason: { en: 'No market data found.', te: 'మార్కెట్ డేటా లేదు.', hi: 'कोई बाजार डेटा नहीं मिला।' }, bestWeek: 'N/A', expectedPrice: '₹0', potentialGain: 0 };

  return (
    <div className="space-y-5 md:ml-60">
      <div className="animate-float-up">
        <h2 className="font-display text-xl font-bold">{t('sellAdvisor')}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'en' ? 'Should you sell now or wait? Get AI-powered advice.' : 'ఇప్పుడు అమ్మాలా లేక వేచి ఉండాలా? AI సలహా పొందండి.'}
        </p>
      </div>

      {/* Input */}
      <div className="kisan-card-glass space-y-4 animate-float-up stagger-1">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('selectCrop')}</label>
          <Select value={selectedCrop} onValueChange={(v) => { setSelectedCrop(v); setShowResult(false); }}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder={t('selectCrop')} />
            </SelectTrigger>
            <SelectContent>
              {crops.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label[language]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full h-12 rounded-xl font-display font-semibold text-base" onClick={handleAdvice} disabled={!selectedCrop || isAnalyzing}>
          {isAnalyzing ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              {language === 'en' ? 'AI Analyzing...' : 'AI విశ్లేషిస్తోంది...'}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4" /> {t('getAdvice')}
            </span>
          )}
        </Button>
      </div>

      {/* Result */}
      {showResult && result && (
        <>
          <div className={`kisan-card-glass border-2 animate-scale-up ${result.decision === 'sell' ? 'border-success' : 'border-warning'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {result.decision === 'sell' ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                    <CheckCircle2 className="h-7 w-7 text-success" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
                    <Clock className="h-7 w-7 text-warning" />
                  </div>
                )}
                <div>
                  <span className="font-display text-2xl font-bold">
                    {result.decision === 'sell' ? t('sellNow') : t('wait')}
                  </span>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Zap className="h-3 w-3 text-primary" /> AI {language === 'en' ? 'Recommendation' : 'సిఫారసు'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">{t('confidence')}</span>
                <div className="font-display text-3xl font-bold text-primary">
                  <AnimatedCounter value={result.confidence} suffix="%" />
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-muted/40 p-4 text-sm mb-4">
              <p className="font-medium">{result.reason[language]}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="kisan-metric rounded-xl">
                <span className="text-[10px] text-muted-foreground font-medium">{language === 'en' ? 'Best Window' : 'ఉత్తమ సమయం'}</span>
                <span className="font-display text-base font-bold">{result.bestWeek}</span>
              </div>
              <div className="kisan-metric rounded-xl">
                <span className="text-[10px] text-muted-foreground font-medium">{language === 'en' ? 'Expected Price' : 'ఆశించిన ధర'}</span>
                <span className="font-display text-base font-bold text-success">{result.expectedPrice}</span>
              </div>
              <div className="kisan-metric rounded-xl">
                <span className="text-[10px] text-muted-foreground font-medium">{language === 'en' ? 'Potential Gain' : 'సంభావ్య లాభం'}</span>
                <span className="font-display text-base font-bold text-primary">
                  {result.potentialGain > 0 ? `+₹${result.potentialGain.toLocaleString()}` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Price Table */}
          <div className="kisan-card-glass animate-float-up stagger-1">
            <h3 className="mb-3 font-display text-sm font-bold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {language === 'en' ? 'Mandi Price Forecast (₹/qtl)' : 'మండి ధర అంచనా (₹/క్వి)'}
            </h3>
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 font-medium">
                  <tr>
                    <th className="p-3">{language === 'en' ? 'Timeline' : 'సమయం'}</th>
                    <th className="p-3">{language === 'en' ? 'Market Price' : 'మార్కెట్ ధర'}</th>
                    <th className="p-3">{language === 'en' ? 'AI Forecast' : 'AI అంచనా'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {priceData.map((row, idx) => (
                    <tr key={idx} className={row.week === 'Now' ? 'bg-primary/5 font-semibold' : ''}>
                      <td className="p-3 text-muted-foreground">{row.week}</td>
                      <td className="p-3">{row.price ? `₹${row.price}` : '—'}</td>
                      <td className={`p-3 ${row.predicted ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        {row.predicted ? `₹${row.predicted}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Neighbor comparison */}
          <div className="kisan-card-glass animate-float-up stagger-2">
            <h3 className="mb-3 font-display text-sm font-bold flex items-center gap-2">
              <Users className="h-4 w-4 text-secondary" />
              {language === 'en' ? 'Neighbor Farm Insights' : 'పొరుగు పొలాల అంతర్దృష్టులు'}
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-accent/50 p-3.5">
                <span className="text-sm">{language === 'en' ? 'Farmers near you growing' : 'మీ సమీపంలో పండిస్తున్న రైతులు'} {crops.find(c => c.value === selectedCrop)?.label[language]}</span>
                <span className="font-display font-bold text-primary text-lg">67%</span>
              </div>
              <div className="rounded-xl bg-success/5 border border-success/20 p-3.5 text-sm">
                <p className="font-medium text-success">
                  {language === 'en'
                    ? `💡 Farmers near you earn 40% more growing ${crops.find(c => c.value === selectedCrop)?.label.en} with direct FPO sales`
                    : `💡 మీ సమీపంలోని రైతులు FPO ద్వారా ${crops.find(c => c.value === selectedCrop)?.label.te} అమ్మి 40% ఎక్కువ సంపాదిస్తున్నారు`}
                </p>
              </div>
            </div>
          </div>

          {/* Conditional Cold Storage Routing */}
          {result.decision === 'wait' && (
            <div className="kisan-card-glass border border-info/30 bg-info/5 animate-scale-up stagger-3">
              <h3 className="mb-3 font-display text-sm font-bold flex items-center gap-2 text-info">
                <Snowflake className="h-5 w-5" />
                {language === 'en' ? 'Nearby Cold Storage Options' : 'సమీప కోల్డ్ స్టోరేజ్ ఎంపికలు'}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                {language === 'en' ? 'Store your crop safely until the price spikes next week.' : 'వచ్చే వారం ధర పెరిగే వరకు మీ పంటను సురక్షితంగా నిల్వ చేయండి.'}
              </p>
              
              <div className="space-y-3">
                {[
                  { name: 'Kisan Cold Logistics', dist: '12 km', capacity: 45, cost: '₹15/qtl/day' },
                  { name: 'AgriSafe Storage', dist: '18 km', capacity: 12, cost: '₹12/qtl/day' }
                ].map((facility, i) => (
                  <div key={i} className="flex flex-col gap-2 rounded-xl bg-background/50 p-3 shadow-sm border border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {facility.name}
                      </span>
                      <span className="text-xs font-bold text-primary">{facility.cost}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{facility.dist} {language === 'en' ? 'away' : 'దూరంలో'}</span>
                      <span className={`font-medium ${facility.capacity > 30 ? 'text-success' : 'text-danger'}`}>
                        {facility.capacity}% {language === 'en' ? 'Capacity' : 'సామర్థ్యం'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
