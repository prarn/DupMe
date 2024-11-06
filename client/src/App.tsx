import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

import Page404 from './Pages/Page404/Page404';
import Home from './Pages/Home/Home';
import SoundTesting from './Pages/SoundTesting/SoundTesting';
import InLobby from './Pages/InLobby/InLobby';
import Select from './Pages/Select/Select';
import HowToPlay from './Pages/HowToPlay/HowToPlay'; // Import your HowToPlay component
import Rooms from './Pages/Rooms/Rooms';
import SupportUs from './Pages/SupportUs/SupportUs';
import Game from "./Pages/Game/Game";
import BackgroundChange from "./Pages/BackgroundChange/BackgroundChange";


function App() {
  const location = useLocation();
  const audioRef = useRef<HTMLAudioElement | null>(null); // Typing audioRef as HTMLAudioElement or null
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    // Set initial volume to 50%
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
    }
  }, []);

  useEffect(() => {
    const handleInteraction = () => {
      // Play music after the user interacts
      if (
        location.pathname !== "/game" &&
        location.pathname !== "/soundtesting"
      ) {
        audioRef.current?.play();
      }
      window.removeEventListener("click", handleInteraction);
    };

    // Ensure music is ready to play
    audioRef.current?.addEventListener("canplaythrough", () => {
      setAudioReady(true);
    });

    window.addEventListener("click", handleInteraction); // Start music on user interaction

    return () => {
      window.removeEventListener("click", handleInteraction);
    };
  }, [location]);

  useEffect(() => {
    if (audioReady) {
      // Play/pause logic based on the current route
      if (
        location.pathname !== "/game" &&
        location.pathname !== "/soundtesting"
      ) {
        audioRef.current?.play();
      } else {
        audioRef.current?.pause();
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
        }
      }
    }
  }, [location, audioReady]);

  return (
    <>
      <audio ref={audioRef} loop>
        <source src="/audio/background_music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/game" element={<Game />} />
        <Route path="/soundtesting" element={<SoundTesting />} />
        <Route path="/inlobby" element={<InLobby />} />
        <Route path="/select" element={<Select />} />
        <Route path="*" element={<Page404 />} />
        <Route path="/backgroundchange" element={<BackgroundChange />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="/support-us" element={<SupportUs />} />
      </Routes>
    </>
  );
}

export default App;
