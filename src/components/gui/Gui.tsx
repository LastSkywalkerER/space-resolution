import {KeyboardControlsEntry} from '@react-three/drei';
import {FC, useRef} from 'react';
import cx from 'classnames';

interface GuiProps {
    map: KeyboardControlsEntry<string>[];
    className?: string;
    isPlaying: boolean;
    setIsPlaying: (state: boolean) => void;
}


export const Gui: FC<GuiProps> = ({
                                      map,
                                      className,
                                      isPlaying,
                                      setIsPlaying,
                                  }) => {
    const audio = useRef<HTMLAudioElement | null>(null);

    const beginGame = () => {
        audio.current?.play();
        setIsPlaying(true);
    };

    return (
        <div className={cx('w-full h-full', className)}>
            <audio
                ref={audio}
                src="audios/ambient.mp3"
                autoPlay
                onEnded={(event) => event.currentTarget.play()}
            />

            <h1>Controls</h1>
            {map.map(({name, keys}) => (
                <p key={name}>{`${name} - ${keys.map((key) => `${key} `)}`}</p>
            ))}



            {!isPlaying && (
                <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded fixed top-1/2 left-1/2"
                    onClick={beginGame}
                >
                    Play
                </button>
            )}
        </div>
    );
};
