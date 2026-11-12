import { useMemo, useRef, useState } from 'react';
import DragItem from '../components/DragItem';
import type { GameProps } from '../components/GameShell';
import { starsFor, useFeedback } from '../components/Feedback';
import Icon from '../components/Icon';
import { grow, type Item } from '../content/medical';
import { useLang } from '../hooks/useLang';
import { shuffle } from '../hooks/useProgress';

export default function GrowYousif({ onFinish }: GameProps) {
  const { tl } = useLang();
  const fb = useFeedback();
  const items = useMemo(() => shuffle([...grow.healthy, ...grow.sometimes]), []);
  const [given, setGiven] = useState<string[]>([]);
  const [tried, setTried] = useState<string[]>([]);
  const [shake, setShake] = useState<string | null>(null);
  const mistakes = useRef(0);

  const total = grow.healthy.length;
  const step = given.length;
  const done = step >= total;

  const give = (item: Item) => {
    if (done || given.includes(item.id)) return;
    if (grow.healthy.some((h) => h.id === item.id)) {
      const next = [...given, item.id];
      setGiven(next);
      fb.good(`${tl(item.label)} ${tl(grow.healthyMessage)}`);
      if (next.length >= total) window.setTimeout(() => onFinish(starsFor(mistakes.current, 1, 3)), 1600);
    } else {
      if (!tried.includes(item.id)) {
        mistakes.current++;
        setTried([...tried, item.id]);
      }
      setShake(item.id);
      window.setTimeout(() => setShake(null), 500);
      fb.soft(tl(grow.sometimesMessage));
    }
  };

  return (
    <div className="grow-game">
      <p className="instruction">{tl(grow.instruction)}</p>
      <div className="grow-stage" data-drop="yousif" dir="ltr">
        <div className="ruler" aria-label={`${step} / ${total}`}>
          {Array.from({ length: total }, (_, i) => (
            <i key={i} className={total - i <= step ? 'on' : ''} />
          ))}
        </div>
        <div className="yousif-box">
          {done && <Icon name="medal" size={72} className="medal" />}
          <img
            src="img/yousif.webp"
            alt=""
            draggable={false}
            className={done ? 'happy' : ''}
            style={{ height: `${52 + (step / total) * 48}%` }}
          />
        </div>
      </div>

      <div className="tray">
        {items
          .filter((it) => !given.includes(it.id))
          .map((it) => (
            <DragItem
              key={it.id}
              item={it}
              disabled={done}
              shake={shake === it.id}
              onDrop={(zone) => zone === 'yousif' && give(it)}
              onTap={() => give(it)}
            />
          ))}
      </div>
      {fb.node}
    </div>
  );
}
