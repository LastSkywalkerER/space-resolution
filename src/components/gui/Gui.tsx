import { KeyboardControlsEntry } from "@react-three/drei";
import { FC, useEffect, useRef, useState } from "react";
import cx from "classnames";
import { useGame } from "@/services/game.service";
import { utils } from "ethers";
import { ConnectWallet, Web3Button, useSigner } from "@thirdweb-dev/react";

interface GuiProps {
  map: KeyboardControlsEntry<string>[];
  className?: string;
  isPlaying: boolean;
  setIsPlaying: (state: boolean) => void;
}

export const Gui: FC<GuiProps> = ({ map, className, isPlaying, setIsPlaying }) => {
  const audio = useRef<HTMLAudioElement | null>(null);
  const signer = useSigner();

  const { bullets, buyBullets: buyGameBullets, wreckedEthers, loadGameData } = useGame();

  useEffect(() => {
    signer && loadGameData(signer);
  }, [signer]);

  const beginGame = () => {
    audio.current?.play();
    setIsPlaying(true);
  };

  const buyBullets = async () => {
    signer && (await buyGameBullets(signer, 100));
  };

  return (
    <div className={cx("w-full h-full text-white", className)}>
      <audio
        ref={audio}
        src="audios/ambient.mp3"
        autoPlay
        onEnded={(event) => event.currentTarget.play()}
      />

      <h1>Controls</h1>
      {map.map(({ name, keys }) => (
        <p key={name}>{`${name} - ${keys.map((key) => `${key} `)}`}</p>
      ))}
      {signer ? (
        <>
          <h1>Player</h1>
          {isPlaying && <ConnectWallet />}
          <p>{`Bullets - ${bullets}`}</p>
          <p>{`Wrecked Ethers - ${wreckedEthers}`}</p>
        </>
      ) : null}

      {!isPlaying && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-12">
          {signer && (
            <>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={beginGame}
              >
                Play
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={buyBullets}
              >
                Buy Bullets
              </button>
            </>
          )}
          <ConnectWallet />
        </div>
      )}
    </div>
  );
};
