import { useEffect, useState, useRef } from "react";
import { fetchFilteredMovies, Movie, fetchSearchedMovies } from "../Api/tmdbApi";
import { useNavigate } from "react-router-dom";

function Movies() {
  const navigate = useNavigate();
  type Badge = string;

  const [selectedBadges, setSelectedBadges] = useState<Badge[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const observer = useRef<IntersectionObserver>();

  const lastMovieElementRef = (node: HTMLDivElement) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  const toggleBadge = (badge: Badge) => {
    if (selectedBadges.includes(badge)) {
      setSelectedBadges(selectedBadges.filter((b) => b !== badge));
    } else {
      setSelectedBadges([...selectedBadges, badge]);
    }
    setPage(1); // 페이지 초기화
    setMovies([]); // 영화 리스트 초기화
    setHasMore(true); // 스크롤 가능 상태 초기화
  };

  const genres: Badge[] = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "TV Movie",
    "Thriller",
    "War",
    "Western",
  ];
  const ratings: Badge[] = [
    "1점 이상",
    "2점 이상",
    "3점 이상",
    "4점 이상",
    "5점 이상",
    "6점 이상",
    "7점 이상",
    "8점 이상",
    "9점 이상",
  ];

  const genreIdMapping: { [key: string]: number } = {
    Action: 28,
    Adventure: 12,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    History: 36,
    Horror: 27,
    Music: 10402,
    Mystery: 9648,
    Romance: 10749,
    "Science Fiction": 878,
    "TV Movie": 10770,
    Thriller: 53,
    War: 10752,
    Western: 37,
  };

  const parseBadgesForParams = (selectedBadges: Badge[]) => {
    const params: { [key: string]: string | number } = {};
    let maxRating = 0;
    const genreIds: number[] = [];

    selectedBadges.forEach((badge) => {
      if (badge.includes("점 이상")) {
        const rating = parseInt(badge.split("점")[0], 10);
        if (rating > maxRating) {
          maxRating = rating;
        }
      } else if (genreIdMapping[badge] !== undefined) {
        genreIds.push(genreIdMapping[badge]);
      }
    });

    if (maxRating > 0) {
      params["vote_average.gte"] = maxRating;
    }

    if (genreIds.length > 0) {
      params["with_genres"] = genreIds.join(",");
    }

    return params;
  };

  useEffect(() => {
    const getMoviesAndShows = async () => {
      try {
        const params = parseBadgesForParams(selectedBadges);
        const fetchedMovies = await fetchFilteredMovies(params, 1);
        setMovies(fetchedMovies);
        setHasMore(fetchedMovies.length > 0);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    getMoviesAndShows();
  }, [selectedBadges]);

  useEffect(() => {
    const getMoviesAndShows = async () => {
      try {
        const params = parseBadgesForParams(selectedBadges);
        const fetchedMovies = searchQuery
          ? await fetchSearchedMovies(searchQuery, page)
          : await fetchFilteredMovies(params, page);
        setMovies((prevMovies) => (page === 1 ? fetchedMovies : [...prevMovies, ...fetchedMovies]));
        setHasMore(fetchedMovies.length > 0);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    getMoviesAndShows();
  }, [page, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); // 검색어가 변경될 때 페이지 초기화
    setMovies([]); // 검색 결과 초기화
    setHasMore(true); // 추가 로드 가능 상태 초기화
  };

  return (
    <>
      <div className="board px-[400px]">
        <div className="flex justify-start mt-2">
          장르:
          {genres.map((genre) => (
            <div
              key={genre}
              className={`badge badge-outline cursor-pointer mx-2 mt-1 ${
                selectedBadges.includes(genre) ? "badge-active" : ""
              }`}
              onClick={() => toggleBadge(genre)}
            >
              {genre}
            </div>
          ))}
        </div>
        <div className="flex justify-start mt-2">
          별점:
          {ratings.map((rating) => (
            <div
              key={rating}
              className={`badge badge-outline cursor-pointer mx-2 mt-1 ${
                selectedBadges.includes(rating) ? "badge-active" : ""
              }`}
              onClick={() => toggleBadge(rating)}
            >
              {rating}
            </div>
          ))}
        </div>
        <div className="flex justify-start mt-2">
          검색 조건:
          {selectedBadges.map((badge) => (
            <div
              key={badge}
              className="badge badge-primary cursor-pointer mx-2 mt-1"
              onClick={() => toggleBadge(badge)}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 flex justify-end mr-[155px]">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={handleSearchChange}
          className="input input-bordered w-full max-w-xs"
        />
      </div>
      <div className="board pl-[150px] flex flex-wrap">
        {movies.map((movie, index) => (
          <div
            ref={movies.length === index + 1 ? lastMovieElementRef : null}
            onClick={() => navigate(`/detail/${movie.id}`)}
            key={`${movie.id}-${index}`}
            className="w-[200px] h-[300px] my-12 mx-3 cursor-pointer"
          >
            <img
              className="w-full h-full object-cover"
              src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
              alt={movie.title}
            />
            <p className="text-center">{movie.title}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Movies;
