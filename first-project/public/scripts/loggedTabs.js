function loadPage() {
    const newCard = document.getElementById('newCard').innerText;
    
    if(newCard == 'true') { //Starts on card Tab if new card was added
        content[0].style.display = 'none'; //Start on Bank display
        buttons[1].style.paddingBottom = '3vh'; //Bankdata marked
        formCard.style.display = 'none';
        alert('Novo cartão adicionado!');
    } else {
        content[1].style.display = 'none'; //Start on userdata display
        buttons[0].style.paddingBottom = '3vh'; //Userdata marked
    }
}

//Tab alternation
function navTabs(selectedTab) {
    content.forEach(function(tabs) {
        tabs.style.display = 'none'
    })
    buttons.forEach(function(selectedButton) {
        selectedButton.style.paddingBottom = '.4rem'
    } )

    content[selectedTab].style.display = 'block'
    buttons[selectedTab].style.paddingBottom = '3vh'

    if(selectedTab = 1) {
        formCard.style.display = 'none';
    }
}

//Add and cancel add of new cards functions
function addCard() {
    formCard.style.display = 'flex'; 
}

function cancelAdd() { //To cancel the addition of a new card
    formCard.style.display = 'none';
}

function deleteCard (Button) {
    const strongParent = Button.parentElement;
    const ArticleId = strongParent.parentElement.getAttribute("id");
    
    var deleteConfirm = confirm('Deseja mesmo excluir esse cartão de sua conta?');
    
    if(deleteConfirm) {
        (async () => {
            const response = await axios.request(`/logged?cardID=${ArticleId}`) //If the user wants to deletecard, sends query to the backend
          })()

        document.getElementById(ArticleId).remove()
        alert('Cartão removido com sucesso!')
    }
}

const content = document.querySelectorAll('.tab-content div');
const buttons = document.querySelectorAll('.tab-buttons button');
const formCard = document.querySelector('#add-card'); 
const excludeCard = document.querySelector('.card-information strong button');