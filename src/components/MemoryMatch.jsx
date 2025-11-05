import React, { useState, useEffect } from "react";
import { playSound } from "../soundUtils";

export default function MemoryMatch() {
  const cardsArray = ["🦖", "🦕", "🦖", "🦕", "🥚", "🥚", "🦴", "🦴"];
  const [cards, setCards] = useState(shuffle(cardsArray));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [score, setScore] = useState(0);

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  const handleFlip = (index) => {
    if (flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first] === cards[second]) {
        playSound("/sounds/win.mp3");
        setMatched((prev) => [...prev, first, second]);
        setScore(score + 1);

        // Update Hall of Fame
        const storedScores = JSON.parse(localStorage.getItem("dinoHighScores")) || {};
        localStorage.setItem(
          "dinoHighScores",
          JSON.stringify({
            ...storedScores,
            "Memory Match": Math.max(score + 1, storedScores["Memory Match"] || 0),
          })
        );
      }
      setTimeout(() => setFlipped([]), 700);
    }
  };

  const restartGame = () => {
    setCards(shuffle(cardsArray));
    setFlipped([]);
    setMatched([]);
    setScore(0);
  };

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">Memory Match 🧠</h2>
      <p className="mb-2">Score: {score}</p>
      <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleFlip(index)}
            className={`w-16 h-16 flex items-center justify-center text-3xl rounded-lg cursor-pointer border-2 border-yellow-400
            ${flipped.includes(index) || matched.includes(index) ? "bg-yellow-200" : "bg-green-800"}`}
          >
            {flipped.includes(index) || matched.includes(index) ? card : "❓"}
          </div>
        ))}
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
