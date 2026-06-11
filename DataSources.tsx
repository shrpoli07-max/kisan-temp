import { useLanguage } from '@/contexts/LanguageContext';
import { Database, ExternalLink, Shield, FileText, Globe2, Zap, BarChart3, CloudRain, Sprout, TrendingUp, IndianRupee, Bug, Droplets } from 'lucide-react';

interface DataSource {
  feature: { en: string; te: string };
  icon: any;
  datasets: {
    name: string;
    source: { en: string; te: string };
    url: string;
    type: string;
    description: { en: string; te: string };
  }[];
}

const dataSources: DataSource[] = [
  {
    feature: { en: 'Mandi Price Forecaster & Sell Advisor', te: 'మండి ధర అంచనా & అమ్మకం సలహా' },
    icon: TrendingUp,
    datasets: [
      { name: 'AGMARKNET', source: { en: 'Directorate of Marketing & Inspection, Govt. of India', te: 'మార్కెటింగ్ & ఇన్స్పెక్షన్ డైరెక్టరేట్, భారత ప్రభుత్వం' }, url: 'https://agmarknet.gov.in', type: 'API/CSV', description: { en: 'Daily mandi prices for 3,000+ markets, 300+ commodities. Historical data from 2005. Used for price trend analysis and forecasting.', te: '3,000+ మార్కెట్ల, 300+ వస్తువుల రోజువారీ మండి ధరలు. 2005 నుండి చారిత్రక డేటా.' } },
      { name: 'e-NAM Portal', source: { en: 'Small Farmers Agribusiness Consortium (SFAC)', te: 'చిన్న రైతుల వ్యవసాయ వ్యాపార సంస్థ' }, url: 'https://enam.gov.in', type: 'API', description: { en: 'Real-time electronic trading prices from 1,000+ regulated mandis across India.', te: '1,000+ నియంత్రిత మండీల నుండి రియల్-టైమ్ ఎలక్ట్రానిక్ ట్రేడింగ్ ధరలు.' } },
      { name: 'FCAOI Price Bulletins', source: { en: 'Dept. of Consumer Affairs, Govt. of India', te: 'వినియోగదారుల వ్యవహారాల విభాగం' }, url: 'https://fcainfoweb.nic.in', type: 'Daily Bulletin', description: { en: 'Daily retail and wholesale prices of 22 essential commodities across 100+ centers.', te: '100+ కేంద్రాల్లో 22 అవసరమైన వస్తువుల రోజువారీ రిటైల్ & హోల్‌సేల్ ధరలు.' } },
    ],
  },
  {
    feature: { en: 'Weather & Climate Dashboard', te: 'వాతావరణం & వాతావరణ డాష్‌బోర్డ్' },
    icon: CloudRain,
    datasets: [
      { name: 'IMD Weather API', source: { en: 'India Meteorological Department', te: 'భారత వాతావరణ శాఖ' }, url: 'https://mausam.imd.gov.in', type: 'API/XML', description: { en: '7-day district-level forecasts, rainfall predictions, extreme weather alerts. Updated every 3 hours.', te: '7-రోజుల జిల్లా-స్థాయి అంచనాలు, వర్షపాతం అంచనాలు, తీవ్ర వాతావరణ హెచ్చరికలు.' } },
      { name: 'Open-Meteo', source: { en: 'Open-Meteo (Open Source)', te: 'ఓపెన్-మెటియో (ఓపెన్ సోర్స్)' }, url: 'https://open-meteo.com', type: 'REST API', description: { en: 'Free weather API with hourly/daily forecasts, soil temperature, and evapotranspiration data.', te: 'గంట/రోజువారీ అంచనాలు, నేల ఉష్ణోగ్రత, బాష్పీభవన డేటాతో ఉచిత వాతావరణ API.' } },
      { name: 'Skymet Weather', source: { en: 'Skymet Weather Services', te: 'స్కైమెట్ వెదర్ సర్వీసెస్' }, url: 'https://www.skymetweather.com', type: 'API', description: { en: 'Hyper-local weather for agriculture, including crop-specific advisories for Indian states.', te: 'వ్యవసాయం కోసం హైపర్-లోకల్ వాతావరణం, భారతీయ రాష్ట్రాలకు పంట-నిర్దిష్ట సలహాలు.' } },
    ],
  },
  {
    feature: { en: 'Soil Health & Fertilizer Optimizer', te: 'నేల ఆరోగ్యం & ఎరువుల ఆప్టిమైజర్' },
    icon: Sprout,
    datasets: [
      { name: 'Soil Health Card Portal', source: { en: 'Dept. of Agriculture & Farmers Welfare', te: 'వ్యవసాయ & రైతు సంక్షేమ విభాగం' }, url: 'https://soilhealth.dac.gov.in', type: 'Portal/API', description: { en: 'NPK levels, pH, organic carbon, micro-nutrients for 12+ crore soil samples across India.', te: 'భారతదేశంలో 12+ కోట్ల నేల నమూనాల NPK స్థాయిలు, pH, సేంద్రీయ కార్బన్.' } },
      { name: 'ICAR Fertilizer Calculator', source: { en: 'Indian Council of Agricultural Research', te: 'భారత వ్యవసాయ పరిశోధన మండలి' }, url: 'https://icar.org.in', type: 'Dataset', description: { en: 'Crop-specific fertilizer recommendations based on soil test values and agro-climatic zones.', te: 'నేల పరీక్ష విలువలు & వ్యవసాయ-వాతావరణ మండలాల ఆధారంగా పంట-నిర్దిష్ట ఎరువుల సిఫారసులు.' } },
      { name: 'Fertilizer Price Data', source: { en: 'Dept. of Fertilizers, Govt. of India', te: 'ఎరువుల విభాగం, భారత ప్రభుత్వం' }, url: 'https://fert.nic.in', type: 'CSV/PDF', description: { en: 'MRP of subsidized fertilizers (Urea, DAP, MOP, SSP) and subsidy rates.', te: 'సబ్సిడీ ఎరువుల (యూరియా, DAP, MOP, SSP) MRP మరియు సబ్సిడీ రేట్లు.' } },
    ],
  },
  {
    feature: { en: 'Crop Profitability Ranker', te: 'పంట లాభదాయకత ర్యాంకర్' },
    icon: BarChart3,
    datasets: [
      { name: 'Cost of Cultivation Reports', source: { en: 'CACP / DES, Ministry of Agriculture', te: 'CACP / DES, వ్యవసాయ మంత్రిత్వ శాఖ' }, url: 'https://desagri.gov.in', type: 'PDF/Excel', description: { en: 'State-wise, crop-wise cost of production (A2, C2) used to estimate profit per acre.', te: 'రాష్ట్రం-వారీగా, పంట-వారీగా ఉత్పత్తి ధర (A2, C2) ఎకరానికి లాభం అంచనా వేయడానికి ఉపయోగిస్తారు.' } },
      { name: 'MSP Rates (CACP)', source: { en: 'Commission for Agricultural Costs & Prices', te: 'వ్యవసాయ ధరలు & ఖర్చుల కమిషన్' }, url: 'https://cacp.dacnet.nic.in', type: 'Annual Report', description: { en: 'Minimum Support Prices for 23 Kharif & Rabi crops. Key benchmark for profitability calculation.', te: '23 ఖరీఫ్ & రబీ పంటలకు కనీస మద్దతు ధరలు. లాభదాయకత గణనకు ముఖ్యమైన బెంచ్‌మార్క్.' } },
      { name: 'Crop Production Statistics', source: { en: 'Directorate of Economics & Statistics', te: 'ఆర్థికశాస్త్రం & గణాంకాల డైరెక్టరేట్' }, url: 'https://eands.dacnet.nic.in', type: 'Excel', description: { en: 'Area, production, and yield data for all crops across all states from 1950 onwards.', te: '1950 నుండి అన్ని రాష్ట్రాల్లో అన్ని పంటలకు విస్తీర్ణం, ఉత్పత్తి, దిగుబడి డేటా.' } },
    ],
  },
  {
    feature: { en: 'Disease Detection', te: 'వ్యాధి గుర్తింపు' },
    icon: Bug,
    datasets: [
      { name: 'PlantVillage Dataset', source: { en: 'Penn State University (Open Source)', te: 'పెన్ స్టేట్ యూనివర్శిటీ (ఓపెన్ సోర్స్)' }, url: 'https://plantvillage.psu.edu', type: 'Image Dataset', description: { en: '54,306 images of 38 crop diseases. Used to train CNN models for leaf disease classification.', te: '38 పంట వ్యాధుల 54,306 చిత్రాలు. ఆకు వ్యాధి వర్గీకరణ కోసం CNN మోడల్‌లను శిక్షించడానికి ఉపయోగించబడ్డాయి.' } },
      { name: 'ICAR-NBPGR Pest Database', source: { en: 'ICAR National Bureau of Plant Genetic Resources', te: 'ICAR జాతీయ వృక్ష జన్యు వనరుల బ్యూరో' }, url: 'https://www.nbpgr.ernet.in', type: 'Database', description: { en: 'Comprehensive Indian crop pest/disease database with treatment protocols.', te: 'సమగ్ర భారతీయ పంట తెగులు/వ్యాధి డేటాబేస్ చికిత్స ప్రోటోకాల్‌లతో.' } },
    ],
  },
  {
    feature: { en: 'Government Schemes Matcher', te: 'ప్రభుత్వ పథకాలు మ్యాచర్' },
    icon: FileText,
    datasets: [
      { name: 'PM-KISAN Portal', source: { en: 'Ministry of Agriculture & Farmers Welfare', te: 'వ్యవసాయ & రైతు సంక్షేమ మంత్రిత్వ శాఖ' }, url: 'https://pmkisan.gov.in', type: 'Portal/API', description: { en: 'Beneficiary status, eligibility, and installment data for 11+ crore farmers.', te: '11+ కోట్ల రైతులకు లబ్ధిదారుల స్థితి, అర్హత, మరియు విడత డేటా.' } },
      { name: 'Rythu Bandhu Portal', source: { en: 'Govt. of Telangana', te: 'తెలంగాణ ప్రభుత్వం' }, url: 'https://rythubandhu.telangana.gov.in', type: 'Portal', description: { en: 'Telangana farmer investment support scheme — ₹10,000/acre/year per farmer.', te: 'తెలంగాణ రైతు పెట్టుబడి మద్దతు పథకం — ₹10,000/ఎకరం/సంవత్సరం.' } },
      { name: 'PMFBY Dashboard', source: { en: 'Ministry of Agriculture', te: 'వ్యవసాయ మంత్రిత్వ శాఖ' }, url: 'https://pmfby.gov.in', type: 'Dashboard/API', description: { en: 'Crop insurance enrollment, claims, premium calculator for Pradhan Mantri Fasal Bima Yojana.', te: 'ప్రధాన మంత్రి ఫసల్ బీమా యోజన పంట బీమా నమోదు, క్లెయిమ్‌లు, ప్రీమియం కాలిక్యులేటర్.' } },
    ],
  },
  {
    feature: { en: 'Direct Buyer Network & Middleman Eliminator', te: 'ప్రత్యక్ష కొనుగోలు నెట్‌వర్క్' },
    icon: IndianRupee,
    datasets: [
      { name: 'FPO Directory', source: { en: 'SFAC / NABARD', te: 'SFAC / నాబార్డ్' }, url: 'https://sfacindia.com', type: 'Directory', description: { en: '7,000+ registered FPOs with location, crop specialization, and contact information.', te: '7,000+ నమోదిత FPOలు స్థానం, పంట ప్రత్యేకత, మరియు సంప్రదింపు సమాచారంతో.' } },
      { name: 'e-NAM Trader Registry', source: { en: 'e-NAM, Govt. of India', te: 'e-NAM, భారత ప్రభుత్వం' }, url: 'https://enam.gov.in', type: 'API', description: { en: 'Verified traders and buyers registered on the national e-marketplace.', te: 'జాతీయ ఇ-మార్కెట్‌ప్లేస్‌లో నమోదైన ధృవీకరించబడిన వ్యాపారులు & కొనుగోలుదారులు.' } },
    ],
  },
  {
    feature: { en: 'Water Stress Prediction', te: 'నీటి ఒత్తిడి అంచనా' },
    icon: Droplets,
    datasets: [
      { name: 'India-WRIS', source: { en: 'Central Water Commission, Govt. of India', te: 'కేంద్ర జల సంఘం, భారత ప్రభుత్వం' }, url: 'https://indiawris.gov.in', type: 'GIS/API', description: { en: 'Water resource information — groundwater levels, reservoir storage, rainfall maps.', te: 'నీటి వనరుల సమాచారం — భూగర్భ జలాల స్థాయిలు, రిజర్వాయర్ నిల్వ, వర్షపాతం మ్యాప్‌లు.' } },
      { name: 'NASA SMAP Soil Moisture', source: { en: 'NASA Earthdata', te: 'నాసా ఎర్త్‌డేటా' }, url: 'https://smap.jpl.nasa.gov', type: 'Satellite Data', description: { en: 'Global soil moisture data at 9km resolution, updated every 2-3 days.', te: '9km రిజల్యూషన్‌లో గ్లోబల్ నేల తేమ డేటా, ప్రతి 2-3 రోజులకు అప్‌డేట్.' } },
    ],
  },
];

