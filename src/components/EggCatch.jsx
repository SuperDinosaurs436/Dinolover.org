import React, { useState, useEffect } from "react";
import { playSound } from "../soundUtils";

export default function EggCatch() {
  const [eggs, setEggs] = useState([]);
  const [score, setScore] = useState(0);
  const [basketX, setBasketX] = useState(200);
  const basketWidth = 80;

  // Spawn eggs
  useEffect(() => {
    const interval = setInterval(() => {
      const x = Math.random() * 320;
      setEggs((prev) => [...prev, { x, y: 0, id: Date.now() }]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Move eggs down
  useEffect(() => {
    const interval = setInterval(() => {
      setEggs((prev) =>
        prev
          .map((egg) => ({ ...egg, y: egg.y + 5 }))
          .filter((egg) => {
            // Check for catch
            if (egg.y >= 300) {
              if (egg.x + 20 >= basketX && egg.x <= basketX + basketWidth) {
                playSound("/sounds/win.mp3");
                setScore((s) => s + 1);

                // Update Hall of Fame
                const storedScores = JSON.parse(localStorage.getItem("dinoHighScores")) || {};
                localStorage.setItem(
                  "dinoHighScores",
                  JSON.stringify({
                    ...storedScores,
                    "Egg Catch": Math.max(score + 1, storedScores["Egg Catch"] || 0),
                  })
                );

                return false; // remove egg
              } else {
                playSound("/sounds/jump.mp3");
                return false; // missed egg, remove
              }
            }
            return true;
          })
      );
    }, 50);
    return () => clearInterval(interval);
  }, [basketX, score]);

  const handleMouseMove = (e) => {
    setBasketX(e.nativeEvent.offsetX - basketWidth / 2);
  };

  const restartGame = () => {
    setEggs([]);
    setScore(0);
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Egg Catch 🥚</h2>
      <p className="mb-2">Score: {score}</p>
      <div
        className="relative bg-green-800 w-96 h-64 mx-auto border-2 border-yellow-400 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {eggs.map((egg) => (
          <div
            key={egg.id}
            style={{ position: "absolute", top: egg.y, left: egg.x }}
            className="text-2xl"
          >
            🥚
          </div>
        ))}
        <div
          className="absolute bottom-0 bg-yellow-400 h-4 rounded"
          style={{ width: basketWidth, left: basketX }}
        ></div>
      </div>
      <button
        className="mt-4 bg-yellow-400 text-green-900 px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
        onClick={restartGame}
      >
        Restart Game
      </button>
    </div>
  );
}
