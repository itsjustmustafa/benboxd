import { useEffect, useState } from "react";
import benboxdLogo from "src/assets/benboxd logo.png";
import benboxdTitle from "src/assets/benboxd title.png";
import styles from "src/App.module.css";
import type { Movie } from "src/movie";
import Game from "src/game";
import { formatLocalDate } from "src/game";
import Rand from "rand-seed";
import Favicon from "react-favicon";

const TOTAL_ROUNDS = 11;

function createMovieIndicies(
    total: number,
    movies: Movie[],
    random_seed: string,
): number[] {
    const rand = new Rand(random_seed);
    function randRange(min: number, max: number): number {
        return rand.next() * (max - min) + min;
    }
    const indices: number[] = [];
    while (indices.length < total) {
        const next_index = Math.floor(randRange(0, movies.length));
        if (movies[next_index].rating <= 0) {
            continue;
        }
        if (indices.length) {
            const last_index = indices[indices.length - 1];
            if (movies[last_index].rating == movies[next_index].rating) {
                continue;
            }
            if (indices.includes(next_index)) {
                continue;
            }
        }
        indices.push(next_index);
    }
    return indices;
}

async function loadMovies(): Promise<Movie[]> {
    const res = await fetch(import.meta.env.BASE_URL + "all_movies.json");
    return res.json();
}

function App() {
    const [nowDate, _] = useState<Date>(new Date());
    const [movies, setMovies] = useState<Movie[]>([]);
    const [movieIndicies, setMovieIndices] = useState<number[]>([]);
    const [difficulty, setDifficulty] = useState<"easy" | "hard" | undefined>(
        undefined,
    );

    useEffect(() => {
        loadMovies().then(setMovies);
    }, []);

    useEffect(() => {
        if (movies.length) {
            setMovieIndices((prevMovies) => {
                if (prevMovies.length == 0) {
                    return createMovieIndicies(
                        TOTAL_ROUNDS + 1,
                        movies,
                        formatLocalDate(nowDate),
                    );
                }
                return prevMovies;
            });
        }
    }, [movies]);

    if (movieIndicies.length == 0) {
        return <div>Loading...</div>;
    }

    const starting_view = (
        <div className={styles.starting}>
            <img src={benboxdTitle} alt="BenBoxd Logo" />
            <h2>Guess how my mate Ben rates movies.</h2>
            <h3>Choose your difficulty:</h3>
            <div className={styles.choose_difficulty}>
                <button onClick={() => setDifficulty("easy")}>Easy</button>
                <button onClick={() => setDifficulty("hard")}>Hard</button>
            </div>
        </div>
    );

    const game_view = (
        <div className={styles.game}>
            <Game
                movies={movies}
                movie_indicies={movieIndicies}
                game_time={nowDate}
                difficulty={difficulty || "easy"}
            />
        </div>
    );

    return (
        <div className={styles.app}>
            <Favicon url={import.meta.env.BASE_URL + "favicon.ico"} />
            <div className={styles.siteLogo}>
                <img src={benboxdLogo} alt="BenBoxd Logo" />
            </div>
            {difficulty == undefined && starting_view}
            {difficulty !== undefined && game_view}
        </div>
    );
}

export default App;
