import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar } from 'lucide-react';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

type Phase = 'plant' | 'grow' | 'harvest' | 'sell' | 'none';

const cropCalendars: { name: { en: string; te: string; hi: string }; phases: Phase[]; bestSell: number[] }[] = [
  { name: { en: 'Cotton', te: 'పత్తి', hi: 'कपास' }, phases: ['none','none','none','none','plant','plant','grow','grow','grow','harvest','harvest','sell'], bestSell: [10,11] },
  { name: { en: 'Tomato', te: 'టమాటా', hi: 'टमाटर' }, phases: ['harvest','sell','none','none','none','plant','plant','grow','grow','grow','harvest','sell'], bestSell: [0,1,11] },
  { name: { en: 'Rice', te: 'వరి', hi: 'चावल' }, phases: ['none','none','none','none','none','plant','grow','grow','grow','harvest','sell','sell'], bestSell: [10,11] },
  { name: { en: 'Chilli', te: 'మిర్చి', hi: 'मिर्च' }, phases: ['harvest','sell','sell','none','none','plant','plant','grow','grow','grow','harvest','harvest'], bestSell: [1,2] },
  { name: { en: 'Onion', te: 'ఉల్లిపాయ', hi: 'प्याज' }, phases: ['grow','harvest','sell','sell','none','none','none','none','none','plant','plant','grow'], bestSell: [2,3] },
  { name: { en: 'Wheat', te: 'గోధుమ', hi: 'गेहूँ' }, phases: ['grow','grow','harvest','sell','none','none','none','none','none','plant','plant','grow'], bestSell: [3,4] },
  { name: { en: 'Maize', te: 'మొక్కజొన్న', hi: 'मक्का' }, phases: ['none','none','none','none','none','plant','plant','grow','grow','harvest','sell','none'], bestSell: [10] },
  { name: { en: 'Sugarcane', te: 'చెరకు', hi: 'गन्ना' }, phases: ['harvest','sell','sell','none','plant','grow','grow','grow','grow','grow','grow','grow'], bestSell: [1,2] },
  { name: { en: 'Soybean', te: 'సోయాబీన్', hi: 'सोयाबीन' }, phases: ['none','none','none','none','none','plant','grow','grow','harvest','sell','none','none'], bestSell: [9,10] },
  { name: { en: 'Mango', te: 'మామిడి', hi: 'आम' }, phases: ['grow','grow','grow','harvest','sell','sell','none','none','none','none','none','none'], bestSell: [4,5] },
];

const phaseColors: Record<Phase, string> = {
  plant: 'bg-info/20 text-info border-info/30',
  grow: 'bg-[hsl(var(--success)/0.15)] text-success border-success/30',
  harvest: 'bg-[hsl(var(--warning)/0.15)] text-warning border-warning/30',
  sell: 'bg-[hsl(var(--primary)/0.15)] text-primary border-primary/30',
  none: 'bg-muted text-muted-foreground/30 border-transparent',
};

const phaseLabels: Record<Phase, { en: string; te: string; hi: string }> = {
  plant: { en: '🌱', te: '🌱', hi: '🌱' },
  grow: { en: '🌿', te: '🌿', hi: '🌿' },
  harvest: { en: '🌾', te: '🌾', hi: '🌾' },
  sell: { en: '💰', te: '💰', hi: '💰' },
  none: { en: '·', te: '·', hi: '·' },
};

export default function CropCalendar() {
  const { language } = useLanguage();

  return (
    <div className="space-y-4 md:ml-60">
      <h2 className="font-display text-xl font-bold flex items-center gap-2">
        <Calendar className="h-6 w-6 text-primary" />
        {language === 'en' ? 'Crop Calendar' : 'పంట క్యాలెండర్'}
      </h2>
      <p className="text-sm text-muted-foreground">
        {language === 'en' ? '12-month timeline with planting, growing, harvest & best selling windows' : '12-నెలల సమయరేఖ — నాటడం, పెరుగుదల, పంట కోత & అమ్మకం'}
      </p>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {(['plant','grow','harvest','sell'] as Phase[]).map(p => (
          <div key={p} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${phaseColors[p]}`}>
            {phaseLabels[p][language]} {language === 'en' ? p.charAt(0).toUpperCase() + p.slice(1) : p === 'plant' ? 'నాటడం' : p === 'grow' ? 'పెరుగుదల' : p === 'harvest' ? 'కోత' : 'అమ్మకం'}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Month headers */}
          <div className="grid grid-cols-[120px_repeat(12,1fr)] gap-1 mb-1">
            <div />
            {months.map(m => (
              <div key={m} className="text-center text-[10px] font-medium text-muted-foreground">{m}</div>
            ))}
          </div>

          {/* Crop rows */}
          {cropCalendars.map((crop, ci) => (
            <div key={ci} className="grid grid-cols-[120px_repeat(12,1fr)] gap-1 mb-1">
              <div className="flex items-center text-sm font-semibold truncate pr-2">{crop.name[language]}</div>
              {crop.phases.map((phase, mi) => (
                <div
                  key={mi}
                  className={`flex items-center justify-center rounded border py-2 text-xs font-medium transition-all ${phaseColors[phase]} ${crop.bestSell.includes(mi) ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                >
                  {phaseLabels[phase][language]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Profit windows */}
      <div className="kisan-card-glass kisan-gradient-hero text-primary-foreground">
        <h3 className="font-display text-base font-semibold mb-2">🏆 {language === 'en' ? 'Best Profit Windows' : 'ఉత్తమ లాభ విండోలు'}</h3>
        <div className="space-y-1 text-sm opacity-90">
          <p>🌾 {language === 'en' ? 'Cotton: Sell Nov-Dec for peak MSP rates' : 'పత్తి: నవం-డిసెం లో MSP ధరలకు అమ్మండి'}</p>
          <p>🍅 {language === 'en' ? 'Tomato: Jan-Feb demand spike = 40% premium' : 'టమాటా: జన-ఫిబ్ డిమాండ్ = 40% ప్రీమియం'}</p>
          <p>🌶️ {language === 'en' ? 'Chilli: Feb-Mar export demand highest' : 'మిర్చి: ఫిబ్-మార్ ఎగుమతి డిమాండ్ అధికం'}</p>
        </div>
      </div>
    </div>
  );
}
