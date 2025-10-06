import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./HomePage.css";

import escapeTheLavaImg from "../utils/assets/escapeTheLava.jpg";
import findTheColorImg from "../utils/assets/findTheColor.jpg";
import redLightGreenLightImg from "../utils/assets/redLightGreenLight.jpg";
import sharpShooterImg from "../utils/assets/sharpShooter.jpg";

const games = [
    { title: "Escape The Lava", type: "Solo / Team", players: "1 - 6 Players", image: escapeTheLavaImg },
    { title: "Find The Color", type: "Competition", players: "1 - 6 Players", image: findTheColorImg },
    { title: "Red Light Green Light", type: "Competition", players: "1 - 4 Players", image: redLightGreenLightImg },
    { title: "Sharp Shooter", type: "Competition", players: "1 - 4 Players", image: sharpShooterImg },
];

export default function HomePage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const prevGame = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev === 0 ? games.length - 1 : prev - 1));
    };

    const nextGame = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev === games.length - 1 ? 0 : prev + 1));
    };

    const game = games[currentIndex];

    const cardVariants = {
        enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.8 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.8 }),
    };

    return (
        <div className="homepage-container">
            <header className="homepage-header">
                <h1 className="homepage-title">GAME SELECTION</h1>
                <p className="homepage-subtitle">Choose your adventure and start playing</p>
            </header>

            <button type="button" className="neon-arrow left-arrow" onClick={prevGame}>
                &#8592;
            </button>
            <button type="button" className="neon-arrow right-arrow" onClick={nextGame}>
                &#8594;
            </button>


            <AnimatePresence custom={direction} exitBeforeEnter>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.6, type: "tween" }}
                    className="game-card-wrapper"
                >
                    <div className="game-card">
                        <img src={game.image} alt={game.title} className="game-image" />
                        <div className="game-info">
                            <h2 className="game-title">{game.title}</h2>
                            <p className="game-details">{game.type} | {game.players}</p>
                            <button className="play-button">Play Now</button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <footer className="homepage-footer">
                <p className="game-counter">{currentIndex + 1} / {games.length}</p>
            </footer>
        </div>
    );
}
