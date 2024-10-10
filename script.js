// Hämta referenser till HTML-element som ska manipuleras
const booksContainer = document.getElementById('books-container'); // Container där bokkorten visas
const apiURL = 'https://potterapi-fedeperin.vercel.app/en/books'; // API URL för att hämta böcker
const searchInput = document.getElementById('search-input'); // Sökfältet
const filterYear = document.getElementById('filter-year'); // Filter-dropdown för utgivningsår
const sortOptions = document.getElementById('sort-options'); // Sorterings-dropdown

// Hämta referenser till modal-elementen för att visa bokdetaljer
const bookModal = new bootstrap.Modal(document.getElementById('bookModal'), {}); // Initiera Bootstrap modal
const modalTitle = document.getElementById('bookModalLabel'); // Modal titel
const modalCover = document.getElementById('modal-cover'); // Modal bokomslag
const modalOriginalTitle = document.getElementById('modal-originalTitle'); // Modal originaltitel
const modalReleaseDate = document.getElementById('modal-releaseDate'); // Modal utgivningsdatum
const modalPages = document.getElementById('modal-pages'); // Modal antal sidor
const modalGenre = document.getElementById('modal-genre'); // Modal genre
const modalDescription = document.getElementById('modal-description'); // Modal beskrivning

// Globala variabler för att lagra alla böcker och filtrerade böcker
let allBooks = []; // Alla böcker hämtade från API:et
let filteredBooks = []; // Böcker efter sökning, filtrering och sortering

/**
 * Hämtar böcker från API:et och initialiserar sidan
 */
function fetchBooks() {
    fetch(apiURL) // Gör ett HTTP GET-anrop till API:et
        .then(response => {
            if (!response.ok) { // Kontrollera om anropet lyckades
                throw new Error(`HTTP-fel! status: ${response.status}`); // Kasta fel om status inte är OK
            }
            return response.json(); // Om OK, returnera JSON-datan
        })
        .then(data => {
            console.log('Data från API:', data); // Logga den hämtade datan för felsökning

            // Kontrollera om data är en array
            if (!Array.isArray(data)) {
                console.error('Oväntat dataformat:', data); // Logga fel om data inte är en array
                booksContainer.innerHTML = '<p class="text-danger">Oväntat dataformat från API:et.</p>'; // Visa felmeddelande på sidan
                return; // Avsluta funktionen
            }

            allBooks = data; // Spara alla böcker i globala variabeln
            filteredBooks = allBooks; // Initialt är alla böcker visade

            populateFilterYear(allBooks); // Fyll i filteralternativ för utgivningsår
            displayBooks(filteredBooks); // Visa böckerna på sidan
        })
        .catch(error => {
            console.error('Fel vid hämtning av böcker:', error); // Logga eventuella fel
            booksContainer.innerHTML = '<p class="text-danger">Kunde inte ladda böcker.</p>'; // Visa felmeddelande på sidan
        });
}

/**
 * Fyller i filteralternativ för utgivningsår baserat på böckerna
 * @param {Array} books - Array av bokobjekt
 */
function populateFilterYear(books) {
    // Extrahera unika år från böckerna
    const years = [...new Set(books.map(book => new Date(book.releaseDate).getFullYear()))].sort((a, b) => a - b);

    // Skapa en <option> för varje år och lägg till i filterYear dropdown
    years.forEach(year => {
        const option = document.createElement('option'); // Skapa ett nytt option-element
        option.value = year; // Sätt värdet till årtalet
        option.textContent = year; // Visa årtalet som text
        filterYear.appendChild(option); // Lägg till option i dropdown-menyn
    });
}

/**
 * Skapar HTML-kod för ett bokkort
 * @param {Object} book - Bokobjekt från API:et
 * @returns {string} - HTML-sträng för bokkortet
 */
