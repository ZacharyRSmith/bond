/**
 * @module bond.
 *
 * Like Function.prototype.bind, but funner.
 *
 * @flow
 */
const bond = (fn/*: Function */, ...args/*: mixed[] */) => {
  return function innerBond(...innerArgs/*: mixed[] */) {
    const finalArgs = [];
    const maxLen = Math.max(args.length, innerArgs.length);
    for (let i = 0; i < maxLen; i++) {
      if (innerArgs[i] !== undefined) {
        if (innerArgs[i] instanceof Object) {
          finalArgs[i] = Object.assign(
            args[i] instanceof Object ? args[i] : {},
            innerArgs[i]
          );
        } else {
          finalArgs[i] = innerArgs[i];
        }
        continue;
      }
      finalArgs[i] = args[i];
    }
    return fn.apply(this, finalArgs);
  };
};

module.exports = bond; // eslint-disable-line no-undef
