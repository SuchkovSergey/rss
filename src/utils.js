import _ from 'lodash';
import axios from 'axios';
import * as yup from 'yup';

// ToDo вынести в константы
const CORS_API_URL = 'https://cors-anywhere.herokuapp.com/';

// Validation text in the "input"
const validate = (currentUrl, addedURLs) => yup
    .string()
    .url('invalidUrl')
    .required('')
    .notOneOf(addedURLs, 'hasUrlYet')
    .validate(currentUrl);

const updateValidationState = (state) => {
    const { url } = state.form.fields;
    const addedURLs = state.feeds.map((feed) => feed.url);
    validate(url, addedURLs)
        .then(() => {
            state.form.errors = [];
            state.form.valid = true;
        })
        .catch((err) => {
            state.form.errors = err.errors;
            state.form.valid = false;
        });
};

/*
The function "parse" parses xml (string) to an object with the following structure:

const response = {
    feed: currentFeed,
    posts: arrayOfPosts,
}

The structures of currentFeed and post objects are located below

const currentFeed = {
    id,
    feedTitle,
    feedDescription,
}

const post = {
    feedId,
    postTitle,
    postDescription,
    link,
}
*/
const parse = (xml) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(xml, 'text/xml');
    const id = _.uniqueId();
    const channel = dom.querySelector('channel');
    const feed = {
        id,
        feedTitle: channel.querySelector('title').textContent,
        feedDescription: channel.querySelector('description').textContent,
    };
    const items = channel.querySelectorAll('item');
    const posts = [];
    items.forEach((item) => {
        const postObj = {
            feedId: id,
            postTitle: item.querySelector('title').textContent,
            postDescription: item.querySelector('description').textContent,
            link: item.querySelector('link').textContent,
        };
        posts.push(postObj);
    });

    return { feed, posts };
};

const checkForNewPosts = (state) => {
    setTimeout(checkForNewPosts, 5000, state);
    const { feeds } = state;
    const urls = feeds.map((feed) => feed.url);
    urls.forEach((url) => {
        const corsUrl = `${CORS_API_URL}${url}`;
        axios.get(corsUrl)
            .then((response) => {
                const { feed, posts } = parse(response.data);
                const { feedTitle } = feed;
                const currentFeed = feeds.find((el) => el.feedTitle === feedTitle);
                const { id } = currentFeed;
                const newPosts = posts.map((post) => ({ ...post, feedId: id }));
                const diffPosts = _.differenceBy(newPosts, state.posts, 'postTitle');
                Array.prototype.push.apply(state.posts, diffPosts);
            })
            .catch((err) => { throw err; });
    });
};

export {
    parse, updateValidationState, checkForNewPosts, CORS_API_URL,
};
