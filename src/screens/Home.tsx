import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { Stars } from '../components/Feedback';
import { draftNote, gameContent, type GameId, PARENTS_NOTE_ENABLED, parentsNote, REVIEWED_BY_DOCTOR } from '../content/medical';
import { gameList } from '../games';
import { useLang } from '../hooks/useLang';
import { useProgress } from '../hooks/useProgress';
import { sfx, speak, unlockAudio } from '../hooks/useSound';

/** The gate video is shown once per visit; coming back from a game skips it. */
let startedOnce = false;

const circles = gameList.filter((g) => !g.variantOf);
/** A game and its other ways to play. */
const modesOf = (id: GameId) => gameList.filter((g) => g.id === id || g.variantOf === id);

function useMedia(query: string) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

export default function Home() {
  const nav = useNavigate();
  const { lang, t, tl } = useLang();
  const { stars } = useProgress();
  const [phase, setPhase] = useState<'gate' | 'video' | 'ready'>(startedOnce ? 'ready' : 'gate');
  const [animate] = useState(!startedOnce);
  const [showNote, setShowNote] = useState(false);
  const [choice, setChoice] = useState<GameId | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timers = useRef<number[]>([]);

  /* Three cuts of the gate video: tall 9:16 for phones, 3:4 for an upright
     iPad, and 16:9 for desktop and an iPad on its side. */
  const upright = useMedia('(min-aspect-ratio: 13/20)');
  const landscape = useMedia('(min-aspect-ratio: 1/1)');
  const base = `video/gate-${landscape ? 'landscape' : upright ? 'wide' : 'portrait'}`;

  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  const revealed = useRef(startedOnce);
  const reveal = () => {
    if (revealed.current) return;
    revealed.current = true;
    speak(t('appTitle'), lang);
    circles.forEach((_, i) => timers.current.push(window.setTimeout(sfx.pop, 500 + i * 150)));
    setPhase('ready');
  };

  const start = () => {
    unlockAudio();
    startedOnce = true;
    sfx.whoosh();
    setPhase('video');
    videoRef.current?.play().catch(() => {
      /* video blocked or missing: the poster stays */
    });
    timers.current.push(window.setTimeout(reveal, 2000));
  };

  const play = (id: GameId, wait: number) => {
    sfx.pop();
    timers.current.push(window.setTimeout(() => nav(`/game/${id}`), wait));
  };

  const open = (id: GameId) => {
    unlockAudio();
    speak(tl(gameContent[id].name), lang);
    if (modesOf(id).length > 1) {
      sfx.pop();
      setChoice(id);
    } else play(id, 450);
  };

  return (
    <main className={`home phase-${phase}`}>
      <div className="home-blur" style={{ backgroundImage: `url(${base}.jpg)` }} />
      <video
        key={base}
        ref={videoRef}
        className="home-video"
        src={`${base}.mp4`}
        poster={`${base}.jpg`}
        muted
        loop
        playsInline
        preload="auto"
        autoPlay={phase !== 'gate'}
      />
      <div className="home-scrim" />

      {phase === 'gate' && (
        <button className="start-btn" onClick={start}>
          {t('tapToStart')}
        </button>
      )}

      {phase === 'ready' && (
        <div className={`home-content ${animate ? 'animate' : ''}`}>
          <h1 className="home-title">{t('appTitle')}</h1>
          <nav className="circles">
            {circles.map((g, i) => (
              <button key={g.id} className="circle" style={{ animationDelay: `${0.5 + i * 0.15}s` }} onClick={() => open(g.id)}>
                <span className="circle-disc">
                  <Icon name={g.icon} size="62%" />
                </span>
                <span className="circle-label">{tl(gameContent[g.id].name)}</span>
                <Stars count={Math.max(...modesOf(g.id).map((m) => stars[m.id] || 0))} size={16} />
              </button>
            ))}
          </nav>
          {PARENTS_NOTE_ENABLED && (
            <button className="parents-btn" onClick={() => setShowNote(true)}>
              {t('parents')}
            </button>
          )}
        </div>
      )}

      {choice && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setChoice(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>{tl(gameContent[choice].name)}</h2>
            <div className="mode-row">
              {modesOf(choice).map((g, i) => (
                <button key={g.id} className="pick mode-pick" onClick={() => play(g.id, 300)}>
                  <Icon name={g.icon} size={56} />
                  <strong>
                    {t('game')} {i + 1}
                  </strong>
                  {g.mode && <span>{t(g.mode)}</span>}
                  <Stars count={stars[g.id] || 0} size={18} />
                </button>
              ))}
            </div>
            <button className="btn" onClick={() => setChoice(null)}>
              {t('close')}
            </button>
          </div>
        </div>
      )}

      {showNote && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setShowNote(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>{t('parents')}</h2>
            <p>{tl(parentsNote)}</p>
            {!REVIEWED_BY_DOCTOR && <p className="draft-note">{tl(draftNote)}</p>}
            <button className="btn" onClick={() => setShowNote(false)}>
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
