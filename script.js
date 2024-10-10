//Skapa en variabel för vårt API så att vi kan hämta in detta
const apiURL = 'https://potterapi-fedeperin.vercel.app/en/books';

//Hämta referenser till HTML-element som ska manipuleras
const booksContainer = document.getElementById('books-container'); //Containern där böckerna visas
const searchInput = document.getElementById('search-input'); //Sökfältet
const filterYear = document.getElementById('filter-year'); //Dropdown filter för utg år
const sortOptions = document.getElementById('sort-options'); //Sorteringd-dropdown

//Hämta referenser för bootstrap modal elementen så att vi kan visa bokdetaljer
const bookModal = new bootstrap.Modal(document.getElementById('bookModal'), {}); // Initiera Bootstrap modal
const modalTitle = document.getElementById('bookModalLabel'); // Modal titel
const modalCover = document.getElementById('modal-cover'); // Modal bokomslag
const modalOriginalTitle = document.getElementById('modal-originalTitle'); // Modal originaltitel
const modalReleaseDate = document.getElementById('modal-releaseDate'); // Modal utgivningsdatum
const modalPages = document.getElementById('modal-pages'); // Modal antal sidor
const modalGenre = document.getElementById('modal-genre'); // Modal genre
const modalDescription = document.getElementById('modal-description'); // Modal beskrivning

//Skapar globala (nerifrån sett) variabler för att kunna lagra alla böcker samt
//hantera den filtrering som anv gör
let allBooks = [];
let filteredBooks = [];

//Skapar en funktion som hämtar data från API och initialiserar sidan i samband med det
function fetchBooks() {
    fetch(apiURL) //Gör vi ett HTTP GET anrop till APIet
        .then((response) => {
            if (!response.ok) {
                //Kontrollera om anropet lyckas
                throw new Error(`HTTP fel, status: ${response.status}`); //Om ej anropet lyckas ger vi ett error med en statuskod
            }
            return response.json(); //Om ok, returnera JSON-datan
        })
        .then((data) => {
            //console.log('Data från API:', data);

            //Kontrollera om data är en array
            /* Array.isArry() inbyggd funktion i JS som används för att kontroller aom ett givet
            värde är en array (en lista av element), returnerar true om det angivna värdet är en array */
            if (!Array.isArray(data)) {
                //console.error('oväntat format')
                //booksContainer.innerHTML = '<p class datat finns inte'
                return;
            }

            //Vill spara alla böckerna i den globala variabeln
            allBooks = data;
            filteredBooks = allBooks; //Initialt så finns alla böckerna visade tills dess att
            //filtrering har gjorts...

            populateFilterYear(allBooks); //Fyll i filteralternativ för utgivningsår
            displayBooks(filteredBooks); //Visa böckerna på sidan
        });
}
