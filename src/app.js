/* eslint no-param-reassign: "error" */
import axios from 'axios';
import { watch } from 'melanke-watchjs';
import i18next from 'i18next';
import watchState from './watchers';
import resources from './locales';
import { languagesInShort } from './locales/languages';
import { parse, updateValidationState, checkForNewPosts } from './utils';

const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';

// В функции "updateContent" не стал отделять получение данных от их использования,
// потому что в данном случае эти данные используются строго один раз
const updateContent = () => {
  document.querySelector('h2').textContent = i18next.t('header2');
  document.querySelector('h3').textContent = i18next.t('header3');
  document.querySelector('input[class="form-control"]').placeholder = i18next.t('inputPlaceholder');
  document.querySelector('button[type="submit"]').textContent = i18next.t('addButton');
  document.querySelector('.feedHeader').textContent = i18next.t('feeds');
  if (document.querySelector('.invalid-feedback')) {
    document.querySelector('.invalid-feedback').textContent = i18next.t('url.error');
  }
};

const changeLangsInit = (currentState) => {
  const langs = Object.keys(languagesInShort);
  langs.forEach((lang) => {
    const currentButton = document.getElementById(lang);
    currentButton.addEventListener('click', () => {
      currentState.currentLang = i18next.t(`languages.${lang}`);
      i18next.changeLanguage(languagesInShort[lang]);
    });
  });
};

const app = () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  }).then(() => {
    updateContent();
  });

  i18next.on('languageChanged', () => {
    updateContent();
  });

  const state = {
    addedURLs: [],
    feeds: [],
    posts: [],
    currentLang: 'English',
    form: {
      processState: 'finished',
      fields: {
        url: '',
      },
      errors: [],
      valid: false,
    },
  };
  const input = document.querySelector('input[id="inputInfo"]');
  const form = document.querySelector('form');

  input.addEventListener('input', (e) => {
    state.form.processState = 'filling';
    state.form.fields.url = e.target.value;
    updateValidationState(state);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentURL = state.form.fields.url;
    state.addedURLs.push(currentURL);
    state.form.processState = 'adding';
    const url = `${corsApiUrl}${currentURL}`;
    axios.get(url)
      .then((response) => {
        const output = parse(response.data);
        const { feed, posts } = output;
        state.posts = [...state.posts, ...posts];
        state.feeds.push(feed);
        state.form.processState = 'finished';
        state.form.fields.url = '';
      })
      .catch((err) => {
        const errorMessage = i18next.t('network.error');
        state.form.errors = [errorMessage];
        state.form.valid = false;
        state.form.processState = 'filling';
        throw err;
      });
  });

  changeLangsInit(state);
  checkForNewPosts(state);
  watch(state, watchState(state));
};

export default app;
