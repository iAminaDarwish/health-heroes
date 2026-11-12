import { useEffect, useMemo, useRef, useState } from 'react';
import type { GameProps } from '../components/GameShell';
import Icon from '../components/Icon';
import { memory, type Item } from '../content/medical';
import { useLang } from '../hooks/useLang';
import { shuffle } from '../hooks/useProgress';
import { sfx, speak } from '../hooks/useSound';

export default function MemoryMatch({ onFinish }: GameProps) {
  const { lang, t, tl } = useLang();
  const deck = useMemo(() => shuffle(memory.cards.flatMap((c) => [{ key: `${c.id}-a`, card: c }, { key: `${c.id}-b`, card: c }])), []);
  const [open, setOpen] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [last, setLast] = useState<Item | null>(null);
  const [moves, setMoves] = useState(0);
  const lock = useRef(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);
  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const flip = (key: string, card: Item) => {
    if (lock.current || open.includes(key) || matched.includes(card.id)) return;
    sfx.flip();
    if (open.length === 0) {
      setOpen([key]);
      return;
    }
    const first = deck.find((d) => d.key === open[0])!;
    setOpen([open[0], key]);
    setMoves((m) => m + 1);
    lock.current = true;

    if (first.card.id === card.id) {
      later(() => {
        const all = [...matched, card.id];
        setMatched(all);
        setOpen([]);
        setLast(card);
        sfx.good();
        // Say the name in the current language, then in the other one.
        speak(card.label[lang], lang);
        const other = lang === 'ar' ? 'en' : 'ar';
        later(() => {
          if ('speechSynthesis' in window && !window.speechSynthesis.speaking) speak(card.label[other], other);
        }, 1700);
        lock.current = false;
        if (all.length === memory.cards.length) {
          const total = moves + 1;
          later(() => onFinish(total <= 12 ? 3 : total <= 18 ? 2 : 1), 2200);
        }
      }, 500);
    } else {
      later(() => {
        setOpen([]);
        lock.current = false;
      }, 1000);
    }
  };

  return (
    <div className="memory-game">
      <p className="instruction">{tl(memory.instruction)}</p>
      <div className="memory-info">
        <span>
          {t('moves')}: <strong>{moves}</strong>
        </span>
      </div>
      <div className="memory-grid" dir="ltr">
        {deck.map(({ key, card }) => {
          const up = open.includes(key) || matched.includes(card.id);
          return (
            <button
              key={key}
              className={`mcard ${up ? 'up' : ''} ${matched.includes(card.id) ? 'matched' : ''}`}
              onClick={() => flip(key, card)}
              aria-label={up ? card.label[lang] : '?'}
            >
              <span className="mcard-inner">
                <span className="mcard-back">
                  <Icon name="bluecircle" size="50%" />
                </span>
                <span className="mcard-front">
                  <Icon name={card.icon} size="72%" />
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="memory-name" role="status">
        {last && (
          <div key={last.id} className="name-pair">
            <strong lang="ar" dir="rtl">
              {last.label.ar}
            </strong>
            <strong lang="en" dir="ltr">
              {last.label.en}
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}
