// MainPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useAnimation,
} from "framer-motion";
import foxWallpaper from "../assets/fox.png";
import postcardsData from "../postcards.json";
import PostCard from "../components/PostCard";
import { useLocation } from "react-router-dom";
import config from "../configuration.json";
import { ArrowDown } from "lucide-react";
import { pinTimestamp } from "../simpleTracker";

const postcards = postcardsData.map((card) => ({
  ...card,
  image: require(`../assets/${card.image}`),
}));

const SCREEN_WIDTH = window.screen.width;

const SCROLL_OFFSET = 0;

export default function MainPage({
  typingAudioRef,
  hasTyped,
  setHasTyped,
  startTyping,
}) {
  const [typedGreeting, setTypedGreeting] = useState("");
   const [showBtn, setShowBtn] = useState(false)
  const [hasClicked, setHasClicked] = useState(false)


  useEffect(() => {
    pinTimestamp("Main Page");
  }, []);

  


  useEffect(() => {
    if (!startTyping) return;
    const fullMessage = config.greetingMessage;
    let index = 0;

    if (hasTyped) {
      return setTypedGreeting(fullMessage);
    }

    const interval = setInterval(() => {
      setTypedGreeting((prev) => {
        if (index < fullMessage.length) {
          const next = fullMessage.slice(0, index + 1);
          index += 1;
          return next;
        } else {
          clearInterval(interval);
          setShowBtn(true)

          return prev;
        }
      });
      setHasTyped(true);
    }, 100);

    return () => clearInterval(interval);
  }, [startTyping]);

  const navigate = useNavigate();
  const x = useMotionValue(0);
  const controls = useAnimation();
  const containerRef = useRef(null);

  const location = useLocation();
  const initialIndex = location.state?.index || 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
 

  useEffect(() => {
    controls.start({
      x: -initialIndex * (SCREEN_WIDTH * 0.9 + SCROLL_OFFSET),
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
  }, []);

  const openCard = (id, index) => {
    navigate(`/letter/${id}`, { state: { index } });
  };

  const handleDragEnd = (_, info) => {
    const width = containerRef.current?.offsetWidth || 0;
    const cardWidth = 0.9 * width;
    const index = Math.round(-x.get() / cardWidth);
    const clampedIndex = Math.max(0, Math.min(postcards.length - 1, index));
    controls.start({
      x: -clampedIndex * (SCREEN_WIDTH * 0.9 + SCROLL_OFFSET),
      transition: { type: "spring", stiffness: 300, damping: 30 },
    });
    setCurrentIndex(clampedIndex);
  };
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100dvh",
        backgroundColor: config.themeColor,
      }}
      className="main-page  flex flex-col   overflow-hidden"
    >
      <div
        className="  absolute   w-28 h-16"
        style={{
          backgroundImage: `url(${foxWallpaper})`,
          backgroundSize: "50%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          top: "100%",
          left: "50%",
          transform: "translateY(-100%) translateX(-50%)",
        }}
      />
      {/* <IntroVideoPlayer onIntroEnd={handleIntroEnd} /> */}
      {/* HEADER  */}
      <div
        className=" flex flex-col   items-center px-12 "
        style={{ minHeight: "350px" }}
      >
        <p
          style={{}}
          className=" text-md font-semibold text-black mt-1 opacity-50"
        >
          For {config.recipient}
        </p>
        <p className=" text-lg  text-black mt-6 opacity-80">{typedGreeting}</p>

            <h2 className="page-title relative w-full   justify-center mt-auto  px-2 py-1 font-semibold opacity-60 rounded-full flex flex-row items-center">
            {
              !hasClicked && (
                <div style={{
                  opacity: showBtn ? 1: 0,
                  transition:"all 1s linear"
                }} className="absolute   flex justify-center -top-3 w-full">
               <div className="animate-shake flex items-center bg-white px-2 rounded-full">
                <ArrowDown size={14} className=" mr-1" />
                {
                `click postcards below`
                }
                 
               </div>
              </div>
              )
            }
          <div className="flex  justify-center mt-4 space-x-2">
           
            {postcards.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === currentIndex ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </h2>
      </div>
      <AnimatePresence>
        {true && (
          <motion.div
            className="gallery-section  flex flex-col"
            style={{ flexGrow: 1, minHeight: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              ref={containerRef}
              className="card-scroll-container w-full  flex-1  flex flex-col  overflow-hidden"
            >
              <motion.div
                className="card-drag-row  flex-1  "
                drag="x"
                style={{
                  x,
                  display: "flex",
                  gap: `${SCROLL_OFFSET}px`,
                  cursor: "grab",
                }}
                onDragEnd={handleDragEnd}
                animate={controls}
              >
                {postcards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    layoutId={`card-${card.id}`}
                    className="postcard-card   flex flex-col  px-4 py-4 pb-24"
                    onClick={() => {
                      openCard(card.id, index)
                      setHasClicked(true)
                    }}
                    whileTap={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ width: "90vw", flexShrink: 0 }}
                  >
                    <PostCard  card={card} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
