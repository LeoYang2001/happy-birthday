// LetterPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import postcardsData from "../postcards.json";
import { ChevronLeft } from "lucide-react";
import config from "../configuration.json";
import { pinTimestamp, recordImageZoom } from "../simpleTracker";

const postcards = postcardsData.map((card) => ({
  ...card,
  image: require(`../assets/${card.image}`),
}));

export default function LetterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const card = postcards.find((c) => c.id === id);
  const [dragY, setDragY] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);


  
    useEffect(() => {
      pinTimestamp(`Letter Page: ${id}`);
    }, []);

  if (!card) return <p>Card not found</p>;

  return (
    <div
      style={{
        backgroundColor: config.themeColor,
        minHeight: "100dvh",
      }}
      className="relative w-fulloverflow-auto flex flex-col items-center p-4"
    >
      {!isExpanded && (
        <motion.img
          src={card.image}
          alt={card.title}
          layoutId={`card-${card.id}`}
          className="w-[100%] h-[30vh] object-cover rounded-t-2xl shadow-lg cursor-pointer"
          onClick={() => 
            {
              setIsExpanded(true)
              recordImageZoom(card.title)
            } // ✅ log the image zoom
          }
          drag="y"
          dragConstraints={{ top: -10, bottom: 10 }}
          dragElastic={0.1}
          whileDrag={{ scale: 1.03 }}
          onDragEnd={() => setDragY(0)}
        />
      )}

      {isExpanded && (
        <motion.div
          className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center"
          onClick={() => setIsExpanded(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.img
            src={card.image}
            alt={card.title}
            layoutId={`card-${card.id}`}
            className="max-w-full max-h-full object-contain rounded-xl"
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          />
        </motion.div>
      )}

      <motion.div
        className="bg-white w-[100%]  h-[60vh] flex flex-col -mt-2 rounded-b-2xl shadow-lg p-6 z-10"
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <h1 className="text-xl font-bold text-gray-900 mb-1">{card.title}</h1>
        <div className=" flex-1 overflow-scroll">
          <p className="text-gray-700 leading-relaxed text-base">
            {card.message}
          </p>
          <div className=" w-full  mt-4 flex flex-row justify-end items-center">
            <p className="text-sm  text-gray-500 mb-4">-Leo</p>
          </div>
        </div>

        <div>
          <button
            className="mt-6 text-sm backdrop-blur-sm bg-black/10 rounded-full p-2 underline"
            onClick={() =>
              navigate("/", {
                state: { index: postcards.findIndex((c) => c.id === id) },
              })
            }
          >
            <ChevronLeft color="#000" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
