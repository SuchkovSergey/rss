import 'bootstrap';

const text = '<div class="jumbotron"><h1 class="display-4">RSS</h1><p class="lead">Some information here</p><form><div class="form-group"><label for="exampleInputInfo1">Add stream here</label><input type="info" class="form-control" id="exampleInputInfo1" aria-describedby="infoHelp"></div> <button type="submit" class="btn btn-primary">Add</button></form></div>';

export default class Example {
  constructor(element) {
    this.element = element;
  }

  init() {
    this.element.textContent = text;
  }
}
