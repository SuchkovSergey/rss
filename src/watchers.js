/* eslint no-param-reassign: "error" */
import { watch } from 'melanke-watchjs';

const watchState = (state) => {
  const input = document.querySelector('input[id="inputInfo"]');
  const form = document.querySelector('form');
  const submitButton = form.querySelector('button[type="submit"]');

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
        submitButton.disabled = false;
        break;
      default:
        throw new Error(`Unknown state: ${processState}`);
    }
  });

  watch(state.form, 'valid', () => {
    submitButton.disabled = !state.form.valid;
  });

  watch(state.feeds, () => { // срабатывает при добавлении потока
    // выводим список фидов и список постов
    const currentFeed = state.feeds[state.feeds.length - 1];
    const { feedTitle, feedDescription } = currentFeed;
    const newAElement = document.createElement('a');
    newAElement.setAttribute('href', '#');
    newAElement.classList.add('list-group-item', 'list-group-item-action'); // + class 'active'
    const innerDiv = document.createElement('div');
    innerDiv.classList.add('d-flex', 'w-100', 'justify-content-between');
    innerDiv.innerHTML = `<h5 class="mb-1">${feedTitle}</h5>`;
    const newPElement = document.createElement('p');
    newPElement.classList.add('mb-1');
    newPElement.textContent = feedDescription;
    newAElement.append(innerDiv, newPElement);
    const d = document.querySelector('.feeds');
    d.append(newAElement); // добавили поток в список потоков

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
      const d1 = document.querySelector('.posts');
      d1.append(newAPostElement);
    });
  });
};

export default watchState;