let actualMovie = 0;
const posters = document.querySelectorAll('.movies-posters');

const firstMovieStyle = posters[0].style;

//To starts on the first movie
firstMovieStyle.opacity = '1';
firstMovieStyle.display = 'flex';
firstMovieStyle.zIndex = '1';

const showHighlights = (ind) => {
  //To pass manually the highlight movies
  const Movie = actualMovie;

  posters[Movie].style.opacity = '0';
  posters[Movie].style.zIndex = '0';

  if (Movie + ind < 0) {
    posters[posters.length - 1].style.display = 'flex';
    posters[posters.length - 1].style.zIndex = '1';
    actualMovie = posters.length - 1;
  } else if (Movie + ind === posters.length) {
    posters[0].style.display = 'flex';
    posters[0].style.zIndex = '1';
    actualMovie = 0;
  } else {
    posters[Movie + ind].style.display = 'flex';
    posters[Movie + ind].style.zIndex = '1';
    actualMovie += ind;
  }

  setTimeout(() => {
    //Set a interval to pass the movies
    setTimeout(() => {
      if (posters[actualMovie] != posters[Movie]) {
        posters[Movie].style.display = 'none';
      }
    }, 3000);

    if (Movie + ind < 0) {
      posters[posters.length - 1].style.opacity = '1';
    } else if (Movie + ind === posters.length) {
      posters[0].style.opacity = '1';
    } else {
      posters[Movie + ind].style.opacity = '1';
    }
  }, 500);
};

setInterval(showHighlights, 5000, 1); //To pass automatically the highlight movies
