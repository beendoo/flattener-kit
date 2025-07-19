import { Flattener } from '../src';

describe('Flattener.flatten', () => {
  it('should flatten a nested object', () => {
    const input = {
      user: {
        name: 'John',
        age: 30,
        address: {
          city: 'NYC',
          zip: '10001',
        },
      },
    };

    const output = Flattener.flatten(input);

    expect(output).toEqual({
      'user.name': 'John',
      'user.age': 30,
      'user.address.city': 'NYC',
      'user.address.zip': '10001',
    });
  });

  it('should skip flattening specific keys with safes', () => {
    const input = {
      user: {
        name: 'John',
        tags: ['admin', 'dev'],
      },
    };

    const output = Flattener.flatten(input, {
      safes: ['user.tags'],
    });

    expect(output).toEqual({
      'user.name': 'John',
      'user.tags': ['admin', 'dev'],
    });
  });

  it('should preserve arrays if safe is true', () => {
    const input = {
      items: [1, 2, 3],
    };

    const output = Flattener.flatten(input, {
      safe: true,
    });

    expect(output).toEqual({
      items: [1, 2, 3],
    });
  });

  it('should respect depth limit', () => {
    const input = {
      user: {
        name: 'John',
        meta: {
          info: {
            email: 'john@example.com',
          },
        },
      },
    };

    const output = Flattener.flatten(input, {
      depth: 2,
    });

    expect(output).toEqual({
      'user.name': 'John',
      'user.meta': {
        info: {
          email: 'john@example.com',
        },
      },
    });
  });

  it('should use custom delimiter', () => {
    const input = {
      user: {
        name: 'John',
      },
    };

    const output = Flattener.flatten(input, {
      delimiter: '__',
    });

    expect(output).toEqual({
      user__name: 'John',
    });
  });
});

describe('Flattener.unflatten', () => {
  it('should reconstruct nested object', () => {
    const input = {
      'user.name': 'John',
      'user.age': 30,
      'user.address.city': 'NYC',
    };

    const output = Flattener.unflatten(input);

    expect(output).toEqual({
      user: {
        name: 'John',
        age: 30,
        address: {
          city: 'NYC',
        },
      },
    });
  });

  it('should use custom delimiter during unflattening', () => {
    const input = {
      user__name: 'John',
    };

    const output = Flattener.unflatten(input, {
      delimiter: '__',
    });

    expect(output).toEqual({
      user: {
        name: 'John',
      },
    });
  });

  it('should respect overwrite=false (default)', () => {
    const input = {
      'user.name': 'John',
      user: 'flat',
    };

    const output = Flattener.unflatten(input);

    expect(output).toEqual({
      user: 'flat',
    });
  });

  it('should allow overwrite=true', () => {
    const input = {
      user: 'flat',
      'user.name': 'John',
    };

    const output = Flattener.unflatten(input, {
      overwrite: true,
    });

    expect(output).toEqual({
      user: {
        name: 'John',
      },
    });
  });

  it('should transform keys if transformKey is provided', () => {
    const input = {
      'user.name': 'John',
    };

    const output = Flattener.unflatten(input, {
      transformKey: (k) => k.toUpperCase(),
    });

    expect(output).toEqual({
      USER: {
        NAME: 'John',
      },
    });
  });
});
