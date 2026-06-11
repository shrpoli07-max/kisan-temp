import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'te' | 'hi';

interface Translations {
  [key: string]: { en: string; te: string; hi: string };
}

const translations: Translations = {
  appName: { en: 'Kisan IQ', te: 'కిసాన్ IQ', hi: 'किसान IQ' },
  dashboard: { en: 'Dashboard', te: 'డాష్‌బోర్డ్', hi: 'डैशबोर्ड' },
  sellAdvisor: { en: 'Sell Advisor', te: 'అమ్మకం సలహా', hi: 'बिक्री सलाहकार' },
  incomeSimulator: { en: 'Income Simulator', te: 'ఆదాయ అంచనా', hi: 'आय सिम्युलेटर' },
  diseaseDetector: { en: 'Disease Detector', te: 'వ్యాధి గుర్తింపు', hi: 'रोग पहचानकर्ता' },
  cropRanker: { en: 'Crop Ranker', te: 'పంట ర్యాంకర్', hi: 'फसल रैंकर' },
  schemes: { en: 'Schemes', te: 'పథకాలు', hi: 'योजनाएं' },
  soilHealth: { en: 'Soil Health', te: 'నేల ఆరోగ్యం', hi: 'मिट्टी का स्वास्थ्य' },
  weather: { en: 'Weather', te: 'వాతావరణం', hi: 'मौसम' },
  sellNow: { en: 'Sell Now', te: 'ఇప్పుడు అమ్మండి', hi: 'अभी बेचें' },
  wait: { en: 'Wait', te: 'వేచి ఉండండి', hi: 'प्रतीक्षा करें' },
  confidence: { en: 'Confidence', te: 'విశ్వాసం', hi: 'आत्मविश्वास' },
  profit: { en: 'Profit', te: 'లాభం', hi: 'मुनाफा' },
  risk: { en: 'Risk', te: 'ప్రమాదం', hi: 'जोखिम' },
  low: { en: 'Low', te: 'తక్కువ', hi: 'कम' },
  medium: { en: 'Medium', te: 'మధ్యస్థ', hi: 'मध्यम' },
  high: { en: 'High', te: 'ఎక్కువ', hi: 'उच्च' },
  perAcre: { en: 'per acre', te: 'ఎకరానికి', hi: 'प्रति एकड़' },
  uploadImage: { en: 'Upload Image', te: 'చిత్రాన్ని అప్‌లోడ్ చేయండి', hi: 'छवि अपलोड करें' },
  analyzing: { en: 'Analyzing...', te: 'విశ్లేషిస్తోంది...', hi: 'विश्लेषण कर रहा है...' },
  acreage: { en: 'Acreage', te: 'ఎకరాలు', hi: 'रकबा' },
  crop: { en: 'Crop', te: 'పంట', hi: 'फसल' },
  income: { en: 'Income', te: 'ఆదాయం', hi: 'आय' },
  expenses: { en: 'Expenses', te: 'ఖర్చులు', hi: 'खर्च' },
  netProfit: { en: 'Net Profit', te: 'నికర లాభం', hi: 'शुद्ध लाभ' },
  withMiddleman: { en: 'With Middleman', te: 'దళారీతో', hi: 'बिचौलिए के साथ' },
  directSale: { en: 'Direct Sale', te: 'ప్రత్యక్ష అమ్మకం', hi: 'सीधी बिक्री' },
  nitrogen: { en: 'Nitrogen', te: 'నత్రజని', hi: 'नाइट्रोजन' },
  phosphorus: { en: 'Phosphorus', te: 'భాస్వరం', hi: 'फास्फोरस' },
  potassium: { en: 'Potassium', te: 'పొటాషియం', hi: 'पोटैशियम' },
  moisture: { en: 'Moisture', te: 'తేమ', hi: 'नमी' },
  ph: { en: 'pH Level', te: 'pH స్థాయి', hi: 'पीएच स्तर' },
  temperature: { en: 'Temperature', te: 'ఉష్ణోగ్రత', hi: 'तापमान' },
  humidity: { en: 'Humidity', te: 'ఆర్ద్రత', hi: 'नमी' },
  rainfall: { en: 'Rainfall', te: 'వర్షపాతం', hi: 'वर्षा' },
  lastSynced: { en: 'Last synced', te: 'చివరి సింక్', hi: 'अंतिम सिंक' },
  minsAgo: { en: 'mins ago', te: 'నిమిషాల క్రితం', hi: 'मिनट पहले' },
  alerts: { en: 'Alerts', te: 'హెచ్చరికలు', hi: 'अलर्ट' },
  selectCrop: { en: 'Select Crop', te: 'పంట ఎంచుకోండి', hi: 'फसल चुनें' },
  quantity: { en: 'Quantity (quintals)', te: 'పరిమాణం (క్వింటాళ్లు)', hi: 'मात्रा (क्विंटल)' },
  getAdvice: { en: 'Get Advice', te: 'సలహా పొందండి', hi: 'सलाह प्राप्त करें' },
  treatment: { en: 'Treatment', te: 'చికిత్స', hi: 'उपचार' },
  organic: { en: 'Organic', te: 'సేంద్రీయ', hi: 'जैविक' },
  chemical: { en: 'Chemical', te: 'రసాయన', hi: 'रासायनिक' },
  estimatedCost: { en: 'Estimated Cost', te: 'అంచనా ఖర్చు', hi: 'अनुमानित लागत' },
  severity: { en: 'Severity', te: 'తీవ్రత', hi: 'गंभीरता' },
  simulate: { en: 'Simulate', te: 'అనుకరించండి', hi: 'सिम्युलेट' },
  yield: { en: 'Yield', te: 'దిగుబడి', hi: 'उपज' },
  pricePerQuintal: { en: 'Price/Quintal', te: 'ధర/క్వింటాల్', hi: 'मूल्य/क्विंटल' },
  waterStress: { en: 'Water Stress', te: 'నీటి ఒత్తిడి', hi: 'जल तनाव' },
  fertilizer: { en: 'Fertilizer', te: 'ఎరువులు', hi: 'उर्वरक' },
  directBuyers: { en: 'Direct Buyers', te: 'ప్రత్యక్ష కొనుగోలు', hi: 'सीधे खरीदार' },
  cropCalendar: { en: 'Crop Calendar', te: 'పంట క్యాలెండర్', hi: 'फसल कैलेंडर' },
  alertBot: { en: 'Alert Bot', te: 'హెచ్చరిక బాట్', hi: 'अलर्ट बॉट' },
  about: { en: 'About', te: 'గురించి', hi: 'के बारे में' },
  dataSources: { en: 'Data Sources', te: 'డేటా వనరులు', hi: 'डेटा स्रोत' },
  farmerScore: { en: 'Farmer Score', te: 'రైతు స్కోర్', hi: 'किसान स्कोर' },
  aiPowered: { en: 'AI-Powered', te: 'AI-ఆధారిత', hi: 'एआई संचालित' },
  liveData: { en: 'Live Data', te: 'లైవ్ డేటా', hi: 'लाइव डेटा' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
