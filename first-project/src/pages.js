//Movies requires
const moviesDatabase = require('./database/MovieDB/movieDB')  //Movies Database
const getDate = require('./utils/getDate')                   //Import a function to Get Actual Date day/month/year

const actualDate = {
    day: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear()
}

var SearchDate = { //Keep the Searched day      
    day: 0,
    month: 0,
    year: 0
}

var MovieData = {};   //Will receive the Data of individual Movie Page    
var actualMovieID;    //Movie Selected ID to get it information
var highlightData = [{highLink: '', MovieID: ''}];  //Will receive all data of Movies in Highlight

//User requires
const createUser = require('./database/createUser') //Require the function on user account creation
const newCard = require('./database/newCard')  //Require the function that adds new user cards
const Database = require('./database/db')  //Require Database
var {userData, userBankData} = require('./utils/actualUser');  //Receive the UserData and UserBankData objects to receive the acutal User Data

const resetUser = require('./utils/resetUser');  //Reset information of the Actual User
const setUser = require('./utils/setUser');      //Sets user information
const createUserData = require('./utils/createUserData');  //To set userData on account creation

var isLogged = false;  //Define if user is logged to modify HTML elements
var actualID;          //actualUserId to get him information
//End of UserRequires

function index (req, res) {
    //Reset the Data of the Users and individual Movie
    isLogged = false;
    actualID = 0;
    MovieData = {};
    resetUser(userData, userBankData);
    return res.render('index.html');
}

async function allMovies (req, res) {

    MovieData = {};  //Reset ever time return to the page
    actualMovieID = 0;  //Reset MovieID
    const db = await moviesDatabase;

    if(false) { //To autodelete movies that are not longer in exibition, put true to activate
        const queryMovies = (`
            DELETE FROM movieSchedule
            WHERE (movieSchedule.day < ${actualDate.day} AND movieSchedule.month <= ${actualDate.month + 1})
        `)

        await db.run(queryMovies)
    }

    if(req.query.reset) {   //Reset the SearchDate if the User click on site logo
        for(var ind in SearchDate) {
            SearchDate[ind] = 0;
        }
    }

    if(SearchDate.day == 0) {  //Get the Movie information of actualDay
        var moviesQuery = (`
            SELECT movies.*, movieSchedule.*
            FROM movieSchedule
            JOIN movies ON (movies.id = movieSchedule.movieID)
            WHERE movieSchedule.day = ${actualDate.day}
            AND movieSchedule.month = ${actualDate.month+1}
            AND movieSchedule.year = ${actualDate.year}
        `)
    } else {  //Get the Movie information of the Searched Day
        var moviesQuery = (`
            SELECT movies.*, movieSchedule.*
            FROM movieSchedule
            JOIN movies ON (movies.id = movieSchedule.movieID)
            WHERE movieSchedule.day = ${SearchDate.day}
            AND movieSchedule.month = ${SearchDate.month+1}
            AND movieSchedule.year = ${SearchDate.year}
        `)
    }
    
    var MoviesData = await db.all(moviesQuery);

    queryHighlights = (`
        SELECT movies.*, movieSchedule.*
        FROM movieSchedule
        JOIN movies ON (movies.id = movieSchedule.movieID)
        WHERE movies.highlightPoster != ''
    `) //If the Movie has a highlightPoster, receive for exibition on the page

    const highlightMovies = await db.all(queryHighlights);

    var times = [];
    var indexes = [];

    for(var ind in MoviesData) {
        times[ind] = `${MoviesData[ind].timeFrom}-${ind}` //Get the Schedule, with the index of the movie
        //Get the order of schedule
    }

    times.sort() //sort the schedule

    for(var ind in times) {
        indexes[ind] = times[ind].split('-')[1]  //Indexes receive the schedule order
    }
        
    if(SearchDate.day == 0) {  //To define ActualDay
        var actualDay = getDate(actualDate.day, actualDate.month+1, actualDate.year)
    } else {
        var actualDay = getDate(SearchDate.day, SearchDate.month+1, SearchDate.year)
    }

    var MoviesIDS = [];
        
    for(var ind in highlightMovies){

        MoviesIDS[ind] = highlightMovies[ind].movieID;
        var test = true;
                
        for(var i=0 ; i < MoviesIDS.length-1 ; i++) {   //Verify the presence of repeat movies
            if(MoviesIDS[i] == highlightMovies[ind].movieID) {
                test = false;
                break;
            }
        }

        if(test) { //Put the Data on the Object
            if(highlightData[0].highLink == '') {
                highlightData[0] = {
                    highLink: highlightMovies[ind].highlightPoster,
                    MovieID: highlightMovies[ind].id
                }
            } else {
                highlightData[highlightData.length] = {
                    highLink: highlightMovies[ind].highlightPoster,
                    MovieID: highlightMovies[ind].id
                }
            }
        }
    }
    
    return res.render('all-movies.html', {isLogged, MoviesData, actualDay, indexes, highlightData});
}

