import MovieCard from "./MovieCard";

const Home = () => {
  return (
    <>
      <p className="flex justify-center mt-5">현재 상영작</p>
      <div className="flex justify-center mt-5">
        <MovieCard />
      </div>
      <p className="flex justify-center mt-5">개봉 예정작</p>
      <div className="flex justify-center mt-5">
        <MovieCard />
      </div>
      <p className="flex justify-center mt-5">뭐라고 쓸까</p>
      <div className="flex justify-center mt-5">
        <MovieCard />
      </div>
    </>
  );
};
export default Home;
