import i18next from 'i18next';
import resources from './locales';
import { getErrorsText } from '../utils';
import { LANGUAGES } from '../constants';

export const updateTexts = (state) => {
    const jumbotronHeader = document.querySelector('.jumbotron__header');
    const jumbotronSubHeader = document.querySelector('.jumbotron__sub-header');
    const jumbotronSubmit = document.querySelector('.jumbotron__submit');
    const feedsHeader = document.querySelector('.main-body__feeds-header');
    const errorElement = document.querySelector('.invalid-feedback');
    const urlInput = document.querySelector('.jumbotron__input');

    jumbotronHeader.textContent = i18next.t('jumbotronHeader');
    jumbotronSubHeader.textContent = i18next.t('jumbotronSubHeader');
    jumbotronSubmit.textContent = i18next.t('jumbotronSubmit');
    feedsHeader.textContent = i18next.t('feedsHeader');
    if (errorElement) {
        errorElement.textContent = getErrorsText(state.form.errors);
    }
    if (urlInput) {
        urlInput.placeholder = i18next.t('inputPlaceholder');
    }
};

const changeLanguagesInit = (state) => {
    Object.keys(LANGUAGES).forEach((language) => {
        const currentButton = document.getElementById(language);
        currentButton.addEventListener('click', () => {
            state.currentLang = LANGUAGES[language];
            i18next.changeLanguage(language);
        });
    });
};

const dropButtonInit = () => {
    const dropButton = document.querySelector('.jumbotron__dropdown-button');
    const menuDivElement = document.querySelector('.jumbotron__dropdown-menu');

    dropButton.textContent = LANGUAGES.en;
    Object.keys(LANGUAGES).forEach((language) => {
        const langButton = document.createElement('a');
        langButton.classList.add('dropdown-item');
        langButton.id = language;
        langButton.setAttribute('href', '#');
        langButton.textContent = LANGUAGES[language];
        menuDivElement.append(langButton);
    });
};

export const initializeI18next = (state) => {
    dropButtonInit();
    i18next.init({
        lng: 'en',
        debug: true,
        resources,
    }).then(() => updateTexts(state));
    i18next.on('languageChanged', () => updateTexts(state));
    changeLanguagesInit(state);
};
