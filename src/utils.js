import _ from 'lodash';

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

const parse = (html) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, 'text/xml');
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

export default parse;
