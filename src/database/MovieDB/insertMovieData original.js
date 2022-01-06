const Database = require('./movieDB');
const createDB = require('./createMovieData');

const insertData = async () => {
  const currentYear = new Date().getFullYear();

  const movieData = {
    name: '', //Movie nome
    producer: '', //Name of the producer of the movie
    poster: '/images/movies/', //Href of the movie poster img, complete the href or insert a web href (1383 x 2048), REMEMBER EXTENSION
    synopsis: '', //Complete synopsis of the movie, individual movie tab
    duration: 0, //Duration of the movie (On minutes)
    ticketValue: 0, //Value of the individual ticket
    classification: '/images/utils/classification/.png', //Href of the classification img, insert the number.png to complete
    reducedSynopsis: '', //To the all-movies tab
    genre: '',
    trailerLink: '',
    highlightPoster: '/images/movies/', //(Optional) To movies in highlight, href of the img, complete the href or insert a web href (1371 x 564), put '' for no Highlight poster, REMEMBER EXTENSION
  };

  const movieSchedule = [{}];

  movieSchedule[0] = {
    timeFrom: '',
    timeTo: '',
    day: 0,
    month: 0,
    year: currentYear,
    language: '',
  };

  const db = await Database;

  await createDB(db, { movieData, movieSchedule });
};

insertData();

//node src/database/MovieDB/insertMovieData
