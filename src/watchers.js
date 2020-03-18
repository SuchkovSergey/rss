/* eslint no-param-reassign: "error" */
import { watch } from 'melanke-watchjs';

const watchState = (state) => {
  const input = document.querySelector('input[class="form-control"]');
  const form = document.querySelector('form');
  const submitButton = form.querySelector('button[type="submit"]');

  watch(state, 'currentLang', () => {
    document.getElementById('dropButton').textContent = state.currentLang;
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
    const validity = state.form.valid;
    submitButton.disabled = !validity;
    if (validity) {
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
    }
  });

  watch(state.form, 'errors', () => {
    console.log('errors');
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
    feedbackElement.innerHTML = errorMessages.join('. ');
    input.classList.add('is-invalid');
    input.after(feedbackElement);
  });

  watch(state.feeds, () => {
    const feedDiv = document.querySelector('.feeds');
    const postsDiv = document.querySelector('.posts');

    if (state.feeds.length === 1) {
      const feedHeadDiv = document.querySelector('.feedHeadDiv');
      feedHeadDiv.textContent = 'Feeds';
      const postsHeadDiv = document.querySelector('.postsHeadDiv');
      postsHeadDiv.textContent = 'Posts';
    }

    const currentFeed = state.feeds[state.feeds.length - 1];
    const { feedTitle, feedDescription } = currentFeed;
    const newAElement = document.createElement('a');
    newAElement.setAttribute('href', '#');
    newAElement.classList.add('list-group-item', 'list-group-item-action'); // + class 'active'
    const innerDiv = document.createElement('div');
    innerDiv.classList.add('d-flex', 'w-100', 'justify-content-between');
    innerDiv.innerHTML = `<h4 class="mb-1">${feedTitle}</h4>`;

    const newPElement = document.createElement('p');
    newPElement.classList.add('mb-1');
    newPElement.textContent = feedDescription;
    newAElement.append(innerDiv, newPElement);
    feedDiv.append(newAElement); // добавили поток в список потоков

    const currentPosts = state.posts;
    currentPosts.forEach((post) => {
      const { postTitle, postDescription, link } = post;
      const newAPostElement = document.createElement('a');
      newAPostElement.setAttribute('href', link);
      newAPostElement.classList.add('list-group-item', 'list-group-item-action'); // + class 'active'
      const innerPostDiv = document.createElement('div');
      innerPostDiv.classList.add('d-flex', 'w-100', 'justify-content-between');
      innerPostDiv.innerHTML = `<h6 class="mb-1">${postTitle}</h6>`;
      const newPPostElement = document.createElement('p');
      newPPostElement.classList.add('mb-1');
      newPPostElement.textContent = postDescription;
      newAPostElement.append(innerPostDiv, newPPostElement);
      postsDiv.prepend(newAPostElement);
    });
  });
};

export default watchState;
