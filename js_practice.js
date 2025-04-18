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

// const counter = createCounter(5);
// const a = counter.increment(); // 6
// const b = counter.reset(); // 5
// const c = counter.decrement(); // 4

// console.log(a, b, c);

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

/**
 * @param {number[]} nums
 * @param {Function} fn
 * @param {number} init
 * @return {number}
 */
var reduce = function (nums, fn, init) {
  let result = init;
  let index = 0;

  while (index < nums.length) {
    result = fn(result, nums[index++]);
  }

  return result;
};

/**
 * @param {Function[]} functions
 * @return {Function}
 */
var compose = function (functions) {
  const len = functions.length;

  return function (x) {
    let result = x;
    for (let i = len - 1; i >= 0; i--) {
      result = functions[i](result);
    }

    return result;
  };
};

/**
 * @param {...(null|boolean|number|string|Array|Object)} args
 * @return {number}
 */
var argumentsLength = function (...args) {
  return args.length;
};

// console.log(argumentsLength(1, 2, 3));

/**
 * @param {Function} fn
 * @return {Function}
 */
var once = function (fn) {
  let called = false;
  let result;
  return function (...args) {
    if (!called) {
      called = true;
      result = fn(...args);
      fn = null;

      return result;
    }

    return undefined;
  };
};

/**
 * @param {Function} fn
 * @return {Function}
 */
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * @param {Promise} promise1
 * @param {Promise} promise2
 * @return {Promise}
 */
var addTwoPromises = async function (promise1, promise2) {
  return Promise.all([promise1, promise2]).then(([a, b]) => a + b);
};

/**
 * @param {number} millis
 * @return {Promise}
 */
async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

/**
 * @param {Function} fn
 * @param {Array} args
 * @param {number} t
 * @return {Function}
 */
var cancellable = function (fn, args, t) {
  let timeoutId;
  let cancelled = false;

  const cancelFn = () => {
    cancelled = true;
  };

  timeoutId = setTimeout(() => {
    if (!cancelled) {
      const result = fn(...args);
      return result;
    }
  }, t);

  return cancelFn;
};

/**
 * @param {Function} fn
 * @param {Array} args
 * @param {number} t
 * @return {Function}
 */
var cancellable = function (fn, args, t) {
  let timer;

  const cancelFn = () => {
    clearInterval(timer);
  };

  fn(...args);
  timer = setInterval(() => {
    return fn(...args);
  }, t);

  return cancelFn;
};

/**
 * @param {Function} fn
 * @param {number} t
 * @return {Function}
 */
var timeLimit = function (fn, t) {
  return async function (...args) {
    const timeout = new Promise((_, reject) => {
      setTimeout(() => {
        reject('Time Limit Exceeded');
      }, t);
    });

    return Promise.race([fn(...args), timeout]);
  };
};

var TimeLimitedCache = function () {
  this.cache = new Map();
};

/**
 * @param {number} key
 * @param {number} value
 * @param {number} duration time until expiration in ms
 * @return {boolean} if un-expired key already existed
 */
TimeLimitedCache.prototype.set = function (key, value, duration) {
  const currentTime = Date.now();
  let isExist = false;

  if (this.cache.has(key)) {
    const [_, expireTime] = this.cache.get(key);
    isExist = currentTime < expireTime;
  }

  this.cache.set(key, [value, currentTime + duration]);
  return isExist;
};

/**
 * @param {number} key
 * @return {number} value associated with key
 */
TimeLimitedCache.prototype.get = function (key) {
  if (this.cache.has(key)) {
    const [value, expireTime] = this.cache.get(key);
    const currentTime = Date.now();

    if (currentTime < expireTime) {
      return value;
    } else {
      this.cache.delete(key);
    }
  }

  return -1;
};

/**
 * @return {number} count of non-expired keys
 */
TimeLimitedCache.prototype.count = function () {
  const currentTime = Date.now();
  let count = 0;

  this.cache.forEach(([_, expireTime], key) => {
    if (currentTime < expireTime) {
      count++;
    } else {
      this.cache.delete(key);
    }
  });

  return count;
};

/**
 * @param {Function} fn
 * @param {number} t milliseconds
 * @return {Function}
 */
var debounce = function (fn, t) {
  let timer;

  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      fn(...args);
    }, t);
  };
};

/**
 * @param {Array<Function>} functions
 * @return {Promise<any>}
 */
