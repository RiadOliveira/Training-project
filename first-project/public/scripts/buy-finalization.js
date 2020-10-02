function loadPage() {
    const cardOption = document.getElementById('card-option');
    const userCards = document.querySelectorAll('.data-finalization')[1];

    if(cardOption == null) { //If the user do not has cards, sets none display of the card option
        userCards.style.display = 'none'
    }
}

function payMethodSelection (payMethod, methodOption) { //If Select Billet method, sets none display for card selection
    const payMethodElement = document.querySelectorAll(payMethod)[1];
    payMethodElement.style.display = (methodOption.value == 0) ? 'flex' : 'none';
}

function getTotalValue (totalTag, totalValue) { //To obtain the total value of the tickets
    const tagValue = document.querySelector(totalTag);
    const ticketValue = document.getElementById('ticket-value').innerText;
    tagValue.innerHTML = `Valor total: ${(totalValue.value)*ticketValue /*Movie ticket price*/}R$`;
}