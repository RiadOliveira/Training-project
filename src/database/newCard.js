module.exports = async function (db, userID, userBankData) {
    const addCard = await db.run(`
        INSERT INTO userBankData (
            cardNumber,
            expirationDate,
            cvv,
            cardName,
            user_id
        ) VALUES (
            "${userBankData.cardNumber}",
            "${userBankData.expirationDate}",
            "${userBankData.cvv}",
            "${userBankData.cardName}",
            "${userID}"
        );
    `)
}