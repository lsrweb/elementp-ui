import BizDisplay from './src/main';

/* istanbul ignore next */
BizDisplay.install = function(Vue) {
  Vue.component(BizDisplay.name, BizDisplay);
};

export default BizDisplay;
