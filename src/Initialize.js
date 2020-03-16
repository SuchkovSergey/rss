const divInit = () => {
  const divElement = document.createElement('div');
  divElement.classList.add('jumbotron');
  const header = document.createElement('h1');
  const form = document.createElement('form');
  const divForm = document.createElement('div');
  divForm.classList.add('form-group');
  divForm.innerHTML = '<label for="inputInfo">Add stream here</label><input type="info" class="form-control" id="inputInfo" placeholder="Input correct feed" aria-describedby="infoHelp">';
  const button = document.createElement('button');
  button.setAttribute('type', 'submit');
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Add';
  form.append(divForm, button);
  divElement.append(header, form);
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
