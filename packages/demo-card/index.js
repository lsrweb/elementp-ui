import DemoCard from './src/main';

/* istanbul ignore next */
DemoCard.install = function(Vue) {
  Vue.component(DemoCard.name, DemoCard);
};

export default DemoCard;
