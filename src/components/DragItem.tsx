import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { Item } from '../content/medical';
import { useLang } from '../hooks/useLang';
import Icon from './Icon';

type Props = {
  item: Item;
  /** Called with the id of the drop zone (an element with data-drop="id") the item was let go over. */
  onDrop: (zone: string) => void;
  /** Tap without dragging (for children who prefer tapping). */
  onTap?: () => void;
  selected?: boolean;
  disabled?: boolean;
  shake?: boolean;
};

/** A picture that can be dragged with a finger or a mouse. It springs back if not accepted. */
export default function DragItem({ item, onDrop, onTap, selected, disabled, shake }: Props) {
  const { tl } = useLang();
  const dragged = useRef(false);

  return (
    <motion.button
      className={`drag-item ${selected ? 'selected' : ''} ${disabled ? 'dim' : ''} ${shake ? 'shake' : ''}`}
      drag={!disabled}
      dragSnapToOrigin
      dragMomentum={false}
      dragElastic={1}
      whileDrag={{ scale: 1.2, zIndex: 60 }}
      onDragStart={() => {
        dragged.current = true;
      }}
      onDragEnd={(e) => {
        const p = 'changedTouches' in e ? e.changedTouches[0] : (e as MouseEvent);
        const zone = document
          .elementsFromPoint(p.clientX, p.clientY)
          .map((el) => el.closest('[data-drop]'))
          .find(Boolean);
        if (zone) onDrop(zone.getAttribute('data-drop')!);
        window.setTimeout(() => (dragged.current = false), 60);
      }}
      onClick={() => {
        if (!dragged.current && !disabled) onTap?.();
      }}
      aria-label={tl(item.label)}
      aria-pressed={selected}
    >
      <Icon name={item.icon} size="100%" />
      <span className="drag-label">{tl(item.label)}</span>
    </motion.button>
  );
}
