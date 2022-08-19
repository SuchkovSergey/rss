import { uniqueId, differenceBy } from 'lodash';
import axios from 'axios';
import * as yup from 'yup';
import i18next from 'i18next';
import { CORS_API_URL, STATE_TYPES, CHECK_POSTS_TIMEOUT } from './constants';

export const getErrorsText = (errors) => errors
    .map((text) => i18next.t(`errorMessages.${text}`))
    .join('. ');

const validateCurrentUrl = (currentUrl, addedURLs) => yup
    .string()
    .url('invalidUrl')
    .required('')
    .notOneOf(addedURLs, 'hasUrlYet')
    .validate(currentUrl);

const updateValidationState = (state) => {
    const { url } = state.form.fields;
    const addedURLs = state.feeds.map((feed) => feed.url);
    validateCurrentUrl(url, addedURLs)
        .then(() => {
            state.form.errors = [];
            state.form.valid = true;
        })
        .catch((err) => {
            state.form.errors = err.errors;
            state.form.valid = false;
        });
};

const parseFeedXML = (xml) => {
    const parser = new DOMParser();
    const xmlDomTree = parser.parseFromString(xml, 'text/xml');
    const feedId = uniqueId();
    const channel = xmlDomTree.querySelector('channel');
    const feed = {
        id: feedId,
        feedTitle: channel.querySelector('title').textContent,
        feedDescription: channel.querySelector('description').textContent,
    };

    const posts = [];
    const postsNodes = channel.querySelectorAll('item');
    for (let i = 0; i < postsNodes.length; i++) {
        const item = postsNodes[i];
        posts.push({
            feedId,
            postTitle: item.querySelector('title').textContent,
            postDescription: item.querySelector('description').textContent,
            link: item.querySelector('link').textContent,
        })
    }

    return { feed, posts };
};

export const checkForNewPosts = (state) => {
    setTimeout(checkForNewPosts, CHECK_POSTS_TIMEOUT, state);
    const { feeds } = state;
    feeds.map(({ url }) => url)
        .forEach((url) => {
            const corsUrl = `${CORS_API_URL}${url}`;
            axios.get(corsUrl)
                .then(({ data }) => {
                    const { feed, posts } = parseFeedXML(data);
                    const { feedTitle } = feed;
                    const currentFeed = feeds.find((el) => el.feedTitle === feedTitle);
                    const { id } = currentFeed;
                    const newPosts = posts.map((post) => ({ ...post, feedId: id }));
                    const diffPosts = differenceBy(newPosts, state.posts, 'postTitle');
                    Array.prototype.push.apply(state.posts, diffPosts);
                })
                .catch((err) => {
                    throw err;
                });
        });
};

export const setListeners = (state) => {
    const input = document.querySelector('.jumbotron__input');
    const form = document.querySelector('form');

    input.addEventListener('input', (event) => {
        state.form.processState = STATE_TYPES.FILLING;
        const target = event.target as HTMLInputElement;
        state.form.fields.url = target.value;
        updateValidationState(state);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        state.form.processState = STATE_TYPES.ADDING;
        const currentURL = state.form.fields.url;
        const url = `${CORS_API_URL}${currentURL}`;
        axios.get(url)
            .then(({ data }) => {
                const { feed, posts } = parseFeedXML(data);
                const feedWithUrl = { ...feed, url: currentURL };
                state.posts = [ ...state.posts, ...posts ];
                state.feeds.push(feedWithUrl);
                state.form.processState = STATE_TYPES.FINISHED;
                state.form.fields.url = '';
            })
            .catch((err) => {
                state.form.errors = [ 'network' ];
                state.form.valid = false;
                state.form.processState = STATE_TYPES.FILLING;
                throw err;
            });
    });
};
