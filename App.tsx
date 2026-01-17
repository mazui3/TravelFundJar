
import React, { useState, useEffect, useMemo } from 'react';
import { UserType, Contribution } from './types';
import { User, DollarSign, Info, Plane, Sun, Moon, Cloud, Flower2, Wind, Building2, Coffee, Lamp, Sparkles, Snowflake } from 'lucide-react';

const M3_TASKS = [
  { id: 'm1', text: 'Eating veggies', freq: 'Daily' },
  { id: 'm2', text: 'Doing something cool', freq: 'Weekly' },
  { id: 'm3', text: 'Studying 8 hours', freq: 'Weekly' },
];

const SEALPHIE_TASKS = [
  { id: 's1', text: 'Sleeping 8 hours', freq: 'Daily' },
  { id: 's2', text: 'Gym/Yoga/Rock Climbing', freq: 'Daily' },
  { id: 's3', text: 'Writing diaries', freq: 'Weekly' },
];

const CELEBRATION_COLORS = ['#f472b6', '#34d399', '#60a5fa', '#fbbf24', '#a78bfa', '#f87171', '#ff0000', '#00ff00', '#ffff00'];

type TimeTheme = 'morning' | 'afternoon' | 'evening' | 'night' | 'midnight' | 'early';

const App: React.FC = () => {
  const [m3Logs, setM3Logs] = useState<Contribution[]>([]);
  const [sealphieLogs, setSealphieLogs] = useState<Contribution[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [activeCoins, setActiveCoins] = useState<number[]>([]);
  const [streamers, setStreamers] = useState<{ id: number; left: string; color: string; delay: string; duration: string; startRot: string; endRot: string; width: string; height: string }[]>([]);
  const [currentTheme, setCurrentTheme] = useState<TimeTheme>('morning');

  // Pre-calculate random decoration data
  const afternoonFlowers = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: 20 + Math.random() * 45,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 15
  })), []);

  const eveningDots = useMemo(() => Array.from({ length: 35 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100 + "%",
    size: 3 + Math.random() * 5,
    delay: Math.random() * 15 + "s",
    duration: 12 + Math.random() * 12 + "s",
    drift: (Math.random() - 0.5) * 60 + "px"
  })), []);

  const nightStars = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    top: Math.random() * 70,
    left: Math.random() * 100,
    size: Math.random() * 3,
    delay: Math.random() * 10
  })), []);

  const fairyLights = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    left: (i * 4) + (Math.random() * 2) + "%",
    top: (Math.random() * 8) + "%",
    delay: Math.random() * 5,
    duration: 3 + Math.random() * 3
  })), []);

  const midnightSnow = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100 + "%",
    size: 20 + Math.random() * 40, // Flower-like sizes
    delay: Math.random() * 20 + "s",
    duration: 8 + Math.random() * 12 + "s",
    opacity: 0.15 + Math.random() * 0.45
  })), []);

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      // Set default for testing or use real-time
      if (hour >= 8 && hour < 12) setCurrentTheme('morning');
      else if (hour >= 12 && hour < 16) setCurrentTheme('afternoon');
      else if (hour >= 16 && hour < 20) setCurrentTheme('evening');
      else if (hour >= 20 && hour < 24) setCurrentTheme('night');
      else if (hour >= 0 && hour < 4) setCurrentTheme('midnight');
      else setCurrentTheme('early');
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const [m3Res, sealphieRes] = await Promise.all([
          fetch('https://raw.githubusercontent.com/mazui3/TravelFundJarData/refs/heads/main/m3_history.json'),
          fetch('https://raw.githubusercontent.com/mazui3/TravelFundJarData/refs/heads/main/sealphie_history.json')
        ]);
        if (!m3Res.ok || !sealphieRes.ok) throw new Error('Failed to fetch history');
        setM3Logs(await m3Res.json());
        setSealphieLogs(await sealphieRes.json());
      } catch (err) {
        console.error("Error loading history:", err);
      }
    };
    loadHistory();
  }, []);

  const totalAmount = useMemo(() => {
    return (m3Logs?.reduce((sum, l) => sum + (l.amount || 0), 0) || 0) +
           (sealphieLogs?.reduce((sum, l) => sum + (l.amount || 0), 0) || 0);
  }, [m3Logs, sealphieLogs]);

  const playJarAnimation = () => {
    setIsShaking(true);
    const coinId = Date.now();
    setActiveCoins(prev => [...prev, coinId]);
    setTimeout(() => setIsShaking(false), 500);
    setTimeout(() => setActiveCoins(prev => prev.filter(id => id !== coinId)), 1000);
  };

  const triggerCelebration = () => {
    const newStreamers = Array.from({ length: 125 }).map((_, i) => ({
      id: Date.now() + i,
      left: `${Math.random() * 100}%`,
      color: CELEBRATION_COLORS[Math.floor(Math.random() * CELEBRATION_COLORS.length)],
      delay: `${Math.random() * 0.8}s`,
      duration: `${2 + Math.random() * 3}s`,
      startRot: `${Math.random() * 360}deg`,
      endRot: `${(Math.random() > 0.5 ? 720 : -720) + (Math.random() * 1440)}deg`,
      width: `${6 + Math.random() * 6}px`,
      height: `${12 + Math.random() * 20}px`,
    }));
    setStreamers(prev => [...prev, ...newStreamers]);
    setTimeout(() => {
      setStreamers(prev => prev.filter(s => !newStreamers.find(ns => ns.id === s.id)));
    }, 8500);
  };

  const getThemeConfig = () => {
    switch (currentTheme) {
      case 'morning':
        return {
          bg: 'bg-gradient-to-b from-sky-300 via-sky-100 to-blue-400',
          card: 'bg-white/40',
          text: 'text-slate-800',
          accent: 'text-blue-600',
          header: 'text-sky-900',
          icon: <Sun className="text-amber-400" size={20} />
        };
      case 'afternoon':
        return {
          bg: 'bg-gradient-to-br from-yellow-100 via-green-200 to-emerald-400',
          card: 'bg-white/50',
          text: 'text-slate-900',
          accent: 'text-emerald-700',
          header: 'text-green-900',
          icon: <Flower2 className="text-yellow-200 drop-shadow-sm" size={20} />
        };
      case 'evening':
        return {
          bg: 'bg-gradient-to-t from-orange-200 via-rose-300 to-blue-700',
          card: 'bg-white/30',
          text: 'text-slate-900',
          accent: 'text-orange-800',
          header: 'text-white lg:text-indigo-900',
          icon: <Wind className="text-orange-400" size={20} />
        };
      case 'night':
        return {
          bg: 'bg-gradient-to-b from-slate-900 via-indigo-950 to-black',
          card: 'bg-white/10',
          text: 'text-slate-100',
          accent: 'text-lime-400',
          header: 'text-white',
          icon: <Moon className="text-indigo-200" size={20} />
        };
      case 'midnight':
        return {
          bg: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-black',
          card: 'bg-white/5 border-white/5 shadow-[0_0_50px_rgba(59,130,246,0.1)]',
          text: 'text-blue-100',
          accent: 'text-emerald-400',
          header: 'text-emerald-300',
          icon: <Sparkles className="text-emerald-300" size={20} />
        };
      case 'early':
        return {
          bg: 'bg-gradient-to-tr from-amber-50 via-orange-100 to-rose-200',
          card: 'bg-white/40',
          text: 'text-slate-800',
          accent: 'text-rose-600',
          header: 'text-orange-900',
          icon: <Coffee className="text-amber-800" size={20} />
        };
    }
  };

  const theme = getThemeConfig();

  const ThemeMagicOverlay = () => {
    if (currentTheme === 'morning') return (
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <Cloud className="absolute top-10 left-[10%] text-white/60 animate-drift" size={120} />
        <Cloud className="absolute top-40 right-[15%] text-white/40 animate-drift" style={{ animationDelay: '-3s' }} size={80} />
        <div className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-white/20 to-transparent"></div>
      </div>
    );
    if (currentTheme === 'afternoon') return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-70">
        {afternoonFlowers.map((flower) => (
          <div key={flower.id} className="absolute animate-float-flower"
               style={{
                 top: `${flower.top}%`,
                 left: `${flower.left}%`,
                 animationDelay: `${flower.delay}s`,
                 animationDuration: `${flower.duration}s`
               }}>
            <Flower2 className="text-white opacity-60 hover:opacity-100 transition-opacity" size={flower.size} />
          </div>
        ))}
      </div>
    );
    if (currentTheme === 'evening') return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-orange-500/5 mix-blend-overlay"></div>
        {eveningDots.map((dot) => (
          <div
            key={dot.id}
            className="absolute animate-float-up rounded-full bg-yellow-200/60 shadow-[0_0_8px_rgba(253,224,71,0.5)]"
            style={{
              left: dot.left,
              width: dot.size + 'px',
              height: dot.size + 'px',
              animationDelay: dot.delay,
              animationDuration: dot.duration,
              '--drift-x': dot.drift
            } as React.CSSProperties}
          />
        ))}
      </div>
    );
    if (currentTheme === 'night') return (
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[4%] w-full h-[1px] bg-white/5 shadow-sm"></div>
        {fairyLights.map((light) => (
          <div key={light.id} className="absolute" style={{ left: light.left, top: light.top }}>
            <div className="w-[1px] h-3 bg-white/20 mx-auto"></div>
            <div className="w-2 h-3 rounded-full bg-amber-400 animate-flicker shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                 style={{ animationDelay: `${light.delay}s`, animationDuration: `${light.duration}s` }}></div>
          </div>
        ))}
        {nightStars.map((star) => (
          <div key={star.id} className="absolute bg-white/40 rounded-full animate-twinkle"
               style={{
                 width: star.size + 'px',
                 height: star.size + 'px',
                 top: star.top + '%',
                 left: star.left + '%',
                 animationDelay: star.delay + 's'
               }} />
        ))}
      </div>
    );
    if (currentTheme === 'midnight') return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Aurora Borealis Effect */}
        <div className="absolute top-0 left-[-20%] w-[140%] h-[60%] opacity-50 filter blur-[80px]">
          <div className="absolute top-[10%] left-[10%] w-[80%] h-[40%] bg-emerald-600 rounded-full animate-aurora opacity-90" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-[20%] left-[20%] w-[70%] h-[30%] bg-indigo-800 rounded-full animate-aurora opacity-80" style={{ animationDelay: '-5s' }}></div>
          <div className="absolute top-[15%] left-[40%] w-[60%] h-[35%] bg-teal-500 rounded-full animate-aurora opacity-90" style={{ animationDelay: '-10s' }}></div>
        </div>

        {/* Snowy Animation - Now with large Snowflake icons */}
        {midnightSnow.map((flake) => (
          <div
            key={flake.id}
            className="absolute animate-snow flex items-center justify-center"
            style={{
              left: flake.left,
              animationDelay: flake.delay,
              animationDuration: flake.duration,
              opacity: flake.opacity
            }}
          >
            <Snowflake
              size={flake.size}
              className="text-white/80"
              strokeWidth={1.5}
            />
          </div>
        ))}

        {/* Subtle Starry Base */}
        {nightStars.map((star) => (
          <div key={star.id} className="absolute bg-white/20 rounded-full"
               style={{
                 width: star.size + 'px',
                 height: star.size + 'px',
                 top: star.top + '%',
                 left: star.left + '%',
               }} />
        ))}

        <div className="absolute bottom-0 left-0 w-full h-[20vh] bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>
    );
    if (currentTheme === 'early') return (
      <div className="fixed inset-0 pointer-events-none bg-gradient-radial from-amber-200/20 to-transparent opacity-60"></div>
    );
    return null;
  };

  const UserColumn = ({ name, tasks, logs }: { name: string, tasks: typeof M3_TASKS, logs: Contribution[] }) => {
    const sortedLogs = [...(logs || [])].reverse();
    const hasHanamaru = (logs || []).some(log => log.amount === 0 && tasks.some(t => t.text === log.taskName && t.freq === 'Weekly'));

    return (
      <div className={`flex flex-col h-full w-full p-4 lg:p-6 ${theme.card} backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-xl transition-all hover:bg-white/5 relative theme-transition mb-4 lg:mb-0`}>
        <div className="relative flex items-center gap-4 mb-6">
          <div className="w-12 h-12 lg:w-16 lg:h-16 shrink-0 rounded-full border border-white/10 flex items-center justify-center bg-white/5 shadow-inner">
             <User size={24} className={`lg:size-7 ${theme.text} opacity-80`} />
          </div>
          <h2 className={`text-xl lg:text-3xl font-bold ${theme.text} tracking-tight`}>{name}</h2>

          {hasHanamaru && (
            <div className="absolute -top-8 -right-6 lg:-right-12 w-20 h-20 lg:w-28 lg:h-28 z-[150] cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
                 onClick={triggerCelebration}>
              <img
                src="https://raw.githubusercontent.com/mazui3/Travel-Fund-Jar/refs/heads/main/Hanamaru.png"
                alt="Hanamaru Badge"
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className={`text-[9px] font-black uppercase tracking-widest ${theme.text} mb-3 opacity-50`}>Current Goals</h3>
          <ul className="space-y-2">
            {tasks.map(task => (
              <li key={task.id} className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                <span className={`text-[8px] bg-white/10 px-2 py-0.5 rounded-full ${theme.text} font-black uppercase whitespace-nowrap shrink-0`}>
                  {task.freq}
                </span>
                <div className={`text-sm lg:text-base font-medium ${theme.text} truncate`}>
                  {task.text}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <h3 className={`text-[9px] font-black uppercase tracking-widest ${theme.text} mb-3 opacity-50`}>Savings History</h3>
          <div className="flex-1 overflow-y-auto max-h-[400px] lg:max-h-none pr-1 space-y-1.5 scrollbar-hide">
            {sortedLogs.map(log => (
              <div key={log.id} className={`p-3 bg-white/5 rounded-xl text-[13px] border border-white/5 flex justify-between items-center animate-in fade-in slide-in-from-top-1 duration-300`}>
                <div className="min-w-0 flex items-baseline gap-2">
                  <div className={`font-bold ${theme.text} truncate`}>{log.taskName}</div>
                  <div className={`text-[11px] ${theme.text} shrink-0 opacity-50 font-medium`}>{log.date}</div>
                </div>
                <div className={`font-bold ml-2 shrink-0 ${log.amount === 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {log.amount === 0 ? '$0' : `+$${log.amount}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen lg:h-screen w-full flex flex-col ${theme.bg} theme-transition overflow-y-auto lg:overflow-hidden relative`}>
      <ThemeMagicOverlay />

      {/* Streamers Overlay */}
      {streamers.map(s => (
        <div key={s.id} className="streamer"
          style={{
            left: s.left, backgroundColor: s.color, animationDelay: s.delay,
            animationDuration: s.duration, width: s.width, height: s.height,
            '--start-rot': s.startRot, '--end-rot': s.endRot, zIndex: 200
          } as React.CSSProperties}
        />
      ))}

      <header className="flex-none w-full max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-900 rounded-lg shadow-lg">
            <Plane className="text-lime-400" size={16} />
          </div>
          <h1 className={`text-sm font-black uppercase tracking-[0.2em] ${theme.header} transition-colors`}>Travel Fund Jar</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className={`hidden sm:flex px-3 py-1 rounded-full ${theme.card} backdrop-blur-md items-center gap-2 border border-white/10 transition-all`}>
            {theme.icon}
            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.text}`}>{currentTheme}</span>
          </div>
          <div className={`text-[10px] font-black uppercase tracking-widest ${theme.text} opacity-60 whitespace-nowrap`}>
             <Info size={12} className="inline mr-1" /> Daily $2 | Weekly $20
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 pb-12 lg:pb-4 flex flex-col lg:flex-row gap-4 items-stretch overflow-visible relative z-20">
        <div className="w-full lg:w-[360px] xl:w-[456px] flex flex-col items-center justify-center p-2 gap-4 shrink-0 order-1 lg:order-2">
          <div className="w-full bg-slate-900/95 text-white p-6 rounded-[2.5rem] shadow-2xl text-center transform -rotate-1 hover:rotate-0 transition-transform backdrop-blur-xl border border-white/10">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50 mb-2 text-lime-400/50">Travel Funds</div>
            <div className="text-6xl lg:text-7xl font-black flex items-center justify-center">
              <span className="text-3xl mr-1 text-lime-400">$</span>
              {totalAmount}
            </div>
          </div>

          <div className="relative w-full aspect-square max-w-[240px] lg:max-w-[320px] flex items-center justify-center my-4 lg:my-0">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 flex justify-center">
              {activeCoins.map(id => (
                <div key={id} className="animate-coin">
                  <div className="w-10 h-10 bg-amber-400 rounded-full border-4 border-amber-600 flex items-center justify-center shadow-lg transform scale-110">
                    <DollarSign size={20} className="text-amber-800 font-bold" />
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`w-full h-full flex items-center justify-center cursor-pointer transform transition-all hover:scale-105 active:scale-95 ${isShaking ? 'animate-shake' : ''}`}
              onClick={playJarAnimation}
            >
              <img
                src="https://raw.githubusercontent.com/mazui3/Travel-Fund-Jar/refs/heads/main/Piggy.png"
                alt="Piggy Bank"
                className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-[400px] lg:min-h-0 order-2 lg:order-1">
          <UserColumn name="M3" tasks={M3_TASKS} logs={m3Logs} />
        </div>

        <div className="flex-1 min-h-[400px] lg:min-h-0 order-3 lg:order-3">
          <UserColumn name="Sealphie" tasks={SEALPHIE_TASKS} logs={sealphieLogs} />
        </div>
      </main>

      <footer className={`flex-none py-3 text-center ${theme.text} text-[9px] font-black uppercase tracking-[0.5em] opacity-30 relative z-10`}>
        Saving money or getting things done, win win &middot; 2026
      </footer>
    </div>
  );
};

export default App;
