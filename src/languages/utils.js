import i18next from 'i18next';
import languages from './languages';

export const updateTexts = (state) => {
    document.querySelector('.jumbotron__header').textContent = i18next.t('header2');
    document.querySelector('.jumbotron__sub-header').textContent = i18next.t('header3');
    document.querySelector('.jumbotron__submit').textContent = i18next.t('addButton');
    document.querySelector('.feed-header').textContent = i18next.t('feeds');
    const { errors } = state.form;
    const errorMessages = errors.map((err) => i18next.t(`errorMessages.${err}`)).join('. ');
    if (document.querySelector('.invalid-feedback')) {
        document.querySelector('.invalid-feedback').textContent = errorMessages;
    }
    if (document.querySelector('.jumbotron__input')) {
        document.querySelector('.jumbotron__input').placeholder = i18next.t('inputPlaceholder');
    }
};

// Initializing language changing
export const changeLangsInit = (currentState) => {
    const langs = Object.keys(languages);
    langs.forEach((lang) => {
        const currentButton = document.getElementById(lang);
        currentButton.addEventListener('click', () => {
            currentState.currentLang = languages[lang];
            i18next.changeLanguage(lang);
        });
    });
};

export const dropButtonInit = () => {
    const dropButton = document.querySelector('.jumbotron__dropdown-button');
    const menuDivElement = document.querySelector('.jumbotron__dropdown-menu');

    dropButton.textContent = languages.en;
    Object.keys(languages).forEach((lang) => {
        const langButton = document.createElement('a');
        langButton.classList.add('dropdown-item');
        langButton.id = lang;
        langButton.setAttribute('href', '#');
        langButton.textContent = languages[lang];
        menuDivElement.append(langButton);
    });
};
