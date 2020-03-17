/* eslint no-param-reassign: "error" */
import axios from 'axios';
import { watch } from 'melanke-watchjs';
import _ from 'lodash';
import i18next from 'i18next';
import watchState from './watchers';
import resources from './locales';
import { parse, validate } from './utils';

const languages = {
  russianLang: 'ru',
  englishLang: 'en',
  spanishLang: 'esp',
  deutschLang: 'de',
};

const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';

const app = () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  }).then((_err, _t) => {
    updateContent();
  });

  const state = {
    addedURLs: [],
    feeds: [],
    posts: [],
    errors: [], // дополнить ошибки
    currentLang: 'English',
    form: {
      processState: 'finished',
      fields: {
        feed: '',
      },
      valid: false,
    },
  };

  const input = document.querySelector('input[id="inputInfo"]');

  input.addEventListener('input', (e) => {
    state.form.processState = 'filling';
    state.form.fields.feed = e.target.value;
    validate(e.target.value, state);
  });

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.addedURLs.push(state.form.fields.feed);
    state.form.processState = 'adding';
    const url = `${corsApiUrl}${state.form.fields.feed}`;
    axios.get(url)
      .then((response) => {
        const output = parse(response.data);
        const [feed, posts] = output;
        Array.prototype.push.apply(state.posts, posts);
        state.feeds.push(feed);
        state.form.processState = 'finished';
        state.form.fields.feed = '';
      })
      .catch(() => {
        state.form.processState = 'finished';
        throw new Error('There is a problem with a connection');
      });
  });

  const checkForPosts = (urls) => {
    urls.forEach((url) => {
      const corsUrl = `${corsApiUrl}${url}`;
      axios.get(corsUrl)
        .then((response) => {
          const output = parse(response.data);
          const [feed, posts] = output;
          // const currentPosts = state.posts.map((e) => e.postTitle);

          const difPosts = _.difference(posts, state.posts);
          Array.prototype.push.apply(state.posts, difPosts);
        })
        .catch(() => {
          state.form.processState = 'finished';
          throw new Error(i18next.t('network.error'));
        });
    });
    setTimeout(checkForPosts, 5000, state.addedURLs);
  };

  setTimeout(checkForPosts, 5000, state.addedURLs);

  const body = document.querySelector('body');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container-fluid');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');

  const feedDiv = document.createElement('div');
  feedDiv.classList.add('col-md-3', 'feeds');

  const postsDiv = document.createElement('div');
  postsDiv.classList.add('col-md-9', 'posts');

  rowDiv.append(feedDiv, postsDiv);
  containerDiv.append(rowDiv);

  body.append(containerDiv);

  const langs = Object.keys(languages);

  langs.forEach((lang) => {
    const currentButton = document.getElementById(lang);
    currentButton.addEventListener('click', () => {
      state.currentLang = i18next.t(lang);
      i18next.changeLanguage(languages[lang]);
    });
  });

  const feedHeadDiv = document.createElement('div');
  feedHeadDiv.classList.add('feedHeadDiv');
  feedDiv.append(feedHeadDiv);
  const postsHeadDiv = document.createElement('div');
  postsHeadDiv.classList.add('postsHeadDiv');
  postsDiv.append(postsHeadDiv);

  watch(state, watchState(state));
};

const updateContent = () => {
  document.querySelector('h2').innerHTML = i18next.t('header2');
  document.querySelector('h3').innerHTML = i18next.t('header3');
  document.querySelector('input[class="form-control"]').placeholder = i18next.t('inputPlaceholder'); // не факт
  document.querySelector('button[type="submit"]').innerHTML = i18next.t('addButton');
  if (document.querySelector('.feedHeadDiv')) {
    document.querySelector('.feedHeadDiv').textContent = i18next.t('feeds');
    document.querySelector('.postsHeadDiv').textContent = i18next.t('posts');
  }
};

i18next.on('languageChanged', () => {
  updateContent();
});

export default app;


/*
<a href="#" class="list-group-item list-group-item-action active">
  <div class="d-flex w-100 justify-content-between">
    <h5 class="mb-1">Feed Title 1</h5>
  </div>
  <p class="mb-1">Description 1</p>
</a>

Структура ответного HTML
<channel> <title> <description> <item> <item> <item> <item> <item> </channel>
<item> <title> <description> <link> </item>

<div class="list-group">
  <a href="#" class="list-group-item list-group-item-action active">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">Feed Title 1</h5>
    </div>
    <p class="mb-1">Description 1</p>
  </a>

  <a href="#" class="list-group-item list-group-item-action">

  </a>
</div>;
*/
