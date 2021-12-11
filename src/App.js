import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchBox from './components/SearchBox';
import AddFavourites from './components/AddFavourites';
import RemoveFavourites from './components/RemoveFavourites';

function App() {
  const [movies, setMovies] = useState([]); 
  const [favourites, setFavourites] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  /* Call to the API, to get the movies from the API  */
  const getMovieRequest = async (searchValue) => {
    const url = `http://www.omdbapi.com/?s=${searchValue}&apikey=c284172c`; /* THE API! ${searchValue} -> passing in the search value, you get a array of the movies you search for.  */
  
    const response = await fetch(url); /* Request that goes to the API (Using the fetch API to make a request from the url) */
    const responseJson = await response.json();/* Converting to JSON (converting the http response into Json) */

    if(responseJson.Search) { /* if this is true (the movie is found in the search)  */
      setMovies(responseJson.Search); /* calling the Search: Array */
    }
  };
/* Calling the ,,getMovieRequest" using ,,useEffect" hook */
  useEffect(() => {
    getMovieRequest(searchValue);
  },[searchValue]);

  useEffect(() => {
    const movieFavourites = JSON.parse(
      localStorage.getItem('react-movie-app-favourites')
    );

    if (movieFavourites){
      setFavourites(movieFavourites);
    }
    
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem('react-movie-app-favourites', JSON.stringify(items));
  };

  const addFavouriteMovie = (movie) => {
    const newFavouriteList = [...favourites, movie];
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter(
        (favourite) => favourite.imdbID !== movie.imdbID
      );

      setFavourites(newFavouriteList);
      saveToLocalStorage(newFavouriteList);
  };


  return (
    <div className='container-fluid movie-app'>
      <div className='row d-flex align-items-center mt-4 mb-4'>
        <MovieListHeading heading='Movies'/>
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue}/>
      </div>
      <div className='row'>
        <MovieList 
          movies={movies} 
          handleFavouritesClick={addFavouriteMovie} 
          favouriteComponent={AddFavourites}
        />
      </div>
      <div className='row d-flex align-items-center mt-4 mb-4'>
        <MovieListHeading heading='Your Favourites'/>
      </div>
      <div className='row'>
        <MovieList 
          movies={favourites} 
          handleFavouritesClick={removeFavouriteMovie} 
          favouriteComponent={RemoveFavourites}
        />
      </div>
    </div>
  );
};

export default App;
