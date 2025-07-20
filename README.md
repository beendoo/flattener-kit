# Flattener Kit

Flattener Kit is a lightweight and flexible utility to convert deeply nested objects or arrays into flattened structures—and vice versa. It supports a variety of custom configurations and follows an object-oriented design pattern, making it both reusable and extensible.

---

## 🚀 Features

- Flatten nested `Object` and `Array` structures into a single-level object with dot/bracket notation.
- Unflatten a flat object back to its original nested form.
- Replace whole sub-paths instead of flattening (`safes` config).
- Overwrite or merge behavior support during unflattening (`overwrite` config).
- Highly configurable with reusable OOP design.

---

## 📦 Installation

```bash
npm install flattener-kit
# or
yarn add flattener-kit
# or
pnpm add flattener-kit
```

---

## 📘 Usage

### Import the Class

```ts
import { Flattener } from 'flattener-kit';
```

---

### 1. Flatten a Simple Object

```ts
const payload = {
  name: 'John',
  address: {
    city: 'Anytown',
    zip: '12345',
  },
};

const flattener = new Flattener();
const flat = flattener.flatten(payload);

console.log(flat);
```

**Output:**

```js
{
  "name": "John",
  "address.city": "Anytown",
  "address.zip": "12345"
}
```

---

### 2. Flatten with Array Support

```ts
const data = {
  user: {
    name: 'Alice',
    roles: ['admin', 'editor'],
  },
};

const flattener = new Flattener();
const result = flattener.flatten(data);

console.log(result);
```

**Output:**

```js
{
  "user.name": "Alice",
  "user.roles.0": "admin",
  "user.roles.1.": "editor"
}
```

---

### 3. Use `safe` Config to Keep All Array as-is

```ts
const data = {
  user: {
    name: 'Bob',
    tags: ['dev', 'ops'],
    hobbies: ['reading', 'sports'],
  },
};

const flattener = new Flattener({ safe: true });
const result = flattener.flatten(data);

console.log(result);
```

**Output:**

```js
{
  "user.name": "Bob",
  "user.tags": ["dev", "ops"],
  "user.hobbies": ['reading', 'sports']
}
```

---

### 4. Use `safes` Config to Keep Specific Array/Objects as-is

```ts
const data = {
  user: {
    name: 'Bob',
    tags: ['dev', 'ops'],
    hobbies: ['reading', 'sports'],
  },
};

const flattener = new Flattener({ safes: ['user.tags'] });
const result = flattener.flatten(data);

console.log(result);
```

**Output:**

```js
{
  "user.name": "Bob",
  "user.tags": ["dev", "ops"],
  'user.hobbies.0': 'reading',
  'user.hobbies.1': 'sports',
}
```

---

### 5. Use a Custom `delimiter`

By default, the delimiter is `"."`. You can change it to anything, like `"-"` or `"/"`.

```ts
const data = {
  product: {
    id: 101,
    details: {
      name: 'Book',
      price: 15,
    },
  },
};

const flattener = new Flattener({
  delimiter: '/',
});

const result = flattener.flatten(data);

console.log(result);
```

**Output:**

```js
{
  "product/id": 101,
  "product/details/name": "Book",
  "product/details/price": 15
}
```

---

### 6. Use `transformKey` to Customize Key Formatting

You can pass a `transformKey` function to manipulate the flattened keys (e.g., to uppercase, kebab-case, etc.).

```ts
const data = {
  user: {
    name: 'Daisy',
    profile: {
      age: 30,
    },
  },
};

const flattener = new Flattener({
  transformKey: (key) => key.toUpperCase(),
});

const result = flattener.flatten(data);

console.log(result);
```

**Output:**

```js
{
  "USER.NAME": "Daisy",
  "USER.PROFILE.AGE": 30
}
```

---

### 7. Unflatten a Flat Object

```ts
const flat = {
  'user.name': 'Charlie',
  'user.age': 28,
  'user.hobbies.0': 'reading',
  'user.hobbies.1': 'sports',
};

const flattener = new Flattener();
const nested = flattener.unflatten(flat);

console.log(nested);
```

**Output:**

```js
{
  user: {
    name: "Charlie",
    age: 28,
    hobbies: ["reading", "sports"]
  }
}
```

---

### 8. Unflatten with Overwrite Object Config

```ts
const flat = {
  user: { isAdmin: true },
  'user.name': 'David',
};

const flattener = new Flattener({ overwrite: true });
const nested = flattener.unflatten(flat);

console.log(nested);
```

**Output:**

```js
{
  user: {
    name: 'David';
  }
}
```

---

## ⚙️ Configuration

### `flatten(config?: FlattenConfig)`

| Option         | Type                                      | Default     | Description                                                                    |
| -------------- | ----------------------------------------- | ----------- | ------------------------------------------------------------------------------ |
| `delimiter`    | `string`                                  | `"."`       | Character used to join nested keys.                                            |
| `safe`         | `boolean`                                 | `false`     | Prevents flattening arrays entirely.                                           |
| `safes`        | `string[]`                                | `[]`        | Array of specific paths to leave unflattened (dot/bracket notation supported). |
| `depth`        | `number`                                  | `Infinity`  | Maximum recursion depth for flattening.                                        |
| `transformKey` | `(key: string, path: string[]) => string` | `undefined` | Transforms each key during flattening. Useful for casing or formatting.        |

---

### `unflatten(config?: UnflattenConfig)`

| Option         | Type                                      | Default     | Description                                                                |
| -------------- | ----------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| `delimiter`    | `string`                                  | `"."`       | Character used to split keys.                                              |
| `overwrite`    | `boolean`                                 | `false`     | If `true`, existing non-object values will be overwritten during building. |
| `transformKey` | `(key: string, path: string[]) => string` | `undefined` | Transforms each key before assignment. Useful for renaming or formatting.  |

---

## 📘 Type Definitions

```ts
type Payload = Record<string, any> | any[];

type FlattenConfig = {
  delimiter?: string;
  safe?: boolean;
  safes?: string[];
  depth?: number;
};

type UnflattenConfig = {
  delimiter?: string;
  overwrite?: boolean;
  object?: boolean;
};
```

---

## 📁 Exports

```ts
export default Flattener;
```

---

## 📂 Use Cases

- Sending deeply nested data through form submissions or APIs that require flat structures.
- Normalizing data before storing in NoSQL databases or localStorage.
- Creating key-value string maps for localization files (e.g., i18n).
- Flattening complex payloads for logging or debugging purposes.
- Data diffing, patching, or transformation logic.

---

## ✅ Test Coverage

- Passed all unit tests for `flatten` and `unflatten` behavior
- Supports deeply nested structures and edge cases

---

## 🧪 Testing

```bash
pnpm test
```

---

## 🌐 Repository

[https://github.com/beendoo/flattener-kit.git](https://github.com/beendoo/flattener-kit.git)

---

## 📝 License

MIT © [Foysal Ahmed](https://github.com/foysalahmedmin)

<!--
npm version patch   # for 1.0.0 -> 1.0.1
npm version minor   # for 1.0.0 -> 1.1.0
npm version major   # for 1.0.0 -> 2.0.0
-->
