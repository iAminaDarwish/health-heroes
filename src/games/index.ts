import type { ComponentType } from 'react';
import type { GameProps } from '../components/GameShell';
import type { UiKey } from '../content/ar';
import type { GameId } from '../content/medical';
import PopTheSigns from './PopTheSigns';
import GrowYousif from './GrowYousif';
import InjectionHero from './InjectionHero';
import InjectionRoom from './InjectionRoom';
import LowSugarRescue from './LowSugarRescue';
import YousifsPlate from './YousifsPlate';
import MemoryMatch from './MemoryMatch';

export type GameEntry = {
  id: GameId;
  icon: string;
  /** Background scene: clinic, home, or plain. */
  bg: 'clinic' | 'home' | 'plain';
  Component: ComponentType<GameProps>;
  /** A second way to play that game: the home screen offers both when its circle is tapped. */
  variantOf?: GameId;
  /** Name of this way of playing, shown in that choice. */
  mode?: UiKey;
  /** Covers the whole screen, top bar included. */
  fullscreen?: boolean;
};

export const gameList: GameEntry[] = [
  { id: 'pop', icon: 'drop', bg: 'clinic', Component: PopTheSigns },
  { id: 'grow', icon: 'ruler', bg: 'plain', Component: GrowYousif },
  { id: 'insulin', icon: 'pen', bg: 'plain', Component: InjectionHero, mode: 'modeSteps' },
  { id: 'insulinRoom', icon: 'home', bg: 'plain', Component: InjectionRoom, variantOf: 'insulin', mode: 'modeRoom', fullscreen: true },
  { id: 'low', icon: 'juice', bg: 'home', Component: LowSugarRescue },
  { id: 'plate', icon: 'plate', bg: 'plain', Component: YousifsPlate },
  { id: 'memory', icon: 'cards', bg: 'plain', Component: MemoryMatch },
];
