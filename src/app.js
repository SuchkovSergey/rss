/* eslint no-param-reassign: "error" */
import axios from 'axios';
import i18next from 'i18next';
import watchState from './watchers';
import resources from './locales';
import languages from './locales/languages';
import {
  parse, updateValidationState, checkForNewPosts, corsApiUrl,
} from './utils';

// В функции "updateContent" не стал отделять получение данных от их использования,
// потому что в данном случае эти данные используются строго один раз
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

// Немного скорректировал функцию "changeLangsInit", но не в плане обработчиков.
// Не нашел подтверждения тому, что они навешиваются больше одного раза..
// Отладочная печать тоже не выявила данную проблему
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
      errors: [], // коды ошибок. Например, ['network', 'hasUrlYet', 'invalidUrl']
      valid: false,
    },
  };

  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  }).then(() => updateContent(state));

  // добавил в аргументы функции "updateContent" state, чтобы корректно менялись языки.
  // Как я понял, в случае, когда функция "updateContent" ничего не принимала на вход,
  // стоило написать "i18next.on('languageChanged', updateContent);"
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
        const feedWithUrl = { ...feed, url: currentURL }; // добавляем урл в поток
        state.posts = [...state.posts, ...posts];
        state.feeds.push(feedWithUrl);
        state.form.processState = 'finished';
        state.form.fields.url = '';
      })
      .catch((err) => {
        state.form.errors = ['network']; // теперь храним не текст, а код ошибки
        state.form.valid = false;
        state.form.processState = 'filling';
        throw err;
      });
  });

  changeLangsInit(state);
  checkForNewPosts(state);
  watchState(state);
};

export default app;
