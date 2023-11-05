import { Environment } from '@react-three/drei';

import { FC, useEffect, useState } from 'react';
import { Bullet, BulletProps } from '../Bullet';
import { BulletHit } from '../BulletHit';
import { BulletData, Ship } from '../ship';
import { Asteroid } from '../asteroid';
import { asteroids } from '@/constants';
import { Vector3 } from 'three';

interface Hit {
  id: string;
  position: Vector3;
}

export interface ExperienceProps {
  downgradedPerformance?: boolean;
}

export const Experience: FC<ExperienceProps> = ({ downgradedPerformance }) => {
  const [kills, setKills] = useState(0);

  const [bullets, setBullets] = useState<BulletData[]>([]);
  const [hits, setHits] = useState<Hit[]>([]);

  const onFire = (bullet: BulletData) => {
    setBullets((bullets) => [...bullets, bullet]);
  };

  const onHit = (bulletId: string, position: Vector3) => {
    setBullets((bullets) => bullets.filter((bullet) => bullet.id !== bulletId));
    setHits((hits) => [...hits, { id: bulletId, position }]);
  };

  const onHitEnded = (hitId: string) => {
    setHits((hits) => hits.filter((h) => h.id !== hitId));
  };

  const onKilled = () => {
    setKills((oldState) => ++oldState);
  };

  return (
    <>
      <Ship downgradedPerformance={downgradedPerformance} onFire={onFire} />
      {asteroids.map((position, index) => (
        <Asteroid key={index} position={position} onKilled={onKilled} />
      ))}

      {bullets.map((bullet) => (
        <Bullet
          key={bullet.id}
          {...bullet}
          onHit={(position) => onHit(bullet.id, position)}
        />
      ))}

      {hits.map((hit) => (
        <BulletHit key={hit.id} {...hit} onEnded={() => onHitEnded(hit.id)} />
      ))}
      <Environment preset="sunset" />
    </>
  );
};
