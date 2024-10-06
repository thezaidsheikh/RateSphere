import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster: "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = "8cf2c987";
export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState();
  // useEffect(function () {
  //   console.log("After intial render");
  // }, []);
  // useEffect(function () {
  //   console.log("After every render");
  // });
  // console.log("inside render");
  function handleSelectMovie(id) {
    if (id == selectedId) handleCloseMovie();
    else if (id) setSelectedId(id);
  }
  function handleCloseMovie() {
    setSelectedId(null);
    // document.title = "RateSphere";
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbId !== id));
  }
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setErrorMessage("");
          const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`, { signal: controller.signal });
          const data = await res.json();
          if (!data || data.Response == "False") throw new Error("Movie not found");
          setMovies(data.Search);
          setErrorMessage("");
        } catch (error) {
          if (error.name !== "AbortError") {
            console.log("Error in fetch movies", error);
            setErrorMessage(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setErrorMessage("");
        return;
      }
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumOfResult movies={movies} />
      </NavBar>
      <Main>
        <List>
          {isLoading && <Loader />}
          {!isLoading && errorMessage && <ErrorMessage message={errorMessage} />}
          {!isLoading && !errorMessage && <MoviesList movies={movies} onMovieSelect={handleSelectMovie} />}
        </List>
        <List>
          {selectedId ? (
            <MovieDetail selectedId={selectedId} onCloseMovie={handleCloseMovie} onAddWatch={handleAddWatched} watched={watched} />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>
          )}
        </List>
      </Main>
    </>
  );
}

const Loader = () => <p className="loader">LOADER...</p>;

const ErrorMessage = ({ message }) => <p className="error">{message}</p>;

const average = (arr) => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const Main = ({ children }) => {
  return <main className="main">{children}</main>;
};

const NavBar = ({ children }) => {
  return <nav className="nav-bar">{children}</nav>;
};

const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🎖️</span>
      <h1>RateSphere</h1>
    </div>
  );
};

const Search = ({ query, setQuery }) => {
  return <input className="search" type="text" placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} />;
};

const NumOfResult = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
};

const List = ({ children }) => {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen1((open) => !open)}>
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
};

const MoviesList = ({ movies, onMovieSelect }) => {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} onMovieSelect={onMovieSelect} />
      ))}
    </ul>
  );
};

const Movie = ({ movie, onMovieSelect }) => {
  return (
    <li key={movie.imdbID} onClick={() => onMovieSelect(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
};

// const WatchedBox = () => {
//   const [isOpen2, setIsOpen2] = useState(true);
//   return (
//     <div className="box">
//       <button className="btn-toggle" onClick={() => setIsOpen2((open) => !open)}>
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// };

const WatchedSummary = ({ watched }) => {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => parseInt(movie.Runtime)));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
};

const WatchedList = ({ watched, onDeleteWatched }) => {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} onDeleteWatched={onDeleteWatched} />
      ))}
    </ul>
  );
};

const WatchedMovie = ({ movie, onDeleteWatched }) => {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{parseInt(movie.Runtime)} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbId)}>
          x
        </button>
      </div>
    </li>
  );
};

const MovieDetail = ({ selectedId, onCloseMovie, onAddWatch, watched }) => {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let [userRating, setUserRating] = useState(0);
  // let title = movie ? movie.Title : "";
  let title = "";
  let loading = true;
  useEffect(
    function () {
      async function getMovieDetail() {
        try {
          setIsLoading(true);
          const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
          const data = await res.json();
          if (!data || data.Response == "False") throw new Error("Movie not found");
          setMovie(data);
          title = data.Title;
          setIsLoading(false);
        } catch (error) {
          console.log("Error in fetch movies", error);
        }
      }
      getMovieDetail();
    },
    [selectedId]
  );
  useEffect(
    function () {
      if (title) document.title = "movie | " + movie.Title;
      return function () {
        document.title = "RateSphere";
      };
    },
    [title]
  );

  useEffect(
    function () {
      function callback(e) {
        if (e.key === "Escape") onCloseMovie();
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );
  function handleUserRating() {
    const newWatchedMovie = {
      ...movie,
      imdbId: selectedId,
      userRating: userRating,
    };
    onAddWatch(newWatchedMovie);
    onCloseMovie();
  }
  if (isLoading || !movie) return <Loader />;
  const watchedMovie = watched.find((movie) => movie.imdbId == selectedId);
  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={() => onCloseMovie()}>
          &larr;
        </button>
        <img src={movie.Poster} alt={`${movie.Title} poster`} />
        <div className="details-overview">
          <h2>{movie.Title}</h2>
          <p>
            {movie.Released} &bull; {parseInt(movie.Runtime)} min
          </p>
          <p>{movie.Genre}</p>
          <p>
            <span>⭐️</span>
            {movie.imdbRating} IMDB Rating
          </p>
        </div>
      </header>
      <section>
        <div className="rating">
          {!watchedMovie ? (
            <>
              <StarRating maxRating={10} size={24} color="orange" onSetRating={setUserRating} />
              <button className="btn-add" onClick={handleUserRating}>
                + Add to list
              </button>
            </>
          ) : (
            <p>You have already rated this movie ⭐️ {watchedMovie.userRating}</p>
          )}
        </div>
        <p>
          <em>{movie.Plot}</em>
        </p>
        <p>Starring {movie.Actors}</p>
        <p>Directed by {movie.Director}</p>
      </section>
    </div>
  );
};
