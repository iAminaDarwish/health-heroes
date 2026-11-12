import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { LangProvider } from './hooks/useLang';
import TopBar from './components/TopBar';
import Home from './screens/Home';
import GameShell from './components/GameShell';

export default function App() {
  return (
    <LangProvider>
      <MotionConfig reducedMotion="user">
        <HashRouter>
          <div className="app">
            <TopBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/:id" element={<GameShell />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </HashRouter>
      </MotionConfig>
    </LangProvider>
  );
}
