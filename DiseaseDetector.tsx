import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Upload, Camera, AlertCircle, Leaf, FlaskConical, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { detectDisease, type DiagnosisResult } from './utils/diseaseEngine';

export default function DiseaseDetector() {
  const { t, language } = useLanguage();
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      setPreview(reader.result as string);
      setResult(null);
      setAnalyzing(true);
      setProgress(0);
      
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 90) return 90;
          return p + Math.random() * 15;
        });
      }, 200);

      try {
        // Simulate AI progress/network delay
        await new Promise(res => setTimeout(res, 1800));
        const diagnosis = await detectDisease(file);
        
        clearInterval(interval);
        setProgress(100);
        setResult(diagnosis);
      } catch (error) {
        clearInterval(interval);
        setProgress(0);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5 md:ml-60">
      <div className="animate-float-up">
        <h2 className="font-display text-xl font-bold">{t('diseaseDetector')}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'en' ? 'Upload a photo of your crop leaf for AI-powered diagnosis' : 'AI-ఆధారిత నిర్ధారణ కోసం మీ పంట ఆకు ఫోటోను అప్‌లోడ్ చేయండి'}
        </p>
      </div>

      {/* Upload area */}
      <div
        className="kisan-card-glass flex flex-col items-center justify-center gap-4 border-2 border-dashed border-primary/30 py-12 cursor-pointer transition-all hover:bg-accent/30 hover:border-primary/50 animate-float-up stagger-1"
        onClick={() => fileRef.current?.click()}
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        {preview ? (
          <img src={preview} alt="Crop" className="max-h-52 rounded-xl object-contain shadow-md" />
        ) : (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold">{t('uploadImage')}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'en' ? 'Take a clear photo of the affected leaf' : 'ప్రభావిత ఆకు యొక్క స్పష్టమైన ఫోటో తీయండి'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Analyzing state */}
      {analyzing && (
        <div className="kisan-card-glass flex flex-col items-center gap-4 py-8 animate-scale-up">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <div className="absolute inset-2 flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary animate-pulse" />
            </div>
          </div>
          <div className="w-full max-w-xs space-y-2">
            <Progress value={Math.min(progress, 100)} className="h-2" />
            <p className="text-center text-sm font-medium text-muted-foreground">
              {progress < 30 ? (language === 'en' ? 'Scanning image...' : 'చిత్రం స్కాన్ చేస్తోంది...') :
               progress < 60 ? (language === 'en' ? 'Identifying patterns...' : 'నమూనాలు గుర్తిస్తోంది...') :
               progress < 90 ? (language === 'en' ? 'Matching disease database...' : 'వ్యాధి డేటాబేస్‌తో సరిపోల్చడం...') :
               (language === 'en' ? 'Generating diagnosis...' : 'నిర్ధారణ రూపొందిస్తోంది...')}
            </p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && !analyzing && (
        <div className="space-y-4">
          {result.confidence < 50 && (
            <div className="kisan-card-glass border border-destructive/50 bg-destructive/5 p-4 rounded-xl flex items-start gap-3 animate-float-up">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive text-sm">
                  {language === 'en' ? 'Low confidence prediction. Result may be inaccurate.' : 'తక్కువ విశ్వాస అంచనా. ఫలితం ఖచ్చితమైనది కాకపోవచ్చు.'}
                </p>
                <p className="text-xs text-destructive/80 mt-1">
                  {language === 'en' ? 'Please try uploading a clearer image of the affected plant area.' : 'దయచేసి ప్రభావిత మొక్క ప్రాంతం యొక్క స్పష్టమైన చిత్రాన్ని అప్‌లోడ్ చేయడానికి ప్రయత్నించండి.'}
                </p>
              </div>
            </div>
          )}
          <div className={`kisan-card-glass border-2 animate-scale-up ${result.confidence < 50 ? 'border-destructive/30' : result.confidence > 80 ? 'border-success/50' : 'border-warning'}`}>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning/10">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold">{result.disease[language]}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{result.description[language]}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="kisan-metric rounded-xl">
                <span className="text-[10px] text-muted-foreground font-medium">{t('severity')}</span>
                <div className="w-full mt-1.5">
                  <Progress value={result.severity} className="h-2.5" />
                </div>
                <span className={`text-base font-bold font-display mt-1 ${result.severity > 70 ? 'text-destructive' : 'text-warning'}`}>
                  {result.severity}%
                </span>
              </div>
              <div className="kisan-metric rounded-xl">
                <span className="text-[10px] text-muted-foreground font-medium">{t('confidence')}</span>
                <span className="text-2xl font-bold font-display text-primary mt-1">{result.confidence}%</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3" /> AI Model
                </span>
              </div>
            </div>
          </div>

          {/* Treatments */}
          <div className="grid gap-3 sm:grid-cols-2 animate-float-up stagger-1">
            <div className="kisan-card-glass border border-success/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                  <Leaf className="h-4 w-4 text-success" />
                </div>
                <h4 className="font-display text-sm font-bold text-success">{t('organic')}</h4>
              </div>
              <p className="text-sm">{result.treatments.organic.name[language]}</p>
              <p className="mt-2 text-xs text-muted-foreground">{t('estimatedCost')}: <span className="font-bold text-foreground">{result.treatments.organic.cost}</span></p>
            </div>
            <div className="kisan-card-glass border border-info/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10">
                  <FlaskConical className="h-4 w-4 text-info" />
                </div>
                <h4 className="font-display text-sm font-bold text-info">{t('chemical')}</h4>
              </div>
              <p className="text-sm">{result.treatments.chemical.name[language]}</p>
              <p className="mt-2 text-xs text-muted-foreground">{t('estimatedCost')}: <span className="font-bold text-foreground">{result.treatments.chemical.cost}</span></p>
            </div>
          </div>

          {/* Prevention tips */}
          <div className="kisan-card-glass animate-float-up stagger-2">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-primary" />
              <h4 className="font-display text-sm font-bold">{language === 'en' ? 'Prevention Tips' : 'నివారణ చిట్కాలు'}</h4>
            </div>
            <div className="space-y-2">
              {result.preventionTips[language].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl bg-muted/40 p-3">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