function searchMovies (req, res) {
    const searchedDay = Number(req.body.search);

    if(SearchDate.day == 0) {  //To equal SearchDate to actualDate
        for(var ind in SearchDate) {
            SearchDate[ind] = actualDate[ind]
        }
    }
    
    if(searchedDay < actualDate.day && SearchDate.month != actualDate.month + 1) {  //Verify to pass to the next month
        SearchDate.month += 1;

        if(SearchDate.month == 12) { //Verify to pass to the next year
            SearchDate.month = 0;
            SearchDate.year += 1;
        }
        
    } else if(searchedDay >= actualDate.day) {
        SearchDate.month = actualDate.month
    }

    SearchDate.day = searchedDay;

    return res.redirect('/all-movies')
}

function advanceDay (req, res) {
    if(SearchDate.day == 0) {
        for(var ind in SearchDate) {
            SearchDate[ind] = actualDate[ind]
        }
    }

    SearchDate.day++; //Advance one day

    if(SearchDate.day == 32) { //Verify the day of the month
        SearchDate.day = 1;
        SearchDate.month += 1;

        if(SearchDate.month == 12) { //Verify the day of the year
            SearchDate.month = 0;
            SearchDate.year += 1;
        }
    }

    return res.redirect('/all-movies')
}

function returnDay (req, res) {
    if(SearchDate.day == 0) {
        for(var ind in SearchDate) {
            SearchDate[ind] = actualDate[ind]
        }
    }

    if(SearchDate.day > 1) { //Verify the day of the month
        SearchDate.day--;
    } else {

        if(SearchDate.year > actualDate.year) { //Verify if pass the year and want to return
            SearchDate.day = 31;
            SearchDate.month = 11;
            SearchDate.year -= 1;
        } else {
            SearchDate.day = 31;
            SearchDate.month -= 1;
        }  
    }

    return res.redirect('/all-movies')
}

async function individualMovie (req, res) {

    const db = await moviesDatabase

    const MovieID = req.query.movieID; //Get the movie by the movieID defined on all movies page and get it information
    actualMovieID = MovieID;

    queryMovie = (`
        SELECT movies.*, movieSchedule.*
        FROM movieSchedule
        JOIN movies ON (movies.id = movieSchedule.movieID) 
        WHERE movieSchedule.id = ${MovieID}
    `)

    MovieData = await db.all(queryMovie)

    MovieData = MovieData[0]
    
    return res.render('individual-movie.html', {isLogged, MovieData})
}

function buyTicket (req, res) {
    return res.render('buy-ticket.html', {isLogged, userBankData, MovieData})
}

function buyFinalization (req, res) {
    const confirmCard = req.body;
    const Price = confirmCard.ticketQuantity*MovieData.ticketValue //Get the total price of the tickets

    if(confirmCard.payMethod == 0) {
        const SelectedCard = userBankData[confirmCard.userCards]; //Get the selected card

        return res.redirect('/success-buy?payMethod=0')  //Paid out by the card
    } else {
        return res.redirect('/success-buy?payMethod=1')
    }
}

function successBuy (req, res) {

    if(req.query.payMethod == 0) { //Return of card method
        var buyData = {
            text: 'Compra finalizada com sucesso.',
            img: '/images/utils/success.png',
            payMethod: req.query.payMethod
        } 
    } else {  //Return of the billet method
        var buyData = {
            text: 'Pague o boleto abaixo para concluir a compra.',
            img: '',
            payMethod: req.query.payMethod
        }
    }

    return res.render('success-buy.html', {buyData, isLogged})
}

function sigAndLog (req, res) {

    var logError = '' //Will receive the error message and send to front-end if the login was unsuccessful

    if(req.query.success == "0") { //Verify if the login has been successful
        logError = 'Login ou senha inválido(s).'
        return res.render('sig&log.html', {logError})
    }
    return res.render('sig&log.html', {logError})
}

