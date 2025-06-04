import { footprints } from "./trackingStore";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firebase";

function getTimeString(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

let sessionActive = false;
let sessionStartTime = null;
export let timeStampPin = null;
let lastPageName = null;
let userIP = null;


// Get IP on load
fetch("https://api.ipify.org?format=json")
  .then((res) => res.json())
  .then((data) => {
    userIP = data.ip;
    // console.log(`🌐 IP address: ${userIP}`);
  })
  .catch(() => {
    userIP = "unknown-ip";
  });




export function startSessionIfNeeded() {
  if (!sessionActive) {
    // Reset everything
    footprints.length = 0;            // clears array in-place
    timeStampPin = null;
    lastPageName = null;

    sessionStartTime = new Date();
    const msg = `🟢 Session started at ${getTimeString(sessionStartTime)}`;
    footprints.push(msg);
    sessionActive = true;
  }
}
export async function endSessionIfNeeded() {
  if (sessionActive && sessionStartTime) {
    const endTime = new Date();
    const durationMs = endTime - sessionStartTime;
    const durationSec = Math.round(durationMs / 1000);

    const msg = `🔴 Session ended at ${getTimeString(endTime)} (duration: ${durationSec}s)`;
    footprints.push(msg);

    sessionActive = false;

    const sessionId = `${Date.now()}-${uuidv4()}`;
    const userId = userIP || "unknown-ip";

    try {
      const sessionRef = doc(db, "sessions", userId, "logs", sessionId);
      await setDoc(sessionRef, {
        sessionId,
        ip: userIP,
        startedAt: sessionStartTime.toISOString(),
        endedAt: endTime.toISOString(),
        durationSec,
        footprints,
      });
    } catch (error) {
      console.error("❌ Failed to save footprints to Firebase:", error);
    }

    sessionStartTime = null;
  }
}

export function getFootprints() {
  return footprints;
}





export function pinTimestamp(newPageName) {
  const now = new Date();

  // Avoid logging duplicate page pins
  if (lastPageName === newPageName) {
    return;
  }

  if (timeStampPin && lastPageName) {
    const durationMs = now - timeStampPin;
    const durationSec = Math.round(durationMs / 1000);
    const msg = `📄 Page "${lastPageName}" ended — duration: ${durationSec}s`;
    footprints.push(msg);
  }

  timeStampPin = now;
  lastPageName = newPageName;

  const msg = `📍 Page "${newPageName}" started at ${getTimeString(timeStampPin)}`;
  footprints.push(msg);
}


let videoStartTime = null;

export function startVideoWatch() {
  if (!videoStartTime) {
    videoStartTime = new Date();
    const msg = `🎬 Video opened at ${getTimeString(videoStartTime)}`;
    footprints.push(msg);
  }
}

export function endVideoWatch() {
  if (videoStartTime) {
    const now = new Date();
    const durationSec = Math.round((now - videoStartTime) / 1000);
    const msg = `🛑 Video closed — duration: ${durationSec}s`;
    footprints.push(msg);
    videoStartTime = null;
  }
}


export function recordImageZoom(imageTitle) {
  const msg = `🔍 User zoomed in on image: "${imageTitle}" at ${getTimeString()}`;
  footprints.push(msg);
}


export function recordMuteToggle(isMuted) {
  const msg = `🔇 Mute toggled: ${isMuted ? "Muted" : "Unmuted"} at ${getTimeString()}`;
  footprints.push(msg);
}