interface IIndexable <T> {
  [key: string]: T
}

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
}

type Partial<T> = {
  [P in keyof T]?: T[P];
}

export {
  IIndexable,
  Readonly,
  Partial
}