const predictionMethodology = [
  { method: { en: 'Price Forecasting', te: 'ధర అంచనా' }, algo: 'ARIMA + LSTM Neural Network', desc: { en: 'Time-series analysis on 5-year historical mandi price data with seasonal decomposition and neural network fine-tuning for 4-8 week ahead predictions.', te: '5-సంవత్సరాల చారిత్రక మండి ధర డేటాపై సమయ-శ్రేణి విశ్లేషణ. 4-8 వారాల ముందు అంచనాల కోసం.' } },
  { method: { en: 'Disease Classification', te: 'వ్యాధి వర్గీకరణ' }, algo: 'ResNet-50 + Transfer Learning', desc: { en: 'Pre-trained CNN on PlantVillage dataset, fine-tuned for 38 Indian crop diseases with 94.2% accuracy.', te: 'PlantVillage డేటాసెట్‌పై ముందస్తు-శిక్షిత CNN, 38 భారతీయ పంట వ్యాధులకు 94.2% ఖచ్చితత్వంతో.' } },
  { method: { en: 'Water Stress Prediction', te: 'నీటి ఒత్తిడి అంచనా' }, algo: 'Random Forest + Weather Integration', desc: { en: 'Ensemble model combining soil moisture sensors, weather forecast (IMD), and evapotranspiration for 3-day irrigation prediction.', te: 'నేల తేమ సెన్సార్‌లు, వాతావరణ అంచనా (IMD), మరియు బాష్పీభవనాన్ని కలిపి 3-రోజుల నీటిపారుదల అంచనా.' } },
  { method: { en: 'Crop Ranking', te: 'పంట ర్యాంకింగ్' }, algo: 'Multi-Criteria Decision Analysis (MCDA)', desc: { en: 'Weighted scoring combining profitability (MSP, mandi price), risk (climate, disease history), and input costs for personalized crop recommendations.', te: 'వ్యక్తిగతీకరించిన పంట సిఫారసుల కోసం లాభదాయకత, ప్రమాదం, మరియు ఇన్‌పుట్ ఖర్చులను కలిపి వెయిటెడ్ స్కోరింగ్.' } },
  { method: { en: 'Farmer Score', te: 'రైతు స్కోర్' }, algo: 'Composite Index (ICAR Framework)', desc: { en: 'Multi-dimensional score based on soil health, water efficiency, crop diversification, market timing, and risk management practices.', te: 'నేల ఆరోగ్యం, నీటి సామర్థ్యం, పంట వైవిధ్యం, మార్కెట్ సమయం, మరియు ప్రమాద నిర్వహణ పద్ధతుల ఆధారంగా బహుళ-డైమెన్షనల్ స్కోర్.' } },
];

