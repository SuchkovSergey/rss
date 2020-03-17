/* eslint no-param-reassign: "error" */
import * as yup from 'yup';
import axios from 'axios';
import { watch } from 'melanke-watchjs';
import _ from 'lodash';
import i18next from 'i18next';
import watchState from './watchers';
import resources from './locales';
import parse from './utils';

const schema = yup.object().shape({
  website: yup.string().url(),
});

const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';

const validate = (feedAdress, state) => schema
  .isValid({ website: feedAdress })
  .then((validity) => {
    const doubleCheck = state.feedAdresses.includes(feedAdress);
    state.form.valid = validity && !doubleCheck;
  });

  // когда пустое поле ввода при нажатии еще раз добавляется тот же поток

const app = () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  }).then((err, t) => {
    updateContent();
  });

  const state = {
    feedAdresses: [],
    feeds: [],
    posts: [],
    errors: [],
    currentLang: 'English',
    form: {
      processState: 'filling',
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
    state.feedAdresses.push(state.form.fields.feed);
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

  const body = document.querySelector('body');

  const divFeedsElement = document.createElement('div');
  divFeedsElement.classList.add('list-group', 'feeds');

  const feedHead = document.createElement('div');
  feedHead.classList.add('alert', 'alert-info');
  feedHead.setAttribute('id', 'feedHead');
  feedHead.setAttribute('role', 'alert');


  const postsHead = document.createElement('div');
  postsHead.classList.add('alert', 'alert-info');
  postsHead.setAttribute('id', 'postsHead');
  postsHead.setAttribute('role', 'alert');

  body.append(feedHead, divFeedsElement);

  const divPostsElement = document.createElement('div');
  divPostsElement.classList.add('list-group', 'posts');

  body.append(postsHead, divPostsElement);

  const rusButton = document.getElementById('rusButton');
  rusButton.addEventListener('click', () => {
    state.currentLang = 'Русский';
    console.log(state.currentLang);
    // state.currentLang = i18next.t('russianLang');
    i18next.changeLanguage('ru');
  });

  const engButton = document.getElementById('engButton');
  engButton.addEventListener('click', () => {
    state.currentLang = 'English';
    console.log(state.currentLang);
    // state.currentLang = i18next.t('englishLang');
    i18next.changeLanguage('en');
  
  });


  watch(state, watchState(state));
};

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


const updateContent = () => {
  document.querySelector('h2').innerHTML = i18next.t('headerText');
  document.querySelector('input[class="form-control"]').placeholder = i18next.t('inputPlaceholder'); // не факт
  document.querySelector('button[type="submit"]').innerHTML = i18next.t('addButton');
  if (document.getElementById('feedHead')) {
    document.getElementById('feedHead').textContent = i18next.t('feeds');
  document.getElementById('postsHead').textContent = i18next.t('posts');
  }
  

  // document.getElementById('output').innerHTML = i18next.t('key');
};


const changeLng = (lng) => {
  i18next.changeLanguage(lng);
};

i18next.on('languageChanged', () => {
  updateContent();
});
