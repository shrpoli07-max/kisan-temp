import { useState, useRef, useEffect } from 'react';
import { useLanguage } from './LanguageContext';
import { Send, Bot, User, Mic } from 'lucide-react';
import { Button } from './button';

interface Message {
  from: 'bot' | 'user';
  text: string;
  time: string;
}

const initialMessages: { en: Message[]; te: Message[]; hi: Message[] } = {
  en: [
    { from: 'bot', text: '🌾 Welcome to Kisan IQ Alerts! I\'ll keep you updated on weather, prices, and crop health.', time: '9:00 AM' },
    { from: 'bot', text: '🌧️ WEATHER ALERT: Heavy rain (80mm) expected Thursday in your area. Delay irrigation and cover harvested crops.', time: '9:01 AM' },
    { from: 'bot', text: '📈 PRICE ALERT: Tomato prices at Warangal mandi up 12% this week. Current: ₹3,400/qtl. Consider selling within 3 days.', time: '9:02 AM' },
    { from: 'bot', text: '🐛 DISEASE ALERT: Leaf blight reported in 3 farms near you. Inspect your tomato and chilli crops. Neem oil spray recommended.', time: '9:05 AM' },
    { from: 'bot', text: '💰 SCHEME ALERT: PM-KISAN 15th installment released. Check your bank account for ₹2,000 credit.', time: '10:30 AM' },
  ],
  te: [
    { from: 'bot', text: '🌾 కిసాన్ IQ హెచ్చరికలకు స్వాగతం! వాతావరణం, ధరలు, పంట ఆరోగ్యం గురించి నవీకరణలు అందిస్తాను.', time: '9:00 AM' },
    { from: 'bot', text: '🌧️ వాతావరణ హెచ్చరిక: గురువారం మీ ప్రాంతంలో భారీ వర్షం (80mm). నీటిపారుదల ఆపి, కోసిన పంటలను కప్పండి.', time: '9:01 AM' },
    { from: 'bot', text: '📈 ధర హెచ్చరిక: వరంగల్ మండి టమాటా ధరలు 12% పెరిగాయి. ప్రస్తుతం: ₹3,400/క్వి. 3 రోజుల్లో అమ్మడం ఆలోచించండి.', time: '9:02 AM' },
    { from: 'bot', text: '🐛 వ్యాధి హెచ్చరిక: మీ సమీపంలో 3 పొలాల్లో ఆకు ఎండు తెగులు. టమాటా, మిర్చి పంటలు తనిఖీ చేయండి. వేప నూనె స్ప్రే సిఫారసు.', time: '9:05 AM' },
    { from: 'bot', text: '💰 పథకం హెచ్చరిక: PM-KISAN 15వ విడత విడుదల. ₹2,000 క్రెడిట్ కోసం మీ బ్యాంక్ ఖాతా తనిఖీ చేయండి.', time: '10:30 AM' },
  ],
  hi: [
    { from: 'bot', text: '🌾 किसान IQ अलर्ट्स में आपका स्वागत है! मैं आपको मौसम, कीमतों और फसल स्वास्थ्य पर अपडेट रखूंगा।', time: '9:00 AM' },
    { from: 'bot', text: '🌧️ मौसम अलर्ट: आपके क्षेत्र में गुरुवार को भारी बारिश (80 मिमी) की उम्मीद है। सिंचाई में देरी करें और कटी हुई फसलों को ढक दें।', time: '9:01 AM' },
    { from: 'bot', text: '📈 मूल्य अलर्ट: इस सप्ताह वारंगल मंडी में टमाटर की कीमतों में 12% की वृद्धि। वर्तमान: ₹3,400/क्विंटल। 3 दिनों के भीतर बेचने पर विचार करें।', time: '9:02 AM' },
    { from: 'bot', text: '🐛 रोग अलर्ट: आपके पास 3 खेतों में पत्ती झुलसने की सूचना है। अपनी टमाटर और मिर्च की फसलों का निरीक्षण करें। नीम के तेल के स्प्रे की सिफारिश की जाती है।', time: '9:05 AM' },
    { from: 'bot', text: '💰 योजना अलर्ट: पीएम-किसान 15वीं किस्त जारी। ₹2,000 क्रेडिट के लिए अपने बैंक खाते की जाँच करें।', time: '10:30 AM' },
  ],
};

