import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
}

// let name = "";
refs.input.focus();
refs.input.addEventListener("input", debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    const name = e.target.value.trim();
    if (name === "") {
        clearMarkup();
        return;
    }
    fetchCountries(name).then(countries => {
    // console.log(countries);
     if (countries.length === 1) {
       clearMarkup();
       createCountryInfo(countries);
       return;
     } else if (countries.length > 1 && countries.length <= 10) {
       clearMarkup();
       createCountriesList(countries);
       return;
     } else if (countries.length > 10) {
       clearMarkup();
       Notify.info('Too many matches found. Please enter a more specific name.');
       return;
     }
   }).catch(onError);
}

function createCountriesList(countries) {
    const markupList = countries.map(country => 
      `<li class="country-item">
        <img src="${country.flags.svg}" alt="flag" width='20' height ='15'/>
        <p>${country.name.official}</p>
      </li>`).join(" ");
    
  refs.list.insertAdjacentHTML("beforeend", markupList);
}

function createCountryInfo(countries) {
    const languages = Object.values(countries[0].languages).join(', ');

    const markupInfo = countries.map(country => 
      `<div class="country-item">
        <img src="${country.flags.svg}" alt="flag" width='20' height ='15'/>
        <h1>${country.name.official}</h1></div>
      <ul class="country-info-list">
        <li class="country-info_item">
          <b>Capital:</b 
          <span>${country.capital}</span>
        </li>
        <li class="country-info_item">
          <b>Population:</b 
          <span>${country.population}</span>
        </li>
        <li class="country-info_item">
          <b>Languages:</b 
          <span>${languages}</span>
        </li>
      </ul>`);
    
    refs.info.insertAdjacentHTML("beforeend", markupInfo);
}

function clearMarkup() {
    refs.list.innerHTML = "";
    refs.info.innerHTML = "";
}

function onError() {
    clearMarkup();
    Notify.failure("Oops, there is no country with that name");
}
