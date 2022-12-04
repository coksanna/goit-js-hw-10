import axios from "axios";

export function fetchCountries(name) {
    return axios.get(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
    .then(({data}) => data);
}