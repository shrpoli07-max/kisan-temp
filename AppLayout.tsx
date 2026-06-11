import { ReactNode, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Calculator, Bug, Globe, Wifi, WifiOff,
  Sprout, Droplets, FlaskConical, Users, FileText, Calendar,
  MessageCircle, Info, Menu, X, Database, Award, Zap, LogOut
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import OnboardingModal from './OnboardingModal';
import { useFarmer } from './FarmerContext';

const navSections = [
  {
    label: { en: 'Core', te: 'ప్రధాన', hi: 'मुख्य' },
    items: [
      { path: '/', icon: LayoutDashboard, labelKey: 'dashboard' },
      { path: '/sell-advisor', icon: TrendingUp, labelKey: 'sellAdvisor' },
      { path: '/income-simulator', icon: Calculator, labelKey: 'incomeSimulator' },
      { path: '/disease-detector', icon: Bug, labelKey: 'diseaseDetector' },
    ],
  },
  {
    label: { en: 'Farm', te: 'పొలం', hi: 'खेत' },
    items: [
      { path: '/crop-ranker', icon: Sprout, labelKey: 'cropRanker' },
      { path: '/water-stress', icon: Droplets, labelKey: 'waterStress' },
      { path: '/fertilizer', icon: FlaskConical, labelKey: 'fertilizer' },
      { path: '/crop-calendar', icon: Calendar, labelKey: 'cropCalendar' },
    ],
  },
  {
    label: { en: 'Market', te: 'మార్కెట్', hi: 'बाज़ार' },
    items: [
      { path: '/direct-buyers', icon: Users, labelKey: 'directBuyers' },
      { path: '/schemes', icon: FileText, labelKey: 'schemes' },
      { path: '/alerts', icon: MessageCircle, labelKey: 'alertBot' },
    ],
  },
  {
    label: { en: 'More', te: 'మరిన్ని', hi: 'अधिक' },
    items: [
      { path: '/farmer-score', icon: Award, labelKey: 'farmerScore' },
      { path: '/data-sources', icon: Database, labelKey: 'dataSources' },
      { path: '/about', icon: Info, labelKey: 'about' },
    ],
  },
];

const allItems = navSections.flatMap(s => s.items);
const mobileItems = [
  allItems[0], // Dashboard
  allItems[1], // Sell Advisor
  allItems[2], // Income Simulator
  allItems[3], // Disease Detector
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { clearProfile } = useFarmer();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnline] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <OnboardingModal />
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/70 backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-muted/80 transition-colors hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl kisan-gradient-hero shadow-md transition-transform group-hover:scale-105">
                <span className="text-base font-bold text-primary-foreground">🌾</span>
              </div>
              <div className="flex flex-col">
                <h1 className="font-display text-lg font-bold text-foreground leading-none">{t('appName')}</h1>
                <span className="hidden sm:flex items-center gap-1 text-[9px] font-medium text-primary">
                  <Zap className="h-2.5 w-2.5" /> {t('aiPowered')}
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* Live data indicator */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {t('liveData')}
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
              {isOnline ? <Wifi className="h-3 w-3 text-success" /> : <WifiOff className="h-3 w-3 text-danger" />}
              <span className="hidden sm:inline">{t('lastSynced')} 2 {t('minsAgo')}</span>
            </div>
            
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : language === 'hi' ? 'te' : 'en')}
              className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary/20 hover:scale-105"
            >
              <Globe className="h-3.5 w-3.5" />
              {language === 'en' ? 'हिन्दी' : language === 'hi' ? 'తెలుగు' : 'English'}
            </button>
            <button
              onClick={clearProfile}
              className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive transition-all hover:bg-destructive/20 hover:scale-105 ml-1"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{language === 'en' ? 'Logout' : language === 'hi' ? 'लॉग आउट' : 'లాగ్ అవుట్'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-14 bottom-0 w-72 overflow-y-auto border-r border-border/60 bg-card/95 backdrop-blur-xl p-4 shadow-2xl animate-slide-in-left">
            {navSections.map((section, si) => (
              <div key={si} className="mb-5">
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  {section.label[language]}
                </p>
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {t(item.labelKey)}
                    </Link>
                  );
                })}
              </div>
            ))}
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 container py-5 pb-24 md:pb-5">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-card/90 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-around py-1.5">
          {mobileItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-medium transition-all ${
                  isActive ? 'text-primary scale-110' : 'text-muted-foreground'
                }`}
              >
                <div className={`rounded-lg p-1 transition-all ${isActive ? 'bg-primary/10' : ''}`}>
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                </div>
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar nav */}
      <aside className="fixed left-0 top-14 bottom-0 hidden w-60 overflow-y-auto border-r border-border/60 bg-card/50 backdrop-blur-xl md:block">
        <nav className="flex flex-col gap-1 p-4">
          {navSections.map((section, si) => (
            <div key={si} className="mb-4">
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                {section.label[language]}
              </p>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:translate-x-0.5'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </div>
  );
}
