import { useEffect, useRef, useState } from 'react';
import type { GameProps } from '../components/GameShell';
import { starsFor, useFeedback } from '../components/Feedback';
import Icon from '../components/Icon';
import { pop, type Item } from '../content/medical';
import { useLang } from '../hooks/useLang';
import { shuffle } from '../hooks/useProgress';
import { sfx, speak } from '../hooks/useSound';

type Bubble = { id: number; item: Item; sign: boolean; x: number; dur: number; state: 'float' | 'pop' | 'wobble' };

/* Three rounds, each a little faster. need = signs to pop to finish the round. */
const ROUNDS = [
  { dur: 9, gap: 1150, need: 5 },
  { dur: 7.5, gap: 950, need: 6 },
  { dur: 6.2, gap: 800, need: 7 },
];

export default function PopTheSigns({ onFinish }: GameProps) {
  const { lang, t, tl } = useLang();
  const fb = useFeedback();
  const [round, setRound] = useState(0);
  const [banner, setBanner] = useState(true);
  const [over, setOver] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [count, setCount] = useState(0);
  const [found, setFound] = useState<string[]>([]);
  const mistakes = useRef(0);
  const nextId = useRef(0);
  const queue = useRef<Item[]>([]);

  useEffect(() => {
    setBanner(true);
    const id = window.setTimeout(() => setBanner(false), 1600);
    return () => window.clearTimeout(id);
  }, [round]);

  useEffect(() => {
    if (banner || over) return;
    const cfg = ROUNDS[round];
    const spawn = () => {
      if (document.hidden) return;
      const sign = Math.random() < 0.6;
      let item: Item;
      if (sign) {
        if (!queue.current.length) queue.current = shuffle(pop.signs);
        item = queue.current.pop()!;
      } else {
        item = pop.decoys[Math.floor(Math.random() * pop.decoys.length)];
      }
      const b: Bubble = { id: nextId.current++, item, sign, x: Math.random(), dur: cfg.dur * (0.9 + Math.random() * 0.25), state: 'float' };
      setBubbles((list) => [...list.slice(-11), b]);
    };
    spawn();
    const id = window.setInterval(spawn, cfg.gap);
    return () => window.clearInterval(id);
  }, [banner, over, round]);

  const remove = (id: number) => setBubbles((list) => list.filter((b) => b.id !== id));
  const setState = (id: number, state: Bubble['state']) => setBubbles((list) => list.map((b) => (b.id === id ? { ...b, state } : b)));

  const tap = (b: Bubble) => {
    if (b.state !== 'float' || banner || over) return;
    if (!b.sign) {
      mistakes.current++;
      setState(b.id, 'wobble');
      fb.soft(tl(pop.decoyMessage));
      return;
    }
    sfx.pop();
    speak(tl(b.item.label), lang);
    setState(b.id, 'pop');
    setFound((f) => (f.includes(b.item.id) ? f : [...f, b.item.id]));
    const c = count + 1;
    if (c < ROUNDS[round].need) {
      setCount(c);
      return;
    }
    // round finished
    setCount(0);
    window.setTimeout(() => setBubbles([]), 350);
    if (round < ROUNDS.length - 1) {
      sfx.good();
      setRound(round + 1);
    } else {
      setOver(true);
      window.setTimeout(() => onFinish(starsFor(mistakes.current, 1, 4)), 800);
    }
  };

  return (
    <div className="pop-game">
      <div className="pop-status">
        <div className="sign-chips">
          {pop.signs.map((s) => (
            <span key={s.id} className={`sign-chip ${found.includes(s.id) ? 'on' : ''}`} title={tl(s.label)}>
              <Icon name={s.icon} size={34} />
            </span>
          ))}
        </div>
        <div className="dots" dir="ltr" aria-label={`${count} / ${ROUNDS[round].need}`}>
          {Array.from({ length: ROUNDS[round].need }, (_, i) => (
            <i key={i} className={i < count ? 'on' : ''} />
          ))}
        </div>
      </div>

      <div className="pop-sky">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className={`bubble-wrap ${b.state !== 'float' ? 'paused' : ''}`}
            style={{ left: `calc((100% - var(--bubble)) * ${b.x})`, animationDuration: `${b.dur}s` }}
            onAnimationEnd={(e) => e.target === e.currentTarget && remove(b.id)}
          >
            <button
              className={`bubble ${b.state}`}
              onPointerDown={() => tap(b)}
              onAnimationEnd={(e) => {
                e.stopPropagation();
                if (b.state === 'pop') remove(b.id);
                else if (b.state === 'wobble') setState(b.id, 'float');
              }}
              aria-label={tl(b.item.label)}
            >
              <Icon name={b.item.icon} size="54%" />
              <span>{tl(b.item.label)}</span>
            </button>
          </div>
        ))}

        {banner && !over && (
          <div className="round-banner">
            {round === 0 && <p>{tl(pop.instruction)}</p>}
            <strong>
              {t('round')} {round + 1}
            </strong>
          </div>
        )}
      </div>
      {fb.node}
    </div>
  );
}
