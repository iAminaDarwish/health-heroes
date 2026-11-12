import { useCallback, useEffect, useRef, useState } from 'react';
import { useLang } from '../hooks/useLang';
import { sfx, speak } from '../hooks/useSound';
import Icon from './Icon';

type Msg = { text: string; kind: 'good' | 'soft'; n: number };

/** Short message at the bottom of a game: "good" (teal) or a gentle "try again". */
export function useFeedback() {
  const { lang } = useLang();
  const [msg, setMsg] = useState<Msg | null>(null);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const show = useCallback(
    (kind: Msg['kind'], text: string) => {
      if (kind === 'good') sfx.good();
      else sfx.soft();
      speak(text, lang);
      setMsg({ text, kind, n: Date.now() });
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setMsg(null), 2800);
    },
    [lang],
  );

  const node = msg ? (
    <div key={msg.n} className={`toast ${msg.kind}`} role="status">
      {msg.text}
    </div>
  ) : null;

  return {
    node,
    good: (text: string) => show('good', text),
    soft: (text: string) => show('soft', text),
  };
}

export function Stars({ count, size = 28, animate = false }: { count: number; size?: number; animate?: boolean }) {
  return (
    <span className={`stars ${animate ? 'stars-animate' : ''}`} dir="ltr" aria-label={`${count} / 3`}>
      {[1, 2, 3].map((i) => (
        <Icon key={i} name={i <= count ? 'star' : 'starOff'} size={size} />
      ))}
    </span>
  );
}

/** Stars from the number of gentle "try again" moments. */
export function starsFor(mistakes: number, three = 1, two = 4) {
  return mistakes <= three ? 3 : mistakes <= two ? 2 : 1;
}
