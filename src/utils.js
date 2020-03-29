/* eslint no-param-reassign: "error" */
import _ from 'lodash';
import axios from 'axios';
import { string, mixed } from 'yup';

const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';

const validate = (currentUrl, addedURLs) => {
  let urlValidity;
  return string().url().isValid(currentUrl)
    .then((valid) => {
      urlValidity = valid;
    })
    .then(() => mixed().notOneOf(addedURLs).isValid(currentUrl))
    .then((doubleValidity) => new Promise((resolve) => {
      const errors = [];
      if (!urlValidity) { errors.push('invalidUrl'); }
      if (!doubleValidity) { errors.push('hasUrlYet'); }
      resolve(errors);
    }));
};

const updateValidationState = (state) => {
  const { url } = state.form.fields;
  const addedURLs = state.feeds.map((feed) => feed.url);
  validate(url, addedURLs).then((errors) => {
    state.form.errors = errors;
    state.form.valid = _.isEqual(errors, []);
  });
};

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
    const corsUrl = `${corsApiUrl}${url}`;
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
  parse, updateValidationState, checkForNewPosts, corsApiUrl,
};

/*
The structure of response xml is:
<channel> <title> <description> <item> <item> <item> <item> <item> </channel>

Each <item> is:
<item> <title> <description> <link> </item>

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
