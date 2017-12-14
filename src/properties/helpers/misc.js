export const getter = name => args => {
  let value;

  args.some(arg => {
    if (arg[name]) {
      value = arg[name];
      return true;
    }

    return false;
  });

  return value;
};

export const returnsBool = fn => args => !!fn(args);
