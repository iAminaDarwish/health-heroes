import { useMemo, useRef, useState } from 'react';
import type { GameProps } from '../components/GameShell';
import { starsFor, useFeedback } from '../components/Feedback';
import Icon from '../components/Icon';
import { low, LOW_SHOW_DATES_AND_SWEETS, type Item } from '../content/medical';
import { useLang } from '../hooks/useLang';
import { shuffle } from '../hooks/useProgress';
import { sfx, speak } from '../hooks/useSound';

type Phase = 'ask' | 'help' | 'adult';

export default function LowSugarRescue({ onFinish }: GameProps) {
  const { lang, t, tl } = useLang();
  const fb = useFeedback();
  const mistakes = useRef(0);

  /* Four low-sugar signs and two feelings that are not signs, mixed. */
  const rounds = useMemo(
    () => shuffle([...shuffle(low.signs).slice(0, 4).map((f) => ({ f, sign: true })), ...low.notSigns.map((f) => ({ f, sign: false }))]),
    [],
  );
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('ask');
  const [shake, setShake] = useState<string | null>(null);
  const current = rounds[Math.min(index, rounds.length - 1)];
  const finished = index >= rounds.length;

  const options = useMemo(() => {
    const good = shuffle(low.helps).slice(0, 1 + Math.round(Math.random()));
    const bad = shuffle(low.doesNotHelp).slice(0, 4 - good.length);
    // TODO: awaiting Dr. Zainab — dates and sweets stay hidden until she decides.
    const extra: Item[] = LOW_SHOW_DATES_AND_SWEETS ? low.unconfirmed : [];
    return shuffle([...good, ...bad, ...extra]);
  }, [index]);

  const next = () => {
    const n = index + 1;
    setIndex(n);
    setPhase('ask');
    if (n >= rounds.length) window.setTimeout(() => onFinish(starsFor(mistakes.current, 1, 4)), 1200);
    else speak(tl(rounds[n].f.label), lang);
  };

  const wrong = (id: string, message: string) => {
    mistakes.current++;
    setShake(id);
    window.setTimeout(() => setShake(null), 500);
    fb.soft(message);
  };

  const answer = (yes: boolean) => {
    if (yes !== current.sign) {
      wrong(yes ? 'yes' : 'no', tl(current.sign ? low.isSignMessage : low.notSignMessage));
      return;
    }
    if (current.sign) {
      sfx.good();
      setPhase('help');
      speak(tl(low.helpQuestion), lang);
    } else {
      fb.good(tl(low.notSignMessage));
      window.setTimeout(next, 1400);
    }
  };

  const pick = (item: Item) => {
    if (low.helps.some((h) => h.id === item.id)) {
      sfx.good();
      setPhase('adult');
      speak(`${tl(low.tellAdultPrompt)} ${tl(low.tellAdult)}`, lang);
    } else {
      wrong(item.id, tl(low.helpWrongMessage));
    }
  };

  const energy = Math.round((Math.min(index, rounds.length) / rounds.length) * 100);
  const unwell = current.sign && phase !== 'adult' && !finished;

  return (
    <div className="low-game">
      <div className="energy" aria-label={`${t('energy')} ${energy}%`}>
        <span>{t('energy')}</span>
        <div className="energy-bar" dir="ltr">
          <i style={{ width: `${Math.max(energy, 6)}%` }} />
        </div>
      </div>

      <div className="low-scene" dir="ltr">
        <img src="img/yousif.webp" alt="" draggable={false} className={finished ? 'happy' : unwell ? `feel-${current.f.id}` : ''} />
        {!finished && (
          <div className="feeling" key={current.f.id} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            <Icon name={current.f.icon} size={64} />
            <strong>{tl(current.f.label)}</strong>
          </div>
        )}
      </div>

      {!finished && (
        <div className="low-panel">
          {phase === 'ask' && (
            <>
              <p className="question">{tl(low.question)}</p>
              <div className="choice-row">
                <button className={`btn btn-teal big ${shake === 'yes' ? 'shake' : ''}`} onClick={() => answer(true)}>
                  {t('yes')}
                </button>
                <button className={`btn big ${shake === 'no' ? 'shake' : ''}`} onClick={() => answer(false)}>
                  {t('no')}
                </button>
              </div>
            </>
          )}
          {phase === 'help' && (
            <>
              <p className="question">{tl(low.helpQuestion)}</p>
              <div className="choice-row">
                {options.map((o) => (
                  <button key={o.id} className={`pick ${shake === o.id ? 'shake' : ''}`} onClick={() => pick(o)}>
                    <Icon name={o.icon} size={52} />
                    <span>{tl(o.label)}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          {phase === 'adult' && (
            <>
              <p className="question">{tl(low.tellAdultPrompt)}</p>
              <button
                className="btn btn-teal big adult-btn"
                onClick={() => {
                  sfx.good();
                  next();
                }}
              >
                <img src="img/mother.webp" alt="" draggable={false} />
                {tl(low.tellAdult)}
              </button>
            </>
          )}
        </div>
      )}
      {fb.node}
    </div>
  );
}
