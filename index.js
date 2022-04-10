const loader = document.querySelector('.loader');
const card = document.querySelector('.countries-list');
const searchForm = document.querySelector('form');
const dropdownItem = document.querySelector('.dropdown-item');
dropdownItem.addEventListener('onclick', () => {
  filteringCountries(dropdownItem.value);
});

// Filtering countries WORK ON THIS!!
const filteringCountries = (data) => {
  const checkedFilter = document.querySelector('.dropdown-menu').value;
  console.log(checkedFilter);
};

// Get countries
const getCountries = async () => {
  const base = 'https://restcountries.com/v3.1/all';

  const response = await fetch(base);
  const data = await response
    .json()
    .then((data) => {
      updateUI(data);
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
                <div class="my-3">Continent: <br><span class="text">${
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

// Search by country name, capital or language
searchForm.addEventListener('keyup', (e) => {
  e.preventDefault();
  const input = searchForm.country.value.trim().toLowerCase();
  // As allCards is a HTML Collection we have to use a for loop instead of forEach to loop through it
  const allCards = document.getElementsByClassName('card');

  for (i = 0; i < allCards.length; i++) {
    if (allCards[i].innerText.toLowerCase().includes(input)) {
      allCards[i].classList.remove('hide');
    } else {
      allCards[i].classList.add('hide');
    }
  }
});
