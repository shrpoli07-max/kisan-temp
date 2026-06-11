# 🏆 Kisan IQ Hackathon Master Guide

You have built a truly competitive, high-barrier-to-entry application. The key to winning is **not just showing code**, but selling the *impact*, the *accessibility*, and the *cutting-edge workarounds* (like the multimodal audio bypass).

---

## 📽️ The Demo Video Script (2 Minutes - High Energy)

**[0:00 - 0:10] The Hook (Slide/Screen: High-level problem statement)**
*Speaker:* "Farmers across India lose billions annually due to reactive farming—finding out about diseases too late, missing out on hyper-local government subsidies, and struggling with complex apps in languages they don't speak. Meet **Kisan IQ**: a proactive, AI-native, multi-lingual farming operating system."

**[0:10 - 0:40] Feature 1: The Context Engine & Schemes (Screen: Onboarding & Schemes)**
*Speaker:* "Our platform builds a dynamic `FarmerContext` from day one. I select my state, district, and land size. Instantly, our **Schemes Matcher Engine** bypasses generic advice and calculates exactly what regional and central subsidies I qualify for. Notice how it instantly filters *YSR Rythu Bharosa* because my profile is mapped to Andhra Pradesh."

**[0:40 - 1:10] Feature 2: Multimodal Voice AI (Screen: Alert Bot)**
*Speaker:* "But accessibility is the true bottleneck. Keyboard typing isn't intuitive for rural farmers. So, we completely ripped out standard legacy web speech APIs and built a **Multimodal streaming engine**. Watch me click the microphone and speak in natural Telugu/Hindi. *[Do the live mic demo]*. Kisan IQ captures my raw audio blob, streams it securely to Gemini 2.5 Flash which has native 'ears', instantly transcribes it seamlessly on the UI, and speaks the answer back to me in my local dialect."

**[1:10 - 1:40] Feature 3: Actionable Predictors (Screen: Disease & Crop Ranker)**
*Speaker:* "But we go beyond chat. The **Crop Ranker** evaluates complex multi-variable indices—matching my specific soil type with current market data to rank the most profitable crops. And if a crop looks sick? The **Disease Detector** allows farmers to upload photos for instant AI inference, confidence scores, and recommended chemical treatments."

**[1:40 - 2:00] The Close**
*Speaker:* "Kisan IQ isn't just a dashboard. It’s an accessible, voice-first, highly scalable ecosystem designed for the next billion users in Indian agriculture. Thank you."

---

## 🎤 The Presentation Strategy (Jury Q&A Flexes)

When presenting to the judges, strategically highlight these technical flexes:

1. **"The Voice-Bot Architecture Flex"** 
   *If they ask about the AI:* Mention that you didn't just use a basic text API wrapper. Explain how browser speech-to-text plugins break on secure browsers like Brave. Explain that you engineered a custom `MediaRecorder` hook that encodes W3C standard raw audio blobs into Base64 and forces Gemini's multimodal engine to natively "listen" to the wavelength, making your app 100% browser-agnostic.
2. **"The Localization Flex"**
   *If they ask about scaling:* Explain that you built a rigid Global State (`FarmerContext`) fed by a highly structured master JSON mapping every single State and District in India. The AI acts on this context, making predictions dynamically hyper-local.
3. **"The Supabase Database Flex"**
   *If they ask about data:* Point out your `utils/supabase.ts` integration showing that data isn't just hardcoded; it's architected around a scalable PostgreSQL cloud instance.

---

## 🛠️ The "Last Mile" Finishing Touches Checklist

Before you hit record or walk on stage, check off these items so you don't crash live:

> [!WARNING]
> **Live Demo Golden Rule:** Never rely on live typing. Copy/paste from a notepad, or use the voice recorder for maximum impact.

- `[ ]` **Clear Local Storage:** Right-click > Inspect > Application > Local Storage. Delete everything so you start the demo at the pristine `OnboardingModal` step!
- `[ ]` **Microphone Permissions Check:** Do a dry run of the mic button. Ensure the `🎤 "transcript"` perfectly replaces the placeholder.
- `[ ]` **Hide the Keys:** Make sure your `.env` file is NOT visible in the codebase if you open VSCode to show the judges your code.
- `[ ]` **Responsive Check:** Open Chrome DevTools, click the Mobile/Tablet view icon. Make sure the Disease Detector camera button and the voice bot microphone button don't look broken on a mobile screen. Judges *love* mobile-first Agri-tech.
- `[ ]` **Pre-fetch Images:** If your UI uses heavy images, load the app once before the jury arrives so the images format instantly from the browser cache.
- `[ ]` **Restart Vite:** Run `npm run dev` fresh to ensure no memory leaks crash the local server mid-demo.
