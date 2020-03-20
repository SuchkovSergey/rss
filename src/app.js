/* eslint no-param-reassign: "error" */
import * as yup from 'yup';
import axios from 'axios';
import { watch } from 'melanke-watchjs';
import _ from 'lodash';
import i18next from 'i18next';
import watchState from './watchers';
import resources from './locales';
import { languagesInShort } from './locales/languages';
import parse from './utils';

const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';

const validationSchema = yup.object().shape({
  website: yup.string().url(),
});

const validate = (state) => {
  const errors = [];
  const url = state.form.fields.feed;
  validationSchema
    .isValid({ website: url })
    .then((validity) => {
      if (!validity) {
        errors.push(i18next.t('url.error'));
      }
    });
  if (state.addedURLs.includes(url)) {
    errors.push(i18next.t('hadUrlYet.error'));
  }
  return errors;
};

const updateValidationState = (state) => {
  const errors = validate(state);
  state.form.errors = errors;
  state.form.valid = _.isEqual(errors, []);
};

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

const checkForNewPosts = (currentState) => {
  const urls = currentState.addedURLs;
  setTimeout(checkForNewPosts, 5000, currentState);
  urls.forEach((url) => {
    const corsUrl = `${corsApiUrl}${url}`;
    axios.get(corsUrl)
      .then((response) => {
        const output = parse(response.data);
        const { feed, posts } = output;
        const { feedTitle } = feed;
        const currentFeed = currentState.feeds.find((el) => el.feedTitle === feedTitle);
        const { id } = currentFeed;
        const newPosts = posts.map((post) => ({ ...post, feedId: id }));
        const diffPosts = _.differenceBy(newPosts, currentState.posts, 'postTitle');
        Array.prototype.push.apply(currentState.posts, diffPosts);
      })
      .catch(() => {
        currentState.form.processState = 'finished';
        throw new Error(i18next.t('network.error'));
      });
  });
};

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

const app = () => {
  const state = {
    addedURLs: [],
    feeds: [],
    posts: [],
    currentPosts: [],
    currentLang: 'English',
    form: {
      processState: 'finished',
      fields: {
        feed: '',
      },
      errors: [],
      valid: false,
    },
  };
  const input = document.querySelector('input[id="inputInfo"]');
  const form = document.querySelector('form');

  input.addEventListener('input', (e) => {
    state.form.processState = 'filling';
    state.form.fields.feed = e.target.value;
    updateValidationState(state);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentURL = state.form.fields.feed;
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
        state.form.fields.feed = '';
      })
      .catch(() => {
        state.form.processState = 'finished';
        throw new Error(i18next.t('network.error'));
      });
  });

  changeLangsInit(state);
  checkForNewPosts(state);
  watch(state, watchState(state));
};

export default app;
