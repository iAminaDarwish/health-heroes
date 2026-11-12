import { Fragment, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { GameProps } from '../components/GameShell';
import { starsFor, useFeedback } from '../components/Feedback';
import Icon from '../components/Icon';
import { insulin, insulinRoom } from '../content/medical';
import { useLang } from '../hooks/useLang';
import { setMuted, sfx, useMuted } from '../hooks/useSound';
import { Teddy } from './InjectionHero';

/** The room picture is 3168 x 1344; every position below is a percent of it. */
const ASPECT = 3168 / 1344;
/** Time for Yousif to walk the whole width of the room. */
const CROSS_MS = 4200;
const POSES = ['walk1', 'walk2', 'cheer', 'wave'] as const;

type Station = {
  /** Tappable part of the picture: left, top, width, height. */
  area: [number, number, number, number];
  /** Centre of the icon bubble. */
  bubble: [number, number];
  /** Where Yousif stands. */
  stand: number;
  clip?: string;
};
/** One place per step, in the same order as insulin.steps. */
const stations: Station[] = [
  { area: [0, 26, 11, 46], bubble: [5.5, 31], stand: 10, clip: 'wash' },
  { area: [40.5, 20, 10, 70], bubble: [39.5, 27], stand: 37, clip: 'prepare' },
  { area: [50.6, 30, 8, 36], bubble: [54.6, 36.5], stand: 61 },
  { area: [59, 30, 17, 50], bubble: [66.5, 36], stand: 66, clip: 'shot' },
  { area: [86, 28, 14, 58], bubble: [91.8, 38], stand: 86, clip: 'box' },
];

export default function InjectionRoom({ onFinish }: GameProps) {
  const nav = useNavigate();
  const { lang, t, tl } = useLang();
  const fb = useFeedback();
  const muted = useMuted();
  const mistakes = useRef(0);
  const calm = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = stageRef.current!;
    const measure = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const timers = useRef<number[]>([]);
  const fallback = useRef(0);
  const stopWater = useRef<() => void>();
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
    return id;
  };
  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      stopWater.current?.();
    },
    [],
  );

  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState(false);
  const [wrong, setWrong] = useState<number | null>(null);
  const [scene, setScene] = useState<'clip' | 'teddy' | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  /* ---- Yousif ---- */
  const [pos, setPos] = useState(28);
  const [dur, setDur] = useState(0);
  const [left, setLeft] = useState(false);
  const [walking, setWalking] = useState(false);
  const [frame, setFrame] = useState(0);
  const [cheer, setCheer] = useState(false);

  useEffect(() => {
    if (!walking) return;
    const id = window.setInterval(() => {
      setFrame((f) => 1 - f);
      sfx.step();
    }, 240);
    return () => window.clearInterval(id);
  }, [walking]);

  const walkTo = (to: number, then: () => void) => {
    const x = Math.min(94, Math.max(6, to));
    const dist = Math.abs(x - pos);
    if (dist < 0.5) return then();
    const ms = calm.current ? 0 : Math.max(300, (dist / 100) * CROSS_MS);
    setLeft(x < pos);
    setDur(ms);
    setPos(x);
    setWalking(true);
    later(() => {
      setWalking(false);
      then();
    }, ms);
  };

  /* The room is as tall as the screen; the camera slides sideways to keep Yousif in view. */
  const worldW = Math.max(stage.w, stage.h * ASPECT);
  const cam = Math.min(0, Math.max(stage.w - worldW, stage.w / 2 - (pos / 100) * worldW));
  const stride = ((stage.w * 0.6) / worldW) * 100;

  const roam = (to: number) => {
    if (busy) return;
    setBusy(true);
    walkTo(to, () => setBusy(false));
  };
  const tapFloor = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    roam(((e.clientX - r.left) / r.width) * 100);
  };

  /* ---- steps ---- */
  const finishStep = () => {
    const n = step + 1;
    setScene(null);
    setCount(0);
    setHint(false);
    setStep(n);
    setCheer(true);
    later(() => setCheer(false), 1300);
    if (n < stations.length) setBusy(false);
    else later(() => onFinish(starsFor(mistakes.current, 1, 4)), 1300);
  };

  const video = useRef<HTMLVideoElement>(null);
  const clipOpen = useRef(false);
  const endClip = () => {
    if (!clipOpen.current) return;
    clipOpen.current = false;
    window.clearTimeout(fallback.current);
    stopWater.current?.();
    sfx.good();
    finishStep();
  };
  const playClip = (name: string) => {
    clipOpen.current = true;
    setScene('clip');
    const v = video.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {
        /* video blocked or missing: the poster stays until the fallback below */
      });
    }
    fallback.current = later(endClip, 6500);
    if (name === 'wash') {
      stopWater.current = sfx.water(4.6);
      [1200, 2100, 3000].forEach((ms) => later(sfx.pop, ms));
    }
    if (name === 'prepare') [900, 1300, 1700, 2100].forEach((ms) => later(sfx.click, ms));
    if (name === 'shot') {
      for (let n = 1; n <= 10; n++) {
        later(() => {
          setCount(n);
          sfx.tick();
        }, 300 + n * 440);
      }
    }
    if (name === 'box') later(sfx.drop, 3000);
  };

  const go = (i: number) => {
    if (busy) return;
    sfx.tap();
    setBusy(true);
    walkTo(stations[i].stand, () => {
      const clip = stations[i].clip;
      if (i < step) setBusy(false);
      else if (i > step) {
        mistakes.current++;
        fb.soft(tl(insulin.wrongStepMessage));
        setWrong(i);
        later(() => setWrong(null), 500);
        setHint(true);
        setBusy(false);
      } else if (clip) playClip(clip);
      else setScene('teddy');
    });
  };

  const tapSite = (id: string) => {
    if (picked) return;
    if (insulinRoom.usedSites.includes(id)) {
      mistakes.current++;
      fb.soft(tl(insulin.usedMessage));
      return;
    }
    setPicked(id);
    fb.good(tl(insulin.sites.find((s) => s.id === id)!.label));
    later(finishStep, 1200);
  };

  const sprite = walking ? (frame ? 'walk2' : 'walk1') : cheer ? 'cheer' : 'wave';
  const move = { transitionDuration: `${dur}ms` };
  /* The clip of the next step that has one, so it is loaded before it is needed. */
  const clip = stations.slice(Math.min(step, stations.length - 1)).find((s) => s.clip)!.clip;
  const playing = step < stations.length;

  return (
    <div className="room-game" ref={stageRef}>
      {stage.h > 0 && (
        <div
          className="room-world"
          dir="ltr"
          style={{ width: worldW, height: worldW / ASPECT, transform: `translateX(${cam}px)`, ...move }}
          onClick={tapFloor}
        >
          <img className="room-bg" src="img/room.webp" alt="" draggable={false} />
          <img className="room-mum" src="img/mother.webp" alt="" draggable={false} />
          <div className={`room-yousif ${walking ? 'walking' : ''}`} style={{ transform: `translateX(${(pos / 100) * worldW}px)`, ...move }}>
            <div className={`room-sprite ${walking && left ? 'flip' : ''}`}>
              {POSES.map((p) => (
                <img key={p} src={`img/yousif-${p}.webp`} alt="" draggable={false} style={{ opacity: p === sprite ? 1 : 0 }} />
              ))}
            </div>
          </div>
          {stations.map((s, i) => (
            <Fragment key={i}>
              <button
                className="room-spot"
                style={{ left: `${s.area[0]}%`, top: `${s.area[1]}%`, width: `${s.area[2]}%`, height: `${s.area[3]}%` }}
                aria-label={tl(insulin.steps[i].label)}
                onClick={(e) => {
                  e.stopPropagation();
                  go(i);
                }}
              />
              <span
                className={`room-bubble ${i < step ? 'done' : hint && i === step ? 'hint' : ''}`}
                style={{ left: `${s.bubble[0]}%`, top: `${s.bubble[1]}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  go(i);
                }}
              >
                <i className={wrong === i ? 'shake' : ''}>
                  <Icon name={i < step ? 'check' : insulin.steps[i].icon} size="64%" />
                </i>
              </span>
            </Fragment>
          ))}
        </div>
      )}

      <div className="room-hud">
        <button className="round-btn" aria-label={t('back')} onClick={() => nav('/')}>
          <Icon name="back" size={28} className="flip-rtl" />
        </button>
        <ol className="room-steps">
          {insulin.steps.map((s, i) => (
            <li key={s.id} className={i < step ? 'done' : i === step ? 'now' : ''}>
              {i < step ? <Icon name={s.icon} size="78%" /> : i + 1}
            </li>
          ))}
        </ol>
        <button
          className="round-btn"
          aria-label={muted ? t('soundOn') : t('soundOff')}
          aria-pressed={muted}
          onClick={() => {
            setMuted(!muted);
            if (muted) sfx.tap();
          }}
        >
          <Icon name={muted ? 'soundOff' : 'soundOn'} size={28} />
        </button>
      </div>

      {!scene && playing && (
        <>
          {cam < -2 && (
            <button className="round-btn room-arrow left" aria-label="←" onClick={() => roam(pos - stride)}>
              <Icon name="back" size={28} />
            </button>
          )}
          {cam > stage.w - worldW + 2 && (
            <button className="round-btn room-arrow right" aria-label="→" onClick={() => roam(pos + stride)}>
              <Icon name="back" size={28} />
            </button>
          )}
          <p className="instruction room-prompt">{tl(step === 0 ? insulinRoom.firstPrompt : insulinRoom.nextPrompt)}</p>
        </>
      )}

      <div className={`room-cut ${scene === 'clip' ? 'on' : ''}`} aria-hidden={scene !== 'clip'}>
        <div className="room-frame">
          <video
            ref={video}
            src={`video/injection-${clip}.mp4`}
            poster={`video/injection-${clip}.jpg`}
            muted
            playsInline
            preload="auto"
            onEnded={endClip}
          />
          {count > 0 && (
            <span key={count} className="room-count">
              {count.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en')}
            </span>
          )}
          {playing && <p className="instruction">{tl(insulin.steps[step].label)}</p>}
        </div>
      </div>

      {scene === 'teddy' && (
        <div className="room-pick">
          <p className="instruction">{tl(insulinRoom.placePrompt)}</p>
          <div className="teddy" dir="ltr">
            <Teddy />
            {insulin.sites.map((s) => {
              const used = insulinRoom.usedSites.includes(s.id) || picked === s.id;
              return (
                <button
                  key={s.id}
                  className={`site ${used ? 'used' : ''}`}
                  style={{ left: `${s.x}%`, top: `${s.y}%` }}
                  onClick={() => tapSite(s.id)}
                  aria-label={tl(s.label)}
                >
                  {used && <Icon name="plaster" size="100%" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {fb.node}
    </div>
  );
}
