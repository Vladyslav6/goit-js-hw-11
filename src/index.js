import 'slim-select/dist/slimselect.css';
import axios from 'axios';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Notiflix from 'notiflix';
import SlimSelect from 'slim-select';

axios.defaults.headers.common['x-api-key'] =
  'live_qCm7NgYqt97ZAlQ0zAuVOQ6WcWwqAwPaHtC33gHlCg2E0Hw1PQr4iK7BSY80vHCQ';

const backPack = {
  select: document.querySelector('.breed-select'),
  loader: document.querySelector('.loader'),
  loaderText: document.querySelector('.loader-text'),
  catInfo: document.querySelector('.cat-info'),
};

backPack.loader.classList.replace('is-hidden', 'loader');
backPack.loaderText.classList.replace('is-hidden', 'loader');
backPack.select.addEventListener('change', handleChange);
//////
//
//
//////
function createMarkupId(selectCat) {
  return selectCat
    .map(
      arr => `
      <div class="img-cat">
        <h1>${arr.breeds[0].name}</h1>
        <img src=${arr.url} alt=${arr.breeds[0].name} width='400'/>
      </div>
      <div class="cat-descr">
        <p>${arr.breeds[0].description}</p>
        <p>${arr.breeds[0].temperament}</p>
      </div>
    `
    )
    .join('');
}

function handleChange(event) {
  const breedId = event.currentTarget.value;
  backPack.select.classList.add('is-hidden');
  backPack.loader.classList.replace('is-hidden', 'loader');
  backPack.loaderText.classList.replace('is-hidden', 'loader-text');
  ///////
  //
  //
  //////
  fetchCatByBreed(breedId)
    .then(data => {
      backPack.select.classList.remove('is-hidden');
      backPack.catInfo.classList.remove('is-hidden');
      backPack.loader.classList.replace('loader', 'is-hidden');
      backPack.loaderText.classList.replace('loader-text', 'is-hidden');

      const catInfoMarkup = createMarkupId(data);
      backPack.catInfo.innerHTML = catInfoMarkup;
      if (data.length === 0) {
        Notiflix.Notify.failure(
          'Failed to fetch cat information.Please, choose another cat.'
        );
      }
    })
    .catch(error => {
      backPack.select.classList.remove('is-hidden');
      console.error(error);
      Notiflix.Notify.failure('Failed to fetch cat information');
    });
}
///////////////
//
//
//////////////
fetchBreeds()
  .then(initialBreeds => {
    const arrBreeds = initialBreeds.map(({ name, id, url }) => ({
      name,
      value: id,
      url,
    }));
    backPack.select.innerHTML = createMarkup(arrBreeds);
    backPack.select.value = arrBreeds[0].value;
    handleChange({ currentTarget: backPack.select });
    new SlimSelect({
      select: '#selectElement',
    });

    backPack.catInfo.classList.remove('is-hidden');
    backPack.select.classList.remove('is-hidden');
    backPack.loader.classList.replace('loader', 'is-hidden');
    backPack.loaderText.classList.replace('loader-text', 'is-hidden');
  })
  .catch(error => {
    console.error(error);
    backPack.select.classList.remove('is-hidden');
    Notiflix.Notify.failure('Failed to fetch breeds');
  });

function createMarkup(arrBreeds) {
  return arrBreeds
    .map(
      arr => `
        <option value='${arr.value}'>${arr.name}</option>
      `
    )
    .join('');
}
