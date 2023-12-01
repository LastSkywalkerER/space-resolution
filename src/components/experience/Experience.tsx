import { Environment } from "@react-three/drei";

import { FC, useEffect, useState } from "react";
import { Bullet, BulletProps } from "../Bullet";
import { BulletHit } from "../BulletHit";
import { Ship } from "../ship";
import { Asteroid } from "../asteroid";
import { asteroids } from "@/constants";
import { Vector3 } from "three";
import { useGame } from "@/services/game/game.service";
import { Signer } from "ethers";
import { BulletData } from "@/types/game.types";
import { useSigner } from "@thirdweb-dev/react";

interface Hit {
  id: string;
  position: Vector3;
}

export interface ExperienceProps {
  downgradedPerformance?: boolean;
}

export const Experience: FC<ExperienceProps> = ({ downgradedPerformance }) => {
  const { ethers, init, onShoot, position } = useGame();
  const signer = useSigner();

  const [bullets, setBullets] = useState<BulletData[]>([]);
  const [hits, setHits] = useState<Hit[]>([]);

  useEffect(() => {
    signer && init(signer);
  }, [signer]);

  const onFire = async (bullet: BulletData) => {
    await onShoot(bullet.position);
    setBullets((bullets) => [...bullets, bullet]);
  };

  const onHit = (bulletId: string, position: Vector3) => {
    setBullets((bullets) => bullets.filter((bullet) => bullet.id !== bulletId));
    setHits((hits) => [...hits, { id: bulletId, position }]);
  };

  const onHitEnded = (hitId: string) => {
    setHits((hits) => hits.filter((h) => h.id !== hitId));
  };

  return (
    <>
      <Ship downgradedPerformance={downgradedPerformance} onFire={onFire} position={position} />
      {ethers.map(({ id, position }) => (
        <Asteroid key={id} position={position} id={id} />
      ))}

      {bullets.map((bullet) => (
        <Bullet key={bullet.id} {...bullet} onHit={(position) => onHit(bullet.id, position)} />
      ))}

      {hits.map((hit) => (
        <BulletHit key={hit.id} {...hit} onEnded={() => onHitEnded(hit.id)} />
      ))}
      <Environment preset="sunset" />
    </>
  );
};
