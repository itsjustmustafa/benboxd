import type { Movie } from "src/movie";
import FilmCard from "src/components/film_card";
import styles from "src/components/results.module.css";

interface ResultProps {
    firstMovie: Movie;
    secondMovie: Movie;
    guess: "first" | "second";
    is_correct: boolean;
}

function Result({ firstMovie, secondMovie, guess, is_correct }: ResultProps) {
    return (
        <div
            className={`${styles.result} ${is_correct ? styles.success : styles.failure}`}
        >
            <FilmCard movie={firstMovie} as_result={true} />
            <div className={styles.comparator}>
                <p>Your guess</p>
                <h1>{guess === "first" ? "←" : "→"}</h1>
            </div>
            <FilmCard movie={secondMovie} as_result={true} />
        </div>
    );
}

export default Result;
