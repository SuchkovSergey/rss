/* eslint no-param-reassign: "error" */
import * as yup from 'yup';

// The function "parse" parses html (string) to array,
// where first element is feed object
// the second one - array of post objects
// [ {currentFeed}, [ {post1}, {post2}, {post3}, ... , {postn} ] ]

// The structure of feed and post objects is located below

// const currentFeed = {
//   id,
//   feedTitle,
//   feedDescription,
// }
// const post = {
//   feedId,
//   postTitle,
//   postDescription,
//   link,
// }

const parse = (html) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, 'text/xml');
  const id = _.uniqueId(); // неясно, будет ли работать корректно
  const channel = dom.querySelector('channel');
  const currentFeed = {
    id,
    feedTitle: channel.querySelector('title').textContent,
    feedDescription: channel.querySelector('description').textContent,
  };
  const items = channel.querySelectorAll('item');
  const newItems = [];
  items.forEach((item) => {
    const obj = {
      feedId: id,
      postTitle: item.querySelector('title').textContent,
      postDescription: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    };
    newItems.push(obj);
  });
  return [currentFeed, newItems];
};

const schema = yup.object().shape({
  website: yup.string().url(),
});

const validate = (feedAdress, state) => schema
  .isValid({ website: feedAdress })
  .then((validity) => {
    const doubleCheck = state.feedAdresses.includes(feedAdress);
    state.form.valid = validity && !doubleCheck;
  });

export { parse, validate };
