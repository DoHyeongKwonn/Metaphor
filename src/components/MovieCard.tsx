function MovieCard() {
  return (
    <div className="card w-96 bg-base-100 shadow-xl max-w-xs text-sm ">
      <figure>
        <img src="https://img.movist.com/?img=/x00/05/53/65_p1.jpg" alt="movie" />
      </figure>
      <div className="card-body p-2">
        <h2 className="card-title">Movie</h2>
        <p>and the Oscar goes to</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary h-9 ">Trailer</button>
          <button className="btn btn-accent h-9 ">Review</button>
        </div>
      </div>
    </div>
  );
}
export default MovieCard;
