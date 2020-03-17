// import i18next from 'i18next';
// import resources from './locales';
// import './styles/styles.css';

const dropDiv = document.createElement('div');
dropDiv.classList.add('dropdown');
const dropButton = document.createElement('button');
dropButton.classList.add('btn', 'btn-info', 'dropdown-toggle', 'float-right');
dropButton.id = 'dropButton';
dropButton.setAttribute('data-toggle', 'dropdown');
dropButton.textContent = 'English'; // здесь i18next.t()
const menuDiv = document.createElement('div');
menuDiv.classList.add('dropdown-menu');


const engButton = document.createElement('a');
engButton.classList.add('dropdown-item');
engButton.id = 'englishLang';

// engButton.setAttribute('click', 'i18next.changeLanguage("en")');

engButton.setAttribute('href', '#');
engButton.innerHTML = 'English'; // здесь i18next.t()


const rusButton = document.createElement('a');
rusButton.classList.add('dropdown-item');
rusButton.id = 'russianLang';
// rusButton.setAttribute('click', 'i18next.changeLanguage("ru")');
rusButton.setAttribute('href', '#');
rusButton.innerHTML = 'Русский'; // здесь i18next.t()


const espButton = document.createElement('a');
espButton.classList.add('dropdown-item');
espButton.id = 'spanishLang';
// espButton.setAttribute('click', 'i18next.changeLanguage("ru")');
espButton.setAttribute('href', '#');
espButton.innerHTML = 'Español'; // здесь i18next.t()


const deutschButton = document.createElement('a');
deutschButton.classList.add('dropdown-item');
deutschButton.id = 'deutschLang';
// deutschButton.setAttribute('click', 'i18next.changeLanguage("ru")');
deutschButton.setAttribute('href', '#');
deutschButton.innerHTML = 'Deutsch'; // здесь i18next.t()


menuDiv.append(engButton, rusButton, espButton, deutschButton);
dropDiv.append(dropButton, menuDiv);


const divInit = () => {
  const divElement = document.createElement('div');

  divElement.classList.add('jumbotron');
  divElement.setAttribute('style', 'background-image: url(https://images.wallpaperscraft.com/image/gradient_green_texture_131365_1920x1080.jpg); background-size: 100%;');

  const header = document.createElement('h3', 'float-right');
  header.classList.add('display-6', 'text-light', 'center-block');

  const header2 = document.createElement('h2');
  header2.classList.add('center-block', 'text-light');
  header2.textContent = 'Your personal RSS aggregator';
  const form = document.createElement('form');
  const divForm = document.createElement('div');
  divForm.classList.add('form-group');
  divForm.innerHTML = '<label for="inputInfo"></label><input type="info" class="form-control" id="inputInfo" placeholder="" aria-describedby="infoHelp">';
  const button = document.createElement('button');
  button.setAttribute('type', 'submit');
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Add';
  form.append(divForm, button);
  divElement.append(dropDiv, header2, header, form);
  return divElement;
};

export default class Initialize {
  constructor(element) {
    this.element = element;
  }

  init() {
    this.element.append(divInit());
  }
}


{ /* <div class="dropdown">
  <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown button
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
  </div>
</div> */ }
