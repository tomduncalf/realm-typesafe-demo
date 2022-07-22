declare namespace Realm {
  type QueryableString = Pick<string, never> & {
    startsWith: (search: string, caseInsensitive?: boolean) => boolean;
    endsWith: (search: string, caseInsensitive?: boolean) => boolean;
    contains: (search: string, caseInsensitive?: boolean) => boolean;
    like: (s: string, caseInsensitive?: boolean) => boolean;
  };

  type QueryableArray<T> = Queryable<T> & {
    count: () => number;
    avg: (fn: (x: Queryable<T>) => any) => number;
    any: (fn: (x: Queryable<T>) => any) => QueryableArray<T>;
    all: (fn: (x: Queryable<T>) => any) => QueryableArray<T>;
  };

  type Queryable<T> = {
    [P in keyof T]: T[P] extends string
      ? QueryableString
      : T[P] extends Array<any>
      ? QueryableArray<T[P][0]>
      : Queryable<T[P]>;
  };

  interface Collection<T> extends ReadonlyArray<T> {
    filtered: (fn: (x: Queryable<T>) => any, deps?: () => any) => Results<T>;
  }
}
