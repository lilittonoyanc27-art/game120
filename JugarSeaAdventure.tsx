import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Anchor, 
  Ship, 
  Waves as WavesIcon, 
  User, 
  Trophy, 
  Compass, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Zap,
  Wind
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---

interface Question {
  id: number;
  sentence: string;
  translation: string;
  options: string[];
  correct: string;
}

// --- Data: 20 Questions (Jugar Conjugations) ---

const QUESTIONS: Question[] = [
  { id: 1, sentence: "Yo ____ al fútbol en el parque.", translation: "Ես այգում ֆուտբոլ եմ խաղում:", options: ["juego", "juegas", "juega"], correct: "juego" },
  { id: 2, sentence: "Tú ____ al tenis muy bien.", translation: "Դու շատ լավ թենիս ես խաղում:", options: ["juego", "juegas", "jugamos"], correct: "juegas" },
  { id: 3, sentence: "Él ____ a los videojuegos.", translation: "Նա վիդեոխաղեր է խաղում:", options: ["juega", "juego", "juegan"], correct: "juega" },
  { id: 4, sentence: "Nosotros ____ al escondite.", translation: "Մենք պահմտոցի ենք խաղում:", options: ["jugamos", "jugáis", "juegan"], correct: "jugamos" },
  { id: 5, sentence: "Ellos ____ al ajedrez los domingos.", translation: "Նրանք կիրակի օրերին շախմատ են խաղում:", options: ["juegan", "juega", "jugamos"], correct: "juegan" },
  { id: 6, sentence: "¿____ tú al póker con tus amigos?", translation: "Դու ընկերներիդ հետ պոկեր խաղո՞ւմ ես:", options: ["Juego", "Juegas", "Juega"], correct: "Juegas" },
  { id: 7, sentence: "Mi hermano ____ en el equipo local.", translation: "Եղբայրս խաղում է տեղական թիմում:", options: ["juega", "juego", "jugamos"], correct: "juega" },
  { id: 8, sentence: "Ustedes ____ muy profesionalmente.", translation: "Դուք (հոգնակի) շատ պրոֆեսիոնալ եք խաղում:", options: ["juegan", "juega", "jugamos"], correct: "juegan" },
  { id: 9, sentence: "Yo ____ con mi perro por la mañana.", translation: "Ես առավոտյան խաղում եմ շանս հետ:", options: ["juego", "juegas", "juega"], correct: "juego" },
  { id: 10, sentence: "Vosotros ____ al baloncesto ahora.", translation: "Դուք (Իսպանիայում) հիմա բասկետբոլ եք խաղում:", options: ["jugamos", "jugáis", "juegan"], correct: "jugáis" },
  { id: 11, sentence: "Los niños ____ en la arena de la playa.", translation: "Երեխաները խաղում են լողափի ավազի վրա:", options: ["juegan", "juega", "jugamos"], correct: "juegan" },
  { id: 12, sentence: "Ella ____ al voleibol en la escuela.", translation: "Նա դպրոցում վոլեյբոլ է խաղում:", options: ["juega", "juego", "juegas"], correct: "juega" },
  { id: 13, sentence: "Nosotros un partido importante.", translation: "Մենք կարևոր մրցախաղ ենք խաղում:", options: ["jugamos", "jugáis", "juegan"], correct: "jugamos" },
  { id: 14, sentence: "Usted ____ al golf los fines de semana.", translation: "Դուք (հարգալից) հանգստյան օրերին գոլֆ եք խաղում:", options: ["juega", "juego", "juegas"], correct: "juega" },
  { id: 15, sentence: "María y Juan ____ a las cartas.", translation: "Մարիան և Խուանը թղթախաղ են խաղում:", options: ["juegan", "juega", "juego"], correct: "juegan" },
  { id: 16, sentence: "Yo ____ por la tarde cuando termino.", translation: "Ես խաղում եմ կեսօրից հետո, երբ ավարտում եմ:", options: ["juego", "juegas", "juega"], correct: "juego" },
  { id: 17, sentence: "¿____ tú conmigo?", translation: "Խաղո՞ւմ ես հետս:", options: ["Juego", "Juegas", "Juega"], correct: "Juegas" },
  { id: 18, sentence: "El gato ____ con la lana.", translation: "Կատուն խաղում է բրդի հետ:", options: ["juega", "juego", "juegan"], correct: "juega" },
  { id: 19, sentence: "Usted ____ al dominó.", translation: "Դուք դոմինո եք խաղում:", options: ["juega", "juego", "juegas"], correct: "juega" },
  { id: 20, sentence: "Nosotros ____ a los bolos.", translation: "Մենք բոուլինգ ենք խաղում:", options: ["jugamos", "jugáis", "juegan"], correct: "jugamos" }
];

