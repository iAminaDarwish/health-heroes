import { useLang } from '../hooks/useLang';
import { setMuted, sfx, unlockAudio, useMuted } from '../hooks/useSound';
import Icon from './Icon';

/** Doctor's name stays at the top LEFT in both languages; buttons at the top right. */
export default function TopBar() {
  const { lang, setLang, t } = useLang();
  const muted = useMuted();

  return (
    <header className="topbar" dir="ltr">
      <span className="topbar-name" lang="ar" dir="rtl">
        د. زينب ناصر
      </span>
      <div className="topbar-buttons">
        <button
          className="round-btn"
          aria-label={muted ? t('soundOn') : t('soundOff')}
          aria-pressed={muted}
          onClick={() => {
            unlockAudio();
            setMuted(!muted);
            if (muted) sfx.tap();
          }}
        >
          <Icon name={muted ? 'soundOff' : 'soundOn'} size={28} />
        </button>
        <button
          className="lang-btn"
          lang={lang === 'ar' ? 'en' : 'ar'}
          onClick={() => {
            unlockAudio();
            sfx.tap();
            setLang(lang === 'ar' ? 'en' : 'ar');
          }}
        >
          {t('switchLang')}
        </button>
      </div>
    </header>
  );
}
