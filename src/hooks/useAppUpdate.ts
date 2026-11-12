import { useEffect } from 'react';

/** The built script's file name, e.g. "assets/index-C9P866Eg.js". Vite gives it a new name on every build. */
const SCRIPT = /assets\/index-[\w-]+\.js/;
const CHECK_EVERY = 30 * 60 * 1000;

function atHome() {
  return location.hash === '' || location.hash === '#' || location.hash === '#/';
}

/**
 * Apps installed on a phone's home screen stay open in the background and do not
 * reload by themselves, so they keep running the old version after a deploy.
 * When the app comes back to the front (and every 30 minutes), this fetches index.html
 * fresh and compares its script name with the one running now. If a new version is
 * out, the app reloads: at once on the home screen, or as soon as the child goes back
 * home, so a game is never cut off halfway.
 */
export function useAppUpdate() {
  useEffect(() => {
    const running = document.querySelector<HTMLScriptElement>('script[type="module"][src*="assets/index-"]')?.src.match(SCRIPT)?.[0];
    if (!running) return; // dev server: nothing to compare

    let pending = false;
    let checking = false;

    const reloadWhenHome = () => {
      if (pending && atHome()) location.reload();
    };

    const check = async () => {
      if (pending || checking || document.visibilityState !== 'visible') return;
      checking = true;
      try {
        const res = await fetch(`./index.html?v=${Date.now()}`, { cache: 'no-store' });
        const latest = res.ok ? (await res.text()).match(SCRIPT)?.[0] : undefined;
        if (latest && latest !== running) {
          pending = true;
          reloadWhenHome();
        }
      } catch {
        // offline: try again next time
      } finally {
        checking = false;
      }
    };

    check();
    const timer = window.setInterval(check, CHECK_EVERY);
    document.addEventListener('visibilitychange', check);
    window.addEventListener('focus', check);
    window.addEventListener('pageshow', check);
    window.addEventListener('hashchange', reloadWhenHome);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
      window.removeEventListener('focus', check);
      window.removeEventListener('pageshow', check);
      window.removeEventListener('hashchange', reloadWhenHome);
    };
  }, []);
}
