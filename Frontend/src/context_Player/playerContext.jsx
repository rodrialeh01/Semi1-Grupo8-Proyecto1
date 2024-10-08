import React, { createContext, useState, useContext } from "react";

const PlayerContext = createContext();

const PlayerProvider = ({ children }) => {
    const [cancionActual, setCancionActual] = useState({});
    const [canc, setCanc] = useState([]);
    const [reproduciendose, setReproduciendose] = useState(false);

    const value = {
        cancionActual,
        setCancionActual,
        canc,
        setCanc,
        reproduciendose,
        setReproduciendose
    }

    return (
        <PlayerContext.Provider value={value}>
            {children}
        </PlayerContext.Provider>
    )
}
export default PlayerProvider;
export const usePlayer = () => useContext(PlayerContext);

