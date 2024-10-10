Här är en steg-för-steg beskrivning av koden som passar i en .md-fil:

# Harry Potter Webbsida - Steg för Steg

## 1. Hämta referenser till HTML-element
Vi börjar med att hämta referenser till de HTML-element som ska manipuleras, som exempelvis container för böcker, sökfältet, filtrerings-dropdowns, och Bootstrap-modal för att visa bokdetaljer.

```javascript
const booksContainer = document.getElementById('books-container');
const apiURL = 'https://potterapi-fedeperin.vercel.app/en/books';
const searchInput = document.getElementById('search-input');
const filterYear = document.getElementById('filter-year');
const sortOptions = document.getElementById('sort-options');

2. Globala variabler

Här skapar vi två globala variabler: en för att lagra alla böcker från API:et och en för filtrerade böcker.

let allBooks = [];
let filteredBooks = [];

3. Funktion för att hämta böcker från API:et

Vi hämtar böckerna från API:et och visar dem på sidan. Om det uppstår ett fel loggar vi det och visar ett felmeddelande på webbsidan.

function fetchBooks() {
    fetch(apiURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP-fel! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                booksContainer.innerHTML = '<p class="text-danger">Oväntat dataformat från API:et.</p>';
                return;
            }
            allBooks = data;
            filteredBooks = allBooks;
            populateFilterYear(allBooks);
            displayBooks(filteredBooks);
        })
        .catch(error => {
            booksContainer.innerHTML = '<p class="text-danger">Kunde inte ladda böcker.</p>';
        });
}

4. Fyller filter-alternativ för år

Denna funktion fyller dropdown-menyn för utgivningsår genom att extrahera unika år från böckerna.

function populateFilterYear(books) {
    const years = [...new Set(books.map(book => new Date(book.releaseDate).getFullYear()))].sort();
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        filterYear.appendChild(option);
    });
}

5. Visa böcker på sidan

Denna funktion genererar HTML-strängar för att visa varje bok som ett kort med bokomslag, titel, beskrivning, och en knapp för att visa mer detaljer i en modal.

function createBookCard(book) {
    const title = book.title || 'Ingen titel';
    const coverImage = book.cover || 'https://via.placeholder.com/300x400?text=Ingen+Bild';
    return `
        <div class="col-md-4">
            <div class="card book-card h-100">
                <img src="${coverImage}" class="card-img-top" alt="${title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${title}</h5>
                    <button class="btn btn-primary mt-auto" onclick="showBookDetails(${book.number})">Läs mer</button>
                </div>
            </div>
        </div>
    `;
}

6. Visa detaljerad bokinformation

När användaren klickar på “Läs mer”-knappen, öppnas en modal som visar detaljerad information om boken.

function showBookDetails(bookNumber) {
    const book = allBooks.find(b => b.number === bookNumber);
    if (!book) return;
    modalTitle.textContent = book.title;
    modalCover.src = book.cover || 'https://via.placeholder.com/300x400?text=Ingen+Bild';
    modalDescription.textContent = book.description;
    bookModal.show();
}

7. Filtrering och sortering

Här filtrerar vi böcker baserat på användarens sökterm, valt år och sorteringsalternativ.

function applyFilters() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedYear = filterYear.value;
    const selectedSort = sortOptions.value;

    filteredBooks = allBooks.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm);
        const matchesYear = selectedYear ? new Date(book.releaseDate).getFullYear() === parseInt(selectedYear) : true;
        return matchesSearch && matchesYear;
    });

    // Sortera böcker
    if (selectedSort) {
        const [key, order] = selectedSort.split('-');
        filteredBooks.sort((a, b) => {
            if (key === 'title') {
                return order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
            } else if (key === 'releaseDate') {
                return order === 'asc' ? new Date(a.releaseDate) - new Date(b.releaseDate) : new Date(b.releaseDate) - new Date(a.releaseDate);
            }
        });
    }

    displayBooks(filteredBooks);
}

8. Event listeners

Vi lägger till event-lyssnare på sökfältet, filter-dropdown och sorterings-dropdown, så att filtrering och sortering tillämpas när användaren gör ändringar.

searchInput.addEventListener('input', applyFilters);
filterYear.addEventListener('change', applyFilters);
sortOptions.addEventListener('change', applyFilters);

9. Starta applikationen

När sidan har laddats, hämtar vi böckerna och visar dem på sidan.

document.addEventListener('DOMContentLoaded', fetchBooks);

Denna beskrivning är anpassad för att läsas enkelt i en `.md`-fil, med fokus på att bryta ned vad koden gör i olika steg.
# Books
