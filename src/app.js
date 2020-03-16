/* eslint no-param-reassign: "error" */
import * as yup from 'yup';
import axios from 'axios';
import { watch } from 'melanke-watchjs';
import _ from 'lodash';
import watchState from './watchers';

const schema = yup.object().shape({
  website: yup.string().url(),
});

const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';

const parse = (html) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, 'text/xml');
  const id = _.uniqueId(); // неясно, будет ли работать корректно
  const channel = dom.querySelector('channel');
  const feedTitle = channel.querySelector('title').textContent;
  const feedDescription = channel.querySelector('description').textContent;
  const currentFeed = {
    id,
    feedTitle,
    feedDescription,
  };
  const items = channel.querySelectorAll('item');
  const newItems = [];

  items.forEach((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    const obj = {
      feedId: id,
      postTitle,
      postDescription,
      link,
    };
    newItems.push(obj);
  });
  return [currentFeed, newItems]; // [ {currentFeed}, [ {post1}, {post2}, {post3}, ... , {postn}]
};

const validate = (feedAdress, state) => schema
  .isValid({ website: feedAdress })
  .then((validity) => {
    const doubleCheck = state.feedAdresses.includes(feedAdress);
    state.form.valid = validity && !doubleCheck;
  });


const app = () => {
  const state = {
    feedAdresses: [],
    feeds: [], // связь с постами - через id
    posts: [],
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
      })
      .catch(() => {
        state.form.processState = 'finished';
        throw new Error('There is a problem with a net');
      });
  });

  const body = document.querySelector('body');
  const divFeedsElement = document.createElement('div');
  divFeedsElement.classList.add('list-group', 'feeds');
  body.append(divFeedsElement);

  const divPostsElement = document.createElement('div');
  divPostsElement.classList.add('list-group', 'posts');
  body.append(divPostsElement);

  watch(state, watchState(state));
};


// <a href="#" class="list-group-item list-group-item-action active">
//   <div class="d-flex w-100 justify-content-between">
//     <h5 class="mb-1">Feed Title 1</h5>
//   </div>
//   <p class="mb-1">Description 1</p>
// </a>


/* Работа парсера
принимает на вход строку html
использует DOMParser для перевода строки в ДОМ
создает массив в виде: [ {currentFeed}, [ {post1}, {post2}, ... , {postn}]

const currentFeed = { // такой объект один
  id,
  feedTitle,
  feedDescription,
}
const post = { // таких объектов будет несколько
  feedId,
  postTitle,
  postDescription,
  link,
}
*/

export default app;

// Структура ответного HTML
// <channel> <title> <description> <item> <item> <item> <item> <item> </channel>
// <item> <title> <description> <link> </item>

// _.uniqueId();
// // => '105'

/*
<div class="list-group">
  <a href="#" class="list-group-item list-group-item-action active">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">Feed Title 1</h5>
    </div>
    <p class="mb-1">Description 1</p>
  </a>

  <a href="#" class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">Feed Title 2</h5>
    </div>
    <p class="mb-1">Description 2</p>
  </a>
</div>;
*/
