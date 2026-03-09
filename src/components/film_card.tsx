import type { Movie } from "src/movie";
import styles from "src/components/film_card.module.css";

interface FilmCardProps {
    movie: Movie;
    as_result?: boolean;
    show_rating?: boolean;
    onClick?: () => void;
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
}: FilmCardProps) {
    return (
        <div
            className={`${styles.card} ${as_result ? styles.result : ""}`}
            onClick={onClick}
        >
            <div>
                <img
                    src={movie.poster}
                    alt={"Poster for " + movie.title}
                    draggable={false}
                />
            </div>
            <div className={styles.title}>{movie.title}</div>
            {show_rating && (
                <div className={styles.rating}>
                    {ratingToStars(movie.rating)}
                </div>
            )}
            {!show_rating && <div className={styles.rating}>???</div>}
        </div>
    );
}

export default FilmCard;
