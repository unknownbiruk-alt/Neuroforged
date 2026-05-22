import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Target, Brain, Layers, Activity, Eye,
  Play, Trophy, ArrowLeft, CheckCircle2, RotateCcw, Lock
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSessionStore, calculateXpForSession, TestType } from '../store/sessionStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../utils/cn';

type TestState = 'select' | 'ready' | 'active' | 'complete';

interface TestConfig {
  id: TestType;
  label: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
  tier: 'free' | 'pro' | 'elite';
  instructions: string;
}

const TESTS: TestConfig[] = [
  {
    id: 'reaction_time',
    label: 'Reaction Time',
    desc: 'Click as fast as possible when the target appears',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-yellow-500 to-orange-500',
    tier: 'free',
    instructions: 'Wait for the green circle to appear, then click it as fast as you can. 10 rounds.',
  },
  {
    id: 'aim_precision',
    label: 'Aim Precision',
    desc: 'Click moving targets accurately',
    icon: <Target className="w-5 h-5" />,
    color: 'from-red-500 to-pink-500',
    tier: 'free',
    instructions: 'Click on each target that appears. Accuracy matters — each miss reduces your score.',
  },
  {
    id: 'pattern_recognition',
    label: 'Pattern Recognition',
    desc: 'Identify the correct pattern in a sequence',
    icon: <Layers className="w-5 h-5" />,
    color: 'from-cyan-500 to-blue-500',
    tier: 'free',
    instructions: 'Watch the pattern flash, then select the matching sequence.',
  },
  {
    id: 'working_memory',
    label: 'Working Memory',
    desc: 'Remember and recall sequences of increasing length',
    icon: <Brain className="w-5 h-5" />,
    color: 'from-violet-500 to-purple-500',
    tier: 'pro',
    instructions: 'Memorize the sequence of numbers shown, then type them back in order.',
  },
  {
    id: 'cognitive_flexibility',
    label: 'Cognitive Flexibility',
    desc: 'Switch between tasks rapidly without errors',
    icon: <Activity className="w-5 h-5" />,
    color: 'from-emerald-500 to-teal-500',
    tier: 'pro',
    instructions: 'Respond correctly to the changing rules. The rule switches every few rounds.',
  },
  {
    id: 'focus_endurance',
    label: 'Focus Endurance',
    desc: 'Sustained attention over a longer session',
    icon: <Eye className="w-5 h-5" />,
    color: 'from-indigo-500 to-violet-500',
    tier: 'elite',
    instructions: 'Maintain focus over an extended session. Miss fewer than 10% of targets.',
  },
];

