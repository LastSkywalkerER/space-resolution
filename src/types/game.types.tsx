import { Vector3 } from "three";

export interface BulletData {
  id: number;
  position: THREE.Vector3;
  hitPosition?: THREE.Vector3;
  angle: THREE.Quaternion;
  player: string;
}

export interface ShipSpecs {
  MOVE_SPEED: number;
  MOVE_ANGLE_SPEED: number;
  SHIP_MASS: number;
  LINEAR_DAMPING: number;
  ANGULAR_DAMPING: number;
  FIRE_RATE: number;
  WEAPON_OFFSET: Vector3;
}
