type Payload = Record<string, any> | any[];

export type FlattenConfig = {
  delimiter?: string;
  safe?: boolean; // whether to keep arrays as-is
  safes?: string[]; // specific keys to skip flattening
  depth?: number;
  transformKey?: (key: string) => string;
};

export type UnflattenConfig = {
  delimiter?: string;
  overwrite?: boolean;
  object?: boolean;
  transformKey?: (key: string) => string;
};

export class Flattener {
  private readonly defaultFlattenConfig: Required<FlattenConfig> = {
    delimiter: '.',
    safe: false,
    safes: [],
    depth: Infinity,
    transformKey: (key: string) => key,
  };

  private readonly defaultUnflattenConfig: Required<UnflattenConfig> = {
    delimiter: '.',
    overwrite: false,
    object: false,
    transformKey: (key: string) => key,
  };

  constructor(private readonly payload: Payload) {}

  flatten(config: FlattenConfig = {}): Record<string, any> {
    const finalConfig = { ...this.defaultFlattenConfig, ...config };
    return Flattener._flatten(this.payload, finalConfig);
  }

  unflatten(config: UnflattenConfig = {}): Record<string, any> {
    const finalConfig = { ...this.defaultUnflattenConfig, ...config };
    return Flattener._unflatten(
      this.payload as Record<string, any>,
      finalConfig,
    );
  }

  static _flatten(
    payload: Payload,
    config: Required<FlattenConfig>,
    prefix = '',
    step = 0,
  ): Record<string, any> {
    const { delimiter, safes, safe, depth, transformKey } = config;
    const result: Record<string, any> = {};

    if (prefix && safes.includes(prefix)) {
      result[transformKey(prefix)] = payload;
      return result;
    }

    if (safe && Array.isArray(payload)) {
      result[transformKey(prefix || 'array')] = payload;
      return result;
    }

    if (depth !== undefined && step >= depth) {
      result[transformKey(prefix || 'root')] = payload;
      return result;
    }

    if (Array.isArray(payload)) {
      payload.forEach((item, index) => {
        const arrayKey = prefix ? `${prefix}${delimiter}${index}` : `${index}`;
        if (typeof item === 'object' && item !== null) {
          Object.assign(
            result,
            Flattener._flatten(item, config, arrayKey, step + 1),
          );
        } else {
          result[transformKey(arrayKey)] = item;
        }
      });
      return result;
    }

    if (typeof payload !== 'object' || payload === null) {
      if (prefix) result[transformKey(prefix)] = payload;
      return result;
    }

    for (const key in payload) {
      if (!Object.prototype.hasOwnProperty.call(payload, key)) continue;
      const value = payload[key];
      const fullKey = prefix ? `${prefix}${delimiter}${key}` : key;

      if (typeof value === 'object' && value !== null) {
        Object.assign(
          result,
          Flattener._flatten(value, config, fullKey, step + 1),
        );
      } else {
        result[transformKey(fullKey)] = value;
      }
    }

    return result;
  }

  static _unflatten(
    flat: Record<string, any>,
    config: Required<UnflattenConfig>,
  ): Record<string, any> {
    const result: Record<string, any> = {};
    const { delimiter, overwrite, object, transformKey } = config;

    // Helper function to safely get numeric key
    const getKey = (key: string): string | number => {
      const parsedKey = Number(key);
      return isNaN(parsedKey) || key.indexOf('.') !== -1 || object
        ? key
        : parsedKey;
    };

    // Helper function to check if value is an object
    const isObject = (value: any): boolean => {
      const type = Object.prototype.toString.call(value);
      return type === '[object Object]' || type === '[object Array]';
    };

    for (const flatKey in flat) {
      const value = flat[flatKey];
      const keys = flatKey.split(delimiter).map(transformKey);
      let current: any = result;

      for (let i = 0; i < keys.length; i++) {
        const key = getKey(keys[i]);
        const isLast = i === keys.length - 1;

        if (isLast) {
          // Final key - assign the value
          if (
            !overwrite &&
            current[key] !== undefined &&
            !isObject(current[key])
          ) {
            // Don't overwrite existing non-object values unless overwrite is true
            continue;
          }
          current[key] = value;
        } else {
          // Intermediate key - ensure path exists
          const nextKey = keys[i + 1];
          const nextIsNumeric = !isNaN(Number(nextKey)) && !object;

          if (current[key] === undefined || current[key] === null) {
            // Create new container
            current[key] = nextIsNumeric ? [] : {};
          } else if (!isObject(current[key])) {
            // Existing non-object value
            if (overwrite) {
              current[key] = nextIsNumeric ? [] : {};
            } else {
              // Can't continue down this path without overwriting
              break;
            }
          }
          // If it's already an object/array, continue using it

          current = current[key];
        }
      }
    }

    return result;
  }

  // Optional utility methods
  static flatten(
    payload: Payload,
    config?: FlattenConfig,
  ): Record<string, any> {
    return new Flattener(payload).flatten(config);
  }

  static unflatten(
    flat: Record<string, any>,
    config?: UnflattenConfig,
  ): Record<string, any> {
    return new Flattener(flat).unflatten(config);
  }
}

export default Flattener;
