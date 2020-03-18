import _ from 'lodash';

/*
The function "parse" parses html (string) to array,
where first element is a feed object
the second one is an array of post objects
[ {currentFeed}, [ {post1}, {post2}, {post3}, ... , {postn} ] ]

The structure of feed and post objects is located below

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

const parse = (html) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, 'text/xml');
  const id = _.uniqueId();
  const channel = dom.querySelector('channel');
  const currentFeed = {
    id,
    feedTitle: channel.querySelector('title').textContent,
    feedDescription: channel.querySelector('description').textContent,
  };
  const items = channel.querySelectorAll('item');
  const newItems = [];
  items.forEach((item) => {
    const postObj = {
      feedId: id,
      postTitle: item.querySelector('title').textContent,
      postDescription: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    };
    newItems.push(postObj);
  });
  return [currentFeed, newItems];
};

export default parse;
