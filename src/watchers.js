/* eslint no-param-reassign: "error" */
import { watch } from 'melanke-watchjs';

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
    const errorMessages = state.form.errors;

    if (errorElement) {
      input.classList.remove('is-invalid');
      errorElement.remove();
    }
    if (errorMessages.length === 0) {
      return;
    }
    const feedbackElement = document.createElement('div');
    feedbackElement.classList.add('invalid-feedback', 'text-warning');
    feedbackElement.textContent = errorMessages.join('. ');
    input.classList.add('is-invalid');
    input.after(feedbackElement);
  });

  watch(state.feeds, () => {
    const feedDivElement = document.querySelector('.feeds');
    const activeFeedElement = feedDivElement.querySelector('.active');
    if (activeFeedElement) {
      activeFeedElement.classList.remove('active');
    }
    if (state.feeds.length === 1) {
      const feedHeader = document.querySelector('.feedHeader');
      feedHeader.textContent = 'Your feeds';
    }
    const currentFeed = state.feeds[state.feeds.length - 1];
    const { id, feedTitle, feedDescription } = currentFeed;
    const newAElement = document.createElement('a');
    newAElement.setAttribute('href', '#');
    newAElement.classList.add('list-group-item', 'list-group-item-action');
    const innerDiv = document.createElement('div');
    const header4 = document.createElement('h4');
    header4.classList.add('mb-1', 'feedItem');
    header4.textContent = feedTitle;
    innerDiv.append(header4);
    const newPElement = document.createElement('p');
    newPElement.classList.add('mb-1');
    newPElement.textContent = feedDescription;
    newAElement.append(innerDiv, newPElement);
    feedDivElement.append(newAElement); // добавили поток в список потоков

    newAElement.addEventListener('click', () => { // обработчики кликов на потоки
      const currentPosts = state.posts.filter((post) => post.feedId === id);
      state.currentPosts = currentPosts;
      const activeElement = feedDivElement.querySelector('.active');
      if (activeElement) {
        activeElement.classList.remove('active');
      }
      newAElement.classList.add('active');
    });
  });

  const dataFields = ['posts', 'currentPosts'];

  dataFields.forEach((el) => {
    watch(state, el, () => {
      const postsDiv = document.querySelector('.posts');
      postsDiv.innerHTML = '';
      const currentPosts = state[el];
      currentPosts.forEach((post) => {
        const { postTitle, postDescription, link } = post;
        const newDivElement = document.createElement('div');
        newDivElement.classList.add('mb-2', 'border-bottom');
        const header5 = document.createElement('h5');
        const newPElement = document.createElement('p');
        header5.innerHTML = `<a href="${link}">${postTitle}</a>`;
        newPElement.textContent = postDescription;
        newDivElement.append(header5, newPElement);
        postsDiv.append(newDivElement);
      });
    });
  });
};

export default watchState;