var promiseAll = function (functions) {
  const result = [];
  let count = 0;
  const len = functions.length;

  return new Promise((resolve, reject) => {
    if (len === 0) {
      return resolve([]);
    }

    functions.forEach((fn, index) => {
      fn()
        .then((res) => {
          result[index] = res;
          count++;

          if (count === len) {
            resolve(result);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};

/**
 * @param {Object|Array} obj
 * @return {boolean}
 */
var isEmpty = function (obj) {
  return Object.keys(obj).length === 0;
};

/**
 * @param {Array} arr
 * @param {number} size
 * @return {Array}
 */
var chunk = function (arr, size) {
  const result = [];
  let index = 0;

  while (index < arr.length) {
    result.push(arr.slice(index, index + size));
    index += size;
  }

  return result;
};

/**
 * @return {null|boolean|number|string|Array|Object}
 */
Array.prototype.last = function () {
  if (this.length === 0) return -1;
  return this[this.length - 1];
};

/**
 * @param {Function} fn
 * @return {Object}
 */
Array.prototype.groupBy = function (fn) {
  const result = {};

  for (let i = 0; i < this.length; i++) {
    const key = fn(this[i]);
    result[key] = result[key] || [];
    result[key].push(this[i]);
  }

  return result;
};

/**
 * @param {Array} arr
 * @param {Function} fn
 * @return {Array}
 */
var sortBy = function (arr, fn) {
  return arr.sort((a, b) => fn(a) - fn(b));
};

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @return {Array}
 */
var join = function (arr1, arr2) {
  const result = {};

  arr1.forEach((item) => {
    result[item.id] = item;
  });

  arr2.forEach((item) => {
    if (result[item.id]) {
      result[item.id] = { ...result[item.id], ...item };
    } else {
      result[item.id] = item;
    }
  });

  return Object.values(result);
};

/**
 * @param {Array} arr
 * @param {number} depth
 * @return {Array}
 */
var flat = function (arr, n) {
  if (n === 0) return arr;
  const result = [];

  const dfs = (arr, depth) => {
    if (depth > n) {
      result.push(arr);
      return;
    }

    for (let i = 0; i < arr.length; i++) {
      if (Array.isArray(arr[i])) {
        dfs(arr[i], depth + 1);
      } else {
        result.push(arr[i]);
      }
    }
  };

  dfs(arr, 0);

  return result;
};

/**
 * @param {Object|Array} obj
 * @return {Object|Array}
 */
var compactObject = function (obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.filter(Boolean).map(compactObject);
  }

  if (typeof obj === 'object') {
    const result = {};

    for (const key in obj) {
      const value = compactObject(obj[key]);
      if (value) {
        result[key] = value;
      }
    }

    return result;
  }
};

class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  /**
   * @param {string} eventName
   * @param {Function} callback
   * @return {Object}
   */
  subscribe(eventName, callback) {
    if (!callback) return;

    if (!this.events.has(eventName)) {
      this.events.set(eventName, [callback]);
    } else {
      this.events.get(eventName).push(callback);
    }

    return {
      unsubscribe: () => {
        const callbacks = this.events.get(eventName);
        console.log(callbacks, callback);
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      },
    };
  }

  /**
   * @param {string} eventName
   * @param {Array} args
   * @return {Array}
   */
  emit(eventName, args = []) {
    if (!this.events.has(eventName)) return [];

    console.log(
      '-----: ',
      this.events.get(eventName).map((cb) => cb(...args))
    );
    return this.events.get(eventName).map((cb) => cb(...args));
  }
}

const emitter = new EventEmitter();
const sub1 = emitter.subscribe('firstEvent', (x) => x + 1);
console.log('sub1: ', sub1);
const sub2 = emitter.subscribe('firstEvent', (x) => x + 2);
sub2.unsubscribe(); // undefined
emitter.emit('firstEvent', [5]); // [7]

/**
 * @param {number[]} nums
 * @return {void}
 */
var ArrayWrapper = function (nums) {
  this.nums = nums;
};

/**
 * @return {number}
 */
ArrayWrapper.prototype.valueOf = function () {
  if (this.nums.length === 0) return 0;
  let value = 0;
  for (let i = 0; i < this.nums.length; i++) {
    value += this.nums[i];
  }

  return value;
};

/**
 * @return {string}
 */
ArrayWrapper.prototype.toString = function () {
  return `[${this.nums.join(',')}]`;
};

/**
 * const obj1 = new ArrayWrapper([1,2]);
 * const obj2 = new ArrayWrapper([3,4]);
 * obj1 + obj2; // 10
 * String(obj1); // "[1,2]"
 * String(obj2); // "[3,4]"
 */

class Calculator {
  /**
   * @param {number} value
   */
  constructor(value) {
    this.value = value;
  }

  /**
   * @param {number} value
   * @return {Calculator}
   */
  add(value) {
    this.value += value;
    return this;
  }

  /**
   * @param {number} value
   * @return {Calculator}
   */
  subtract(value) {
    this.value -= value;
    return this;
  }

  /**
   * @param {number} value
   * @return {Calculator}
   */
  multiply(value) {
    this.value *= value;
    return this;
  }

  /**
   * @param {number} value
   * @return {Calculator}
   */
  divide(value) {
    if (value === 0) {
      throw new Error('Division by zero is not allowed');
    }

    this.value = this.value / value;
    return this;
  }

  /**
   * @param {number} value
   * @return {Calculator}
   */
  power(value) {
    this.value = Math.pow(this.value, value);

    return this;
  }

  /**
   * @return {number}
   */
  getResult() {
    return this.value;
  }
}
