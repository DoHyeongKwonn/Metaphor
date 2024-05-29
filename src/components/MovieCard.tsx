import React from "react";
import { Movie, fetchMovieTrailer } from "../Api/tmdbApi";
import { useNavigate } from "react-router-dom";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(`/detail/${movie.id}`);
  };

  const handleTrailerClick = async () => {
    try {
      const trailer = await fetchMovieTrailer(movie.id);
      if (trailer) {
        window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
      } else {
        alert("트레일러를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
      alert("트레일러를 불러오는 데 실패했습니다.");
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl max-w-xs text-sm mx-3">
      <figure className="relative h-0 pb-[150%] overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="absolute top-0 left-0 w-full h-full object-cover" // object-cover로 가져오는 포스터의 크기가 다를 때 맞춰줌
        />
      </figure>
      <div className="card-body p-2">
        <h2 className="card-title">{movie.title}</h2>
        <p className="overflow-hidden h-[100px]">{movie.overview}</p>
        <div className="card-actions justify-end">
          <button onClick={handleTrailerClick} className="btn btn-primary h-9">
            Trailer
          </button>
          <button onClick={handleDetailClick} className="btn btn-accent h-9">
            Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