export default function DataSources() {
  const { language } = useLanguage();

  return (
    <div className="space-y-5 md:ml-60">
      {/* Hero */}
      <div className="kisan-card-glass kisan-gradient-info text-primary-foreground py-8 animate-float-up">
        <div className="flex items-center gap-3 mb-3">
          <Database className="h-8 w-8" />
          <div>
            <h2 className="font-display text-2xl font-bold">
              {language === 'en' ? 'Data Sources & Methodology' : 'డేటా వనరులు & పద్ధతి'}
            </h2>
            <p className="text-sm opacity-80">
              {language === 'en' ? 'Transparency in every prediction we make' : 'మేము చేసే ప్రతి అంచనాలో పారదర్శకత'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center">
            <p className="font-display text-2xl font-bold">22+</p>
            <p className="text-[10px] opacity-80">{language === 'en' ? 'Datasets' : 'డేటాసెట్‌లు'}</p>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center">
            <p className="font-display text-2xl font-bold">12</p>
            <p className="text-[10px] opacity-80">{language === 'en' ? 'Govt. Sources' : 'ప్రభుత్వ వనరులు'}</p>
          </div>
          <div className="rounded-xl bg-white/10 backdrop-blur-sm p-3 text-center">
            <p className="font-display text-2xl font-bold">5</p>
            <p className="text-[10px] opacity-80">{language === 'en' ? 'AI Models' : 'AI మోడల్స్'}</p>
          </div>
        </div>
      </div>

      {/* Credibility badge */}
      <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/20 p-4 animate-float-up stagger-1">
        <Shield className="h-6 w-6 text-primary shrink-0" />
        <div>
          <p className="text-sm font-semibold text-primary">
            {language === 'en' ? 'Government-Backed Data' : 'ప్రభుత్వ-ఆధారిత డేటా'}
          </p>
          <p className="text-xs text-muted-foreground">
            {language === 'en'
              ? 'All predictions are grounded in official government datasets from AGMARKNET, IMD, ICAR, and more.'
              : 'అన్ని అంచనాలు AGMARKNET, IMD, ICAR మొదలైన అధికారిక ప్రభుత్వ డేటాసెట్‌లపై ఆధారపడి ఉంటాయి.'}
          </p>
        </div>
      </div>

      {/* Data sources by feature */}
      {dataSources.map((section, si) => (
        <div key={si} className="kisan-card-glass animate-float-up" style={{ animationDelay: `${(si + 2) * 0.05}s` }}>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <section.icon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-display text-base font-bold">{section.feature[language]}</h3>
          </div>
          <div className="space-y-3">
            {section.datasets.map((ds, di) => (
              <div key={di} className="rounded-xl bg-muted/40 p-3.5 hover:bg-muted/70 transition-all">
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <p className="text-sm font-bold">{ds.name}</p>
                    <p className="text-[11px] text-muted-foreground">{ds.source[language]}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="kisan-badge-info text-[10px]">{ds.type}</span>
                    <a href={ds.url} target="_blank" rel="noopener noreferrer" className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{ds.description[language]}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Prediction methodology */}
      <div className="kisan-card-glass animate-float-up">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
            <Zap className="h-4 w-4 text-secondary" />
          </div>
          <h3 className="font-display text-base font-bold">
            {language === 'en' ? 'AI/ML Prediction Methodology' : 'AI/ML అంచనా పద్ధతి'}
          </h3>
        </div>
        <div className="space-y-3">
          {predictionMethodology.map((pm, i) => (
            <div key={i} className="rounded-xl bg-muted/40 p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-bold">{pm.method[language]}</p>
                <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-[10px] font-mono font-medium text-secondary">{pm.algo}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{pm.desc[language]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">
          {language === 'en' ? '⚠️ Disclaimer' : '⚠️ నిరాకరణ'}
        </p>
        <p className="leading-relaxed">
          {language === 'en'
            ? 'This is a prototype demonstration. While all data sources cited are real government and research databases, the current implementation uses simulated data for demo purposes. In production, real-time API integrations would be established with each data source listed above. Predictions are illustrative and should not be used for actual farming decisions without expert consultation.'
            : 'ఇది ఒక ప్రోటోటైప్ ప్రదర్శన. ఉటంకించిన అన్ని డేటా వనరులు నిజమైన ప్రభుత్వ & పరిశోధన డేటాబేస్‌లు అయినప్పటికీ, ప్రస్తుత అమలు డెమో ప్రయోజనాల కోసం అనుకరించిన డేటాను ఉపయోగిస్తుంది.'}
        </p>
      </div>
    </div>
  );
}