function createBookCard(book) {
    // Hämta egenskaper från bokobjektet med fallback-värden om de saknas
    const title = book.title || 'Ingen titel';
    const originalTitle = book.originalTitle || 'Ingen originaltitel';
    const releaseDate = book.releaseDate || 'Okänt datum';
    const description = book.description || 'Ingen beskrivning tillgänglig.';
    const coverImage = book.cover || 'https://via.placeholder.com/300x400?text=Ingen+Bild'; // Placeholder-bild om cover saknas
    const pages = book.pages || 'Okänt antal sidor';

    // Eftersom API:et inte tillhandahåller genre, kan vi sätta den till "Fantasy" för alla böcker
    const genre = 'Fantasy';

    // Skapa HTML-strängen för bokkortet
    return `
        <div class="col-md-4">
            <div class="card book-card h-100">
                <!-- Bokomslag -->
                <img src="${coverImage}" class="card-img-top" alt="${title}">
                <div class="card-body d-flex flex-column">
                    <!-- Boktitel -->
                    <h5 class="card-title">${title}</h5>
                    <!-- Bokbeskrivning, trunkerad till 150 tecken -->
                    <p class="card-text">${truncateText(description, 150)}</p>
                    <!-- Utgivningsdatum -->
                    <p class="card-text"><strong>Utgivningsdatum:</strong> ${releaseDate}</p>
                    <!-- Antal sidor -->
                    <p class="card-text"><strong>Sidor:</strong> ${pages}</p>
                    <!-- Genre -->
                    <p class="card-text"><strong>Genre:</strong> ${genre}</p>
                    <!-- Knapp för att läsa mer, öppnar modal med detaljer -->
                    <button class="btn btn-primary mt-auto" onclick="showBookDetails(${book.number})">Läs mer</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Trunkerar text till ett maximalt antal tecken och lägger till "..." om det behövs
 * @param {string} text - Text att trunkera
 * @param {number} maxLength - Maximal längd på texten
 * @returns {string} - Trunkerad text
 */
function truncateText(text, maxLength) {
    if (!text) return ''; // Om texten är tom, returnera tom sträng
    if (text.length > maxLength) { // Om texten är längre än maxLength
        return text.substring(0, maxLength) + '...'; // Trunkera och lägg till "..."
    }
    return text; // Annars, returnera originaltexten
}

/**
 * Visar böckerna på sidan genom att skapa bokkort och lägga till dem i DOM
 * @param {Array} books - Array av bokobjekt att visa
 */
function displayBooks(books) {
    if (Array.isArray(books) && books.length > 0) { // Kontrollera att books är en icke-tom array
        const bookCards = books.map(book => createBookCard(book)).join(''); // Skapa HTML för varje bok och slå samman till en sträng
        booksContainer.innerHTML = bookCards; // Lägg till bokkorten i container-elementet
    } else {
        booksContainer.innerHTML = '<p>Inga böcker hittades.</p>'; // Visa meddelande om inga böcker finns
    }
}

/**
 * Visar detaljerad information om en bok i modal-fönstret
 * @param {number} bookNumber - Unikt nummer för boken att visa
 */
function showBookDetails(bookNumber) {
    // Hitta boken med det specifika numret i allBooks arrayen
    const book = allBooks.find(b => b.number === bookNumber);
    if (!book) { // Om boken inte hittas
        console.error('Bok inte hittad:', bookNumber); // Logga fel
        return; // Avsluta funktionen
    }

    // Uppdatera modalens innehåll med bokens detaljer
    modalTitle.textContent = book.title; // Sätt modalens titel till bokens titel
    modalCover.src = book.cover || 'https://via.placeholder.com/300x400?text=Ingen+Bild'; // Sätt bokomslagsbilden
    modalCover.alt = book.title; // Sätt alt-texten för bilden
    modalOriginalTitle.textContent = book.originalTitle; // Sätt originaltitel
    modalReleaseDate.textContent = book.releaseDate; // Sätt utgivningsdatum
    modalPages.textContent = book.pages; // Sätt antal sidor
    modalGenre.textContent = 'Fantasy'; // Sätt genre, eftersom API:et inte tillhandahåller denna information
    modalDescription.textContent = book.description; // Sätt beskrivning

    // Visa modal-fönstret
    bookModal.show();
}

/**
 * Filtrerar böcker baserat på söktermen, utgivningsår och sorteringsalternativ
 */
function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase(); // Hämta söktermen och gör den till små bokstäver
    const selectedYear = filterYear.value; // Hämta valt utgivningsår från filter
    const selectedSort = sortOptions.value; // Hämta valt sorteringsalternativ

    // Filtrera böcker baserat på söktermen och utgivningsåret
    filteredBooks = allBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm); // Kontrollera om bokens titel innehåller söktermen
        const matchesYear = selectedYear ? new Date(book.releaseDate).getFullYear() === parseInt(selectedYear) : true; // Kontrollera om boken matchar valt år
        return matchesSearch && matchesYear; // Returnera true om både sökning och filter matchar
    });

    // Sortera böcker baserat på valt sorteringsalternativ
    if (selectedSort) { // Om ett sorteringsalternativ är valt
        const [key, order] = selectedSort.split('-'); // Dela upp sorteringsalternativet i nyckel och ordning
        filteredBooks.sort((a, b) => { // Sortera filteredBooks arrayen
            if (key === 'title') { // Sortera efter titel
                if (a.title < b.title) return order === 'asc' ? -1 : 1;
                if (a.title > b.title) return order === 'asc' ? 1 : -1;
                return 0;
            } else if (key === 'releaseDate') { // Sortera efter utgivningsdatum
                const dateA = new Date(a.releaseDate);
                const dateB = new Date(b.releaseDate);
                return order === 'asc' ? dateA - dateB : dateB - dateA;
            }
            return 0; // Om nyckeln inte är känd, behåll ordningen
        });
    }

    displayBooks(filteredBooks); // Visa de filtrerade och sorterade böckerna
}

// Lägg till event listeners för sökfält, filter och sorteringsalternativ
searchInput.addEventListener('input', applyFilters); // Anropa applyFilters vid varje inmatning i sökfältet
filterYear.addEventListener('change', applyFilters); // Anropa applyFilters när filter för år ändras
sortOptions.addEventListener('change', applyFilters); // Anropa applyFilters när sorteringsalternativ ändras

// Initialisera sidan genom att hämta böcker när DOM:en är laddad
document.addEventListener('DOMContentLoaded', fetchBooks);

// Gör showBookDetails-funktionen tillgänglig globalt så att den kan anropas från HTML-knappen
window.showBookDetails = showBookDetails;

/**
 * Filtrerar böcker baserat på en sökterm i titeln
 * @param {Array} books - Array av bokobjekt
 * @param {string} searchTerm - Sökterm att filtrera böcker med
 * @returns {Array} - Filtrerade böcker som matchar sökterm
 */
function filterBooksByTitle(books, searchTerm) {
    return books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));
}

/**
 * Exempel på användning av filterBooksByTitle-funktionen
 * Denna del är valfri och visar hur du kan filtrera böcker baserat på en sökterm
 */
fetch(apiURL)
    .then(response => {
        if (!response.ok) { // Kontrollera om anropet lyckades
            throw new Error(`HTTP-fel! status: ${response.status}`);
        }
        return response.json(); // Returnera JSON-datan
    })
    .then(data => {
        if (Array.isArray(data)) { // Kontrollera om data är en array
            const filteredBooks = filterBooksByTitle(data, 'harry'); // Filtrera böcker som innehåller 'harry' i titeln
            console.log('Filtrerade Böcker:', filteredBooks); // Logga de filtrerade böckerna
        } else {
            console.error('Oväntat dataformat för filter:', data); // Logga fel om data inte är en array
        }
    })
    .catch(error => console.error(error)); // Logga eventuella fel
