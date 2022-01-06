const Database = require('./movieDB');
const createDB = require('./createMovieData');

const insertData = async () => {
  const currentYear = new Date().getFullYear();

  const movieData = {
    name: 'Movie 2', //Movie nome
    producer: 'Producer 2', //Name of the producer of the movie
    poster: '/images/movies/movie2-p.png', //Href of the movie poster img, complete the href or insert a web href (1383 x 2048)
    synopsis:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla at risus. Quisque purus magna, auctor et, sagittis ac, posuere eu, lectus. Nam mattis, felis ut adipiscing.', //Complete synopsis of the movie, individual movie tab
    duration: 150, //Duration of the movie (On minutes)
    ticketValue: 14, //Value of the individual ticket
    classification: '/images/utils/classification/18.png', //Href of the classification img, insert the number.png to complete
    reducedSynopsis:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eget ligula eu lectus lobortis condimentum. Aliquam nonummy auctor massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.', //To the all-movies tab
    genre: 'Genre 2',
    trailerLink: 'https://www.youtube.com',
    highlightPoster: '/images/movies/movie2-h.png', //(Optional) To movies in highlight, href of the img, complete the href or insert a web href (1371 x 564), put '' for no Highlight poster
  };

  const movieSchedule = [{}];

  movieSchedule[0] = {
    timeFrom: '15',
    timeTo: '17:30',
    day: 2,
    month: 10,
    year: currentYear,
    language: 'Português',
  };

  movieSchedule[1] = {
    timeFrom: '20',
    timeTo: '22:30',
    day: 2,
    month: 1,
    year: currentYear,
    language: 'Inglês',
  };

  const db = await Database;

  await createDB(db, { movieData, movieSchedule });
};

insertData();

//node src/database/MovieDB/insertMovieData
