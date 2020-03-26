import i18next from 'i18next';
import languages from './locales/languages';

const dropButtonInit = () => {
  const divElement = document.createElement('div');
  divElement.classList.add('dropdown');
  const dropButton = document.createElement('button');
  dropButton.classList.add('btn', 'btn-info', 'dropdown-toggle', 'float-right');
  dropButton.id = 'dropButton';
  dropButton.setAttribute('data-toggle', 'dropdown');
  dropButton.textContent = 'English';
  const menuDivElement = document.createElement('div');
  menuDivElement.classList.add('dropdown-menu');

  const langs = Object.keys(languages);
  langs.forEach((lang) => {
    const langButton = document.createElement('a');
    langButton.classList.add('dropdown-item');
    langButton.id = lang;
    langButton.setAttribute('href', '#');
    langButton.textContent = languages[lang];
    menuDivElement.append(langButton);
  });
  divElement.append(dropButton, menuDivElement);

  return divElement;
};

const headInit = () => {
  const divElement = document.createElement('div');
  divElement.classList.add('jumbotron');
  divElement.setAttribute('style', 'background-image: url(https://images.wallpaperscraft.com/image/polygon_triangles_geometric_128478_1920x1080.jpg); background-size: 100%;');
  const header3 = document.createElement('h3');
  header3.classList.add('display-6', 'text-light', 'ml-1');
  const header2 = document.createElement('h2');
  header2.classList.add('text-light', 'text-center');
  header2.textContent = i18next.t('header2');
  const form = document.createElement('form');
  const divFormElement = document.createElement('div');
  divFormElement.classList.add('form-group');
  divFormElement.innerHTML = '<input class="form-control" id="inputInfo" placeholder="">';
  const button = document.createElement('button');
  button.setAttribute('type', 'submit');
  button.classList.add('btn', 'btn-primary');
  button.textContent = i18next.t('addButton');
  form.append(divFormElement, button);
  divElement.append(dropButtonInit(), header2, header3, form);
  return divElement;
};

const containerInit = () => {
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container-fluid');
  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');
  const divElement = document.createElement('div');
  divElement.classList.add('col-lg-3', 'border-right', 'mb-4');
  const feedDiv = document.createElement('div');
  feedDiv.classList.add('feeds');

  const postsDiv = document.createElement('div');
  postsDiv.classList.add('col-lg-9', 'posts');
  rowDiv.append(divElement, postsDiv);
  containerDiv.append(rowDiv);
  const feedHeadDiv = document.createElement('div');
  const feedHeader = document.createElement('h5');
  feedHeader.classList.add('feedHeader', 'text-center', 'border-bottom', 'mb-3', 'pb-sm-2');
  feedHeadDiv.append(feedHeader);
  divElement.append(feedHeadDiv, feedDiv);
  return containerDiv;
};

const footerInit = () => {
  const footer = document.createElement('footer');
  footer.setAttribute('style', 'position: fixed; bottom: 0; left: 0; right: 0');
  const copyrightDiv = document.createElement('div');
  copyrightDiv.classList.add('footer-copyright', 'text-center', 'py-3');
  const copyrightLink = '<a href="https://github.com/Sergey89274291549">GitHub account.</a>';
  copyrightDiv.innerHTML = `© Sergey Suchkov, 2020.  Welcome to my ${copyrightLink}`;
  footer.classList.add('page-footer', 'bg-light', 'border-top');
  footer.append(copyrightDiv);
  return footer;
};

export default () => {
  const element = document.getElementById('point');
  element.append(headInit(), containerInit(), footerInit());
};
