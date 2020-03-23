/* eslint no-param-reassign: "error" */
import _ from 'lodash';
import i18next from 'i18next';
import * as yup from 'yup';
import axios from 'axios';

const validate = (currentUrl, addedURLs) => {
  const validationSchema = yup.object().shape({
    website: yup.string().url(),
    url: yup.mixed().oneOf(addedURLs),
  });
  const errors = [];
  validationSchema
    .isValid({ website: currentUrl })
    .then((validity) => {
      if (!validity) {
        errors.push(i18next.t('url.error'));
      }
    });
  validationSchema
    .isValid({ url: currentUrl })
    .then((validity) => {
      if (validity) {
        errors.push(i18next.t('hadUrlYet.error'));
      }
    });
  return errors;
};

const updateValidationState = (state) => {
  const { url } = state.form.fields;
  const { addedURLs } = state;
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
  const urls = currentState.addedURLs;
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
        const errorMessage = i18next.t('network.error');
        currentState.form.errors = [errorMessage];
        currentState.form.valid = false;
        currentState.form.processState = 'filling';
        throw err;
      });
  });
};

export { parse, updateValidationState, checkForNewPosts };

/*
The structure of response html is:
<channel> <title> <description> <item> <item> <item> <item> <item> </channel>

Each <item> is:
<item> <title> <description> <link> </item>

The function "parse" parses html (string) to an object with the following structure:

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
