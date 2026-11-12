import { useMemo, useRef, useState } from 'react';
import DragItem from '../components/DragItem';
import type { GameProps } from '../components/GameShell';
import { starsFor, useFeedback } from '../components/Feedback';
import Icon from '../components/Icon';
import { plate, type PlateZone } from '../content/medical';
import { useLang } from '../hooks/useLang';
import { shuffle } from '../hooks/useProgress';

const ZONES: PlateZone[] = ['veg', 'protein', 'starch'];

export default function YousifsPlate({ onFinish }: GameProps) {
  const { t, tl } = useLang();
  const fb = useFeedback();
  const foods = useMemo(() => shuffle(plate.foods), []);
  const drinks = useMemo(() => shuffle(plate.drinks), []);
  const [placed, setPlaced] = useState<Record<PlateZone, string[]>>({ veg: [], protein: [], starch: [] });
  const [drink, setDrink] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [shake, setShake] = useState<string | null>(null);
  const mistakes = useRef(0);

  const plateFull = ZONES.every((z) => placed[z].length >= plate.zones[z].capacity);
  const placedIds = ZONES.flatMap((z) => placed[z]);

  const nope = (id: string, message: string) => {
    mistakes.current++;
    setShake(id);
    window.setTimeout(() => setShake(null), 500);
    fb.soft(message);
  };

  const drop = (id: string, zone: string) => {
    setSelected(null);
    if (!plateFull) {
      const food = plate.foods.find((f) => f.id === id);
      if (!food || zone === 'drink') return;
      const z = zone as PlateZone;
      if (food.zone === null) return nope(id, tl(plate.treatMessage));
      if (food.zone !== z) return nope(id, tl(plate.wrongZoneMessage));
      if (placed[z].length >= plate.zones[z].capacity) return nope(id, tl(plate.fullZoneMessage));
      const next = { ...placed, [z]: [...placed[z], id] };
      setPlaced(next);
      const nowFull = ZONES.every((k) => next[k].length >= plate.zones[k].capacity);
      fb.good(nowFull ? tl(plate.drinkQuestion) : `${tl(food.label)}: ${tl(plate.zones[z].label)}`);
      return;
    }
    const d = plate.drinks.find((x) => x.id === id);
    if (!d || drink) return;
    if (!d.ok) return nope(id, tl(plate.drinkWrongMessage));
    setDrink(id);
    fb.good(tl(d.label));
    window.setTimeout(() => onFinish(starsFor(mistakes.current, 1, 4)), 1500);
  };

  /* Tapping also works: tap a food, then tap its place. */
  const tapZone = (zone: string) => selected && drop(selected, zone);

  const tray = plateFull ? drinks : foods.filter((f) => !placedIds.includes(f.id));

  return (
    <div className="plate-game">
      <p className="instruction">{plateFull ? tl(plate.drinkQuestion) : tl(plate.instruction)}</p>
      <div className="plate-row" dir="ltr">
        <div className="plate">
          {ZONES.map((z) => {
            const full = placed[z].length >= plate.zones[z].capacity;
            return (
              <div key={z} className={`zone zone-${z} ${full ? 'full' : ''}`} data-drop={z} onClick={() => tapZone(z)}>
                <span className="zone-label">{tl(plate.zones[z].label)}</span>
                <div className="zone-items">
                  {placed[z].map((id) => (
                    <Icon key={id} name={plate.foods.find((f) => f.id === id)!.icon} size={z === 'veg' ? 54 : 46} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className={`cup ${plateFull ? 'ready' : ''} ${drink ? 'full' : ''}`} data-drop="drink" onClick={() => tapZone('drink')}>
          {drink ? <Icon name={plate.drinks.find((d) => d.id === drink)!.icon} size={64} /> : <span className="zone-label">{t('drink')}</span>}
        </div>
      </div>

      <div className="tray">
        {!drink &&
          tray.map((it) => (
            <DragItem
              key={it.id}
              item={it}
              selected={selected === it.id}
              shake={shake === it.id}
              onDrop={(zone) => drop(it.id, zone)}
              onTap={() => setSelected(selected === it.id ? null : it.id)}
            />
          ))}
      </div>
      {fb.node}
    </div>
  );
}
