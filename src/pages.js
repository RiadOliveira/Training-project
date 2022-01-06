//Movies requires
const moviesDatabase = require('./database/MovieDB/movieDB');
const getDate = require('./utils/getDate');

//User requires
const createUser = require('./database/createUser');
const newCard = require('./database/newCard');
const Database = require('./database/db');
const { userData, userBankData } = require('./utils/actualUser'); //Receive the UserData and UserBankData objects to receive the acutal User Data

const resetUser = require('./utils/resetUser'); //Reset information of the Actual User
const setUser = require('./utils/setUser'); //Sets user information
const createUserData = require('./utils/createUserData'); //To set userData on account creation

const actualDate = {
  day: new Date().getDate(),
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
};

const SearchDate = {
  //Keep the Searched day
  day: 0,
  month: 0,
  year: 0,
};

let MovieData = {}; //Will receive the Data of individual Movie Page
let actualMovieID; //Movie Selected ID to get it information
const highlightData = [{ highLink: '', MovieID: '' }]; //Will receive all data of Movies in Highlight

let isLogged = false; //Define if user is logged to modify HTML elements
let actualID; //actualUserId to get him information
//End of UserRequires

const index = (req, res) => {
  //Reset the Data of the Users and individual Movie
  isLogged = false;
  actualID = 0;
  MovieData = {};
  resetUser(userData, userBankData);

  return res.render('index.html');
};

const allMovies = async (req, res) => {
  MovieData = {}; //Resets every time that returns to the page
  actualMovieID = 0; //Resets MovieID

  const db = await moviesDatabase;

  if (false) {
    //To autodelete movies that are not longer in exibition, put true to activate

    const queryMovies = `
            DELETE FROM movieSchedule
            WHERE (movieSchedule.day < ${actualDate.day} AND movieSchedule.month <= ${actualDate.month})
        `;

    await db.run(queryMovies);
  }

  if (req.query.reset) {
    //Reset the SearchDate if the User click on site logo
    for (let ind in SearchDate) {
      SearchDate[ind] = 0;
    }
  }

  let moviesQuery = '';

  if (!SearchDate.day) {
    //Get the Movie information of actualDay
    moviesQuery = `
            SELECT movies.*, movieSchedule.*
            FROM movieSchedule
            JOIN movies ON (movies.id = movieSchedule.movieID)
            WHERE movieSchedule.day = ${actualDate.day}
            AND movieSchedule.month = ${actualDate.month}
            AND movieSchedule.year = ${actualDate.year}
        `;
  } else {
    //Get the Movie information of the Searched Day
    moviesQuery = `
            SELECT movies.*, movieSchedule.*
            FROM movieSchedule
            JOIN movies ON (movies.id = movieSchedule.movieID)
            WHERE movieSchedule.day = ${SearchDate.day}
            AND movieSchedule.month = ${SearchDate.month}
            AND movieSchedule.year = ${SearchDate.year}
        `;
  }

  const MoviesData = await db.all(moviesQuery);

  queryHighlights = `
        SELECT movies.*, movieSchedule.*
        FROM movieSchedule
        JOIN movies ON (movies.id = movieSchedule.movieID)
        WHERE movies.highlightPoster != ''
    `; //If the Movie has a highlightPoster, receive for exibition on the page

  const highlightMovies = await db.all(queryHighlights);

  const times = [];
  const indexes = [];

  for (let ind in MoviesData) {
    times[ind] = `${MoviesData[ind].timeFrom}-${ind}`; //Get the Schedule, with the index of the movie
    //Get the order of schedule
  }

  times.sort(); //sort the schedule

  for (let ind in times) {
    indexes[ind] = times[ind].split('-')[1]; //Indexes receive the schedule order
  }

  let actualDay = '';

  if (!SearchDate.day) {
    //To define ActualDay
    actualDay = getDate(actualDate.day, actualDate.month, actualDate.year);
  } else {
    actualDay = getDate(SearchDate.day, SearchDate.month, SearchDate.year);
  }

  const MoviesIDS = [];

  for (let ind in highlightMovies) {
    MoviesIDS[ind] = highlightMovies[ind].movieID;
    let test = true;

    for (let i = 0; i < MoviesIDS.length - 1; i++) {
      //Verify the presence of repeat movies
      if (MoviesIDS[i] === highlightMovies[ind].movieID) {
        test = false;
        break;
      }
    }

    if (test) {
      //Put the Data on the Object
      if (!highlightData[0].highLink) {
        highlightData[0] = {
          highLink: highlightMovies[ind].highlightPoster,
          MovieID: highlightMovies[ind].id,
        };
      } else {
        highlightData[highlightData.length] = {
          highLink: highlightMovies[ind].highlightPoster,
          MovieID: highlightMovies[ind].id,
        };
      }
    }
  }

  return res.render('all-movies.html', {
    isLogged,
    MoviesData,
    actualDay,
    indexes,
    highlightData,
  });
};

