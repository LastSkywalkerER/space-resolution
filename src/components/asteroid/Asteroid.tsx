import {
  CollisionPayload,
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
  vec3,
} from "@react-three/rapier";
import { FC, useRef, useState } from "react";
import { BulletUserData } from "../Bullet";
import { CustomFbxLoader } from "../customObject";
import { asteroidAssets } from "./asssets";
import { Vector3 } from "three";
import { useGame } from "@/services/game/game.service";
import { useSigner } from "@thirdweb-dev/react";

export interface AsteroidProps {
  onKilled?: () => void;
  id: number;
}

export const Asteroid: FC<RigidBodyProps & AsteroidProps> = ({ onKilled, id, ...props }) => {
  const rigidBody = useRef<RapierRigidBody | null>(null);

  const signer = useSigner();
  const { onHit } = useGame();

  const [isDead, setIsDead] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Vector3 | null>(null);

  const intersectionHandler = async ({ other }: CollisionPayload) => {
    if ((other.rigidBody?.userData as BulletUserData).type === "bullet" && signer) {
      setCurrentPosition(vec3(rigidBody.current?.translation()));

      try {
        await onHit(signer, vec3(rigidBody.current?.translation()), id);
        setIsDead(true);
        onKilled && onKilled();
      } catch (error) {
        setCurrentPosition(null);
      }
    }
  };

  if (isDead) {
    return null;
  }

  if (currentPosition) {
    return (
      <mesh position={currentPosition}>
        <boxGeometry />
        <meshBasicMaterial color={"red"} />
      </mesh>
    );
  }

  return (
    <RigidBody
      ref={rigidBody}
      {...props}
      angularVelocity={[0, 1, 0]}
      enabledTranslations={[true, false, true]}
      onIntersectionEnter={intersectionHandler}
      colliders={"hull"}
    >
      <CustomFbxLoader {...asteroidAssets} />
    </RigidBody>
  );
};
