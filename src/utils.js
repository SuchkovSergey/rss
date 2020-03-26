/* eslint no-param-reassign: "error" */
// import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import { string, mixed } from 'yup';

const validate = (currentUrl, addedURLs) => {
  const errors = [];
  string().url().validate(currentUrl).catch(() => {
    errors.push('invalidUrl');
  });
  mixed().notOneOf(addedURLs).validate(currentUrl).catch(() => {
    errors.push('hasUrlYet');
  });
  return errors;
};

const updateValidationState = (state) => {
  const { url } = state.form.fields;
  const addedURLs = state.feeds.map((feed) => feed.url);
  const errors = validate(url, addedURLs);
  state.form.errors = errors;
  state.form.valid = _.isEqual(errors, []);
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

const corsApiUrl = 'https://cors-anywhere.herokuapp.com/';

const checkForNewPosts = (currentState) => {
  const urls = currentState.feeds.map((feed) => feed.url);
  setTimeout(checkForNewPosts, 5000, currentState);
  urls.forEach((url) => {
    const corsUrl = `${corsApiUrl}${url}`;
    axios.get(corsUrl)
      .then((response) => {
        const output = parse(response.data);
        const { feed, posts } = output;
        const { feedTitle } = feed;
        const currentFeed = currentState.feeds.find((el) => el.feedTitle === feedTitle);
        const { id } = currentFeed;
        const newPosts = posts.map((post) => ({ ...post, feedId: id }));
        const diffPosts = _.differenceBy(newPosts, currentState.posts, 'postTitle');
        Array.prototype.push.apply(currentState.posts, diffPosts);
      })
      .catch((err) => {
        currentState.form.errors = ['network'];
        currentState.form.valid = false;
        currentState.form.processState = 'filling';
        throw err;
      });
  });
};

export { parse, updateValidationState, checkForNewPosts };

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
