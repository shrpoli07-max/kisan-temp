import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

import { useQuery } from '@tanstack/react-query';
import { supabase } from './utils/supabase';

// Fetched directly from Supabase backend

import { crops } from './utils/crops';

export default function IncomeSimulator() {
  const { t, language } = useLanguage();
  const [crop, setCrop] = useState('tomato');
  const [acreage, setAcreage] = useState([3]);
  const [withMiddleman, setWithMiddleman] = useState(true);

  const { data: dbEco } = useQuery({
    queryKey: ['cropEconomics', crop],
    queryFn: async () => {
      const { data, error } = await supabase.from('crop_economics').select('*').eq('crop_id', crop).single();
      if (error || !data) return null;
      return {
        yieldPerAcre: data.yield_per_acre,
        pricePerQtl: data.price_per_qtl,
        costPerAcre: data.cost_per_acre,
        middlemanCut: data.middleman_cut
      };
    }
  });

  const eco = dbEco || { yieldPerAcre: 50, pricePerQtl: 3000, costPerAcre: 40000, middlemanCut: 0.15 };
  const totalYield = eco.yieldPerAcre * acreage[0];
  const grossIncome = totalYield * eco.pricePerQtl;
  const middlemanFee = withMiddleman ? grossIncome * eco.middlemanCut : 0;
  const totalCost = eco.costPerAcre * acreage[0];
  const netProfit = grossIncome - middlemanFee - totalCost;

  const directProfit = grossIncome - totalCost;
  const middlemanProfit = grossIncome - (grossIncome * eco.middlemanCut) - totalCost;
  const savingsAmount = directProfit - middlemanProfit;

  const comparisonData = [
    { name: language === 'en' ? 'Direct Sale' : 'ప్రత్యక్ష', income: Math.round(grossIncome), expenses: Math.round(totalCost), profit: Math.round(directProfit) },
    { name: language === 'en' ? 'Via Middleman' : 'దళారీ ద్వారా', income: Math.round(grossIncome - grossIncome * eco.middlemanCut), expenses: Math.round(totalCost), profit: Math.round(middlemanProfit) },
  ];

  return (
    <div className="space-y-5 md:ml-60">
      <div className="animate-float-up">
        <h2 className="font-display text-xl font-bold">{t('incomeSimulator')}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'en' ? 'Adjust sliders to simulate your income in real-time' : 'మీ ఆదాయాన్ని రియల్-టైమ్‌లో అనుకరించడానికి స్లైడర్లను సర్దుబాటు చేయండి'}
        </p>
      </div>

      {/* Controls */}
      <div className="kisan-card-glass space-y-5 animate-float-up stagger-1">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('crop')}</label>
          <Select value={crop} onValueChange={setCrop}>
            <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              {crops.map(c => <SelectItem key={c.value} value={c.value}>{c.label[language]}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t('acreage')}</label>
            <span className="font-display text-base font-bold text-primary">{acreage[0]} {language === 'en' ? 'acres' : 'ఎకరాలు'}</span>
          </div>
          <Slider value={acreage} onValueChange={setAcreage} min={1} max={20} step={1} />
        </div>



        <div className="flex items-center justify-between rounded-xl bg-muted/40 p-3">
          <label className="text-sm font-medium">{t('withMiddleman')}</label>
          <Switch checked={withMiddleman} onCheckedChange={setWithMiddleman} />
        </div>
      </div>

      {/* Live result */}
      <div className="grid grid-cols-3 gap-3 animate-float-up stagger-2">
        <div className="kisan-card-glass text-center py-4">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t('income')}</span>
          <p className="font-display text-lg font-bold mt-1">
            <AnimatedCounter value={Math.round(grossIncome - middlemanFee)} prefix="₹" />
          </p>
        </div>
        <div className="kisan-card-glass text-center py-4">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t('expenses')}</span>
          <p className="font-display text-lg font-bold text-destructive mt-1">
            <AnimatedCounter value={Math.round(totalCost)} prefix="₹" />
          </p>
        </div>
        <div className="kisan-card-glass text-center py-4">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t('netProfit')}</span>
          <p className={`font-display text-lg font-bold mt-1 ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
            {netProfit >= 0 ? <TrendingUp className="h-4 w-4 inline mr-1" /> : <TrendingDown className="h-4 w-4 inline mr-1" />}
            <AnimatedCounter value={Math.abs(Math.round(netProfit))} prefix={netProfit >= 0 ? '₹' : '-₹'} />
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="kisan-card-glass animate-float-up stagger-3">
        <h3 className="mb-3 font-display text-sm font-bold">{t('directSale')} vs {t('withMiddleman')}</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" name={t('income')} fill="hsl(142 52% 36%)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expenses" name={t('expenses')} fill="hsl(0 72% 51%)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" name={t('netProfit')} fill="hsl(36 72% 55%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Savings */}
      <div className="kisan-card-glass kisan-gradient-hero text-primary-foreground animate-float-up stagger-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold mb-1">
              💰 {language === 'en' ? 'You could save' : 'మీరు ఆదా చేయవచ్చు'}
            </h3>
            <p className="text-2xl font-display font-bold">
              ₹{Math.round(savingsAmount).toLocaleString()}
            </p>
            <p className="text-sm opacity-90 mt-1">
              {language === 'en' ? 'by selling directly through FPOs instead of middlemen' : 'దళారీల బదులు FPO ల ద్వారా నేరుగా అమ్మడం ద్వారా'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
