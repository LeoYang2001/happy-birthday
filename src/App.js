// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LetterPage from "./pages/LetterPage";
import ExpandableVideoPlayer from "./components/ExpandableVideoPlayer";

export default function App() {
  const [hasTyped, setHasTyped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [startTyping, setStartTyping] = useState(false);

  return (
    <div className="w-[100vw] h-[100vh]  overflow-hidden">
      <div
        style={{
          zIndex: 999,
          width: isExpanded ? "100vw" : 80,
          height: isExpanded ? "100vh" : 80,
          transition: " all 0.2s linear",
        }}
        className="absolute right-0 top-0  bg-red-500 border border-red-500 "
      >
        <ExpandableVideoPlayer
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          setStartTyping={setStartTyping}
        />
      </div>
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
