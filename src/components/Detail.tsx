import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Credits, fetchMovieCredits, fetchMovieDetail, fetchMovieTrailer, Movie } from "../Api/tmdbApi";
import Review from "./Review";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import LikeButton from "./Like";

interface Video {
  key: string;
  name: string;
  site: string;
  type: string;
}

function Detail() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [reviews, setReviews] = useState<{ content: string; username: string; time: string }[]>([]);

  useEffect(() => {
    const fetchMovie = async () => {
      if (id) {
        try {
          setLoading(true);
          const movieDetail = await fetchMovieDetail(Number(id));
          setMovie(movieDetail);
          const trailerDetail = await fetchMovieTrailer(Number(id));
          setTrailer(trailerDetail);
          const movieCredits = await fetchMovieCredits(parseInt(id));
          setCredits(movieCredits);
        } catch (error) {
          console.error("Error fetching movie detail:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMovie();
  }, [id]);
  useEffect(() => {
    const fetchReviews = () => {
      if (id) {
        const reviewsRef = collection(db, `review/${id}/reviews`);
        const q = query(reviewsRef, orderBy("createdAt"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const reviewsList: { content: string; username: string; time: string }[] = [];
          querySnapshot.forEach((doc) => {
            reviewsList.push({
              content: doc.data().content,
              username: doc.data().username,
              time: doc.data().createdAt.toDate().toLocaleString(),
            });
          });
          setReviews(reviewsList);
        });

        return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
      }
    };

    fetchReviews();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-[500px] justify-center pt-10">
        {trailer ? (
          <iframe
            width="30%"
            height="500"
            src={`https://www.youtube.com/embed/${trailer.key}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
          ></iframe>
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="max-w-sm rounded-lg shadow-2xl h-[500px]"
          />
        )}

        <div className="pt-2 pl-5 w-[700px]">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="pt-6 h-[100px] overflow-hidden">{movie.overview}</p>

          {credits && (
            <div className="credits mt-[4px]">
              <h2 className="text-2xl font-bold">감독</h2>
              <ul>
                {credits.crew
                  .filter((member) => member.job === "Director")
                  .map((director) => (
                    <li key={director.id}>{director.name}</li>
                  ))}
              </ul>
              <h2 className="text-2xl mt-3 font-bold">출연 배우</h2>
              <ul>
                {credits.cast.slice(0, 5).map((actor) => (
                  <li key={actor.id}>
                    {actor.name} as {actor.character}
                  </li>
                ))}
              </ul>
              <p className="mt-3">개봉일 : {movie.release_date}</p>
              <p className="mt-3">평점 : {movie.vote_average}</p>
            </div>
          )}
          <LikeButton id={id} />
          {/* <div className="indicator mt-3">
            <span className="indicator-item badge badge-secondary top-[5px] right-[3px]"></span>
            <button className=" text-lg ">Like</button>
          </div> */}
          {/* {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Trailer
              </a>
            )} */}
        </div>
      </div>
      <div className="flex flex-col items-center mt-10">
        <div className="pb-4 px-4 w-2/3">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className=" mb-2">
                <div className="area rounded-lg shadow-md pb-1 min-h-15">
                  <div className="px-4 pt-2">{review.content}</div>
                  <div className="px-4 text-right">
                    {review.username} - {review.time}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="pl-2">등록된 리뷰가 없습니다.</div>
          )}
        </div>
        <div className="comment pb-4 px-4  w-2/3">
          <Review id={id} />
        </div>
      </div>
    </>
  );
}

export default Detail;