const searchMovies = (req, res) => {
  const searchedDay = Number(req.body.search);

  if (!SearchDate.day) {
    //To equal SearchDate to actualDate
    for (let ind in SearchDate) {
      SearchDate[ind] = actualDate[ind];
    }
  }

  if (searchedDay < actualDate.day && SearchDate.month !== actualDate.month) {
    //Verify to pass to the next month
    SearchDate.month += 1;

    if (SearchDate.month === 12) {
      //Verify to pass to the next year
      SearchDate.month = 0;
      SearchDate.year += 1;
    }
  } else if (searchedDay >= actualDate.day) {
    SearchDate.month = actualDate.month;
  }

  SearchDate.day = searchedDay;

  return res.redirect('/all-movies');
};

const advanceDay = (req, res) => {
  if (!SearchDate.day) {
    for (let ind in SearchDate) {
      SearchDate[ind] = actualDate[ind];
    }
  }

  SearchDate.day++; //Advance one day

  if (SearchDate.day === 32) {
    //Verify the day of the month
    SearchDate.day = 1;
    SearchDate.month += 1;

    if (SearchDate.month === 12) {
      //Verify the day of the year
      SearchDate.month = 0;
      SearchDate.year += 1;
    }
  }

  return res.redirect('/all-movies');
};

const returnDay = (req, res) => {
  if (!SearchDate.day) {
    for (let ind in SearchDate) {
      SearchDate[ind] = actualDate[ind];
    }
  }

  if (SearchDate.day > 1) {
    //Verify the day of the month
    SearchDate.day--;
  } else {
    if (SearchDate.year > actualDate.year) {
      //Verify if pass the year and want to return
      SearchDate.day = 31;
      SearchDate.month = 11;
      SearchDate.year -= 1;
    } else {
      SearchDate.day = 31;
      SearchDate.month -= 1;
    }
  }

  return res.redirect('/all-movies');
};

const individualMovie = async (req, res) => {
  const db = await moviesDatabase;

  const MovieID = req.query.movieID; //Get the movie by the movieID defined on all movies page and get it information
  actualMovieID = MovieID;

  queryMovie = `
        SELECT movies.*, movieSchedule.*
        FROM movieSchedule
        JOIN movies ON (movies.id = movieSchedule.movieID)
        WHERE movieSchedule.id = ${MovieID}
    `;

  MovieData = await db.all(queryMovie);

  MovieData = MovieData[0];

  return res.render('individual-movie.html', { isLogged, MovieData });
};

const buyTicket = (req, res) => {
  return res.render('buy-ticket.html', { isLogged, userBankData, MovieData });
};

const buyFinalization = (req, res) => {
  const confirmCard = req.body;
  const Price = confirmCard.ticketQuantity * MovieData.ticketValue; //Get total price of the tickets

  if (!confirmCard.payMethod) {
    const SelectedCard = userBankData[confirmCard.userCards]; //Get selected card ()
  }

  return res.redirect(`/success-buy?payMethod=${confirmCard.payMethod}`);
};

const successBuy = (req, res) => {
  const buyData = {
    text: '',
    img: '',
    payMethod: req.query.payMethod,
  };

  if (!req.query.payMethod) {
    //Return of card method
    buyData.text = 'Compra finalizada com sucesso.';
    buyData.img = '/images/utils/success.png';
  } else {
    //Return of the billet method
    buyData.text = 'Pague o boleto abaixo para concluir a compra.';
  }

  return res.render('success-buy.html', { buyData, isLogged });
};

const sigAndLog = (req, res) => {
  let logError = ''; //Will receive the error message and send to front-end if the login was unsuccessful

  if (req.query.success === 0) {
    //Verify if the login has been successful
    logError = 'Login ou senha inválido(s).';
  }

  return res.render('sig&log.html', { logError });
};

