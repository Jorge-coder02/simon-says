import "./index.css";
import SimonPad from "./Components/SimonPad";
import { useEffect, useState, useRef } from "react";

function App() {
  const startLevel = 1;
  const startDefaultLevel = 5;
  const [totalLevels, setTotalLevels] = useState<number>(startDefaultLevel);
  const [startBtnIsClicked, setStartBtnIsClicked] = useState<boolean>(false);
  const [sequenceMessage, setSequenceMessage] = useState<string>("");
  const [colorSequence, setColorSequence] = useState<string[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(startLevel);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState<string>();
  const [activeTurn, setActiveTurn] = useState<string>("none");
  const intervalRef = useRef<number | null>(null);

  const sounds: { [key: string]: string } = {
    yellow: "/sounds/yellow.mp3",
    green: "/sounds/green.mp3",
    blue: "/sounds/blue.mp3",
    red: "/sounds/red.mp3",
  };
  const playSound = (color: string) => {
    const src = sounds[color];
    if (src) {
      const audio = new Audio(src);
      audio.play();
    }
  };

  const generateNumber = (max: number) => {
    const num = Math.floor(Math.random() * max);
    return num;
  };

  const generateColorSequence = (n_times: number) => {
    const possibleColors = ["yellow", "red", "blue", "green"];
    const colorSequence: string[] = [];
    for (let i = 1; i < n_times + 1; i++) {
      const random_n = generateNumber(4);
      const color = possibleColors[random_n];
      colorSequence.push(color);
    }
    setColorSequence(colorSequence); // this sequence never changes during the game
    console.log("Complete sequence 😉: ", colorSequence);
  };

  // ▶
  const startGame = () => {
    // Restart all
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSequenceMessage("");
    setCurrentLevel(startLevel);
    setPlayerSequence([]);
    setColorSequence([]);
    // Start (just 1st time)
    generateColorSequence(totalLevels);
    // once colorSequence changes, showSequence() starts
    setActiveTurn("IA");
  };

  // 🔀 Managing turns
  useEffect(() => {
    if (activeTurn === "IA") {
      // ✅ PLAYER WINS GAME
      if (currentLevel > colorSequence.length) {
        setSequenceMessage("win");
        setActiveTurn("");
      } else {
        showSequence(); // this will be called after currentLevel or colorSequence (once) is updated
      }
    } else if (activeTurn === "Player") {
      checkPlayerSequence();
    }
  }, [activeTurn, playerSequence, currentLevel, colorSequence]);

  // 🤖 IA
  const showSequence = () => {
    // Setting lapse between colors
    const timeLapse = 900;
    const darkTime = 500;

    let index = 0; // index of the colorSequence[] to active

    // ▶ Interval that last an entire sequence
    intervalRef.current = window.setInterval(() => {
      setSequenceMessage(""); // reset 'correct sequence' msg

      const currentColor = colorSequence[index];
      setActiveColor(currentColor); // 💡
      playSound(currentColor); // 🔊

      // Reset active color for a moment during the sequence
      setTimeout(() => {
        setActiveColor("");
      }, darkTime);

      index++;
      // Check if the current sequence is completed
      setTimeout(() => {
        if (index === currentLevel) {
          clearInterval(intervalRef.current!);
          setPlayerSequence([]); // reset player´s sequence
          setActiveTurn("Player");
        }
      }, darkTime);
    }, timeLapse);
  };

  // 👤 Player
  const checkPlayerSequence = () => {
    // ❌ check wrong sequence
    for (let i = 0; i < playerSequence.length; i++) {
      if (colorSequence[i] !== playerSequence[i]) {
        setSequenceMessage("wrong");
        // Restart current level
        setPlayerSequence([]);
        setActiveColor("");
        setActiveTurn("IA");
        return;
      }
    }

    // ✅ right sequence...
    // Reset last pad clicked
    setTimeout(() => {
      setActiveColor("");
    }, 300);

    // Check if player completed the whole sequence
    if (playerSequence.length === currentLevel) {
      setCurrentLevel((prev) => prev + 1);
      setSequenceMessage("correct");
      setActiveTurn("IA");
    }
  };

  // Pad clicked
  const handleClick = (colorClicked: string) => {
    if (activeTurn === "Player") {
      setActiveColor(colorClicked); // 💡
      playSound(colorClicked); // 🔊
      setPlayerSequence((prev) => [...prev, colorClicked]);
    }
  };

  return (
    <div
      className={`flex flex-col gap-4 place-items-center p-6 sm:p-20 text-center bg-background transition-all duration-200 ease-out min-h-[100dvh]   ${
        sequenceMessage === "wrong"
          ? "bg-wrong"
          : sequenceMessage === "win"
          ? "bg-win"
          : null
      }`}
    >
      <h1 className="text-primary text-5xl font-bold p-4 ">SIMON SAYS</h1>
      <span className="p-2 text-2xl font-bold">
        {activeTurn === "IA"
          ? "IA´s turn 👁"
          : activeTurn === "Player"
          ? "YOUR TURN 👤"
          : sequenceMessage !== "win"
          ? "Start the game"
          : "🎉 YOU WON 🎉"}
      </span>

      <div
        className={`flex gap-4 items-center shadow-lg card p-8 bg-slate-700`}
      >
        <div className="grid place-items-center grid-cols-2 gap-12 sm:gap-14 p-6 sm:p-10 w-full max-w-md">
          <SimonPad
            onClick={handleClick}
            bg_color="yellow"
            active={activeColor === "yellow"}
          />
          <SimonPad
            onClick={handleClick}
            bg_color="red"
            active={activeColor === "red"}
          />
          <SimonPad
            onClick={handleClick}
            bg_color="blue"
            active={activeColor === "blue"}
          />
          <SimonPad
            onClick={handleClick}
            bg_color="green"
            active={activeColor === "green"}
          />
        </div>
        <button
          onClick={() => {
            startGame();
            setStartBtnIsClicked(true);
          }}
          className={`btn w-full sm:w-5/6 text-zinc-50 font-bold 
            ${
              startBtnIsClicked
                ? "btn-warning text-black"
                : "text-lg border-none bg-blue-700 hover:scale-105 hover:bg-blue-600"
            }`}
        >
          {startBtnIsClicked ? "RESTART GAME" : "START"}
        </button>
      </div>

      {
        // ⏯ If game is active
        colorSequence.length > 0 ? (
          <span
            className={`transition-all ease-out duration-200
          ${
            sequenceMessage === "correct"
              ? "text-4xl text-green-500"
              : "text-2xl text-zinc-100"
          }`}
          >
            {`${
              colorSequence.length > 0 && currentLevel <= totalLevels
                ? `Level ${currentLevel} / ${totalLevels}`
                : `You have completed all ${totalLevels} levels`
            }`}
          </span>
        ) : (
          // ⏸ If game hasn´t started yet
          <div className="flex place-items-center gap-4">
            <span>Choose difficulty (rounds): </span>
            <select
              value={totalLevels}
              onChange={(e) => setTotalLevels(parseInt(e.target.value))}
              className="select rounded-xl bg-secondary"
            >
              {[...Array(25)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        )
      }
    </div>
  );
}

export default App;
