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
            speak(`${t('wellDone')} ${tl(content.endMessage)}`, lang);
          }}
        />
      </div>

      {result !== null && (
        <div className="welldone" role="dialog" aria-modal="true">
          <div className="welldone-card">
            <Stars count={result} size={64} animate />
            <h2>{t('wellDone')}</h2>
            <p>{tl(content.endMessage)}</p>
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
