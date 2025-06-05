import React, { useEffect, useRef, useState } from 'react'
import config from "../configuration.json";
import { Pause, Piano, Play } from 'lucide-react';
import { endVideoWatch, recordMuteToggle, startVideoWatch, videoPlayingToggle } from '../simpleTracker';

function ExpandableVideoPlayer_improve({
    isExpanded,
    setIsExpanded,
    setStartTyping,
    hasTyped
}) {

      useEffect(() => {
      if (isExpanded) {
        startVideoWatch();
      } else {
        endVideoWatch();
      }
    }, [isExpanded]);

    const handleStart = (e) => {
    setTimeout(() => {
      setIsExpanded(false);
      setStartTyping(true);
    }, 5000);
  };

  


      const videoRef = useRef(null);
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoReady, setVideoReady] = useState(false)

    
  useEffect(() => {
    videoPlayingToggle(isPlaying);
  }, [isPlaying])

    const handlePlay = () => {

        if(!hasTyped)
        {
            handleStart()
        }

        if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
        }
    };

    const handlePause = () => {
        if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
        }
    };

  return (
    <div
    className='   w-full h-full  flex justify-center items-start'>
        {
            !isExpanded && (
                <div style={{
                    backgroundColor:'#fe8125',
                    left:"50%",
                    top:"50%",
                    transform:"translateX(-50%) translateY(-50%)"
                }} className=' absolute shadow-xl p-2 rounded-full '>
                    <Piano size={18} color='#fff' opacity={0.7} />
                    </div>
            )
        }
        {/* MP3 UI  */}
            <div  style={{
                width: isExpanded ? '80%' : 40,
                height: isExpanded ? '30%' : 40,
                backgroundColor:config.themeColor,
                zIndex:999,
                opacity:isExpanded ? 1 : 0,
                transition:'all .5 linear'
            }}
            
                className=' rounded-3xl relative overflow-hidden p-4  shadow-md mt-10'
            >
                {/* {
                    !videoReady && (
                        <div className=' w-full h-full absolute left-0 top-0 flex justify-center items-center'>
                            Loading Video...
                        </div>
                    )
                } */}
                <video
                onPlaying={
                    ()=>{
                        setVideoReady(true)
                    }
                }
                className=' rounded-2xl '
                style={{

                }}
            ref={videoRef}
            autoPlay={false}
            playsInline
            src={require("../assets/piano.mp4")}
            loop
            />
        
            <div className="mt-4 flex justify-center gap-6">
            {
                isPlaying ? (
                <button
                onClick={handlePause}
                className="bg-white  px-4 py-2 rounded-xl shadow"
            >
                <Pause color='#fe8125' className="inline-block w-5 h-5 " />
            </button>
                ):(
                    <button
                    onClick={handlePlay}

                className="bg-white  px-4 py-2 rounded-xl shadow"
            >
                <Play color='#fe8125' className="inline-block w-5 h-5" />
            </button>
                )
            }

            
            </div>
         </div>
    </div>
  )
}

export default ExpandableVideoPlayer_improve