import { crops } from './utils/crops';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = (reader.result as string).split(',')[1];
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const fetchGemini = async (messagesHistory: Message[], newText: string, lang: 'en' | 'te' | 'hi', audioBase64?: string) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return lang === 'en' ? "API Key missing! Check .env." : lang === 'hi' ? "API कुंजी गायब है! कृपया .env की जाँच करें।" : "API కీ లేదు! దయచేసి .envని తనిఖీ చేయండి.";

    // Filter out the static mock notification alerts to preserve correct user/model sequencing
    const validHistory = messagesHistory.filter(m => 
      !initialMessages.en.includes(m) && 
      !initialMessages.te.includes(m) && 
      !initialMessages.hi.includes(m)
    );

    const contents = validHistory.map(msg => ({
      role: msg.from === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));
    
    // Sometimes the bot might fail to respond, meaning two 'user' messages could stack.
    // Gemini strictly requires alternating roles. For safety, just extract the last few alternating ones or just push the current.
    // The easiest robust fix is to just send the new user query as the leading prompt context.
    
    const safeContents: any[] = [{ role: 'user', parts: [{ text: newText }] }];
    
    if (audioBase64) {
      safeContents[0].parts.push({
        inlineData: { mimeType: "audio/webm", data: audioBase64 }
      });
    }

    const systemInstruction = lang === 'en' 
      ? "You are Kisan IQ Alert Bot, an AI expert in Indian agriculture. Help farmers with concise, culturally sensitive answers regarding crops, weather, diseases, and market prices. Keep answers well formatted, helpful, and use emojis."
      : lang === 'hi'
      ? "आप किसान IQ अलर्ट बॉट हैं, भारतीय कृषि में एक AI विशेषज्ञ। किसानों को फसलों, मौसम, बीमारियों और बाजार की कीमतों के बारे में स्पष्ट, सांस्कृतिक रूप से संवेदनशील उत्तरों के साथ मदद करें। कृपया हमेशा केवल हिंदी में बोलें और इमोजी का प्रयोग करें।"
      : "మీరు కిసాన్ IQ అలర్ట్ బాట్, భారతీయ వ్యవసాయంలో AI నిపుణులు. రైతుల కోసం పంటలు, వాతావరణం, వ్యాధులు, మార్కెట్ ధరల గురించి స్పష్టమైన సమాధానాలు ఇవ్వండి. దయచేసి ఎల్లప్పుడూ తెలుగులో మాత్రమే మాట్లాడండి. ఎమోజీలు వాడండి.";

    let finalSystemInstruction = systemInstruction;
    if (audioBase64) {
      finalSystemInstruction += " IMPORTANT: You have been provided with an audio file of the user speaking. You MUST prefix your response exactly with <TRANSCRIPT>the exact transcribed text of what the user said</TRANSCRIPT> followed immediately by <REPLY>your actual helpful response to the user</REPLY>. Do not fail to include these tags.";
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: finalSystemInstruction }] },
        contents: safeContents
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'en' 
      ? "⚠️ Sorry, I'm having trouble connecting to my AI brain. Please check your network or API settings."
      : lang === 'hi'
      ? "⚠️ क्षमा करें, मुझे अपने AI मस्तिष्क से जुड़ने में परेशानी हो रही है। कृपया अपना नेटवर्क जांचें।"
      : "⚠️ క్షమించండి, నా AI మెదడుకు కనెక్ట్ కావడంలో ఇబ్బంది పడుతున్నాను. దయచేసి మీ నెట్‌వర్క్ తనిఖీ చేయండి.";
  }
};

