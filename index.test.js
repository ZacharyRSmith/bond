const assign = require('./index');

const getFoo = function(...args) {
  return this.foo + args.join('');
};

test('binding context/this before', () => {
  const withCtx = getFoo.bind({ foo: 'bar' });
  const withCtxAndArg = assign(withCtx, 1);

  expect(withCtxAndArg()).toBe('bar1');
});

test('binding context/this between', () => {
  const withArg = assign(getFoo, undefined, 2);
  const withCtxAndArg = withArg.bind({ foo: 'bar' });
  const withCtxAnd2Args = assign(withCtxAndArg, 1);

  expect(withCtxAnd2Args()).toBe('bar12');
})

test('binding contet/this after', () => {
  const withArg = assign(getFoo, 1);
  const withCtxAndArg = withArg.bind({ foo: 'bar' });

  expect(withCtxAndArg()).toBe('bar1');
});

describe('doing what Function.prototype.bind does', () => {
  test('partially assigned arguments', () => {
    function list(...args) {
      return args;
    }
    const list1 = list(1, 2, 3); // [1, 2, 3]

    // Create a function with a preset leading argument
    const leadingThirtysevenList = list.bind(null, 37);
    const leadingThirtysevenList2 = assign(list, 37);

    const list2 = leadingThirtysevenList();
    expect(list2).toEqual([37]);
    const list2B = leadingThirtysevenList2();
    expect(list2B).toEqual([37]);

    const list3 = leadingThirtysevenList(1, 2, 3);
    expect(list3).toEqual([37, 1, 2, 3]);
    const list3B = leadingThirtysevenList(1, 2, 3);
    expect(list3B).toEqual([37, 1, 2, 3]);
  });
});

describe('doing funner things', () => {
  test('assigning farther-right arguments first', () => {
    const y = (m, x, b) => m*x + b;
    const oneArg = assign(y, undefined, undefined, 3);
    const twoArgs = assign(oneArg, undefined, 2);

    expect(twoArgs(1)).toBe(5);
  });

  test('incrementally assigning properties on an object argument', () => {
    const y = ({ m, x }, b) => m*x + b;
    const oneArg = assign(y, undefined, 3);
    const twoArgs = assign(oneArg, { x: 2 });

    expect(twoArgs({ m: 1 })).toBe(5);
  });

  test('overwriting previously assigned args', () => {
    const y = ({ m, x }, b) => m*x + b;
    const withArgs = assign(y, { m: 2, x: 2 }, 5);
    expect(withArgs()).toBe(9);
    const withArgsRedone = assign(withArgs, { m: 3 }, 10);

    expect(withArgsRedone()).toBe(16);
  });

  test('overwriting previously assigned args does not blow up when prev was not an obj', () => {
    const concat = (a, b) => a + b;
    const withArg = assign(concat, 'a');
    const withArgs = assign(withArg, { foo: 'bar' }, 'baz');
    expect(withArgs()).toBe('[object Object]baz')
  });

  test('a funner thing', () => {
    const logs = [];
    const log = (msg) => {
      logs.push(msg);
    };
    const hello = ({ salutation='Hello', name='world' }, out) => {
      out(`${salutation}, ${name}!`);
    };
    const logHello = assign(hello, undefined, log);
    const logHelloInSpanish = assign(logHello, { salutation: 'Hola' });

    logHelloInSpanish({ name: 'chico' });

    expect(logs).toEqual(['Hola, chico!']);
  });
});
