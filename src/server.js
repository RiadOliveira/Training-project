const express = require('express');
const nunjucks = require('nunjucks');

const {
  index,
  allMovies,
  individualMovie,
  buyTicket,
  logged,
  sigAndLog,
  createAccount,
  confirmAccount,
  completeLogin,
  addCard,
  searchMovies,
  advanceDay,
  returnDay,
  buyFinalization,
  successBuy,
} = require('./pages');

const server = express();

nunjucks.configure('src/views/', {
  express: server,
  NoCache: true,
});

server
  .get('/', index)
  .use(express.static('public'))
  .use(express.urlencoded({ extended: true }))
  .get('/all-movies', allMovies)
  .get('/individual-movie', individualMovie)
  .get('/buy-ticket', buyTicket)
  .get('/logged', logged)
  .get('/sig&log', sigAndLog)
  .get('/create-account', createAccount)
  .post('/confirm-account', confirmAccount)
  .post('/complete-login', completeLogin)
  .post('/add-card', addCard)
  .post('/search-movie', searchMovies)
  .get('/advance-day', advanceDay)
  .get('/return-day', returnDay)
  .post('/buy-finalization', buyFinalization)
  .get('/success-buy', successBuy)
  .listen('5500');
