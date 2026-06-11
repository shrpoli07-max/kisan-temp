import { useLanguage } from '@/contexts/LanguageContext';
import { useFarmer } from '@/contexts/FarmerContext';
import { useState, useEffect } from 'react';
import { Droplets, Thermometer, Wind, CloudRain, Sprout, AlertTriangle, TrendingUp, Sun, Cloud, Zap, Shield, Award, MapPin } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

interface LocalWeather {
  day: string;
  icon: React.ElementType;
  temp: number;
  rain: number;
}

interface AICrop {
  name: string;
  profit: string;
  risk: string;
  trend: string;
}

interface AIAlert {
  type: 'warning' | 'success' | 'danger';
  message: string;
}

const quickActions = [
  { icon: TrendingUp, label: { en: 'Sell Advisor', te: 'అమ్మకం సలహా', hi: 'बिक्री सलाहकार' }, path: '/sell-advisor', color: 'bg-primary/10 text-primary' },
  { icon: Shield, label: { en: 'Disease Scan', te: 'వ్యాధి స్కాన్', hi: 'रोग स्कैन' }, path: '/disease-detector', color: 'bg-danger/10 text-danger' },
  { icon: Award, label: { en: 'My Score', te: 'నా స్కోర్', hi: 'मेरा स्कोर' }, path: '/farmer-score', color: 'bg-secondary/10 text-secondary' },
  { icon: Zap, label: { en: 'AI Alerts', te: 'AI హెచ్చరికలు', hi: 'AI अलर्ट' }, path: '/alerts', color: 'bg-info/10 text-info' },
];

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { profile } = useFarmer();
  
  const [weatherData, setWeatherData] = useState<LocalWeather[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  
  const [aiCrops, setAiCrops] = useState<AICrop[]>([]);
  const [aiAlerts, setAiAlerts] = useState<AIAlert[]>([]);
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    const fetchLiveWeather = async () => {
      try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=18.0&longitude=79.58&daily=weathercode,temperature_2m_max,precipitation_probability_max&timezone=auto");
        const data = await response.json();
        
        const parseWMO = (code: number) => {
           if (code === 0) return Sun; 
           if (code >= 1 && code <= 3) return Cloud; 
           if (code >= 51 && code <= 99) return CloudRain; 
           return Cloud; 
        };

        const forecasted = data.daily.time.slice(0, 7).map((timeStr: string, index: number) => {
           const date = new Date(timeStr);
           const dayText = index === 0 
             ? (language === 'en' ? 'Today' : language === 'hi' ? 'आज' : 'నేడు') 
             : date.toLocaleDateString(language === 'en' ? 'en-US' : 'te-IN', { weekday: 'short' });
           
           return {
              day: dayText,
              icon: parseWMO(data.daily.weathercode[index]),
              temp: Math.round(data.daily.temperature_2m_max[index]),
              rain: data.daily.precipitation_probability_max[index]
           };
        });

        setWeatherData(forecasted);

        // Weather-based dynamic alerts
        const activeAlerts: AIAlert[] = [];
        if (forecasted[0].rain > 60 || forecasted[1].rain > 60) {
          activeAlerts.push({
            type: 'warning',
            message: language === 'en' ? '🌧️ Heavy rain expected soon — delay irrigation' : language === 'hi' ? '🌧️ जल्द ही भारी बारिश की उम्मीद — सिंचाई रोकें' : '🌧️ త్వరలో భారీ వర్షం — నీటిపారుదల ఆపండి'
          });
        }
        
        setAiAlerts(activeAlerts);
        
      } catch (err) {
        console.error("Open-Meteo API Failed:", err);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchLiveWeather();
  }, [language]);

  useEffect(() => {
    const fetchGeminiPredictions = async () => {
      if (!profile) return;
      try {
        setAiLoading(true);
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const prompt = `You are an AI agricultural predictor. The user is a farmer in ${profile.district}, ${profile.state} with ${profile.landSize} acres of land. 
        Language to respond in: ${language}.
        Task 1: Generate exactly 3 highly profitable crops they should plant right now based on current market trends for their region.
        Task 2: Generate exactly 1 extra farm alert (market or disease) specific to their region.
        Return ONLY a raw JSON string (no markdown ticks) in this exact format:
        {
          "crops": [{"name": "Crop Name", "profit": "e.g. ₹45,000", "risk": "low/medium/high", "trend": "+12%"}],
          "alert": {"type": "success or danger", "message": "Alert text with an emoji"}
        }`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
          })
        });

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);
        
        setAiCrops(parsed.crops);
        setAiAlerts(prev => {
          // If the AI generated an alert, merge it with the weather alerts we already have
          if (parsed.alert && !prev.find(a => a.message === parsed.alert.message)) {
            return [...prev, parsed.alert];
          }
          return prev;
        });

      } catch (err) {
        console.error("Failed to generate AI Top crops");
        // Fallback gracefully without crashing
        setAiCrops([
          { name: language === 'en' ? 'Tomato' : language === 'hi' ? 'टमाटर' : 'టమాటా', profit: '₹45,000', risk: 'low', trend: '+12%' },
          { name: language === 'en' ? 'Chilli' : language === 'hi' ? 'मिर्च' : 'మిర్చి', profit: '₹38,000', risk: 'medium', trend: '+5%' }
        ]);
      } finally {
        setAiLoading(false);
      }
    };

    fetchGeminiPredictions();
  }, [profile, language]);

  return (
    <div className="space-y-5 md:ml-60">
      {/* Farm Overview Panel */}
      <div className="kisan-card-glass kisan-gradient-hero text-primary-foreground py-6 animate-float-up">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm opacity-80">{language === 'en' ? 'Live Farm Intelligence' : language === 'hi' ? 'लाइव फार्म इंटेलिजेंस' : 'లైవ్ ఫార్మ్ అడ్వైజరీ'}</p>
            <h2 className="font-display text-2xl font-bold mt-1">
              {language === 'en' ? 'Hello' : language === 'hi' ? 'नमस्ते' : 'నమస్తే'}, {profile?.name || 'Farmer'}! 🌾
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 flex flex-col justify-center">
            <p className="text-[10px] opacity-80 flex items-center gap-1"><MapPin className="h-3 w-3"/> {language === 'en' ? 'Location' : 'స్థానం'}</p>
            <p className="font-display text-lg font-bold">{profile?.district || 'Warangal'}, {profile?.state || 'Telangana'}</p>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 flex flex-col justify-center">
            <p className="text-[10px] opacity-80">{language === 'en' ? 'Land Registered' : 'నమోదిత భూమి'}</p>
            <p className="font-display text-lg font-bold">{profile?.landSize || 3} {language === 'en' ? 'Acres' : 'ఎకరాలు'}</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-2 animate-float-up stagger-1">
        {quickActions.map((action, i) => (
          <Link key={i} to={action.path} className="kisan-card-glass flex flex-col items-center gap-2 py-4 px-2 text-center hover:scale-105 transition-transform">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.color}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-[11px] font-medium leading-tight">{action.label[language]}</span>
          </Link>
        ))}
      </div>

      {/* Dynamic Alerts */}
      <div className="space-y-2 animate-float-up stagger-2">
        {aiAlerts.map((alert, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 rounded-xl p-3.5 text-sm transition-all hover:translate-x-1 ${
              alert.type === 'warning' ? 'kisan-badge-warning bg-[hsl(var(--warning)/0.08)]' :
              alert.type === 'success' ? 'kisan-badge-success bg-[hsl(var(--success)/0.08)]' :
              'kisan-badge-danger bg-[hsl(var(--danger)/0.08)]'
            }`}
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{alert.message}</span>
          </div>
        ))}
      </div>

      {/* Weather */}
      <div className="kisan-card-glass animate-float-up stagger-3">
        <div className="kisan-section-title">
          <div className="icon-wrap" style={{ background: 'hsl(var(--info) / 0.12)' }}>
            <Thermometer className="h-4 w-4 text-info" />
          </div>
          <h2>{t('weather')} — 7 {language === 'en' ? 'Day Forecast' : language === 'hi' ? 'दिन का पूर्वानुमान' : 'రోజుల అంచనా'}</h2>
          {!weatherLoading && (
            <span className="ml-auto kisan-badge-success text-[10px]">
              <Zap className="h-3 w-3" /> API Live
            </span>
          )}
        </div>
        
        {weatherLoading ? (
          <div className="flex gap-2 pb-2">
             {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <div key={s} className="h-28 w-[76px] rounded-xl bg-muted/60 animate-pulse shrink-0"></div>
             ))}
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {weatherData.map((day, i) => (
              <div
                key={i}
                className={`flex min-w-[76px] flex-col items-center gap-1.5 rounded-xl p-3 transition-all hover:scale-105 ${
                  i === 0 ? 'bg-primary/10 ring-2 ring-primary/30 shadow-sm' : 'bg-muted/50'
                }`}
              >
                <span className="text-[10px] font-semibold text-muted-foreground">{day.day}</span>
                <day.icon className={`h-6 w-6 ${i === 0 ? 'text-primary animate-bounce-subtle' : 'text-foreground'}`} />
                <span className="text-base font-bold font-display">{day.temp}°C</span>
                <div className="flex items-center gap-0.5">
                  <Droplets className="h-3 w-3 text-info" />
                  <span className="text-[10px] text-muted-foreground">{day.rain}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Top Crops AI Generated */}
      <div className="kisan-card-glass animate-float-up stagger-4">
        <div className="kisan-section-title">
          <div className="icon-wrap bg-primary/10">
            <Sprout className="h-4 w-4 text-primary" />
          </div>
          <h2>{language === 'en' ? 'AI Market Predictions' : language === 'hi' ? 'AI बाजार की भविष्यवाणियां' : 'AI మార్కెట్ అంచనాలు'}</h2>
          {!aiLoading && (
            <span className="ml-auto kisan-badge-warning text-[10px]">
              <Zap className="h-3 w-3" /> AI Generated
            </span>
          )}
        </div>
        
        {aiLoading ? (
           <div className="space-y-3">
             <div className="h-16 w-full rounded-xl bg-muted/60 animate-pulse"></div>
             <div className="h-16 w-full rounded-xl bg-muted/60 animate-pulse"></div>
           </div>
        ) : (
          <div className="space-y-3">
            {aiCrops.map((crop, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-border/50 bg-background/50 p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xl">
                    🌿
                  </div>
                  <div>
                    <h3 className="font-bold">{crop.name}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {language === 'en' ? 'Est. Profit: ' : language === 'hi' ? 'अनुमानित लाभ: ' : 'అంచనా లాభం: '} 
                      <span className="font-bold text-success">{crop.profit}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-success text-xs font-bold">
                    <TrendingUp className="h-3 w-3" /> {crop.trend}
                  </div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase
                    ${crop.risk === 'low' ? 'bg-success/10 text-success' : crop.risk === 'high' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}>
                    {crop.risk} risk
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