async function completeLogin (req, res) {
    const userLogin = req.body;
    const db = await Database

    const queryUser = (`
        SELECT users.*
        FROM users
        WHERE users.userEmail = "${userLogin.email}"
        AND users.userPassword = ${userLogin.password}
    `) //Verify the presence of account on database

    const loginConfirm = await db.all(queryUser);
    
    if(loginConfirm == '') { //If the data was not found in the database, return the query with success = 0
        res.redirect('/sig&log' + '?success=0')
    } else { //Get user information

        actualID = loginConfirm[0].id;

        const queryBank = (`
            SELECT userBankData.*
            FROM userBankData
            WHERE userBankData.user_id = ${actualID}
        `) //Pick the userBankData

        const BankConfirm = await db.all(queryBank)
        
        setUser(userData, userBankData, loginConfirm, BankConfirm);

        isLogged = true;

        if(actualMovieID == 0 || actualMovieID == undefined) { //Verify if the user clicked on some movie
            return res.redirect('/logged'); 
        } else { //If him clicked, redirect to buy ticket page of the movie
            return res.redirect(`/buy-ticket?movieID=${actualMovieID}`)
        }      
    }
}

async function addCard (req, res) {

    const cardInf = req.body;
    const db = await Database;
    var bankLength;

    if(userBankData[0] == undefined) { //Verify the length of the vector and adds data on the last position
        bankLength = userBankData.length
    } else {
        const bankValues = Object.values(userBankData[0])

        if((userBankData.length == 1) && (bankValues[0] == '')) { //Verify the first position of the vector
            bankLength = 0;
        } else {
            bankLength = userBankData.length
        }
    }
   
    userBankData[bankLength] = { //Adds on the specified position
        cardNumber: cardInf.cardNumber,
        expirationDate: cardInf.expirationDate,
        cvv: cardInf.cvv,
        cardName: cardInf.cardName
    }

    await newCard(db, actualID, userBankData[userBankData.length-1]); //Add on database, based on the object created
    
    res.redirect('/logged?success=1')    
}

async function logged (req, res) {

    var verifyBank = Object.values(userBankData[0]);
    verifyBank = (verifyBank[0] != '' ) ? true : false; //Verify if a credit card was registered
    
    if(req.query.cardID != undefined) { //Receive Card ID from axios on frontend, if receive, delete card
        const cardID = req.query.cardID

        const cardNumber = userBankData[cardID].cardNumber

        const queryCards = (`
            DELETE FROM userBankData
            WHERE (user_id = "${actualID}" AND cardNumber = ${cardNumber})
        `) //Delete the specific card

        delete userBankData[cardID];

        if(userBankData[0] == undefined) { //If the deleted card was the unique card of the user, reset the userBankData[0] Object from the server
            userBankData[0] = {
                cardNumber: '',
                expirationDate: '',
                cvv: '',
                cardName: ''
            }
        }

        const db = await Database;

        const excludeCard = await db.run(queryCards)
    }

    var newCard = false;

    if(req.query.success == 1) { //If the Add of the card was successful, send the confirmation to frontend
        newCard = true;
    }

    return res.render('logged.html', {userData, userBankData, verifyBank, newCard})
}

function createAccount (req, res) {
    var signError = '';

    if(req.query.success == 0) { //Verify if the account has already been created and send a error message
        signError = 'E-mail ou CPF já existente(s).'
        return res.render('create-account.html', {signError});
    }

    return res.render('create-account.html', {signError});
}

async function confirmAccount (req, res) {
    const userInf = req.body;
    const datab = await Database;

    const queryAccount = (`
        SELECT users.*
        FROM users
        WHERE users.userEmail = "${userInf.userEmail}"
    `) 

    const queryCPF = (`
        SELECT users.*
        FROM users
        WHERE users.userCPF = "${userInf.userCPF}"
    `)
    
    const verifyAccount = await datab.all(queryAccount);
    const verifyCPF = await datab.all(queryCPF);

    if(verifyAccount[0] == undefined && verifyCPF[0] == undefined) { //Verify if the account already exists

        createUserData(userData, userBankData, userInf);

        const BankDataVerification = Object.values(userBankData[0]);

        var BankTest = true; 

        BankDataVerification.forEach(function (ind) {
            if(ind == '') {
                BankTest = false; //Verify if the user insert card information
            }
        })

        actualID = await createUser(datab, BankTest, {userData, userBankData});

        isLogged = true;

        if(actualMovieID == 0 || actualMovieID == undefined) { //Verify if the user select some movie and redirect to the movie
            return res.redirect('/logged');
        } else {
            return res.redirect(`/buy-ticket?movieID=${actualMovieID}`)
        }  
    } else {
        res.redirect('/create-account' + '?success=0')
    }
}

module.exports = {index, allMovies, individualMovie, buyTicket, logged, sigAndLog, createAccount, confirmAccount, completeLogin, addCard, searchMovies, advanceDay, returnDay, buyFinalization, successBuy}