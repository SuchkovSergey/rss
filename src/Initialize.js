import 'bootstrap';

const divElement = document.createElement('div');
divElement.classList.add('jumbotron');
const header = document.createElement('h1');
const form = document.createElement('form');
const divForm = document.createElement('div');
divForm.classList.add('form-group');
divForm.innerHTML = '<label for="inputInfo">Add stream here</label><input type="info" class="form-control" id="inputInfo" aria-describedby="infoHelp">';
const button = document.createElement('button');
button.type = 'submit';
button.classList.add('btn', 'btn-primary');
button.textContent = 'Add';
form.append(divForm);
form.append(button);
divElement.append(header);
divElement.append(form);


export default class Initialize {
  constructor(element) {
    this.element = element;
  }

  init() {
    this.element.append(divElement);
  }
}
