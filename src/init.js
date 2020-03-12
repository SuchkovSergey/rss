import Initialize from './Initialize';

export default () => {
  const element = document.getElementById('point');
  const obj = new Initialize(element);
  obj.init();
};
