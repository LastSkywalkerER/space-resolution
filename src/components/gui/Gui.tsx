import { KeyboardControlsEntry } from '@react-three/drei';
import { FC } from 'react';

interface GuiProps {
  map: KeyboardControlsEntry<string>[];
  className?: string;
}

export const Gui: FC<GuiProps> = ({ map, className }) => {
  return (
    <div className={className}>
      <h1>Controls</h1>
      {map.map(({ name, keys }) => (
        <p key={name}>{`${name} - ${keys.map((key) => `${key} `)}`}</p>
      ))}
    </div>
  );
};
