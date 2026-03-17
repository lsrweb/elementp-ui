import { createTest, destroyVM } from '../util';
import DemoCard from 'packages/demo-card';

describe('DemoCard', () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it('create', () => {
    vm = createTest(DemoCard, true);
    expect(vm.$el).to.exist;
  });
});

