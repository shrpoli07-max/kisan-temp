import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TrendingUp, Shield, Sprout, Users, BarChart3, Globe, Smartphone, Zap, Award, Database, ChevronRight, Star, Brain } from 'lucide-react';
import { AnimatedCounter } from '@/components/AnimatedCounter';

const stats = [
  { value: 86, suffix: '%', label: { en: 'of Indian farmers are small/marginal', te: 'భారతీయ రైతులు చిన్న/అల్ప' } },
  { value: 30, prefix: '', suffix: '%', label: { en: 'yield improvement with ICT advisory', te: 'ICT సలహాతో దిగుబడి మెరుగుదల' } },
  { value: 6000, prefix: '₹', suffix: '+', label: { en: 'avg. savings per season per farmer', te: 'సగటు ఆదా ప్రతి సీజన్ ప్రతి రైతు' } },
  { value: 15, suffix: '+', label: { en: 'AI-powered features', te: 'AI-ఆధారిత ఫీచర్లు' } },
];

const features = [
  { icon: BarChart3, title: { en: 'Crop Profitability Ranker', te: 'పంట లాభదాయకత ర్యాంకర్' }, desc: { en: 'Top 5 crops ranked by profit for your soil & season', te: 'మీ నేల & సీజన్‌కు లాభం ద్వారా టాప్ 5 పంటలు' } },
  { icon: TrendingUp, title: { en: 'Sell Now or Wait', te: 'ఇప్పుడు అమ్మండి లేదా వేచి ఉండండి' }, desc: { en: 'AI-powered selling decisions with confidence scores', te: 'నమ్మకం స్కోర్‌లతో AI-ఆధారిత అమ్మకం నిర్ణయాలు' } },
  { icon: Shield, title: { en: 'Disease Detection', te: 'వ్యాధి గుర్తింపు' }, desc: { en: 'Upload crop photo for instant diagnosis', te: 'తక్షణ నిర్ధారణ కోసం పంట ఫోటో అప్‌లోడ్ చేయండి' } },
  { icon: Sprout, title: { en: 'Soil & Weather Dashboard', te: 'నేల & వాతావరణ డాష్‌బోర్డ్' }, desc: { en: 'Real-time NPK, moisture, and 7-day forecast', te: 'రియల్-టైమ్ NPK, తేమ మరియు 7-రోజుల అంచనా' } },
  { icon: Users, title: { en: 'Direct Buyer Network', te: 'ప్రత్యక్ష కొనుగోలు నెట్‌వర్క్' }, desc: { en: 'Skip middlemen — connect with FPOs & e-NAM', te: 'దళారీలను దాటి — FPOలు & e-NAMతో కనెక్ట్ అవ్వండి' } },
  { icon: Award, title: { en: 'Farmer IQ Score', te: 'రైతు IQ స్కోర్' }, desc: { en: 'Gamified score tracking farming practices', te: 'వ్యవసాయ పద్ధతులను ట్రాక్ చేసే గేమిఫైడ్ స్కోర్' } },
];

const techStack = [
  { name: 'ARIMA + LSTM', desc: { en: 'Price Forecasting', te: 'ధర అంచనా' } },
  { name: 'ResNet-50', desc: { en: 'Disease Classification', te: 'వ్యాధి వర్గీకరణ' } },
  { name: 'Random Forest', desc: { en: 'Water Prediction', te: 'నీటి అంచనా' } },
  { name: 'MCDA', desc: { en: 'Crop Ranking', te: 'పంట ర్యాంకింగ్' } },
];

const users = [
  { icon: Sprout, name: { en: 'Small & Marginal Farmers', te: 'చిన్న & అల్ప రైతులు' } },
  { icon: Shield, name: { en: 'Government Agriculture Depts', te: 'ప్రభుత్వ వ్యవసాయ విభాగాలు' } },
  { icon: Users, name: { en: 'NGOs & Cooperatives', te: 'NGOలు & సహకార సంఘాలు' } },
  { icon: Zap, name: { en: 'Agri-tech Startups', te: 'అగ్రి-టెక్ స్టార్టప్‌లు' } },
];

