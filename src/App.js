// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LetterPage from "./pages/LetterPage";
import ExpandableVideoPlayer from "./components/ExpandableVideoPlayer";
import { endSessionIfNeeded, pinTimestamp, startSessionIfNeeded } from "./simpleTracker";
import ExpandableVideoPlayer_improve from "./components/ExpandableVideoPlayer_improve";

export default function App() {
  const [hasTyped, setHasTyped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [startTyping, setStartTyping] = useState(false);

  

useEffect(() => {
  // Start a session when the app becomes visible
  startSessionIfNeeded();

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      endSessionIfNeeded();
    } else if (document.visibilityState === "visible") {
      startSessionIfNeeded();
    }
  };

  const handlePageHide = () => {
    endSessionIfNeeded(); // Works better on Safari/iOS
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("pagehide", handlePageHide, { capture: true });

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("pagehide", handlePageHide, { capture: true });
  };
}, []);

  

  return (
    <div className="w-[100vw] h-[100dvh]  overflow-hidden">
       {/* MASK  */}
        <div onClick={()=>{
            setIsExpanded(false)
        }} style={{
            backgroundColor:"#000",
            opacity:isExpanded ? (hasTyped ? 0.7 : 0.9) : 0,
            zIndex: isExpanded ? 300 : 0,
            transition:'all .2s linear'
        }} className=' w-full  h-full absolute flex  justify-center items-center '>
          {!hasTyped && (
            <div className="animate-shake text-white text-xl">
              Click Play Button To Start
            </div>
          )}
        </div>
      <div
        className={`absolute ${isExpanded ? 'right-0':'right-2'} top-0 overflow-hidden   `}
        onClick={()=>{
          if(!isExpanded) setIsExpanded(true)
        }}
       style={{
          zIndex: 999,
          width: isExpanded ? "100dvw": 40,
          transition:'all .2s linear'
        }}>
          <ExpandableVideoPlayer_improve hasTyped={hasTyped} setStartTyping={setStartTyping} isExpanded={isExpanded}  setIsExpanded={setIsExpanded} />
      </div>
      {/* <div
        style={{
          zIndex: 999,
          width: isExpanded ? "100vw" : 80,
          height: isExpanded ? "100dvh" : 80,
          transition: " all 0.2s linear",
        }}
        className={`absolute right-0 top-0 ${!isExpanded && (`animate-shakePause`)}`}
      >
        <ExpandableVideoPlayer
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          setStartTyping={setStartTyping}
          hasTyped={hasTyped}
        />
      </div> */}
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <MainPage
                startTyping={startTyping}
                hasTyped={hasTyped}
                setHasTyped={setHasTyped}
              />
            }
          />
          <Route path="/letter/:id" element={<LetterPage />} />
        </Routes>
      </Router>
    </div>
  );
}