const completeLogin = async (req, res) => {
  const userLogin = req.body;
  const db = await Database;

  const queryUser = `
        SELECT users.*
        FROM users
        WHERE users.userEmail = "${userLogin.email}"
        AND users.userPassword = ${userLogin.password}
    `; //Verify the presence of account on database

  const loginConfirm = await db.all(queryUser);

  if (loginConfirm === '') {
    //If the data was not found on database, return a query with success = 0
    res.redirect('/sig&log' + '?success=0');
  } else {
    //Get user information
    actualID = loginConfirm[0].id;

    const queryBank = `
            SELECT userBankData.*
            FROM userBankData
            WHERE userBankData.user_id = ${actualID}
        `; //Pick userBankData

    const BankConfirm = await db.all(queryBank);

    setUser(userData, userBankData, loginConfirm, BankConfirm);

    isLogged = true;

    if (!actualMovieID) {
      //Verify if the user clicked on some movie
      return res.redirect('/logged');
    } else {
      //If he has clicked, redirect to buy ticket page of the selected movie
      return res.redirect(`/buy-ticket?movieID=${actualMovieID}`);
    }
  }
};

const addCard = async (req, res) => {
  const cardInf = req.body;
  const db = await Database;
  let bankLength = userBankData.length;

  if (userBankData[0]) {
    const bankValues = Object.values(userBankData[0]);

    if (userBankData.length === 1 && !bankValues[0].length) {
      //Verify the first position of the vector
      bankLength = 0;
    }
  }

  userBankData[bankLength] = {
    //Adds on the specified position
    cardNumber: cardInf.cardNumber,
    expirationDate: cardInf.expirationDate,
    cvv: cardInf.cvv,
    cardName: cardInf.cardName,
  };

  await newCard(db, actualID, userBankData[userBankData.length - 1]); //Add on database, based on the object created

  res.redirect('/logged?success=1');
};

const logged = async (req, res) => {
  if (req.query.cardID !== undefined) {
    //Receive Card ID from axios on frontend, if it has received, delete card
    const cardID = req.query.cardID;

    const cardNumber = userBankData[cardID].cardNumber;

    const queryCards = `
            DELETE FROM userBankData
            WHERE (user_id = "${actualID}" AND cardNumber = ${cardNumber})
        `; //Delete the specific card

    delete userBankData[cardID];

    if (!userBankData[0]) {
      //If the deleted card was the unique card of the user, reset the userBankData[0] Object from the server
      userBankData[0] = {
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        cardName: '',
      };
    }

    const db = await Database;

    await db.run(queryCards);
  }

  const bankDataValues = Object.values(userBankData[0]);

  return res.render('logged.html', {
    userData,
    userBankData,
    verifyBank: !!bankDataValues[0],
    newCard: !!req.query.success,
  });
};

const createAccount = (req, res) => {
  let signError = '';

  if (req.query.success === 0) {
    //Verify if the account has already been created and send a error message
    signError = 'E-mail ou CPF já existente(s).';
  }

  return res.render('create-account.html', { signError });
};

const confirmAccount = async (req, res) => {
  const userInf = req.body;
  const datab = await Database;

  const queryAccount = `
        SELECT users.*
        FROM users
        WHERE users.userEmail = "${userInf.userEmail}"
    `;

  const queryCPF = `
        SELECT users.*
        FROM users
        WHERE users.userCPF = "${userInf.userCPF}"
    `;

  const verifyAccount = await datab.all(queryAccount);
  const verifyCPF = await datab.all(queryCPF);

  if (!verifyAccount[0] && !verifyCPF[0]) {
    //Verify if the account already exists
    createUserData(userData, userBankData, userInf);

    const BankDataVerification = Object.values(userBankData[0]);

    let BankTest = true;

    BankDataVerification.forEach((ind) => {
      if (!ind) {
        BankTest = false; //Verify if the user insert card information
      }
    });

    actualID = await createUser(datab, BankTest, { userData, userBankData });

    isLogged = true;

    if (!actualMovieID) {
      //Verify if the user select some movie and redirect to the movie
      return res.redirect('/logged');
    } else {
      return res.redirect(`/buy-ticket?movieID=${actualMovieID}`);
    }
  } else {
    res.redirect('/create-account' + '?success=0');
  }
};

module.exports = {
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
};