export default function Landing() {
  const { language } = useLanguage();

  return (
    <div className="space-y-6 md:ml-60">
      {/* Hero */}
      <div className="kisan-card-glass kisan-gradient-hero text-primary-foreground text-center py-12 px-6 animate-float-up relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <Brain className="h-3 w-3 inline mr-1" />
              {language === 'en' ? 'AI-Powered Agriculture' : 'AI-ఆధారిత వ్యవసాయం'}
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            🌾 Kisan IQ
          </h1>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto leading-relaxed">
            {language === 'en'
              ? 'AI-powered decisions for smarter farming. Increase income, reduce losses, farm sustainably.'
              : 'తెలివైన వ్యవసాయం కోసం AI-ఆధారిత నిర్ణయాలు. ఆదాయం పెంచండి, నష్టాలు తగ్గించండి.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/">
              <Button size="lg" variant="secondary" className="font-display font-bold text-base rounded-xl h-12 px-8 shadow-lg">
                {language === 'en' ? 'Open Dashboard →' : 'డాష్‌బోర్డ్ తెరవండి →'}
              </Button>
            </Link>
            <Link to="/data-sources">
              <Button size="lg" variant="outline" className="font-display font-semibold text-base rounded-xl h-12 px-6 bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Database className="h-4 w-4 mr-2" />
                {language === 'en' ? 'View Data Sources' : 'డేటా వనరులు'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Problem */}
      <div className="kisan-card-glass animate-float-up stagger-1">
        <h2 className="font-display text-lg font-bold mb-2 flex items-center gap-2">
          🎯 {language === 'en' ? 'The Problem' : 'సమస్య'}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {language === 'en'
            ? 'Small farmers lack access to reliable, real-time advisory on crop selection, pricing, and market timing. They lose 15-30% of potential income due to information gaps and middleman exploitation.'
            : 'చిన్న రైతులకు పంట ఎంపిక, ధరలు, మార్కెట్ సమయం గురించి విశ్వసనీయ సలహా అందుబాటులో లేదు. సమాచార అంతరాలు మరియు దళారీ దోపిడీ వల్ల 15-30% సంభావ్య ఆదాయం కోల్పోతున్నారు.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-float-up stagger-2">
        {stats.map((s, i) => (
          <div key={i} className="kisan-card-glass kisan-stat-glow text-center py-5">
            <span className="font-display text-3xl font-bold shimmer-text">
              <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </span>
            <span className="text-[10px] text-muted-foreground text-center block mt-1.5">{s.label[language]}</span>
          </div>
        ))}
      </div>

      {/* AI/ML Tech */}
      <div className="kisan-card-glass animate-float-up stagger-3">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-bold">
            {language === 'en' ? 'AI/ML Engine' : 'AI/ML ఇంజిన్'}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {techStack.map((tech, i) => (
            <div key={i} className="rounded-xl bg-primary/5 border border-primary/10 p-3 text-center">
              <p className="font-mono text-xs font-bold text-primary">{tech.name}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{tech.desc[language]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="animate-float-up stagger-4">
        <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
          ⚡ {language === 'en' ? 'Key Features' : 'ముఖ్య ఫీచర్లు'}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div key={i} className="kisan-card-glass flex gap-3 group">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold">{f.title[language]}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc[language]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target users */}
      <div className="kisan-card-glass animate-float-up stagger-5">
        <h2 className="font-display text-lg font-bold mb-4">
          👥 {language === 'en' ? 'Built For' : 'ఎవరి కోసం'}
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {users.map((u, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-muted/40 p-3.5 hover:bg-muted/70 transition-all">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <u.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium">{u.name[language]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="kisan-card-glass kisan-gradient-hero text-primary-foreground text-center py-10 relative overflow-hidden animate-float-up stagger-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center justify-center gap-1 mb-3">
            {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-current text-yellow-300" />)}
          </div>
          <Smartphone className="h-8 w-8 mx-auto mb-3 opacity-90" />
          <h2 className="font-display text-2xl font-bold mb-3">
            {language === 'en' ? 'Ready to farm smarter?' : 'తెలివిగా వ్యవసాయం చేయడానికి సిద్ధంగా ఉన్నారా?'}
          </h2>
          <Link to="/">
            <Button size="lg" variant="secondary" className="font-display font-bold text-base rounded-xl h-12 px-8 shadow-lg">
              {language === 'en' ? 'Get Started Free →' : 'ఉచితంగా ప్రారంభించండి →'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
