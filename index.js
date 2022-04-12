const loader = document.querySelector('.loader');
const card = document.querySelector('.countries-list');
const searchForm = document.querySelector('form');

// Get countries
const getCountries = async () => {
  const base = 'https://restcountries.com/v3.1/all';

  const response = await fetch(base);
  const data = await response
    .json()
    .then((data) => {
      // Once we get the countries array, we call the updateUI function with this data
      updateUI(data);
      // Once we have data we set the loader to display NONE
      loader.classList.add('d-none');
    })
    .catch((err) => console.log(err));
  return data;
};

getCountries();

// Update User Interface
const updateUI = (countries) => {
  countries.forEach((country) => {
    // For each country we check if there are languages available and if so, as it is an object we store all values in the listOfLanguages array.
    let listOfLanguages = [];
    if (country.languages) {
      Object.values(country.languages).forEach((val) =>
        listOfLanguages.push(val)
      );
    } else {
      listOfLanguages.push('No official language!');
    }

    // Then for each country we add its hmtl template to the cards element. Adding it with += so that we display all countries
    card.innerHTML += `
      <div class="card rounded flip-card m-2">
        <div class="flip-card-inner rounded">
          <div class="flip-card-front overflow-hidden rounded">
            <div class="border-bottom">
              <img
              src="${country.flags.png}"
              class="card-img-top"
              />
            </div>
            <div class="text-muted text-uppercase text-center h-100">
              <h5 class="my-3">${country.name.common}</h5>
              <div class="my-3">Capital: <br><span class="text">${
                country.capital ? country.capital : 'No official capital!'
              }</span>
              </div>
              <div class="my-3">Official languages: <br><span class="text">${listOfLanguages.join(
                ', '
              )}</span>
              </div>
            </div>
          </div>
          <div class="flip-card-back rounded">
            <div class="mb-3">
              <div class="text-muted text-uppercase text-center h-100">
                <h5 class="my-3">${country.name.common}</h5>
                <div class="my-3 continent">Continent: <br><span class="text">${
                  country.continents
                    ? country.continents
                    : 'No official Continent!'
                }</span>
                </div>
                <div class="my-3">Area: <br><span class="text">${
                  country.area
                } km<sup>2</sup></span>
                </div>
                <div class="my-3">Population: <br><span class="text">${
                  country.population
                }</span>
                </div>
                <div class="my-3">Borders with: <br><span class="text">${
                  country.borders
                    ? country.borders.join(', ')
                    : 'No borders with other countries'
                }</span>
                </div>
                <div class="my-3">Timezone: <br><span class="text">${
                  country.timezones.length < 2
                    ? country.timezones
                    : 'Has many different timezones!'
                }</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
  });
};

// Filter by continent
// First we wait until the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const dropdownItem = document.querySelectorAll('.dropdown-item');
  const continentButtom = document.getElementById('continent-dropdown');

  // We add an event listener to every element in the dropdown menu (Africa, Europa, etc)
  dropdownItem.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      // When we click the item we set the dropdown tag to display the current selected item
      continentFilter = item.innerHTML;
      continentButtom.innerHTML = continentFilter;

      // We get all cards. These are HTML templates
      const allCards = document.getElementsByClassName('card');

      // We target the search input to remove the current input when we change the continent.This to force the user to start the search again
      searchForm.country.value = '';

      // If the current filter is ALL we make sure that no cards are hidden
      if (continentFilter == 'All') {
        for (i = 0; i < allCards.length; i++) {
          allCards[i].classList.remove('hide');
        }
        // Otherwise we loop though all cards
      } else {
        for (i = 0; i < allCards.length; i++) {
          if (
            // If the current card does NOT include the current filter, we hide the current card
            !allCards[i].innerText
              .toLowerCase()
              .includes(continentFilter.toLowerCase())
          ) {
            allCards[i].classList.add('hide');
          } else {
            // If the current card includes the current filter, we make sure NOT to hide the card
            allCards[i].classList.remove('hide');
          }
        }
      }
    });
  });
});

// Search by country name, capital or language (taking into account the continent filter)
searchForm.addEventListener('keyup', () => {
  const searchInput = searchForm.country.value.trim().toLowerCase();

  // Here we store the current value of the filter button
  const continentFilter = document
    .getElementById('continent-dropdown')
    .innerHTML.trim();

  // As allCards is a HTML Collection we have to use a for loop instead of forEach to loop through it
  const allCards = document.getElementsByClassName('card');

  // If the current continent filter is ALL
  if (continentFilter == 'All') {
    for (i = 0; i < allCards.length; i++) {
      if (
        // And the card inner text includes the search input, we make sure to show this card
        allCards[i].innerText.toLowerCase().includes(searchInput)
      ) {
        allCards[i].classList.remove('hide');
      } else {
        // If it does not include the search inputo, we hide the card
        allCards[i].classList.add('hide');
      }
    }
    // If the current filter is anything different than ALL
  } else {
    for (i = 0; i < allCards.length; i++) {
      if (
        // We check if the card includes the current selected continent filter AND if the card includes the search input, if so: we show this card.
        // This is to avoid that we get any result for example if we are filtering for Asia and we search for Spain. No result should be shown.
        allCards[i].innerText
          .toLowerCase()
          .includes(continentFilter.toLowerCase()) &&
        allCards[i].innerText.toLowerCase().includes(searchInput)
      ) {
        allCards[i].classList.remove('hide');
      } else {
        // If the card does not include the current continent filter or does not include the search input (any of both), we hide this card
        allCards[i].classList.add('hide');
      }
    }
  }
});

// KNOWN BUG: if the user selects for example Africa and searches for Spain. No results are shown which is correct. But if having Spain in the search bar the user selects All Continents:
// All countries are shown without taking into account what it is written in the search bar (this happens because the search bar functionallity only triggers on keyup).
// If then the user deletes the last letter of Spain (or initiates another search) everything will work again as expected.