export default function AlertBot() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>(initialMessages[language]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const speakText = (text: string, currentLang: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'en' ? 'en-IN' : currentLang === 'hi' ? 'hi-IN' : 'te-IN';
    // Use fallback to regional voice approximations if needed natively
    window.speechSynthesis.speak(utterance);
  };

  const startListening = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const base64Data = await blobToBase64(audioBlob);
        
        // Stop stream tracks
        stream.getTracks().forEach(track => track.stop());
        
        const audioMsgText = language === 'en' ? "🎤 Voice Recording Attached..." : language === 'hi' ? "🎤 ध्वनि रिकॉर्डिंग संलग्न..." : "🎤 వాయిస్ రికార్డింగ్ జతచేయబడింది...";
        sendMessage(audioMsgText, base64Data);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error("Microphone Error:", err);
      alert("Microphone Error: " + err.message + ". Please verify hardware and app permissions.");
      setIsRecording(false);
    }
  };

  useEffect(() => {
    setMessages(initialMessages[language]);
  }, [language]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (overrideText?: string, audioBase64?: string) => {
    const userText = overrideText && typeof overrideText === 'string' ? overrideText : input;
    if (!userText.trim() && !audioBase64) return;
    
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = { from: 'user', text: userText, time: now };
    
    if (!overrideText || typeof overrideText !== 'string') setInput('');
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const reply = await fetchGemini(messages, userText, language as 'en'|'te'|'hi', audioBase64);
    
    let finalBotReply = reply;
    
    if (audioBase64) {
      const matchTranscript = reply.match(/<TRANSCRIPT>(.*?)<\/TRANSCRIPT>/si);
      const matchReply = reply.match(/<REPLY>(.*?)<\/REPLY>/si);
      
      if (matchTranscript) {
        const extractedText = matchTranscript[1].trim();
        finalBotReply = matchReply ? matchReply[1].trim() : reply.replace(/<TRANSCRIPT>.*?<\/TRANSCRIPT>/si, "").trim();
        
        // Overwrite the placeholder user message with the newly transcribed text
        setMessages(prev => {
          const newMessages = [...prev];
          for (let i = newMessages.length - 1; i >= 0; i--) {
            if (newMessages[i].from === 'user') {
              newMessages[i].text = `🎤 "${extractedText}"`;
              break;
            }
          }
          return newMessages;
        });
      }
    }

    setIsTyping(false);
    const replyNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { from: 'bot', text: finalBotReply, time: replyNow }]);
    
    // Auto-read response in selected language
    speakText(finalBotReply, language);
  };

  return (
    <div className="flex flex-col md:ml-60" style={{ height: 'calc(100vh - 8rem)' }}>
      <h2 className="font-display text-xl font-bold mb-2">
        {language === 'en' ? '🤖 Kisan IQ Alerts' : '🤖 కిసాన్ IQ హెచ్చరికలు'}
      </h2>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-3 rounded-xl border border-border bg-muted/30 p-3 mb-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.from === 'user' ? 'justify-end' : ''}`}>
            {msg.from === 'bot' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
              msg.from === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
            }`}>
              <p className="whitespace-pre-line">{msg.text}</p>
              <p className={`mt-1 text-[10px] ${msg.from === 'user' ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{msg.time}</p>
            </div>
            {msg.from === 'user' && (
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                <User className="h-4 w-4 text-secondary" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <div className="max-w-[80%] rounded-xl px-4 py-3 text-sm bg-card border border-border flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"></span>
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <button 
          onClick={startListening}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
            isRecording ? 'bg-danger text-danger-foreground animate-pulse' : 'bg-muted text-muted-foreground hover:bg-accent'
          }`}
        >
          <Mic className="h-5 w-5" />
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder={language === 'en' ? 'Type price, weather, sell...' : 'price, weather, sell టైప్ చేయండి...'}
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button size="icon" onClick={() => sendMessage()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
