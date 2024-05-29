import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { Movie, fetchNowPlayingMovies, fetchUpcomingMovies } from "../Api/tmdbApi";

const Home: React.FC = () => {
  const [nowPlayingMovies, setNowPlayingMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [nowPlayingIndex, setNowPlayingIndex] = useState(0);
  const [upcomingIndex, setUpcomingIndex] = useState(0);

  useEffect(() => {
    const getMoviesAndShows = async () => {
      try {
        const nowPlaying = await fetchNowPlayingMovies();
        setNowPlayingMovies(nowPlaying);
        const upcoming = await fetchUpcomingMovies();
        setUpcomingMovies(upcoming);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    getMoviesAndShows();
  }, []);

  const handleNowPlayingPrev = () => {
    setNowPlayingIndex((prevIndex) => Math.max(prevIndex - 5, 0));
  };

  const handleNowPlayingNext = () => {
    setNowPlayingIndex((prevIndex) => Math.min(prevIndex + 5, nowPlayingMovies.length - 5));
  };

  const handleUpcomingPrev = () => {
    setUpcomingIndex((prevIndex) => Math.max(prevIndex - 5, 0));
  };

  const handleUpcomingNext = () => {
    setUpcomingIndex((prevIndex) => Math.min(prevIndex + 5, upcomingMovies.length - 5));
  };

  return (
    <>
      <p className="flex justify-center mt-5 stat-value text-accent">현재 상영작</p>
      <div className="flex justify-center mt-5">
        <button className="stn btn-circle mt-[350px] mx-[10px] focus:outline-none" onClick={handleNowPlayingPrev}>
          ❮
        </button>
        <div className="slider-container">
          <div className="slider" style={{ transform: `translateX(-${nowPlayingIndex * 20}%)` }}>
            {nowPlayingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
        <button className="stn btn-circle mt-[350px] mx-[10px] focus:outline-none" onClick={handleNowPlayingNext}>
          ❯
        </button>
      </div>
      <p className="flex justify-center mt-5 stat-value text-accent">개봉 예정작</p>
      <div className="flex justify-center mt-5">
        <button className="stn btn-circle mt-[350px] mx-[10px] focus:outline-none" onClick={handleUpcomingPrev}>
          ❮
        </button>
        <div className="slider-container">
          <div className="slider" style={{ transform: `translateX(-${upcomingIndex * 20}%)` }}>
            {upcomingMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
        <button className="stn btn-circle mt-[350px] mx-[10px] focus:outline-none" onClick={handleUpcomingNext}>
          ❯
        </button>
      </div>
    </>
  );
};

export default Home;
