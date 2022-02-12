/* eslint no-param-reassign: "error" */
import { watch } from 'melanke-watchjs';
import i18next from 'i18next';

// Redrawing posts
const renderPosts = (currentPosts) => {
  const postsDiv = document.querySelector('.posts');
  postsDiv.innerHTML = '';
  currentPosts.forEach((post) => {
    const { postTitle, postDescription, link } = post;
    const newDivElement = document.createElement('div');
    newDivElement.classList.add('mb-2', 'border-bottom');
    const header5 = document.createElement('h5');
    const newPElement1 = document.createElement('p');
    header5.innerHTML = `<a href="${link}">${postTitle}</a>`;
    newPElement1.textContent = postDescription;
    newDivElement.append(header5, newPElement1);
    postsDiv.append(newDivElement);
  });
};

// Deleting feed and relevant posts
const deleteFeed = (state, id) => () => {
  const { feeds, posts } = state;
  state.feeds = feeds.filter((el) => el.id !== id);
  state.posts = posts.filter((el) => el.feedId !== id);
};

// Adding feed and relevant posts
const addFeed = (state, feed) => {
  const feedsElement = document.querySelector('.feeds');
  const { id, feedTitle, feedDescription } = feed;
  const newAElement = document.createElement('a');
  newAElement.setAttribute('href', '#');
  newAElement.classList.add('list-group-item', 'list-group-item-action');
  newAElement.addEventListener('click', (event) => {
    event.preventDefault();
  });
  const innerDiv = document.createElement('div');
  innerDiv.innerHTML = `<h4 class='mb-1 feedItem'>${feedTitle}</h4>`;
  const newPElement = document.createElement('p');
  newPElement.classList.add('mb-1');
  newPElement.textContent = feedDescription;
  feedsElement.append(newAElement);

  // Initializing "close" button
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.classList.add('close');
  closeButton.setAttribute('aria-label', 'close');
  closeButton.innerHTML = '<span aria-hidden="true">&times;</span>';
  closeButton.addEventListener('click', deleteFeed(state, id));

  newAElement.append(closeButton, innerDiv, newPElement);

  newAElement.addEventListener('click', () => {
    const currentPosts = state.posts.filter((post) => post.feedId === id);
    renderPosts(currentPosts);
    const activeElement = feedsElement.querySelector('.active');
    if (activeElement) {
      activeElement.classList.remove('active');
    }
    newAElement.classList.add('active');
  });
};

// The main logic of "View" level
// Tracking changes of state, makes changes to the DOM
const watchState = (state) => {
  const input = document.querySelector('input[class="form-control"]');
  const form = document.querySelector('form');
  const submitButton = form.querySelector('button[type="submit"]');

  watch(state, 'currentLang', () => {
    const dropButton = document.getElementById('dropButton');
    dropButton.textContent = state.currentLang;
  });

  watch(state.form, 'processState', () => {
    const { processState } = state.form;
    switch (processState) {
      case 'filling':
        submitButton.disabled = false;
        break;
      case 'adding':
        submitButton.disabled = true;
        break;
      case 'finished':
        input.value = '';
        submitButton.disabled = true;
        break;
      default:
        throw new Error(`Unknown state: ${processState}`);
    }
  });

  watch(state.form, 'valid', () => {
    const { valid } = state.form;
    submitButton.disabled = !valid;
    if (valid) {
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
    }
  });

  watch(state.form, 'errors', () => {
    const errorElement = input.nextElementSibling;
    const { errors } = state.form;
    if (errorElement) {
      input.classList.remove('is-invalid');
      errorElement.remove();
    }
    if (errors.length === 0) return;
    const feedbackElement = document.createElement('div');
    feedbackElement.classList.add('invalid-feedback', 'text-warning');
    const errorMessages = errors.map((err) => i18next.t(`errorMessages.${err}`)).join('. ');
    feedbackElement.textContent = errorMessages;
    input.classList.add('is-invalid');
    input.after(feedbackElement);
  });

  watch(state, 'feeds', () => {
    const feedDivElement = document.querySelector('.feeds');
    feedDivElement.innerHTML = '';
    const { feeds } = state;
    feeds.forEach((feed) => addFeed(state, feed));
  });

  watch(state, 'posts', () => {
    renderPosts(state.posts);
  });
};

export default watchState;
