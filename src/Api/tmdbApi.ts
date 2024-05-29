import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API; // 여기에 당신의 TMDb API 키를 넣으세요.
const BASE_URL = "https://api.themoviedb.org/3";

// 영화 데이터 타입 정의
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}
interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}
interface Params {
  [key: string]: string | number;
}
export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

export const fetchMovieCredits = async (movieId: number): Promise<Credits> => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    throw error;
  }
};

export const fetchMovieDetail = async (id: number): Promise<Movie> => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
      },
    });
    return response.data as Movie;
  } catch (error) {
    console.error("Error fetching movie detail:", error);
    throw error;
  }
};
export const fetchNowPlayingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
        page: 1,
      },
    });
    return response.data.results as Movie[];
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    throw error;
  }
};

export const fetchUpcomingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
        page: 1,
      },
    });
    return response.data.results as Movie[];
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    throw error;
  }
};
export const fetchFilteredMovies = async (params: Params, page: number): Promise<Movie[]> => {
  try {
    // console.log("Fetching movies with params:", params);

    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
        page: page,
        "vote_count.gte": 100,
        "popularity.gte": 200,
        // sort_by: "release_date.desc",
        ...params,
      },
    });
    console.log(`API response for page ${page}:`, response.data); // API 응답 로그

    // 데이터를 클라이언트에서 정렬
    const sortedMovies = response.data.results.sort((a: Movie, b: Movie) => {
      return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
    });

    return sortedMovies;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};
export const fetchMovieTrailer = async (movieId: number): Promise<Video | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
      },
    });
    const trailers: Video[] = response.data.results.filter(
      (video: Video) => video.type === "Trailer" && video.site === "YouTube"
    );
    return trailers.length > 0 ? trailers[0] : null;
  } catch (error) {
    console.error("Error fetching movie trailer:", error);
    throw error;
  }
};
export const fetchSearchedMovies = async (query: string, page: number): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        language: "ko-KR",
        query: query,
        page: page,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};
//샘플
// {
//   "poster_path": "/IfB9hy4JH1eH6HEfIgIGORXi5h.jpg",
//   "adult": false,
//   "overview": "Jack Reacher must uncover the truth behind a major government conspiracy in order to clear his name. On the run as a fugitive from the law, Reacher uncovers a potential secret from his past that could change his life forever.",
//   "release_date": "2016-10-19",
//   "genre_ids": [
//     53,
//     28,
//     80,
//     18,
//     9648
//   ],
//   "id": 343611,
//   "original_title": "Jack Reacher: Never Go Back",
//   "original_language": "en",
//   "title": "Jack Reacher: Never Go Back",
//   "backdrop_path": "/4ynQYtSEuU5hyipcGkfD6ncwtwz.jpg",
//   "popularity": 26.818468,
//   "vote_count": 201,
//   "video": false,
//   "vote_average": 4.19
// }
