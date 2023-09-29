import React, { useEffect, useRef, useState } from "react";
import "./Reproductor.css";

const Vol = ({
  audioElem,
  reproduciendose,
  setReproduciendos,
  cancionActual,
  setCancionActual,
  canciones,
}) => {
  const volumenRef = useRef();
  const [volValue, setVolValue] = useState(1);

  const setVolume = (e) => {
    const vol = e.nativeEvent.offsetX;
    const volWidth = volumenRef.current.clientWidth;

    const volValue2 = (vol / volWidth) * 100;
    setVolValue(volValue2);
    audioElem.current.volume = volValue2 / 100;
  };

  return (
    <div className="flex p-5 w-11/12">
        
       <div className="flex justify-between items-center">
       {volValue == 0 ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        )}
       </div>
      <div className="navigation flex justify-between items-center ml-2">
        <div
          className="navigation_wrapper3 "
          onClick={setVolume}
          ref={volumenRef}
        >
          <div className="vol_bar" style={{ width: `${volValue + "%"}` }}></div>
        </div>
      </div>
    </div>
  );
};
export default Vol;
