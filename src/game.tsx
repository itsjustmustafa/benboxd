import type { Movie } from "src/movie";
import FilmCard from "src/components/film_card";
import styles from "./game.module.css";
import { useState } from "react";
import { motion } from "framer-motion";
import Result from "src/components/result";
import useBodyClass from "src/hooks/useBodyClass";

interface GameProps {
    movies: Movie[];
    movie_indicies: number[];
    difficulty: "easy" | "hard";
    game_time: Date;
}

type GameResult = {
    firstMovieIndex: number;
    secondMovieIndex: number;
    guess: "first" | "second";
    is_correct: boolean;
};

export function formatLocalDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
}

function resultMessage(
    score: number,
    total_guesses: number,
    date_string: string,
    with_hard_mode: boolean,
): string {
    const mode = with_hard_mode ? " • (Hard)" : "";
    return `Benboxd${mode} ${score}/${total_guesses}
${date_string}

https://mzza.xyz/benboxd/`;
}

function Game({ movies, movie_indicies, game_time, difficulty }: GameProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showNextRating, setShowNextRating] = useState(false);
    const [gameBackground, setGameBackground] = useState<
        "none" | "success" | "failure"
    >("none");
    const [gameResults, setGameResults] = useState<GameResult[]>([]);
    const [resultsCopied, setResultsCopied] = useState(false);

    let currentMovie = undefined;
    let nextMovie = undefined;
    let correctIndex = undefined;
    if (currentIndex < movie_indicies.length - 1) {
        currentMovie = movies[movie_indicies[currentIndex]];
        nextMovie = movies[movie_indicies[currentIndex + 1]];
        correctIndex =
            currentMovie.rating > nextMovie.rating
                ? currentIndex
                : currentIndex + 1;
    }

    const handleFilmClick = (index: number) => {
        if (showNextRating) {
            // we are already mid-transition to next round
            return;
        }
        setShowNextRating(true);
        const is_correct = index == correctIndex;
        setTimeout(() => {
            setGameResults((prevGameResults) => {
                const next_game_result: GameResult = {
                    firstMovieIndex: movie_indicies[currentIndex],
                    secondMovieIndex: movie_indicies[currentIndex + 1],
                    guess: index == currentIndex ? "first" : "second",
                    is_correct: is_correct,
                };
                return [...prevGameResults, next_game_result];
            });
        }, 500);
        if (is_correct) {
            setGameBackground("success");
        } else {
            setGameBackground("failure");
        }

        setTimeout(() => {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setGameBackground("none");
            setShowNextRating(false);
        }, 1500);
    };

    const getScore = () => {
        return gameResults.reduce(
            (current_score, result) =>
                current_score + (result.is_correct ? 1 : 0),
            0,
        );
    };

    const copyResults = () => {
        navigator.clipboard.writeText(
            resultMessage(
                getScore(),
                gameResults.length,
                formatLocalDate(game_time),
                difficulty == "hard",
            ),
        );
        setResultsCopied(true);
        setTimeout(() => {
            setResultsCopied(false);
        }, 2000);
    };
    const copyButton = (
        <button className={styles.copyButton} onClick={copyResults}>
            {resultsCopied ? "Copied" : "Copy results"}
        </button>
    );

    const game_finished = gameResults.length >= movie_indicies.length - 1;

    useBodyClass("no-scroll", !game_finished);

    const show_ratings = difficulty == "easy";

    return (
        <>
            {!game_finished &&
                currentMovie !== undefined &&
                nextMovie !== undefined && (
                    <>
                        <h3>Which movie did Ben rate higher?</h3>
                        <div className={`${styles.cardDisplay}`}>
                            <motion.div
                                layout
                                key={currentIndex}
                                className="motion_div"
                            >
                                <FilmCard
                                    movie={currentMovie}
                                    key={currentIndex}
                                    onClick={() =>
                                        handleFilmClick(currentIndex)
                                    }
                                    status={gameBackground}
                                    show_rating={show_ratings}
                                />
                            </motion.div>
                            <motion.div
                                layout
                                key={currentIndex + 1}
                                className="motion_div"
                            >
                                <FilmCard
                                    movie={nextMovie}
                                    key={currentIndex + 1}
                                    show_rating={showNextRating && show_ratings}
                                    onClick={() =>
                                        handleFilmClick(currentIndex + 1)
                                    }
                                    status={gameBackground}
                                />
                            </motion.div>
                        </div>
                    </>
                )}
            {gameResults.length == movie_indicies.length - 1 && (
                <div className={styles.resultView}>
                    <h3>
                        Results: {getScore()}/{gameResults.length}
                    </h3>
                    {copyButton}
                    <div className={styles.results}>
                        {gameResults.map((result) => {
                            const firstMovie = movies[result.firstMovieIndex];
                            const secondMovie = movies[result.secondMovieIndex];
                            return (
                                <Result
                                    firstMovie={firstMovie}
                                    secondMovie={secondMovie}
                                    guess={result.guess}
                                    is_correct={result.is_correct}
                                />
                            );
                        })}
                    </div>
                    {copyButton}
                </div>
            )}
        </>
    );
}

export default Game;
