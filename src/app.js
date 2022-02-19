import axios from 'axios';
import i18next from 'i18next';
import watchState from './watchers';
import resources from './languages/locales';
import {
    parse, updateValidationState, checkForNewPosts, CORS_API_URL,
} from './utils';
import { updateTexts, changeLangsInit, dropButtonInit } from './languages/utils';
import { STATE_TYPES } from './constants';

const app = () => {
    const state = {
        feeds: [],
        posts: [],
        currentLang: 'English',
        form: {
            processState: STATE_TYPES.FINISHED,
            fields: {
                url: '',
            },
            errors: [],
            valid: false,
        },
    };
    dropButtonInit();
    updateTexts(state);

    i18next.init({
        lng: 'en',
        debug: true,
        resources,
    }).then(() => updateTexts(state));

    i18next.on('languageChanged', () => updateTexts(state));

    const input = document.querySelector('input[id="inputInfo"]');
    const form = document.querySelector('form');

    input.addEventListener('input', (e) => {
        state.form.processState = STATE_TYPES.FILLING;
        state.form.fields.url = e.target.value;
        updateValidationState(state);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        state.form.processState = STATE_TYPES.ADDING;
        const currentURL = state.form.fields.url;
        const url = `${CORS_API_URL}${currentURL}`;
        axios.get(url)
            .then((response) => {
                const { feed, posts } = parse(response.data);
                const feedWithUrl = { ...feed, url: currentURL };
                state.posts = [...state.posts, ...posts];
                state.feeds.push(feedWithUrl);
                state.form.processState = STATE_TYPES.FINISHED;
                state.form.fields.url = '';
            })
            .catch((err) => {
                state.form.errors = ['network'];
                state.form.valid = false;
                state.form.processState = STATE_TYPES.FILLING;
                throw err;
            });
    });

    changeLangsInit(state); // Initialize language changing
    checkForNewPosts(state); // Tracking new posts
    watchState(state); // Tracking state changes
};

export default app;
