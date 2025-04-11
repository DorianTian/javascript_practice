/**
 * @param {string} val
 * @return {Object}
 */
var expect = function (val) {
  return {
    toBe: (val2) => {
      if (val === val2) {
        return true;
      } else {
        throw new Error('Not Equal');
      }
    },
    notToBe: (val2) => {
      if (val !== val2) {
        return true;
      } else {
        throw new Error('Equal');
      }
    },
  };
};

/**
 * @param {integer} init
 * @return { increment: Function, decrement: Function, reset: Function }
 */
var createCounter = function (init) {
  const original = init;
  let _init = init;

  return {
    increment: () => {
      _init = _init + 1;
      return _init;
    },
    decrement: () => {
      _init = _init - 1;
      return _init;
    },
    reset: () => {
      _init = original;
      return _init;
    },
  };
};

const counter = createCounter(5);
const a = counter.increment(); // 6
const b = counter.reset(); // 5
const c = counter.decrement(); // 4

console.log(a, b, c);
