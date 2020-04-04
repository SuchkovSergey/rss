/* eslint no-param-reassign: "error" */
import axios from 'axios';
import i18next from 'i18next';
import watchState from './watchers';
import resources from './locales';
import languages from './locales/languages';
import {
  parse, updateValidationState, checkForNewPosts, corsApiUrl,
} from './utils';

// Updating the text of the site when switching the language
const updateContent = (state) => {
  document.querySelector('h2').textContent = i18next.t('header2');
  document.querySelector('h3').textContent = i18next.t('header3');
  document.querySelector('button[type="submit"]').textContent = i18next.t('addButton');
  document.querySelector('.feedHeader').textContent = i18next.t('feeds');
  const { errors } = state.form;
  const errorMessages = errors.map((err) => i18next.t(`errorMessages.${err}`)).join('. ');
  if (document.querySelector('.invalid-feedback')) {
    document.querySelector('.invalid-feedback').textContent = errorMessages;
  }
  if (document.querySelector('input[class="form-control"]')) {
    document.querySelector('input[class="form-control"]').placeholder = i18next.t('inputPlaceholder');
  }
};

// Initializing language changing
const changeLangsInit = (currentState) => {
  const langs = Object.keys(languages);
  langs.forEach((lang) => {
    const currentButton = document.getElementById(lang);
    currentButton.addEventListener('click', () => {
      currentState.currentLang = languages[lang];
      i18next.changeLanguage(lang);
    });
  });
};

const app = () => {
  const state = {
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

  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  }).then(() => updateContent(state));

  i18next.on('languageChanged', () => updateContent(state));

  const input = document.querySelector('input[id="inputInfo"]');
  const form = document.querySelector('form');

  input.addEventListener('input', (e) => {
    state.form.processState = 'filling';
    state.form.fields.url = e.target.value;
    updateValidationState(state);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.form.processState = 'adding';
    const currentURL = state.form.fields.url;
    const url = `${corsApiUrl}${currentURL}`;
    axios.get(url)
      .then((response) => {
        const { feed, posts } = parse(response.data);
        const feedWithUrl = { ...feed, url: currentURL };
        state.posts = [...state.posts, ...posts];
        state.feeds.push(feedWithUrl);
        state.form.processState = 'finished';
        state.form.fields.url = '';
      })
      .catch((err) => {
        state.form.errors = ['network'];
        state.form.valid = false;
        state.form.processState = 'filling';
        throw err;
      });
  });

  changeLangsInit(state); // Initialize language changing
  checkForNewPosts(state);// Tracking new posts
  watchState(state);// Tracking state changes
};

export default app;
