import { useLanguage } from '@/contexts/LanguageContext';
import { Award, TrendingUp, Shield, Droplets, Sprout, Target, ChevronRight, Star, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const scoreBreakdown = [
  { category: { en: 'Soil Health', te: 'నేల ఆరోగ్యం' }, score: 82, icon: Sprout, color: 'text-success' },
  { category: { en: 'Water Management', te: 'నీటి నిర్వహణ' }, score: 75, icon: Droplets, color: 'text-info' },
  { category: { en: 'Crop Diversification', te: 'పంట వైవిధ్యం' }, score: 60, icon: Target, color: 'text-secondary' },
  { category: { en: 'Market Timing', te: 'మార్కెట్ సమయం' }, score: 88, icon: TrendingUp, color: 'text-primary' },
  { category: { en: 'Risk Management', te: 'ప్రమాద నిర్వహణ' }, score: 72, icon: Shield, color: 'text-warning' },
];

const recommendations = [
  { en: 'Add drip irrigation to improve water score by 15 points', te: 'నీటి స్కోర్ 15 పాయింట్లు మెరుగు చేయడానికి డ్రిప్ ఇరిగేషన్ చేర్చండి' },
  { en: 'Diversify with a legume crop to boost soil nitrogen', te: 'నేల నత్రజని పెంచడానికి పప్పు పంటతో వైవిధ్యం చేయండి' },
  { en: 'Register on e-NAM for better market access', te: 'మెరుగైన మార్కెట్ యాక్సెస్ కోసం e-NAMలో నమోదు చేసుకోండి' },
];

const badges = [
  { name: { en: 'Water Saver', te: 'నీటి రక్షకుడు' }, emoji: '💧', earned: true },
  { name: { en: 'Top Seller', te: 'టాప్ సెల్లర్' }, emoji: '🏆', earned: true },
  { name: { en: 'Eco Farmer', te: 'ఎకో రైతు' }, emoji: '🌱', earned: false },
  { name: { en: 'Tech Adopter', te: 'టెక్ అడాప్టర్' }, emoji: '🔬', earned: true },
  { name: { en: 'Market Master', te: 'మార్కెట్ మాస్టర్' }, emoji: '📊', earned: false },
];

export default function FarmerScore() {
  const { language } = useLanguage();
  const overallScore = 78;

  const radialData = [{ name: 'Score', value: overallScore, fill: 'hsl(142, 52%, 36%)' }];

  return (
    <div className="space-y-5 md:ml-60">
      {/* Hero */}
      <div className="kisan-card-glass kisan-gradient-hero text-primary-foreground py-8 text-center animate-float-up">
        <Award className="h-10 w-10 mx-auto mb-3 opacity-90" />
        <h2 className="font-display text-2xl font-bold mb-1">
          {language === 'en' ? 'Your Farmer IQ Score' : 'మీ రైతు IQ స్కోర్'}
        </h2>
        <p className="text-sm opacity-80 mb-4">
          {language === 'en' ? 'AI-calculated score based on farming practices' : 'వ్యవసాయ పద్ధతుల ఆధారంగా AI-లెక్కించిన స్కోర్'}
        </p>
        <div className="relative w-40 h-40 mx-auto">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" data={radialData} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background={{ fill: 'rgba(255,255,255,0.15)' }} dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-bold"><AnimatedCounter value={overallScore} /></span>
            <span className="text-xs opacity-80">/100</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3">
          {[1,2,3,4].map(i => <Star key={i} className="h-5 w-5 fill-current" />)}
          <Star className="h-5 w-5 opacity-40" />
        </div>
        <p className="text-sm font-medium mt-2">
          {language === 'en' ? 'Above 72% of farmers in your district' : 'మీ జిల్లాలో 72% రైతుల కంటే ఎక్కువ'}
        </p>
      </div>

      {/* Score breakdown */}
      <div className="kisan-card-glass animate-float-up stagger-1">
        <h3 className="font-display text-base font-bold mb-4">
          {language === 'en' ? '📊 Score Breakdown' : '📊 స్కోర్ విభజన'}
        </h3>
        <div className="space-y-4">
          {scoreBreakdown.map((item, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  <span className="text-sm font-medium">{item.category[language]}</span>
                </div>
                <span className="font-display text-sm font-bold">{item.score}/100</span>
              </div>
              <Progress value={item.score} className="h-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="kisan-card-glass animate-float-up stagger-2">
        <h3 className="font-display text-base font-bold mb-4">
          {language === 'en' ? '🏅 Achievement Badges' : '🏅 సాధన బ్యాడ్జ్‌లు'}
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {badges.map((badge, i) => (
            <div key={i} className={`flex flex-col items-center gap-1.5 rounded-xl p-3 text-center transition-all ${badge.earned ? 'bg-primary/5 hover:scale-110' : 'bg-muted/40 opacity-50 grayscale'}`}>
              <span className="text-2xl">{badge.emoji}</span>
              <span className="text-[10px] font-medium leading-tight">{badge.name[language]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI recommendations */}
      <div className="kisan-card-glass animate-float-up stagger-3">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="font-display text-base font-bold">
            {language === 'en' ? 'AI Recommendations to Improve' : 'మెరుగుపరచడానికి AI సిఫారసులు'}
          </h3>
        </div>
        <div className="space-y-2">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-muted/40 p-3 hover:bg-muted/70 transition-all">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <ChevronRight className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm">{rec[language]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