// --- Components ---

const SeaBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <motion.div 
      animate={{ x: [0, -100, 0] }}
      transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      className="absolute bottom-[-10%] left-[-10%] w-[120%] h-[30%] opacity-20"
    >
       <WavesIcon size={600} className="text-blue-500" />
    </motion.div>
    <motion.div 
      animate={{ x: [0, 100, 0] }}
      transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      className="absolute bottom-[-5%] right-[-10%] w-[120%] h-[30%] opacity-10"
    >
       <WavesIcon size={800} className="text-cyan-500" />
    </motion.div>
    <div className="absolute top-[20%] left-[5%] opacity-5 rotate-12"><Compass size={300} /></div>
    <div className="absolute top-[10%] right-[10%] opacity-5 -rotate-12"><Anchor size={250} /></div>
  </div>
);

const NavalPlayer = ({ name, color, isActive, sail, score }: { 
  name: string; 
  color: string; 
  isActive: boolean; 
  sail: boolean;
  score: number;
}) => (
  <div className="flex flex-col items-center gap-4 relative">
    <motion.div 
      animate={{ 
        y: sail ? -50 : (isActive ? [0, -10, 0] : 0),
        rotate: isActive ? [-1, 1, -1] : 0
      }}
      transition={{ 
        y: sail ? { type: "spring", stiffness: 200 } : { repeat: Infinity, duration: 2 },
        rotate: { repeat: Infinity, duration: 3 }
      }}
      className={`w-32 h-32 md:w-40 md:h-40 relative flex items-center justify-center`}
    >
       {/* Ship Shape */}
       <div className={`absolute inset-0 ${color} rounded-b-[60px] rounded-t-lg border-b-8 border-black/20 shadow-2xl overflow-hidden`}>
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10" />
          <div className="flex flex-col items-center justify-center h-full pt-4">
             <User size={60} className="text-white opacity-80" />
          </div>
       </div>
       
       {/* Mast */}
       <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-2 h-14 bg-stone-800 rounded-full" />
       
       {/* Sail */}
       <motion.div 
         animate={{ skewX: isActive ? [-5, 5, -5] : 0 }}
         transition={{ repeat: Infinity, duration: 2 }}
         className="absolute -top-10 left-1/2 -translate-x-full w-12 h-10 bg-white rounded-l-md border-r-2 border-stone-300" 
       />

       {/* Name Tag */}
       <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-lg bg-black/60 backdrop-blur-sm`}>
         {name}
       </div>
    </motion.div>

    {/* Ship Score */}
    <div className="bg-stone-900 border border-stone-800 px-6 py-2 rounded-2xl shadow-xl z-20">
       <span className="text-2xl font-black italic text-cyan-400">{score}</span>
    </div>

    {sail && (
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 0.5], y: -80 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 text-cyan-400 pointer-events-none"
      >
        <Wind size={40} />
      </motion.div>
    )}
  </div>
);

export default function JugarSeaAdventure() {
  const [view, setView] = useState<'intro' | 'play' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState({ Gor: 0, Gayane: 0 });
  const [turn, setTurn] = useState<'Gor' | 'Gayane'>('Gor');
  const [feedback, setFeedback] = useState<{ correct: boolean } | null>(null);
  const [isSailing, setIsSailing] = useState(false);

  const startLevel = () => {
    setView('play');
    setCurrentIdx(0);
    setScores({ Gor: 0, Gayane: 0 });
    setTurn('Gor');
    setFeedback(null);
  };

  const handleAnswer = (opt: string) => {
    if (feedback) return;
    const isCorrect = opt === QUESTIONS[currentIdx].correct;
    
    if (isCorrect) {
      setScores(s => ({ ...s, [turn]: s[turn] + 1 }));
      setIsSailing(true);
      setTimeout(() => setIsSailing(false), 800);
    }
    
    setFeedback({ correct: isCorrect });

    setTimeout(() => {
      if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx(c => c + 1);
        setTurn(t => t === 'Gor' ? 'Gayane' : 'Gor');
        setFeedback(null);
      } else {
        setView('result');
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#06b6d4', '#3b82f6', '#ffffff'] });
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      
      <SeaBackground />

      <AnimatePresence mode="wait">

        {/* INTRO */}
        {view === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -50 }}
            className="z-10 text-center space-y-12 max-w-xl"
          >
            <div className="space-y-6">
              <div className="flex justify-center gap-12">
                 <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ repeat: Infinity, duration: 4 }}
                   className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.3)] border-b-4 border-blue-900"
                 >
                    <Ship size={50} className="text-white" />
                 </motion.div>
                 <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ repeat: Infinity, duration: 4, delay: 0.5 }}
                   className="w-24 h-24 rounded-3xl bg-cyan-600 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)] border-b-4 border-cyan-900"
                 >
                    <Ship size={50} className="text-white" />
                 </motion.div>
              </div>
              <div className="space-y-2">
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white drop-shadow-2xl">
                  Jugar <span className="text-cyan-400">Voyage</span>
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[1em] text-cyan-500/50">Sea Adventure</p>
              </div>
              <p className="text-slate-400 font-bold italic text-lg max-w-md mx-auto leading-relaxed">
                Գոռը և Գայանեն մեկնում են իսկական ծովային արկածի: Ընտրե՛ք "Jugar" բայի ճիշտ ձևը և ուղղեք առագաստները:
              </p>
            </div>

            <button 
              onClick={startLevel}
              className="w-full py-8 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-[40px] font-black text-3xl uppercase italic tracking-tighter shadow-3xl transition-all active:scale-95 flex items-center justify-center gap-4 border-b-8 border-cyan-900"
            >
              Մեկնել Արկածի <ArrowRight size={32} />
            </button>
          </motion.div>
        )}

        {/* PLAY */}
        {view === 'play' && (
          <motion.div 
            key="play"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="z-10 w-full max-w-4xl flex flex-col items-center gap-12"
          >
            {/* Voyage Progress */}
            <div className="w-full flex items-center gap-4 px-4 h-12">
               <Compass className="text-cyan-500 animate-spin-slow" size={24} />
               <div className="flex-1 bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                  <motion.div 
                    animate={{ width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                  />
               </div>
               <div className="text-[10px] font-black uppercase tracking-widest text-cyan-500">
                  {currentIdx + 1} / {QUESTIONS.length}
               </div>
            </div>

            {/* Naval Stage */}
            <div className="flex justify-between items-end w-full max-w-3xl px-8 h-64 md:h-80 relative">
               <NavalPlayer 
                 name="Gor" 
                 color="bg-blue-600" 
                 isActive={turn === 'Gor'} 
                 sail={turn === 'Gor' && isSailing}
                 score={scores.Gor}
               />
               
               {/* Middle Decor: Lighthouse or Buoy? */}
               <div className="pb-10 opacity-30">
                  <Anchor size={48} className="text-slate-700 animate-pulse" />
               </div>

               <NavalPlayer 
                 name="Gayane" 
                 color="bg-cyan-600" 
                 isActive={turn === 'Gayane'} 
                 sail={turn === 'Gayane' && isSailing}
                 score={scores.Gayane}
               />
            </div>

            {/* Vessel Orders (Question Card) */}
            <div className="w-full bg-slate-900/50 backdrop-blur-xl border-4 border-slate-800 p-8 md:p-12 rounded-[60px] space-y-6 text-center shadow-4xl relative">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Ship size={100} /></div>
               <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white leading-tight">
                 {QUESTIONS[currentIdx].sentence.split('____').map((part, i) => (
                   <span key={i}>
                     {part}
                     {i === 0 && <span className="text-cyan-400 underline decoration-4 md:decoration-8 underline-offset-[8px] md:underline-offset-[12px]">____</span>}
                   </span>
                 ))}
               </h2>
               <p className="text-cyan-200/60 font-bold italic text-lg md:text-xl">
                 {QUESTIONS[currentIdx].translation}
               </p>
            </div>

            {/* Navigation Choices (Options) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4">
               {QUESTIONS[currentIdx].options.map(opt => {
                 const isCorrectStatus = opt === QUESTIONS[currentIdx].correct;
                 return (
                   <button
                     key={opt}
                     disabled={!!feedback}
                     onClick={() => handleAnswer(opt)}
                     className={`
                       py-6 md:py-8 rounded-[40px] font-black text-3xl uppercase italic tracking-tighter transition-all border-b-[8px]
                       ${feedback 
                         ? (isCorrectStatus ? 'bg-cyan-600 border-cyan-900 text-slate-950 scale-105 shadow-2xl' : 'bg-slate-900 border-slate-950 opacity-20')
                         : 'bg-slate-800 border-slate-950 text-white hover:bg-slate-700 active:translate-y-2 active:border-b-0'
                       }
                     `}
                   >
                     {opt}
                   </button>
                 );
               })}
            </div>
            
            {/* Feedback HUD */}
            <div className="h-10">
               {feedback && (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                   className={`flex items-center gap-3 font-black uppercase text-xs tracking-[0.3em] ${feedback.correct ? 'text-cyan-400' : 'text-slate-600'}`}
                 >
                    {feedback.correct ? <Sparkles size={16} /> : <Zap size={16} />}
                    {feedback.correct ? "Full Sail!" : "Wrong Course"}
                 </motion.div>
               )}
            </div>
          </motion.div>
        )}

        {/* RESULT */}
        {view === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="z-10 text-center space-y-12 max-w-lg w-full"
          >
            <div className="relative inline-block">
               <Trophy size={160} className="text-yellow-500 drop-shadow-[0_0_60px_rgba(234,179,8,0.4)] animate-bounce" />
               <motion.div 
                 animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                 className="absolute inset-0 border-4 border-dashed border-cyan-500/20 rounded-full scale-125" 
               />
            </div>

            <div className="bg-slate-900/80 border border-slate-800 p-12 rounded-[70px] space-y-8 backdrop-blur-3xl shadow-4xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />
               <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">Voyage Ended</h2>
               
               <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 rounded-[40px] bg-blue-600/10 border border-blue-500/20">
                     <p className="text-[10px] font-black uppercase text-blue-400 mb-2">Gor's Map</p>
                     <p className="text-7xl font-black italic">{scores.Gor}</p>
                  </div>
                  <div className="p-8 rounded-[40px] bg-cyan-600/10 border border-cyan-500/20">
                     <p className="text-[10px] font-black uppercase text-cyan-400 mb-2">Gayane's Map</p>
                     <p className="text-7xl font-black italic">{scores.Gayane}</p>
                  </div>
               </div>

               <div className="bg-white/5 p-8 rounded-[40px] border border-white/5">
                  <p className="text-2xl font-black italic text-cyan-300 leading-tight">
                    {scores.Gor > scores.Gayane ? "⚓ Գոռը ծովերի իսկական տիրակալն է: Հրաշալի վոյաժ:" : 
                     scores.Gayane > scores.Gor ? "🏝️ Գայանեն գտավ բոլոր թաքնված կղզիները: Հաղթանակ:" : 
                     "🌊 Միասին դուք աննկարագրելի թիմ եք: Ոչ-ոքի:"}
                  </p>
               </div>
            </div>

            <button 
              onClick={() => setView('intro')}
              className="w-full py-9 bg-white text-slate-950 rounded-[50px] font-black text-4xl uppercase italic tracking-tighter shadow-3xl active:scale-95 transition-all flex items-center justify-center gap-4"
            >
              Sail Again <RotateCcw size={40} />
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      <footer className="fixed bottom-10 opacity-10 pointer-events-none text-center">
         <p className="text-[10px] font-black uppercase tracking-[1.5em] text-cyan-500">Jugar Naval Expedition</p>
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
      `}</style>
    </div>
  );
}
