export interface BulletData {
  id: number;
  position: THREE.Vector3;
  hitPosition?: THREE.Vector3;
  angle: THREE.Quaternion;
  player: string;
}
