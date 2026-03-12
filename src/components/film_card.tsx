import type { Movie } from "src/movie";
import styles from "src/components/film_card.module.css";

interface FilmCardProps {
    movie: Movie;
    as_result?: boolean;
    show_rating?: boolean;
    onClick?: () => void;
    status?: "success" | "failure" | "none";
}

function ratingToStars(rating: number): string {
    // return "★½";
    return "★".repeat(Math.floor(rating)) + (rating % 1 == 0 ? "" : "½");
}

function FilmCard({
    movie,
    as_result = false,
    show_rating = true,
    onClick = () => {},
    status = "none",
}: FilmCardProps) {
    const movie_poster = (
        <img
            src={movie.poster}
            alt={"Poster for " + movie.title}
            draggable={false}
        />
    );

    const rating = show_rating ? ratingToStars(movie.rating) : "???";

    const result_style =
        status == "success"
            ? styles.success
            : status == "failure"
              ? styles.failure
              : "";

    const card_style = `${styles.card} ${as_result ? styles.result : styles.game_card} ${result_style}`;
    return (
        <>
            <div
                className={`${card_style} ${styles.stacked_layout}`}
                onClick={onClick}
            >
                <div>{movie_poster}</div>
                <div className={styles.title}>{movie.title}</div>
                <div className={styles.rating}>{rating}</div>
            </div>
            <div
                className={`${card_style} ${styles.compact_layout}`}
                onClick={onClick}
            >
                <div>{movie_poster}</div>
                <div className={styles.movie_info}>
                    <div className={styles.title}>{movie.title}</div>
                    <div className={styles.rating}>{rating}</div>
                </div>
            </div>
        </>
    );
}

export default FilmCard;
