// import i18next from 'i18next';
// import resources from './locales';

const languages = {
  englishLang: 'English',
  russianLang: 'Русский',
  spanishLang: 'Español',
  deutschLang: 'Deutsch',
};

const dropButtonInit = () => {
  const dropDiv = document.createElement('div');
  dropDiv.classList.add('dropdown');
  const dropButton = document.createElement('button');
  dropButton.classList.add('btn', 'btn-info', 'dropdown-toggle', 'float-right');
  dropButton.id = 'dropButton';
  dropButton.setAttribute('data-toggle', 'dropdown');
  dropButton.textContent = 'English';
  const menuDiv = document.createElement('div');
  menuDiv.classList.add('dropdown-menu');

  const langs = Object.keys(languages);

  langs.forEach((lang) => {
    const langButton = document.createElement('a');
    langButton.classList.add('dropdown-item');
    langButton.id = lang;
    langButton.setAttribute('href', '#');
    langButton.textContent = languages[lang];
    menuDiv.append(langButton);
  });
  dropDiv.append(dropButton, menuDiv);

  return dropDiv;
};

const HeadInit = () => {
  const divElement = document.createElement('div');
  divElement.classList.add('jumbotron');
  divElement.setAttribute('style', 'background-image: url(https://images.wallpaperscraft.com/image/polygon_triangles_geometric_128478_1920x1080.jpg); background-size: 100%;');
  const header = document.createElement('h3');
  header.classList.add('display-6', 'text-light', 'ml-1');
  const header2 = document.createElement('h2');
  header2.classList.add('text-light', 'text-center');
  header2.textContent = 'Your personal RSS aggregator';
  const form = document.createElement('form');
  const divForm = document.createElement('div');
  divForm.classList.add('form-group');
  divForm.innerHTML = '<input class="form-control" id="inputInfo" placeholder="">'; // <label></label>
  const button = document.createElement('button');
  button.setAttribute('type', 'submit');
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Add';
  form.append(divForm, button);
  divElement.append(dropButtonInit(), header2, header, form);
  return divElement;
};

const containerInit = () => {
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container-fluid');
  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');
  const feedDiv = document.createElement('div');
  feedDiv.classList.add('col-md-3', 'feeds', 'border-right', 'mb-4');
  const postsDiv = document.createElement('div');
  postsDiv.classList.add('col-md-9', 'posts');
  rowDiv.append(feedDiv, postsDiv);
  containerDiv.append(rowDiv);
  const feedHeadDiv = document.createElement('div');
  const feedHeader = document.createElement('h5');
  feedHeader.classList.add('feedHeader', 'text-center', 'border-bottom', 'mb-3', 'pb-sm-2');
  feedHeadDiv.append(feedHeader);
  feedDiv.append(feedHeadDiv);
  return containerDiv;
};

const footerInit = () => {
  const footer = document.createElement('footer');
  footer.setAttribute('style', 'position: fixed; bottom: 0; left: 0; right: 0');
  const copyrightDiv = document.createElement('div');
  copyrightDiv.classList.add('footer-copyright', 'text-center', 'py-3');
  const copyrightLink = '<a href="https://github.com/Sergey89274291549">GitHub account.</a>';
  copyrightDiv.innerHTML = `© Sergey Suchkov, 2020.  Welcome to my ${copyrightLink}`;
  footer.classList.add('page-footer', 'font-small', 'bg-light', 'border-top');
  footer.append(copyrightDiv);
  return footer;
};

export default class Initialize {
  constructor(element) {
    this.element = element;
  }

  init() {
    this.element.append(HeadInit(), containerInit(), footerInit());
  }
}

// <div class="dropdown">
//   <button class="btn btn-info dropdown-toggle" type="button"
// id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//     Dropdown button
//   </button>
//   <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
//     <a class="dropdown-item" href="#">Action</a>
//     <a class="dropdown-item" href="#">Another action</a>
//     <a class="dropdown-item" href="#">Something else here</a>
//   </div>
// </div> }

// https://images.wallpaperscraft.com/image/gradient_green_texture_131365_1920x1080.jpg
// https://images.wallpaperscraft.com/image/polygon_triangles_geometric_126824_1920x1080.jpg
// https://images.wallpaperscraft.com/image/polygon_triangles_geometric_128478_1920x1080.jpg
// https://images.wallpaperscraft.com/image/texture_triangles_abstraction_77205_1920x1080.jpg
