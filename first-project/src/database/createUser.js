module.exports = async function (datab, BankTest, {userData, userBankData}) {

    const createUser = await datab.run(`
        INSERT INTO users (
            username,
            userEmail,
            userCPF,
            userPassword,
            userCEP,
            userAdress,
            userAdressNumber,
            userNeighborhood
        ) VALUES (
            "${userData.username}",
            "${userData.userEmail}",
            "${userData.userCPF}",
            "${userData.userPassword}",
            "${userData.userCEP}",
            "${userData.userAdress}",
            "${userData.userAdressNumber}",
            "${userData.userNeighborhood}"
        );
    `)

    var UserID = createUser.lastID;

    if(BankTest == true) {

        var actualBank = userBankData[0]

        const createBankData = await datab.run(`
            INSERT INTO userBankData (
                cardNumber,
                expirationDate,
                cvv,
                cardName,
                user_id
            ) VALUES (
                "${actualBank.cardNumber}",
                "${actualBank.expirationDate}",
                "${actualBank.cvv}",
                "${actualBank.cardName}",
                "${UserID}"
            );  
            `)
    }
    
    return UserID;
}