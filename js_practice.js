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

/**
 * @param {number[]} arr
 * @param {Function} fn
 * @return {number[]}
 */
var map = function (arr, fn) {
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i], i));
  }

  return result;
};

/**
 * @param {number[]} arr
 * @param {Function} fn
 * @return {number[]}
 */
var filter = function (arr, fn) {
  const result = [];
  let index = 0;

  for (let i = 0; i < arr.length; i++) {
    if (fn(arr[i], i)) {
      result[index++] = arr[i];
    }
  }

  return result;
};