// ── Reaction Time Mini-Game ──────────────────────────────────────────────────
function ReactionTimeGame({ onComplete }: { onComplete: (score: number, accuracy: number, reactionMs: number, durationSecs: number) => void }) {
  const [phase, setPhase] = useState<'waiting' | 'ready' | 'go' | 'early' | 'done'>('waiting');
  const [reactions, setReactions] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const [showTime, setShowTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number>(0);
  const ROUNDS = 10;

  const startRound = useCallback(() => {
    setPhase('waiting');
    const delay = 1500 + Math.random() * 2500;
    timerRef.current = setTimeout(() => {
      startRef.current = Date.now();
      setPhase('go');
    }, delay);
  }, []);

  useEffect(() => {
    startRound();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [startRound]);

  const handleClick = () => {
    if (phase === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase('early');
      setTimeout(() => startRound(), 1500);
      return;
    }
    if (phase === 'go') {
      const rt = Date.now() - startRef.current;
      setShowTime(rt);
      setReactions(prev => {
        const next = [...prev, rt];
        if (next.length >= ROUNDS) {
          setTimeout(() => {
            const avg = next.reduce((s, x) => s + x, 0) / next.length;
            const score = Math.max(0, Math.round(1000 - avg));
            const accuracy = Math.round(Math.min(100, (500 / avg) * 100));
            onComplete(score, accuracy, avg, next.length * 3);
          }, 800);
        }
        return next;
      });
      setRound(r => r + 1);
      setPhase('done');
      if (reactions.length + 1 < ROUNDS) {
        setTimeout(() => startRound(), 1200);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-sm text-gray-400">Round {Math.min(round + 1, ROUNDS)} of {ROUNDS}</div>
      <div className="w-full max-w-sm">
        <div className="flex gap-1 mb-4">
          {Array.from({ length: ROUNDS }).map((_, i) => (
            <div key={i} className={cn('h-1.5 flex-1 rounded-full', i < reactions.length ? 'bg-emerald-500' : 'bg-gray-700')} />
          ))}
        </div>
      </div>

      <button
        onClick={handleClick}
        className={cn(
          'w-48 h-48 rounded-full flex flex-col items-center justify-center text-white font-bold transition-all select-none cursor-pointer shadow-2xl',
          phase === 'waiting' && 'bg-red-900 border-2 border-red-700',
          phase === 'go' && 'bg-emerald-500 border-2 border-emerald-400 scale-110 shadow-emerald-900/50',
          phase === 'early' && 'bg-amber-600 border-2 border-amber-400',
          phase === 'done' && 'bg-gray-700 border-2 border-gray-600',
        )}
      >
        {phase === 'waiting' && <span className="text-lg">Wait...</span>}
        {phase === 'go' && <><span className="text-3xl">GO!</span><span className="text-sm">Click now!</span></>}
        {phase === 'early' && <span className="text-sm text-center px-4">Too early!<br />Wait for green</span>}
        {phase === 'done' && <span className="text-2xl font-black">{showTime}ms</span>}
      </button>

      {reactions.length > 0 && (
        <div className="text-center text-sm text-gray-400">
          Best: <span className="text-white font-bold">{Math.min(...reactions)}ms</span> ·
          Avg: <span className="text-white font-bold">{Math.round(reactions.reduce((s, x) => s + x, 0) / reactions.length)}ms</span>
        </div>
      )}
    </div>
  );
}

// ── Aim Precision Mini-Game ──────────────────────────────────────────────────
function AimPrecisionGame({ onComplete }: { onComplete: (score: number, accuracy: number, reactionMs: number, durationSecs: number) => void }) {
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [totalTargets, setTotalTargets] = useState(0);
  const [startTime] = useState(Date.now());
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const targetAppearTimes = useRef<Map<number, number>>(new Map());
  const counterRef = useRef(0);
  const TOTAL = 20;

  const spawnTarget = useCallback(() => {
    if (totalTargets >= TOTAL) return;
    const id = ++counterRef.current;
    const size = 40 + Math.random() * 30;
    const x = size + Math.random() * (320 - size * 2);
    const y = size + Math.random() * (240 - size * 2);
    targetAppearTimes.current.set(id, Date.now());
    setTargets(prev => [...prev, { id, x, y, size }]);
    setTotalTargets(prev => prev + 1);

    setTimeout(() => {
      setTargets(prev => {
        if (prev.find(t => t.id === id)) {
          setMisses(m => m + 1);
          targetAppearTimes.current.delete(id);
        }
        return prev.filter(t => t.id !== id);
      });
    }, 2000);
  }, [totalTargets]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTargets(prev => {
        if (prev >= TOTAL) { clearInterval(interval); return prev; }
        return prev;
      });
      spawnTarget();
    }, 900);
    return () => clearInterval(interval);
  }, [spawnTarget]);

  useEffect(() => {
    if (hits + misses === TOTAL) {
      const acc = Math.round((hits / TOTAL) * 100);
      const score = hits * 5 + Math.round(acc * 0.5);
      const avgReaction = reactionTimes.length
        ? Math.round(reactionTimes.reduce((s, x) => s + x, 0) / reactionTimes.length)
        : 0;
      const duration = Math.round((Date.now() - startTime) / 1000);
      setTimeout(() => onComplete(score, acc, avgReaction, duration), 600);
    }
  }, [hits, misses, reactionTimes, startTime, onComplete]);

  const handleHit = (id: number) => {
    const appearTime = targetAppearTimes.current.get(id);
    if (appearTime) {
      setReactionTimes(prev => [...prev, Date.now() - appearTime]);
      targetAppearTimes.current.delete(id);
    }
    setTargets(prev => prev.filter(t => t.id !== id));
    setHits(h => h + 1);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-sm">
        <span className="text-emerald-400 font-bold">{hits} hits</span>
        <span className="text-gray-400">{hits + misses}/{TOTAL}</span>
        <span className="text-red-400 font-bold">{misses} miss</span>
      </div>

      <div
        className="relative bg-gray-900 border border-gray-700 rounded-xl overflow-hidden"
        style={{ width: 320, height: 240 }}
      >
        <AnimatePresence>
          {targets.map(target => (
            <motion.button
              key={target.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.1 }}
              style={{
                position: 'absolute',
                left: target.x - target.size / 2,
                top: target.y - target.size / 2,
                width: target.size,
                height: target.size,
              }}
              className="rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 border-2 border-violet-400 cursor-crosshair flex items-center justify-center"
              onClick={() => handleHit(target.id)}
            >
              <div className="w-2 h-2 rounded-full bg-white" />
            </motion.button>
          ))}
        </AnimatePresence>
        {targets.length === 0 && hits + misses < TOTAL && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">
            Targets incoming…
          </div>
        )}
      </div>

      <div className="w-full max-w-xs bg-gray-800 rounded-full h-1.5">
        <div
          className="h-full bg-violet-500 rounded-full transition-all"
          style={{ width: `${((hits + misses) / TOTAL) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ── Pattern Recognition Mini-Game ────────────────────────────────────────────
function PatternRecognitionGame({ onComplete }: { onComplete: (score: number, accuracy: number, reactionMs: number, durationSecs: number) => void }) {
  const ROUNDS = 8;
  const GRID_SIZE = 4;
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<'show' | 'input' | 'feedback'>('show');
  const [pattern, setPattern] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [results, setResults] = useState<boolean[]>([]);
  const [showingIdx, setShowingIdx] = useState(-1);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [roundStartTime, setRoundStartTime] = useState(0);
  const [sessionStart] = useState(Date.now());

  const generatePattern = useCallback((difficulty: number) => {
    const count = 3 + Math.floor(difficulty / 2);
    const cells: number[] = [];
    while (cells.length < count) {
      const c = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
      if (!cells.includes(c)) cells.push(c);
    }
    return cells;
  }, []);

  const startRound = useCallback((r: number) => {
    const newPattern = generatePattern(r);
    setPattern(newPattern);
    setSelected([]);
    setPhase('show');
    setShowingIdx(0);

    let idx = 0;
    const showNext = () => {
      if (idx < newPattern.length) {
        setShowingIdx(idx);
        idx++;
        setTimeout(showNext, 600);
      } else {
        setShowingIdx(-1);
        setTimeout(() => {
          setPhase('input');
          setRoundStartTime(Date.now());
        }, 400);
      }
    };
    setTimeout(showNext, 500);
  }, [generatePattern]);

  useEffect(() => { startRound(0); }, [startRound]);

  const handleCellClick = (idx: number) => {
    if (phase !== 'input') return;
    setSelected(prev => {
      const next = prev.includes(idx) ? prev.filter(x => x !== idx) : [...prev, idx];
      if (next.length === pattern.length) {
        const correct = pattern.every(p => next.includes(p)) && next.every(n => pattern.includes(n));
        setReactionTimes(rt => [...rt, Date.now() - roundStartTime]);
        setResults(r => {
          const newResults = [...r, correct];
          setPhase('feedback');
          setTimeout(() => {
            const nextRound = round + 1;
            if (nextRound >= ROUNDS) {
              const acc = Math.round((newResults.filter(Boolean).length / ROUNDS) * 100);
              const score = newResults.filter(Boolean).length * 100 + acc;
              const avgRt = reactionTimes.length
                ? Math.round([...reactionTimes, Date.now() - roundStartTime].reduce((s, x) => s + x, 0) / (reactionTimes.length + 1))
                : 0;
              onComplete(score, acc, avgRt, Math.round((Date.now() - sessionStart) / 1000));
            } else {
              setRound(nextRound);
              startRound(nextRound);
            }
          }, 1000);
          return newResults;
        });
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-400">Round {round + 1}/{ROUNDS}</span>
        <span className="text-gray-600">·</span>
        <span className="text-gray-400">Remember {pattern.length} cells</span>
        {results.length > 0 && (
          <span className={cn('font-bold', results[results.length - 1] ? 'text-emerald-400' : 'text-red-400')}>
            {results[results.length - 1] ? '✓ Correct' : '✗ Wrong'}
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const isShowing = showingIdx !== -1 && pattern[showingIdx] === i;
          const isSelected = selected.includes(i);
          const isInPattern = phase === 'feedback' && pattern.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleCellClick(i)}
              disabled={phase !== 'input'}
              className={cn(
                'w-14 h-14 rounded-lg border-2 transition-all duration-150',
                isShowing && 'bg-violet-500 border-violet-400 scale-110',
                !isShowing && phase === 'show' && 'bg-gray-800 border-gray-700',
                phase === 'input' && isSelected && 'bg-indigo-600 border-indigo-400',
                phase === 'input' && !isSelected && 'bg-gray-800 border-gray-700 hover:border-gray-500 cursor-pointer',
                phase === 'feedback' && isInPattern && isSelected && 'bg-emerald-600 border-emerald-400',
                phase === 'feedback' && isInPattern && !isSelected && 'bg-red-800 border-red-600',
                phase === 'feedback' && !isInPattern && isSelected && 'bg-red-700 border-red-500',
                phase === 'feedback' && !isInPattern && !isSelected && 'bg-gray-800 border-gray-700',
              )}
            />
          );
        })}
      </div>

      <div className="text-sm text-gray-500">
        {phase === 'show' && 'Memorize the highlighted cells…'}
        {phase === 'input' && 'Select the cells you saw'}
        {phase === 'feedback' && (results[results.length - 1] ? '✓ Well done!' : '✗ Not quite — keep going')}
      </div>
    </div>
  );
}

// ── Working Memory Mini-Game ─────────────────────────────────────────────────
function WorkingMemoryGame({ onComplete }: { onComplete: (score: number, accuracy: number, reactionMs: number, durationSecs: number) => void }) {
  const ROUNDS = 7;
  const [round, setRound] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [input, setInput] = useState('');
  const [phase, setPhase] = useState<'show' | 'input' | 'feedback'>('show');
  const [results, setResults] = useState<boolean[]>([]);
  const [sessionStart] = useState(Date.now());
  const [roundStart, setRoundStart] = useState(Date.now());
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  const startRound = useCallback((r: number) => {
    const len = 3 + r;
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * 9) + 1);
    setSequence(seq);
    setInput('');
    setPhase('show');
    setTimeout(() => { setPhase('input'); setRoundStart(Date.now()); }, (len + 1) * 800);
  }, []);

  useEffect(() => { startRound(0); }, [startRound]);

  const handleSubmit = () => {
    const userSeq = input.trim().split(/\s+/).map(Number);
    const correct = sequence.length === userSeq.length && sequence.every((v, i) => v === userSeq[i]);
    setReactionTimes(rt => [...rt, Date.now() - roundStart]);
    setResults(prev => {
      const newResults = [...prev, correct];
      setPhase('feedback');
      setTimeout(() => {
        const nextRound = round + 1;
        if (nextRound >= ROUNDS) {
          const acc = Math.round((newResults.filter(Boolean).length / ROUNDS) * 100);
          const score = newResults.filter(Boolean).length * 120 + acc;
          const avgRt = reactionTimes.length
            ? Math.round(reactionTimes.reduce((s, x) => s + x, 0) / reactionTimes.length)
            : 0;
          onComplete(score, acc, avgRt, Math.round((Date.now() - sessionStart) / 1000));
        } else {
          setRound(nextRound);
          startRound(nextRound);
        }
      }, 1200);
      return newResults;
    });
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-sm text-gray-400">Round {round + 1}/{ROUNDS} · Remember {3 + round} numbers</div>

      {phase === 'show' && (
        <div className="flex gap-3">
          {sequence.map((n, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.7 }}
              className="w-12 h-12 rounded-xl bg-violet-600 border border-violet-400 flex items-center justify-center text-2xl font-black text-white"
            >
              {n}
            </motion.div>
          ))}
        </div>
      )}

      {phase === 'input' && (
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <p className="text-sm text-gray-400">Type the numbers in order, separated by spaces</p>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && input.trim() && handleSubmit()}
            autoFocus
            placeholder="e.g. 3 7 1 4"
            className="w-full bg-gray-900 border border-gray-700 focus:border-violet-500 rounded-lg px-4 py-3 text-white text-center text-xl font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <Button onClick={handleSubmit} disabled={!input.trim()}>Submit Answer</Button>
        </div>
      )}

      {phase === 'feedback' && (
        <div className="text-center">
          <div className={cn('text-2xl font-bold mb-2', results[results.length - 1] ? 'text-emerald-400' : 'text-red-400')}>
            {results[results.length - 1] ? '✓ Correct!' : '✗ Incorrect'}
          </div>
          {!results[results.length - 1] && (
            <div className="text-sm text-gray-400">The sequence was: <span className="text-white font-mono">{sequence.join(' ')}</span></div>
          )}
        </div>
      )}

      <div className="flex gap-1">
        {Array.from({ length: ROUNDS }).map((_, i) => (
          <div key={i} className={cn(
            'w-6 h-2 rounded-full',
            i >= results.length ? 'bg-gray-700' : results[i] ? 'bg-emerald-500' : 'bg-red-500'
          )} />
        ))}
      </div>
    </div>
  );
}

// ── Cognitive Flexibility Mini-Game ──────────────────────────────────────────
type FlexRule = 'color' | 'shape';
interface FlexCard { color: 'red' | 'blue' | 'green'; shape: 'circle' | 'square' | 'triangle'; }
const FLEX_COLORS = ['red', 'blue', 'green'] as const;
const FLEX_SHAPES = ['circle', 'square', 'triangle'] as const;
const colorBgMap: Record<string, string> = { red: 'bg-red-500', blue: 'bg-blue-500', green: 'bg-emerald-500' };

function FlexCardEl({ card }: { card: FlexCard }) {
  return (
    <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', colorBgMap[card.color])}>
      {card.shape === 'circle' && <div className="w-8 h-8 rounded-full bg-white/30" />}
      {card.shape === 'square' && <div className="w-8 h-8 bg-white/30 rounded-sm" />}
      {card.shape === 'triangle' && <div className="w-0 h-0" style={{ borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: '24px solid rgba(255,255,255,0.3)' }} />}
    </div>
  );
}

function CognitiveFlexibilityGame({ onComplete }: { onComplete: (score: number, accuracy: number, reactionMs: number, durationSecs: number) => void }) {
  const ROUNDS = 20;
  const [rule, setRule] = useState<FlexRule>('color');
  const [target, setTarget] = useState<FlexCard>({ color: 'red', shape: 'circle' });
  const [options, setOptions] = useState<FlexCard[]>([]);
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [roundStart, setRoundStart] = useState(Date.now());
  const flexStart = useRef(Date.now());
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateRound = useCallback((r: number, currentRule: FlexRule) => {
    const newRule: FlexRule = r > 0 && r % 5 === 0
      ? (currentRule === 'color' ? 'shape' : 'color')
      : (r % 3 === 0 ? (Math.random() > 0.5 ? 'color' : 'shape') : currentRule);
    const t: FlexCard = {
      color: FLEX_COLORS[Math.floor(Math.random() * 3)],
      shape: FLEX_SHAPES[Math.floor(Math.random() * 3)],
    };
    const correctOpt: FlexCard = newRule === 'color'
      ? { color: t.color, shape: FLEX_SHAPES[Math.floor(Math.random() * 3)] }
      : { color: FLEX_COLORS[Math.floor(Math.random() * 3)], shape: t.shape };
    const opts: FlexCard[] = [correctOpt];
    while (opts.length < 3) {
      const opt: FlexCard = { color: FLEX_COLORS[Math.floor(Math.random() * 3)], shape: FLEX_SHAPES[Math.floor(Math.random() * 3)] };
      const isCorrect = newRule === 'color' ? opt.color === t.color : opt.shape === t.shape;
      if (!isCorrect && !opts.find(o => o.color === opt.color && o.shape === opt.shape)) opts.push(opt);
    }
    setRule(newRule);
    setTarget(t);
    setOptions(opts.sort(() => Math.random() - 0.5));
    setRoundStart(Date.now());
  }, []);

  useEffect(() => { generateRound(0, 'color'); }, [generateRound]);

  const handleAnswer = (opt: FlexCard) => {
    const isCorrect = rule === 'color' ? opt.color === target.color : opt.shape === target.shape;
    setReactionTimes(rt => [...rt, Date.now() - roundStart]);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setResults(prev => {
      const newResults = [...prev, isCorrect];
      setTimeout(() => {
        setFeedback(null);
        const nextRound = round + 1;
        if (nextRound >= ROUNDS) {
          const acc = Math.round((newResults.filter(Boolean).length / ROUNDS) * 100);
          const score = newResults.filter(Boolean).length * 50 + acc;
          const avgRt = reactionTimes.length > 0
            ? Math.round(reactionTimes.reduce((s, x) => s + x, 0) / reactionTimes.length)
            : 500;
          onComplete(score, acc, avgRt, Math.round((Date.now() - flexStart.current) / 1000));
        } else {
          setRound(nextRound);
          generateRound(nextRound, rule);
        }
      }, 500);
      return newResults;
    });
  };
  // suppress unused warning
  void results;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Current rule</div>
        <div className="text-lg font-bold text-white">
          Match by <span className="text-violet-400">{rule === 'color' ? 'COLOR' : 'SHAPE'}</span>
        </div>
      </div>

      <div className="bg-gray-800 border-2 border-violet-600 rounded-xl p-4 flex items-center justify-center">
        <FlexCardEl card={target} />
      </div>

      <div className="text-sm text-gray-400">Choose the card that matches the rule</div>

      <div className="flex gap-4">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(opt)}
            className={cn(
              'rounded-xl border-2 p-2 transition-all',
              feedback === null ? 'border-gray-700 hover:border-violet-500 cursor-pointer' : 'cursor-not-allowed',
              feedback === 'correct' && (rule === 'color' ? opt.color === target.color : opt.shape === target.shape) && 'border-emerald-500',
              feedback === 'wrong' && (rule === 'color' ? opt.color === target.color : opt.shape === target.shape) && 'border-red-500',
            )}
          >
            <FlexCardEl card={opt} />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className={cn('font-bold', feedback === 'correct' ? 'text-emerald-400' : feedback === 'wrong' ? 'text-red-400' : 'text-transparent')}>
          {feedback === 'correct' ? '✓ Correct!' : '✗ Wrong!'}
        </span>
        <span className="text-gray-500">{round}/{ROUNDS}</span>
      </div>
    </div>
  );
}

// ── Focus Endurance Mini-Game ─────────────────────────────────────────────────
function FocusEnduranceGame({ onComplete }: { onComplete: (score: number, accuracy: number, reactionMs: number, durationSecs: number) => void }) {
  const DURATION = 60;
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; odd: boolean }[]>([]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const targetTimes = useRef<Map<number, number>>(new Map());
  const counterRef = useRef(0);
  const [started, setStarted] = useState(false);
  const [sessionStart, setSessionStart] = useState(0);

  useEffect(() => {
    if (!started) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started]);

  useEffect(() => {
    if (timeLeft === 0 && started) {
      const total = hits + misses;
      const acc = total > 0 ? Math.round((hits / total) * 100) : 0;
      const score = hits * 8 + acc;
      const avgRt = reactionTimes.length
        ? Math.round(reactionTimes.reduce((s, x) => s + x, 0) / reactionTimes.length)
        : 0;
      setTimeout(() => onComplete(score, acc, avgRt, DURATION), 500);
    }
  }, [timeLeft, started, hits, misses, reactionTimes, onComplete]);

  useEffect(() => {
    if (!started) return;
    const spawn = setInterval(() => {
      if (timeLeft <= 0) { clearInterval(spawn); return; }
      const id = ++counterRef.current;
      const isOdd = Math.random() > 0.4;
      const x = 20 + Math.random() * 260;
      const y = 20 + Math.random() * 160;
      targetTimes.current.set(id, Date.now());
      setTargets(prev => [...prev, { id, x, y, odd: isOdd }]);
      setTimeout(() => {
        setTargets(prev => {
          if (prev.find(t => t.id === id)) {
            setMisses(m => m + 1);
            targetTimes.current.delete(id);
          }
          return prev.filter(t => t.id !== id);
        });
      }, 1800);
    }, 700);
    return () => clearInterval(spawn);
  }, [started, timeLeft]);

  const handleClick = (id: number, odd: boolean) => {
    if (!odd) { setMisses(m => m + 1); return; }
    const t = targetTimes.current.get(id);
    if (t) setReactionTimes(prev => [...prev, Date.now() - t]);
    targetTimes.current.delete(id);
    setTargets(prev => prev.filter(t => t.id !== id));
    setHits(h => h + 1);
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-gray-400 text-sm max-w-xs">Click only the <span className="text-violet-400 font-bold">VIOLET circles</span> as they appear. Ignore red circles. 60-second session.</p>
        <Button onClick={() => { setStarted(true); setSessionStart(Date.now()); }}>Start 60s Session</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-6 text-sm">
        <span className="text-violet-400 font-bold">{hits} hits</span>
        <div className="text-2xl font-black text-white">{timeLeft}s</div>
        <span className="text-red-400 font-bold">{misses} miss</span>
      </div>

      <div className="relative bg-gray-900 border border-gray-700 rounded-xl overflow-hidden" style={{ width: 320, height: 200 }}>
        <AnimatePresence>
          {targets.map(target => (
            <motion.button
              key={target.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{ position: 'absolute', left: target.x - 18, top: target.y - 18, width: 36, height: 36 }}
              className={cn('rounded-full cursor-pointer border-2', target.odd ? 'bg-violet-600 border-violet-400' : 'bg-red-700 border-red-500')}
              onClick={() => handleClick(target.id, target.odd)}
            />
          ))}
        </AnimatePresence>
      </div>

      <p className="text-xs text-gray-600">Click only the violet circles</p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function TestsPage() {
  const { user } = useAuthStore();
  const { addSession } = useSessionStore();
  const [searchParams] = useSearchParams();
  const [testState, setTestState] = useState<TestState>('select');
  const [selectedTest, setSelectedTest] = useState<TestConfig | null>(null);
  const [lastResult, setLastResult] = useState<{ score: number; accuracy: number; xp: number } | null>(null);

  useEffect(() => {
    const typeParam = searchParams.get('type') as TestType | null;
    if (typeParam) {
      const found = TESTS.find(t => t.id === typeParam);
      if (found) setSelectedTest(found);
    }
  }, [searchParams]);

  if (!user) return null;

  const tierOrder = { free: 0, pro: 1, elite: 2 };
  const userTierLevel = tierOrder[user.subscriptionTier];

  const handleTestComplete = (score: number, accuracy: number, reactionMs: number, durationSecs: number) => {
    if (!selectedTest || !user) return;
    const difficulty = Math.max(1, Math.min(10, Math.round(1 + (score / 100))));
    const xp = calculateXpForSession(score, accuracy, difficulty);

    const session = {
      id: `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      userId: user.id,
      testType: selectedTest.id,
      score,
      accuracy,
      reactionTimeMs: reactionMs || undefined,
      difficulty,
      durationSeconds: durationSecs,
      xpEarned: xp,
      completedAt: new Date().toISOString(),
      metrics: { score, accuracy, reactionMs, durationSecs, difficulty },
    };

    addSession(session);
    setLastResult({ score, accuracy, xp });
    setTestState('complete');

    // Update user XP
    const { updateUser } = useAuthStore.getState();
    updateUser({ xp: user.xp + xp });
  };

  const resetTest = () => {
    setTestState('select');
    setSelectedTest(null);
    setLastResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <AnimatePresence mode="wait">
        {testState === 'select' && (
          <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="text-2xl font-bold text-white mb-1">Training Tests</h1>
            <p className="text-gray-400 text-sm mb-8">
              Select a test to begin. Your results will be saved to your account only.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TESTS.map(test => {
                const testTierLevel = tierOrder[test.tier];
                const isLocked = userTierLevel < testTierLevel;

                return (
                  <div
                    key={test.id}
                    className={cn(
                      'relative bg-gray-900 border rounded-xl p-6 transition-colors',
                      isLocked ? 'border-gray-800 opacity-70' : 'border-gray-800 hover:border-gray-700 cursor-pointer'
                    )}
                    onClick={() => !isLocked && (setSelectedTest(test), setTestState('ready'))}
                  >
                    {isLocked && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="warning" size="sm">
                          <Lock className="w-3 h-3" />
                          {test.tier.charAt(0).toUpperCase() + test.tier.slice(1)}
                        </Badge>
                      </div>
                    )}
                    {!isLocked && test.tier !== 'free' && (
                      <div className="absolute top-3 right-3">
                        <Badge variant={test.tier === 'elite' ? 'gold' : 'violet'} size="sm">
                          {test.tier.charAt(0).toUpperCase() + test.tier.slice(1)}
                        </Badge>
                      </div>
                    )}

                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${test.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                      {test.icon}
                    </div>
                    <h3 className="font-bold text-white mb-1">{test.label}</h3>
                    <p className="text-sm text-gray-400">{test.desc}</p>

                    {isLocked ? (
                      <div className="mt-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled
                          tooltip={`Upgrade to ${test.tier.charAt(0).toUpperCase() + test.tier.slice(1)} to unlock this test`}
                          className="w-full"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          Locked
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <Button size="sm" variant="outline" className="w-full" onClick={() => { setSelectedTest(test); setTestState('ready'); }}>
                          <Play className="w-3.5 h-3.5" /> Start Test
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {testState === 'ready' && selectedTest && (
          <motion.div key="ready" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center py-16">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedTest.color} flex items-center justify-center text-white mb-6 shadow-xl`}>
              {selectedTest.icon}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{selectedTest.label}</h2>
            <p className="text-gray-400 max-w-md mb-6 leading-relaxed">{selectedTest.instructions}</p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={resetTest}><ArrowLeft className="w-4 h-4" /> Back</Button>
              <Button onClick={() => setTestState('active')}>
                <Play className="w-4 h-4" /> Begin Test
              </Button>
            </div>
          </motion.div>
        )}

        {testState === 'active' && selectedTest && (
          <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center gap-3 mb-6">
              <button onClick={resetTest} className="text-gray-500 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="font-bold text-white">{selectedTest.label}</h2>
                <p className="text-xs text-gray-500">Session in progress — results save automatically on completion</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              {selectedTest.id === 'reaction_time' && <ReactionTimeGame onComplete={handleTestComplete} />}
              {selectedTest.id === 'aim_precision' && <AimPrecisionGame onComplete={handleTestComplete} />}
              {selectedTest.id === 'pattern_recognition' && <PatternRecognitionGame onComplete={handleTestComplete} />}
              {selectedTest.id === 'working_memory' && <WorkingMemoryGame onComplete={handleTestComplete} />}
              {selectedTest.id === 'cognitive_flexibility' && <CognitiveFlexibilityGame onComplete={handleTestComplete} />}
              {selectedTest.id === 'focus_endurance' && <FocusEnduranceGame onComplete={handleTestComplete} />}
            </div>
          </motion.div>
        )}

        {testState === 'complete' && lastResult && (
          <motion.div key="complete" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center py-16">
            <div className="w-16 h-16 rounded-full bg-emerald-900/40 border-2 border-emerald-500/50 flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Session Complete!</h2>
            <p className="text-gray-400 mb-8">Your results have been saved to your account.</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Score', value: lastResult.score },
                { label: 'Accuracy', value: `${lastResult.accuracy}%` },
                { label: 'XP Earned', value: `+${lastResult.xp}` },
              ].map(stat => (
                <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={resetTest}>
                <RotateCcw className="w-4 h-4" /> Try Another
              </Button>
              <Button onClick={() => { setSelectedTest(selectedTest); setTestState('ready'); }}>
                <Play className="w-4 h-4" /> Play Again
              </Button>
            </div>

            <div className="mt-4">
              <Trophy className="w-4 h-4 text-amber-400 inline mr-1" />
              <span className="text-sm text-gray-400">XP awarded to your account. Check your rank progress on the dashboard.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
