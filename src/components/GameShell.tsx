import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { gameContent, type GameId } from '../content/medical';
import { gameList } from '../games';
import { useLang } from '../hooks/useLang';
import { useProgress } from '../hooks/useProgress';
import { sfx, speak, stopSpeaking } from '../hooks/useSound';
import Icon from './Icon';
import { Stars } from './Feedback';

export type GameProps = { onFinish: (stars: number) => void };

type WaitNote = typeof gameContent.insulinRoom.waitNote;

/** Needle → clock → plate, with a dot walking along the dashed line: "wait, then eat". */
function WaitTimeline({ note }: { note: WaitNote }) {
  const { tl } = useLang();
  return (
    <div className="wait-note" role="note" aria-label={tl(note.spoken)}>
      <div className="wait-track" aria-hidden="true">
        <div className="wait-stop">
          <span className="wait-bub">
            <svg viewBox="0 0 48 48" width="36" height="36">
              <g transform="rotate(45 24 24)" stroke="#1e3a56" strokeWidth="2.8" strokeLinejoin="round">
                <rect x="18" y="6" width="12" height="26" rx="4" fill="#2f6db5" />
                <rect x="20" y="32" width="8" height="5" fill="#fff" />
                <path d="M24 37v7" strokeLinecap="round" />
              </g>
            </svg>
          </span>
          {tl(note.needle)}
        </div>
        <div className="wait-stop">
          <span className="wait-bub">
            <svg viewBox="0 0 48 48" width="36" height="36">
              <circle cx="24" cy="24" r="19" fill="#fff" stroke="#1e3a56" strokeWidth="3.2" />
              <path className="wait-hand" d="M24 24V13" stroke="#2f6db5" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M24 24l7 5" stroke="#1e3a56" strokeWidth="3.2" strokeLinecap="round" />
            </svg>
          </span>
          {tl(note.wait)}
        </div>
        <div className="wait-stop">
          <span className="wait-bub">
            <svg viewBox="0 0 48 48" width="38" height="38">
              <path d="M6 8v9M10 8v9M14 8v9M6 17q4 4 8 0M10 19v21" stroke="#1e3a56" strokeWidth="2.6" strokeLinecap="round" fill="none" />
              <circle cx="28" cy="26" r="12" fill="#fff" stroke="#1e3a56" strokeWidth="3" />
              <circle cx="28" cy="26" r="7" fill="#3fae9f" opacity="0.4" />
              <ellipse cx="43" cy="13" rx="2.6" ry="4" fill="none" stroke="#1e3a56" strokeWidth="2.4" />
              <path d="M43 17v23" stroke="#1e3a56" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          </span>
          {tl(note.eat)}
        </div>
        <span className="wait-walker" />
      </div>
      <span className="wait-text">{tl(note.shown)}</span>
    </div>
  );
}

/** Frame shared by all six games: back button, title, instruction, "well done" screen. */
export default function GameShell() {
  const { id } = useParams();
  const nav = useNavigate();
  const { lang, t, tl } = useLang();
  const { stars, saveStars } = useProgress();
  const [run, setRun] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const game = gameList.find((g) => g.id === id);
  const content = game ? gameContent[game.id as GameId] : null;

  useEffect(() => {
    if (content) speak(content.instruction[lang], lang);
    return stopSpeaking;
  }, [content, lang, run]);

  if (!game || !content) return <Navigate to="/" replace />;
  const Game = game.Component;
  const waitNote = 'waitNote' in content ? content.waitNote : null;

  return (
    <main className={`game bg-${game.bg} ${game.fullscreen ? 'game-full' : ''}`}>
      {!game.fullscreen && (
        <div className="game-head">
          <button className="round-btn" aria-label={t('back')} onClick={() => nav('/')}>
            <Icon name="back" size={28} className="flip-rtl" />
          </button>
          <h1>{tl(content.name)}</h1>
          <Stars count={stars[game.id] || 0} size={22} />
        </div>
      )}

      <div className="game-body">
        <Game
          key={`${run}-${lang}`}
          onFinish={(n) => {
            saveStars(game.id, n);
            setResult(n);
            sfx.win();
            speak(`${t('wellDone')} ${tl(content.endMessage)}${waitNote ? ` ${tl(waitNote.spoken)}` : ''}`, lang);
          }}
        />
      </div>

      {result !== null && (
        <div className="welldone" role="dialog" aria-modal="true">
          <div className="welldone-card">
            <Stars count={result} size={64} animate />
            <h2>{t('wellDone')}</h2>
            <p>{tl(content.endMessage)}</p>
            {waitNote && <WaitTimeline note={waitNote} />}
            <div className="welldone-buttons">
              <button
                className="btn"
                onClick={() => {
                  setResult(null);
                  setRun((r) => r + 1);
                }}
              >
                <Icon name="replay" size={24} /> {t('playAgain')}
              </button>
              <button className="btn btn-teal" onClick={() => nav('/')}>
                <Icon name="home" size={24} /> {t('home')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
