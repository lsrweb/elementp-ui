import BizCard from './src/main';

/* istanbul ignore next */
BizCard.install = function(Vue) {
  Vue.component(BizCard.name, BizCard);
};

export default BizCard;
