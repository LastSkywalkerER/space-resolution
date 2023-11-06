import {createContext, FC, ReactElement} from "react";
import {Joystick} from "react-joystick-component";

const ControlsContext = createContext({})

export const ConctrolsProvider: FC<{ children: ReactElement | ReactElement[]; }> = ({children}) => {
    return <ControlsContext.Provider value={{}}><Joystick size={100}  move={(data) => {
        console.log(data)
    }}
    ></Joystick>{children}</ControlsContext.Provider >
};