import { useMemo, useRef, useState } from 'react';
import type { GameProps } from '../components/GameShell';
import { starsFor, useFeedback } from '../components/Feedback';
import Icon from '../components/Icon';
import { insulin } from '../content/medical';
import { useLang } from '../hooks/useLang';
import { shuffle } from '../hooks/useProgress';
import { sfx, speak } from '../hooks/useSound';

const BROWN = '#C9966B';
const CREAM = '#F3DCC0';
const NAVY = '#1E3A56';

export function Teddy() {
  const s = { stroke: NAVY, strokeWidth: 3 };
  return (
    <svg viewBox="0 0 200 220" className="teddy-svg" aria-hidden="true">
      <ellipse cx="34" cy="110" rx="19" ry="36" fill={BROWN} {...s} transform="rotate(14 34 110)" />
      <ellipse cx="166" cy="110" rx="19" ry="36" fill={BROWN} {...s} transform="rotate(-14 166 110)" />
      <ellipse cx="64" cy="190" rx="26" ry="27" fill={BROWN} {...s} />
      <ellipse cx="136" cy="190" rx="26" ry="27" fill={BROWN} {...s} />
      <ellipse cx="100" cy="140" rx="56" ry="58" fill={BROWN} {...s} />
      <ellipse cx="100" cy="140" rx="36" ry="38" fill={CREAM} />
      <circle cx="62" cy="26" r="18" fill={BROWN} {...s} />
      <circle cx="138" cy="26" r="18" fill={BROWN} {...s} />
      <circle cx="62" cy="26" r="8" fill={CREAM} />
      <circle cx="138" cy="26" r="8" fill={CREAM} />
      <circle cx="100" cy="54" r="42" fill={BROWN} {...s} />
      <ellipse cx="100" cy="66" rx="17" ry="13" fill={CREAM} />
      <ellipse cx="100" cy="60" rx="6" ry="4.5" fill={NAVY} />
      <path d="M100 64v6m-7 2c4 4 10 4 14 0" fill="none" {...s} strokeWidth="2.500" strokeLinecap="round" />
      <circle cx="84" cy="46" r="4" fill={NAVY} />
      <circle cx="116" cy="46" r="4" fill={NAVY} />
    </svg>
  );
}

export default function InjectionHero({ onFinish }: GameProps) {
  const { lang, t, tl } = useLang();
  const fb = useFeedback();
  const mistakes = useRef(0);

  /* ---- Part 1: steps in order ---- */
  const cards = useMemo(() => shuffle(insulin.steps), []);
  const [placed, setPlaced] = useState(0);
  const [shake, setShake] = useState<string | null>(null);
  const [part, setPart] = useState<1 | 2>(1);

  const tapStep = (id: string) => {
    if (insulin.steps[placed].id === id) {
      const n = placed + 1;
      setPlaced(n);
      sfx.good();
      speak(tl(insulin.steps[placed].label), lang);
      if (n === insulin.steps.length) {
        window.setTimeout(() => {
          setPart(2);
          speak(tl(insulin.teddyInstruction), lang);
        }, 1500);
      }
    } else {
      mistakes.current++;
      setShake(id);
      window.setTimeout(() => setShake(null), 500);
      fb.soft(tl(insulin.wrongStepMessage));
    }
  };

  /* ---- Part 2: a new place on teddy each day ---- */
  const [used, setUsed] = useState<string[]>([]);
  const day = used.length;

  const tapSite = (id: string) => {
    if (day >= insulin.days.length) return;
    if (used.includes(id)) {
      mistakes.current++;
      fb.soft(tl(insulin.usedMessage));
      return;
    }
    const site = insulin.sites.find((s) => s.id === id)!;
    const next = [...used, id];
    setUsed(next);
    fb.good(tl(site.label));
    if (next.length >= insulin.days.length) window.setTimeout(() => onFinish(starsFor(mistakes.current, 1, 4)), 1500);
  };

  if (part === 1) {
    return (
      <div className="steps-game">
        <p className="instruction">{tl(insulin.instruction)}</p>
        <ol className="step-slots">
          {insulin.steps.map((s, i) => (
            <li key={s.id} className={i < placed ? 'filled' : ''}>
              <span className="step-num">{i + 1}</span>
              {i < placed ? (
                <>
                  <Icon name={s.icon} size={40} />
                  <span>{tl(s.label)}</span>
                </>
              ) : (
                <span className="step-empty" />
              )}
            </li>
          ))}
        </ol>
        <div className="step-cards">
          {cards
            .filter((c) => insulin.steps.findIndex((s) => s.id === c.id) >= placed)
            .map((c) => (
              <button key={c.id} className={`step-card ${shake === c.id ? 'shake' : ''}`} onClick={() => tapStep(c.id)}>
                <Icon name={c.icon} size={44} />
                <span>{tl(c.label)}</span>
              </button>
            ))}
        </div>
        {fb.node}
      </div>
    );
  }

  return (
    <div className="teddy-game">
      <p className="instruction">{tl(insulin.teddyInstruction)}</p>
      <div className="days" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {insulin.days.map((d, i) => (
          <span key={d.en} className={i < day ? 'done' : i === day ? 'now' : ''}>
            {i < day ? <Icon name="star" size={20} /> : null}
            {i === day ? tl(d) : tl(d).slice(lang === 'ar' ? 0 : 0, lang === 'ar' ? 20 : 3)}
          </span>
        ))}
      </div>
      <div className="teddy" dir="ltr">
        <Teddy />
        {insulin.sites.map((s) => {
          const isUsed = used.includes(s.id);
          return (
            <button
              key={s.id}
              className={`site ${isUsed ? 'used' : ''}`}
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
              onClick={() => tapSite(s.id)}
              aria-label={tl(s.label)}
            >
              {isUsed && <Icon name="plaster" size="100%" />}
            </button>
          );
        })}
      </div>
      <p className="day-now">
        {t('day')}: <strong>{tl(insulin.days[Math.min(day, insulin.days.length - 1)])}</strong>
      </p>
      {fb.node}
    </div>
  );
}
