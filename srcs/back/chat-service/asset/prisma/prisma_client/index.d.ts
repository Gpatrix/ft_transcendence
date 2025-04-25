
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model msg
 * 
 */
export type msg = $Result.DefaultSelection<Prisma.$msgPayload>
/**
 * Model channel
 * 
 */
export type channel = $Result.DefaultSelection<Prisma.$channelPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Msgs
 * const msgs = await prisma.msg.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Msgs
   * const msgs = await prisma.msg.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.msg`: Exposes CRUD operations for the **msg** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Msgs
    * const msgs = await prisma.msg.findMany()
    * ```
    */
  get msg(): Prisma.msgDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.channel`: Exposes CRUD operations for the **channel** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Channels
    * const channels = await prisma.channel.findMany()
    * ```
    */
  get channel(): Prisma.channelDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    msg: 'msg',
    channel: 'channel'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "msg" | "channel"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      msg: {
        payload: Prisma.$msgPayload<ExtArgs>
        fields: Prisma.msgFieldRefs
        operations: {
          findUnique: {
            args: Prisma.msgFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$msgPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.msgFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$msgPayload>
          }
          findFirst: {
            args: Prisma.msgFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$msgPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.msgFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$msgPayload>
          }
          findMany: {
            args: Prisma.msgFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$msgPayload>[]
          }
          create: {
            args: Prisma.msgCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$msgPayload>
          }
          createMany: {
            args: Prisma.msgCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.msgCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$msgPayload>[]
          }
          delete: {
            args: Prisma.msgDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$msgPayload>
          }
          update: {
            args: Prisma.msgUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$msgPayload>
          }
          deleteMany: {
            args: Prisma.msgDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.msgUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.msgUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$msgPayload>[]
          }
          upsert: {
            args: Prisma.msgUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$msgPayload>
          }
          aggregate: {
            args: Prisma.MsgAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMsg>
          }
          groupBy: {
            args: Prisma.msgGroupByArgs<ExtArgs>
            result: $Utils.Optional<MsgGroupByOutputType>[]
          }
          count: {
            args: Prisma.msgCountArgs<ExtArgs>
            result: $Utils.Optional<MsgCountAggregateOutputType> | number
          }
        }
      }
      channel: {
        payload: Prisma.$channelPayload<ExtArgs>
        fields: Prisma.channelFieldRefs
        operations: {
          findUnique: {
            args: Prisma.channelFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channelPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.channelFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channelPayload>
          }
          findFirst: {
            args: Prisma.channelFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channelPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.channelFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channelPayload>
          }
          findMany: {
            args: Prisma.channelFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channelPayload>[]
          }
          create: {
            args: Prisma.channelCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channelPayload>
          }
          createMany: {
            args: Prisma.channelCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.channelCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channelPayload>[]
          }
          delete: {
            args: Prisma.channelDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channelPayload>
          }
          update: {
            args: Prisma.channelUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channelPayload>
          }
          deleteMany: {
            args: Prisma.channelDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.channelUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.channelUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channelPayload>[]
          }
          upsert: {
            args: Prisma.channelUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$channelPayload>
          }
          aggregate: {
            args: Prisma.ChannelAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChannel>
          }
          groupBy: {
            args: Prisma.channelGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChannelGroupByOutputType>[]
          }
          count: {
            args: Prisma.channelCountArgs<ExtArgs>
            result: $Utils.Optional<ChannelCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    msg?: msgOmit
    channel?: channelOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model msg
   */

  export type AggregateMsg = {
    _count: MsgCountAggregateOutputType | null
    _avg: MsgAvgAggregateOutputType | null
    _sum: MsgSumAggregateOutputType | null
    _min: MsgMinAggregateOutputType | null
    _max: MsgMaxAggregateOutputType | null
  }

  export type MsgAvgAggregateOutputType = {
    id: number | null
    userID: number | null
    channel: number | null
  }

  export type MsgSumAggregateOutputType = {
    id: number | null
    userID: number | null
    channel: number | null
  }

  export type MsgMinAggregateOutputType = {
    id: number | null
    userID: number | null
    channel: number | null
    create_time: Date | null
    text: string | null
  }

  export type MsgMaxAggregateOutputType = {
    id: number | null
    userID: number | null
    channel: number | null
    create_time: Date | null
    text: string | null
  }

  export type MsgCountAggregateOutputType = {
    id: number
    userID: number
    channel: number
    create_time: number
    text: number
    _all: number
  }


  export type MsgAvgAggregateInputType = {
    id?: true
    userID?: true
    channel?: true
  }

  export type MsgSumAggregateInputType = {
    id?: true
    userID?: true
    channel?: true
  }

  export type MsgMinAggregateInputType = {
    id?: true
    userID?: true
    channel?: true
    create_time?: true
    text?: true
  }

  export type MsgMaxAggregateInputType = {
    id?: true
    userID?: true
    channel?: true
    create_time?: true
    text?: true
  }

  export type MsgCountAggregateInputType = {
    id?: true
    userID?: true
    channel?: true
    create_time?: true
    text?: true
    _all?: true
  }

  export type MsgAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which msg to aggregate.
     */
    where?: msgWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of msgs to fetch.
     */
    orderBy?: msgOrderByWithRelationInput | msgOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: msgWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` msgs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` msgs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned msgs
    **/
    _count?: true | MsgCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MsgAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MsgSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MsgMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MsgMaxAggregateInputType
  }

  export type GetMsgAggregateType<T extends MsgAggregateArgs> = {
        [P in keyof T & keyof AggregateMsg]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMsg[P]>
      : GetScalarType<T[P], AggregateMsg[P]>
  }




  export type msgGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: msgWhereInput
    orderBy?: msgOrderByWithAggregationInput | msgOrderByWithAggregationInput[]
    by: MsgScalarFieldEnum[] | MsgScalarFieldEnum
    having?: msgScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MsgCountAggregateInputType | true
    _avg?: MsgAvgAggregateInputType
    _sum?: MsgSumAggregateInputType
    _min?: MsgMinAggregateInputType
    _max?: MsgMaxAggregateInputType
  }

  export type MsgGroupByOutputType = {
    id: number
    userID: number
    channel: number
    create_time: Date
    text: string
    _count: MsgCountAggregateOutputType | null
    _avg: MsgAvgAggregateOutputType | null
    _sum: MsgSumAggregateOutputType | null
    _min: MsgMinAggregateOutputType | null
    _max: MsgMaxAggregateOutputType | null
  }

  type GetMsgGroupByPayload<T extends msgGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MsgGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MsgGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MsgGroupByOutputType[P]>
            : GetScalarType<T[P], MsgGroupByOutputType[P]>
        }
      >
    >


  export type msgSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    channel?: boolean
    create_time?: boolean
    text?: boolean
  }, ExtArgs["result"]["msg"]>

  export type msgSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    channel?: boolean
    create_time?: boolean
    text?: boolean
  }, ExtArgs["result"]["msg"]>

  export type msgSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userID?: boolean
    channel?: boolean
    create_time?: boolean
    text?: boolean
  }, ExtArgs["result"]["msg"]>

  export type msgSelectScalar = {
    id?: boolean
    userID?: boolean
    channel?: boolean
    create_time?: boolean
    text?: boolean
  }

  export type msgOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userID" | "channel" | "create_time" | "text", ExtArgs["result"]["msg"]>

  export type $msgPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "msg"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userID: number
      channel: number
      create_time: Date
      text: string
    }, ExtArgs["result"]["msg"]>
    composites: {}
  }

  type msgGetPayload<S extends boolean | null | undefined | msgDefaultArgs> = $Result.GetResult<Prisma.$msgPayload, S>

  type msgCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<msgFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MsgCountAggregateInputType | true
    }

  export interface msgDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['msg'], meta: { name: 'msg' } }
    /**
     * Find zero or one Msg that matches the filter.
     * @param {msgFindUniqueArgs} args - Arguments to find a Msg
     * @example
     * // Get one Msg
     * const msg = await prisma.msg.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends msgFindUniqueArgs>(args: SelectSubset<T, msgFindUniqueArgs<ExtArgs>>): Prisma__msgClient<$Result.GetResult<Prisma.$msgPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Msg that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {msgFindUniqueOrThrowArgs} args - Arguments to find a Msg
     * @example
     * // Get one Msg
     * const msg = await prisma.msg.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends msgFindUniqueOrThrowArgs>(args: SelectSubset<T, msgFindUniqueOrThrowArgs<ExtArgs>>): Prisma__msgClient<$Result.GetResult<Prisma.$msgPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Msg that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {msgFindFirstArgs} args - Arguments to find a Msg
     * @example
     * // Get one Msg
     * const msg = await prisma.msg.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends msgFindFirstArgs>(args?: SelectSubset<T, msgFindFirstArgs<ExtArgs>>): Prisma__msgClient<$Result.GetResult<Prisma.$msgPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Msg that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {msgFindFirstOrThrowArgs} args - Arguments to find a Msg
     * @example
     * // Get one Msg
     * const msg = await prisma.msg.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends msgFindFirstOrThrowArgs>(args?: SelectSubset<T, msgFindFirstOrThrowArgs<ExtArgs>>): Prisma__msgClient<$Result.GetResult<Prisma.$msgPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Msgs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {msgFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Msgs
     * const msgs = await prisma.msg.findMany()
     * 
     * // Get first 10 Msgs
     * const msgs = await prisma.msg.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const msgWithIdOnly = await prisma.msg.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends msgFindManyArgs>(args?: SelectSubset<T, msgFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$msgPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Msg.
     * @param {msgCreateArgs} args - Arguments to create a Msg.
     * @example
     * // Create one Msg
     * const Msg = await prisma.msg.create({
     *   data: {
     *     // ... data to create a Msg
     *   }
     * })
     * 
     */
    create<T extends msgCreateArgs>(args: SelectSubset<T, msgCreateArgs<ExtArgs>>): Prisma__msgClient<$Result.GetResult<Prisma.$msgPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Msgs.
     * @param {msgCreateManyArgs} args - Arguments to create many Msgs.
     * @example
     * // Create many Msgs
     * const msg = await prisma.msg.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends msgCreateManyArgs>(args?: SelectSubset<T, msgCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Msgs and returns the data saved in the database.
     * @param {msgCreateManyAndReturnArgs} args - Arguments to create many Msgs.
     * @example
     * // Create many Msgs
     * const msg = await prisma.msg.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Msgs and only return the `id`
     * const msgWithIdOnly = await prisma.msg.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends msgCreateManyAndReturnArgs>(args?: SelectSubset<T, msgCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$msgPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Msg.
     * @param {msgDeleteArgs} args - Arguments to delete one Msg.
     * @example
     * // Delete one Msg
     * const Msg = await prisma.msg.delete({
     *   where: {
     *     // ... filter to delete one Msg
     *   }
     * })
     * 
     */
    delete<T extends msgDeleteArgs>(args: SelectSubset<T, msgDeleteArgs<ExtArgs>>): Prisma__msgClient<$Result.GetResult<Prisma.$msgPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Msg.
     * @param {msgUpdateArgs} args - Arguments to update one Msg.
     * @example
     * // Update one Msg
     * const msg = await prisma.msg.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends msgUpdateArgs>(args: SelectSubset<T, msgUpdateArgs<ExtArgs>>): Prisma__msgClient<$Result.GetResult<Prisma.$msgPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Msgs.
     * @param {msgDeleteManyArgs} args - Arguments to filter Msgs to delete.
     * @example
     * // Delete a few Msgs
     * const { count } = await prisma.msg.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends msgDeleteManyArgs>(args?: SelectSubset<T, msgDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Msgs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {msgUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Msgs
     * const msg = await prisma.msg.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends msgUpdateManyArgs>(args: SelectSubset<T, msgUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Msgs and returns the data updated in the database.
     * @param {msgUpdateManyAndReturnArgs} args - Arguments to update many Msgs.
     * @example
     * // Update many Msgs
     * const msg = await prisma.msg.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Msgs and only return the `id`
     * const msgWithIdOnly = await prisma.msg.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends msgUpdateManyAndReturnArgs>(args: SelectSubset<T, msgUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$msgPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Msg.
     * @param {msgUpsertArgs} args - Arguments to update or create a Msg.
     * @example
     * // Update or create a Msg
     * const msg = await prisma.msg.upsert({
     *   create: {
     *     // ... data to create a Msg
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Msg we want to update
     *   }
     * })
     */
    upsert<T extends msgUpsertArgs>(args: SelectSubset<T, msgUpsertArgs<ExtArgs>>): Prisma__msgClient<$Result.GetResult<Prisma.$msgPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Msgs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {msgCountArgs} args - Arguments to filter Msgs to count.
     * @example
     * // Count the number of Msgs
     * const count = await prisma.msg.count({
     *   where: {
     *     // ... the filter for the Msgs we want to count
     *   }
     * })
    **/
    count<T extends msgCountArgs>(
      args?: Subset<T, msgCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MsgCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Msg.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MsgAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MsgAggregateArgs>(args: Subset<T, MsgAggregateArgs>): Prisma.PrismaPromise<GetMsgAggregateType<T>>

    /**
     * Group by Msg.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {msgGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends msgGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: msgGroupByArgs['orderBy'] }
        : { orderBy?: msgGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, msgGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMsgGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the msg model
   */
  readonly fields: msgFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for msg.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__msgClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the msg model
   */
  interface msgFieldRefs {
    readonly id: FieldRef<"msg", 'Int'>
    readonly userID: FieldRef<"msg", 'Int'>
    readonly channel: FieldRef<"msg", 'Int'>
    readonly create_time: FieldRef<"msg", 'DateTime'>
    readonly text: FieldRef<"msg", 'String'>
  }
    

  // Custom InputTypes
  /**
   * msg findUnique
   */
  export type msgFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the msg
     */
    select?: msgSelect<ExtArgs> | null
    /**
     * Omit specific fields from the msg
     */
    omit?: msgOmit<ExtArgs> | null
    /**
     * Filter, which msg to fetch.
     */
    where: msgWhereUniqueInput
  }

  /**
   * msg findUniqueOrThrow
   */
  export type msgFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the msg
     */
    select?: msgSelect<ExtArgs> | null
    /**
     * Omit specific fields from the msg
     */
    omit?: msgOmit<ExtArgs> | null
    /**
     * Filter, which msg to fetch.
     */
    where: msgWhereUniqueInput
  }

  /**
   * msg findFirst
   */
  export type msgFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the msg
     */
    select?: msgSelect<ExtArgs> | null
    /**
     * Omit specific fields from the msg
     */
    omit?: msgOmit<ExtArgs> | null
    /**
     * Filter, which msg to fetch.
     */
    where?: msgWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of msgs to fetch.
     */
    orderBy?: msgOrderByWithRelationInput | msgOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for msgs.
     */
    cursor?: msgWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` msgs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` msgs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of msgs.
     */
    distinct?: MsgScalarFieldEnum | MsgScalarFieldEnum[]
  }

  /**
   * msg findFirstOrThrow
   */
  export type msgFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the msg
     */
    select?: msgSelect<ExtArgs> | null
    /**
     * Omit specific fields from the msg
     */
    omit?: msgOmit<ExtArgs> | null
    /**
     * Filter, which msg to fetch.
     */
    where?: msgWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of msgs to fetch.
     */
    orderBy?: msgOrderByWithRelationInput | msgOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for msgs.
     */
    cursor?: msgWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` msgs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` msgs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of msgs.
     */
    distinct?: MsgScalarFieldEnum | MsgScalarFieldEnum[]
  }

  /**
   * msg findMany
   */
  export type msgFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the msg
     */
    select?: msgSelect<ExtArgs> | null
    /**
     * Omit specific fields from the msg
     */
    omit?: msgOmit<ExtArgs> | null
    /**
     * Filter, which msgs to fetch.
     */
    where?: msgWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of msgs to fetch.
     */
    orderBy?: msgOrderByWithRelationInput | msgOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing msgs.
     */
    cursor?: msgWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` msgs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` msgs.
     */
    skip?: number
    distinct?: MsgScalarFieldEnum | MsgScalarFieldEnum[]
  }

  /**
   * msg create
   */
  export type msgCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the msg
     */
    select?: msgSelect<ExtArgs> | null
    /**
     * Omit specific fields from the msg
     */
    omit?: msgOmit<ExtArgs> | null
    /**
     * The data needed to create a msg.
     */
    data: XOR<msgCreateInput, msgUncheckedCreateInput>
  }

  /**
   * msg createMany
   */
  export type msgCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many msgs.
     */
    data: msgCreateManyInput | msgCreateManyInput[]
  }

  /**
   * msg createManyAndReturn
   */
  export type msgCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the msg
     */
    select?: msgSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the msg
     */
    omit?: msgOmit<ExtArgs> | null
    /**
     * The data used to create many msgs.
     */
    data: msgCreateManyInput | msgCreateManyInput[]
  }

  /**
   * msg update
   */
  export type msgUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the msg
     */
    select?: msgSelect<ExtArgs> | null
    /**
     * Omit specific fields from the msg
     */
    omit?: msgOmit<ExtArgs> | null
    /**
     * The data needed to update a msg.
     */
    data: XOR<msgUpdateInput, msgUncheckedUpdateInput>
    /**
     * Choose, which msg to update.
     */
    where: msgWhereUniqueInput
  }

  /**
   * msg updateMany
   */
  export type msgUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update msgs.
     */
    data: XOR<msgUpdateManyMutationInput, msgUncheckedUpdateManyInput>
    /**
     * Filter which msgs to update
     */
    where?: msgWhereInput
    /**
     * Limit how many msgs to update.
     */
    limit?: number
  }

  /**
   * msg updateManyAndReturn
   */
  export type msgUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the msg
     */
    select?: msgSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the msg
     */
    omit?: msgOmit<ExtArgs> | null
    /**
     * The data used to update msgs.
     */
    data: XOR<msgUpdateManyMutationInput, msgUncheckedUpdateManyInput>
    /**
     * Filter which msgs to update
     */
    where?: msgWhereInput
    /**
     * Limit how many msgs to update.
     */
    limit?: number
  }

  /**
   * msg upsert
   */
  export type msgUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the msg
     */
    select?: msgSelect<ExtArgs> | null
    /**
     * Omit specific fields from the msg
     */
    omit?: msgOmit<ExtArgs> | null
    /**
     * The filter to search for the msg to update in case it exists.
     */
    where: msgWhereUniqueInput
    /**
     * In case the msg found by the `where` argument doesn't exist, create a new msg with this data.
     */
    create: XOR<msgCreateInput, msgUncheckedCreateInput>
    /**
     * In case the msg was found with the provided `where` argument, update it with this data.
     */
    update: XOR<msgUpdateInput, msgUncheckedUpdateInput>
  }

  /**
   * msg delete
   */
  export type msgDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the msg
     */
    select?: msgSelect<ExtArgs> | null
    /**
     * Omit specific fields from the msg
     */
    omit?: msgOmit<ExtArgs> | null
    /**
     * Filter which msg to delete.
     */
    where: msgWhereUniqueInput
  }

  /**
   * msg deleteMany
   */
  export type msgDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which msgs to delete
     */
    where?: msgWhereInput
    /**
     * Limit how many msgs to delete.
     */
    limit?: number
  }

  /**
   * msg without action
   */
  export type msgDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the msg
     */
    select?: msgSelect<ExtArgs> | null
    /**
     * Omit specific fields from the msg
     */
    omit?: msgOmit<ExtArgs> | null
  }


  /**
   * Model channel
   */

  export type AggregateChannel = {
    _count: ChannelCountAggregateOutputType | null
    _avg: ChannelAvgAggregateOutputType | null
    _sum: ChannelSumAggregateOutputType | null
    _min: ChannelMinAggregateOutputType | null
    _max: ChannelMaxAggregateOutputType | null
  }

  export type ChannelAvgAggregateOutputType = {
    id: number | null
  }

  export type ChannelSumAggregateOutputType = {
    id: number | null
  }

  export type ChannelMinAggregateOutputType = {
    id: number | null
    hash: string | null
  }

  export type ChannelMaxAggregateOutputType = {
    id: number | null
    hash: string | null
  }

  export type ChannelCountAggregateOutputType = {
    id: number
    hash: number
    _all: number
  }


  export type ChannelAvgAggregateInputType = {
    id?: true
  }

  export type ChannelSumAggregateInputType = {
    id?: true
  }

  export type ChannelMinAggregateInputType = {
    id?: true
    hash?: true
  }

  export type ChannelMaxAggregateInputType = {
    id?: true
    hash?: true
  }

  export type ChannelCountAggregateInputType = {
    id?: true
    hash?: true
    _all?: true
  }

  export type ChannelAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which channel to aggregate.
     */
    where?: channelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of channels to fetch.
     */
    orderBy?: channelOrderByWithRelationInput | channelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: channelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` channels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` channels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned channels
    **/
    _count?: true | ChannelCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ChannelAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ChannelSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChannelMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChannelMaxAggregateInputType
  }

  export type GetChannelAggregateType<T extends ChannelAggregateArgs> = {
        [P in keyof T & keyof AggregateChannel]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChannel[P]>
      : GetScalarType<T[P], AggregateChannel[P]>
  }




  export type channelGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: channelWhereInput
    orderBy?: channelOrderByWithAggregationInput | channelOrderByWithAggregationInput[]
    by: ChannelScalarFieldEnum[] | ChannelScalarFieldEnum
    having?: channelScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChannelCountAggregateInputType | true
    _avg?: ChannelAvgAggregateInputType
    _sum?: ChannelSumAggregateInputType
    _min?: ChannelMinAggregateInputType
    _max?: ChannelMaxAggregateInputType
  }

  export type ChannelGroupByOutputType = {
    id: number
    hash: string
    _count: ChannelCountAggregateOutputType | null
    _avg: ChannelAvgAggregateOutputType | null
    _sum: ChannelSumAggregateOutputType | null
    _min: ChannelMinAggregateOutputType | null
    _max: ChannelMaxAggregateOutputType | null
  }

  type GetChannelGroupByPayload<T extends channelGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChannelGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChannelGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChannelGroupByOutputType[P]>
            : GetScalarType<T[P], ChannelGroupByOutputType[P]>
        }
      >
    >


  export type channelSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hash?: boolean
  }, ExtArgs["result"]["channel"]>

  export type channelSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hash?: boolean
  }, ExtArgs["result"]["channel"]>

  export type channelSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    hash?: boolean
  }, ExtArgs["result"]["channel"]>

  export type channelSelectScalar = {
    id?: boolean
    hash?: boolean
  }

  export type channelOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "hash", ExtArgs["result"]["channel"]>

  export type $channelPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "channel"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      hash: string
    }, ExtArgs["result"]["channel"]>
    composites: {}
  }

  type channelGetPayload<S extends boolean | null | undefined | channelDefaultArgs> = $Result.GetResult<Prisma.$channelPayload, S>

  type channelCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<channelFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChannelCountAggregateInputType | true
    }

  export interface channelDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['channel'], meta: { name: 'channel' } }
    /**
     * Find zero or one Channel that matches the filter.
     * @param {channelFindUniqueArgs} args - Arguments to find a Channel
     * @example
     * // Get one Channel
     * const channel = await prisma.channel.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends channelFindUniqueArgs>(args: SelectSubset<T, channelFindUniqueArgs<ExtArgs>>): Prisma__channelClient<$Result.GetResult<Prisma.$channelPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Channel that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {channelFindUniqueOrThrowArgs} args - Arguments to find a Channel
     * @example
     * // Get one Channel
     * const channel = await prisma.channel.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends channelFindUniqueOrThrowArgs>(args: SelectSubset<T, channelFindUniqueOrThrowArgs<ExtArgs>>): Prisma__channelClient<$Result.GetResult<Prisma.$channelPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Channel that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channelFindFirstArgs} args - Arguments to find a Channel
     * @example
     * // Get one Channel
     * const channel = await prisma.channel.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends channelFindFirstArgs>(args?: SelectSubset<T, channelFindFirstArgs<ExtArgs>>): Prisma__channelClient<$Result.GetResult<Prisma.$channelPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Channel that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channelFindFirstOrThrowArgs} args - Arguments to find a Channel
     * @example
     * // Get one Channel
     * const channel = await prisma.channel.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends channelFindFirstOrThrowArgs>(args?: SelectSubset<T, channelFindFirstOrThrowArgs<ExtArgs>>): Prisma__channelClient<$Result.GetResult<Prisma.$channelPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Channels that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channelFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Channels
     * const channels = await prisma.channel.findMany()
     * 
     * // Get first 10 Channels
     * const channels = await prisma.channel.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const channelWithIdOnly = await prisma.channel.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends channelFindManyArgs>(args?: SelectSubset<T, channelFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$channelPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Channel.
     * @param {channelCreateArgs} args - Arguments to create a Channel.
     * @example
     * // Create one Channel
     * const Channel = await prisma.channel.create({
     *   data: {
     *     // ... data to create a Channel
     *   }
     * })
     * 
     */
    create<T extends channelCreateArgs>(args: SelectSubset<T, channelCreateArgs<ExtArgs>>): Prisma__channelClient<$Result.GetResult<Prisma.$channelPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Channels.
     * @param {channelCreateManyArgs} args - Arguments to create many Channels.
     * @example
     * // Create many Channels
     * const channel = await prisma.channel.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends channelCreateManyArgs>(args?: SelectSubset<T, channelCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Channels and returns the data saved in the database.
     * @param {channelCreateManyAndReturnArgs} args - Arguments to create many Channels.
     * @example
     * // Create many Channels
     * const channel = await prisma.channel.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Channels and only return the `id`
     * const channelWithIdOnly = await prisma.channel.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends channelCreateManyAndReturnArgs>(args?: SelectSubset<T, channelCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$channelPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Channel.
     * @param {channelDeleteArgs} args - Arguments to delete one Channel.
     * @example
     * // Delete one Channel
     * const Channel = await prisma.channel.delete({
     *   where: {
     *     // ... filter to delete one Channel
     *   }
     * })
     * 
     */
    delete<T extends channelDeleteArgs>(args: SelectSubset<T, channelDeleteArgs<ExtArgs>>): Prisma__channelClient<$Result.GetResult<Prisma.$channelPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Channel.
     * @param {channelUpdateArgs} args - Arguments to update one Channel.
     * @example
     * // Update one Channel
     * const channel = await prisma.channel.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends channelUpdateArgs>(args: SelectSubset<T, channelUpdateArgs<ExtArgs>>): Prisma__channelClient<$Result.GetResult<Prisma.$channelPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Channels.
     * @param {channelDeleteManyArgs} args - Arguments to filter Channels to delete.
     * @example
     * // Delete a few Channels
     * const { count } = await prisma.channel.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends channelDeleteManyArgs>(args?: SelectSubset<T, channelDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Channels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channelUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Channels
     * const channel = await prisma.channel.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends channelUpdateManyArgs>(args: SelectSubset<T, channelUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Channels and returns the data updated in the database.
     * @param {channelUpdateManyAndReturnArgs} args - Arguments to update many Channels.
     * @example
     * // Update many Channels
     * const channel = await prisma.channel.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Channels and only return the `id`
     * const channelWithIdOnly = await prisma.channel.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends channelUpdateManyAndReturnArgs>(args: SelectSubset<T, channelUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$channelPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Channel.
     * @param {channelUpsertArgs} args - Arguments to update or create a Channel.
     * @example
     * // Update or create a Channel
     * const channel = await prisma.channel.upsert({
     *   create: {
     *     // ... data to create a Channel
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Channel we want to update
     *   }
     * })
     */
    upsert<T extends channelUpsertArgs>(args: SelectSubset<T, channelUpsertArgs<ExtArgs>>): Prisma__channelClient<$Result.GetResult<Prisma.$channelPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Channels.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channelCountArgs} args - Arguments to filter Channels to count.
     * @example
     * // Count the number of Channels
     * const count = await prisma.channel.count({
     *   where: {
     *     // ... the filter for the Channels we want to count
     *   }
     * })
    **/
    count<T extends channelCountArgs>(
      args?: Subset<T, channelCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChannelCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Channel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChannelAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChannelAggregateArgs>(args: Subset<T, ChannelAggregateArgs>): Prisma.PrismaPromise<GetChannelAggregateType<T>>

    /**
     * Group by Channel.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {channelGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends channelGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: channelGroupByArgs['orderBy'] }
        : { orderBy?: channelGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, channelGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChannelGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the channel model
   */
  readonly fields: channelFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for channel.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__channelClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the channel model
   */
  interface channelFieldRefs {
    readonly id: FieldRef<"channel", 'Int'>
    readonly hash: FieldRef<"channel", 'String'>
  }
    

  // Custom InputTypes
  /**
   * channel findUnique
   */
  export type channelFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel
     */
    select?: channelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel
     */
    omit?: channelOmit<ExtArgs> | null
    /**
     * Filter, which channel to fetch.
     */
    where: channelWhereUniqueInput
  }

  /**
   * channel findUniqueOrThrow
   */
  export type channelFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel
     */
    select?: channelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel
     */
    omit?: channelOmit<ExtArgs> | null
    /**
     * Filter, which channel to fetch.
     */
    where: channelWhereUniqueInput
  }

  /**
   * channel findFirst
   */
  export type channelFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel
     */
    select?: channelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel
     */
    omit?: channelOmit<ExtArgs> | null
    /**
     * Filter, which channel to fetch.
     */
    where?: channelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of channels to fetch.
     */
    orderBy?: channelOrderByWithRelationInput | channelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for channels.
     */
    cursor?: channelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` channels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` channels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of channels.
     */
    distinct?: ChannelScalarFieldEnum | ChannelScalarFieldEnum[]
  }

  /**
   * channel findFirstOrThrow
   */
  export type channelFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel
     */
    select?: channelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel
     */
    omit?: channelOmit<ExtArgs> | null
    /**
     * Filter, which channel to fetch.
     */
    where?: channelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of channels to fetch.
     */
    orderBy?: channelOrderByWithRelationInput | channelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for channels.
     */
    cursor?: channelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` channels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` channels.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of channels.
     */
    distinct?: ChannelScalarFieldEnum | ChannelScalarFieldEnum[]
  }

  /**
   * channel findMany
   */
  export type channelFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel
     */
    select?: channelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel
     */
    omit?: channelOmit<ExtArgs> | null
    /**
     * Filter, which channels to fetch.
     */
    where?: channelWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of channels to fetch.
     */
    orderBy?: channelOrderByWithRelationInput | channelOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing channels.
     */
    cursor?: channelWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` channels from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` channels.
     */
    skip?: number
    distinct?: ChannelScalarFieldEnum | ChannelScalarFieldEnum[]
  }

  /**
   * channel create
   */
  export type channelCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel
     */
    select?: channelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel
     */
    omit?: channelOmit<ExtArgs> | null
    /**
     * The data needed to create a channel.
     */
    data: XOR<channelCreateInput, channelUncheckedCreateInput>
  }

  /**
   * channel createMany
   */
  export type channelCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many channels.
     */
    data: channelCreateManyInput | channelCreateManyInput[]
  }

  /**
   * channel createManyAndReturn
   */
  export type channelCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel
     */
    select?: channelSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the channel
     */
    omit?: channelOmit<ExtArgs> | null
    /**
     * The data used to create many channels.
     */
    data: channelCreateManyInput | channelCreateManyInput[]
  }

  /**
   * channel update
   */
  export type channelUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel
     */
    select?: channelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel
     */
    omit?: channelOmit<ExtArgs> | null
    /**
     * The data needed to update a channel.
     */
    data: XOR<channelUpdateInput, channelUncheckedUpdateInput>
    /**
     * Choose, which channel to update.
     */
    where: channelWhereUniqueInput
  }

  /**
   * channel updateMany
   */
  export type channelUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update channels.
     */
    data: XOR<channelUpdateManyMutationInput, channelUncheckedUpdateManyInput>
    /**
     * Filter which channels to update
     */
    where?: channelWhereInput
    /**
     * Limit how many channels to update.
     */
    limit?: number
  }

  /**
   * channel updateManyAndReturn
   */
  export type channelUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel
     */
    select?: channelSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the channel
     */
    omit?: channelOmit<ExtArgs> | null
    /**
     * The data used to update channels.
     */
    data: XOR<channelUpdateManyMutationInput, channelUncheckedUpdateManyInput>
    /**
     * Filter which channels to update
     */
    where?: channelWhereInput
    /**
     * Limit how many channels to update.
     */
    limit?: number
  }

  /**
   * channel upsert
   */
  export type channelUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel
     */
    select?: channelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel
     */
    omit?: channelOmit<ExtArgs> | null
    /**
     * The filter to search for the channel to update in case it exists.
     */
    where: channelWhereUniqueInput
    /**
     * In case the channel found by the `where` argument doesn't exist, create a new channel with this data.
     */
    create: XOR<channelCreateInput, channelUncheckedCreateInput>
    /**
     * In case the channel was found with the provided `where` argument, update it with this data.
     */
    update: XOR<channelUpdateInput, channelUncheckedUpdateInput>
  }

  /**
   * channel delete
   */
  export type channelDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel
     */
    select?: channelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel
     */
    omit?: channelOmit<ExtArgs> | null
    /**
     * Filter which channel to delete.
     */
    where: channelWhereUniqueInput
  }

  /**
   * channel deleteMany
   */
  export type channelDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which channels to delete
     */
    where?: channelWhereInput
    /**
     * Limit how many channels to delete.
     */
    limit?: number
  }

  /**
   * channel without action
   */
  export type channelDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the channel
     */
    select?: channelSelect<ExtArgs> | null
    /**
     * Omit specific fields from the channel
     */
    omit?: channelOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const MsgScalarFieldEnum: {
    id: 'id',
    userID: 'userID',
    channel: 'channel',
    create_time: 'create_time',
    text: 'text'
  };

  export type MsgScalarFieldEnum = (typeof MsgScalarFieldEnum)[keyof typeof MsgScalarFieldEnum]


  export const ChannelScalarFieldEnum: {
    id: 'id',
    hash: 'hash'
  };

  export type ChannelScalarFieldEnum = (typeof ChannelScalarFieldEnum)[keyof typeof ChannelScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type msgWhereInput = {
    AND?: msgWhereInput | msgWhereInput[]
    OR?: msgWhereInput[]
    NOT?: msgWhereInput | msgWhereInput[]
    id?: IntFilter<"msg"> | number
    userID?: IntFilter<"msg"> | number
    channel?: IntFilter<"msg"> | number
    create_time?: DateTimeFilter<"msg"> | Date | string
    text?: StringFilter<"msg"> | string
  }

  export type msgOrderByWithRelationInput = {
    id?: SortOrder
    userID?: SortOrder
    channel?: SortOrder
    create_time?: SortOrder
    text?: SortOrder
  }

  export type msgWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: msgWhereInput | msgWhereInput[]
    OR?: msgWhereInput[]
    NOT?: msgWhereInput | msgWhereInput[]
    userID?: IntFilter<"msg"> | number
    channel?: IntFilter<"msg"> | number
    create_time?: DateTimeFilter<"msg"> | Date | string
    text?: StringFilter<"msg"> | string
  }, "id" | "id">

  export type msgOrderByWithAggregationInput = {
    id?: SortOrder
    userID?: SortOrder
    channel?: SortOrder
    create_time?: SortOrder
    text?: SortOrder
    _count?: msgCountOrderByAggregateInput
    _avg?: msgAvgOrderByAggregateInput
    _max?: msgMaxOrderByAggregateInput
    _min?: msgMinOrderByAggregateInput
    _sum?: msgSumOrderByAggregateInput
  }

  export type msgScalarWhereWithAggregatesInput = {
    AND?: msgScalarWhereWithAggregatesInput | msgScalarWhereWithAggregatesInput[]
    OR?: msgScalarWhereWithAggregatesInput[]
    NOT?: msgScalarWhereWithAggregatesInput | msgScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"msg"> | number
    userID?: IntWithAggregatesFilter<"msg"> | number
    channel?: IntWithAggregatesFilter<"msg"> | number
    create_time?: DateTimeWithAggregatesFilter<"msg"> | Date | string
    text?: StringWithAggregatesFilter<"msg"> | string
  }

  export type channelWhereInput = {
    AND?: channelWhereInput | channelWhereInput[]
    OR?: channelWhereInput[]
    NOT?: channelWhereInput | channelWhereInput[]
    id?: IntFilter<"channel"> | number
    hash?: StringFilter<"channel"> | string
  }

  export type channelOrderByWithRelationInput = {
    id?: SortOrder
    hash?: SortOrder
  }

  export type channelWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    hash?: string
    AND?: channelWhereInput | channelWhereInput[]
    OR?: channelWhereInput[]
    NOT?: channelWhereInput | channelWhereInput[]
  }, "id" | "id" | "hash">

  export type channelOrderByWithAggregationInput = {
    id?: SortOrder
    hash?: SortOrder
    _count?: channelCountOrderByAggregateInput
    _avg?: channelAvgOrderByAggregateInput
    _max?: channelMaxOrderByAggregateInput
    _min?: channelMinOrderByAggregateInput
    _sum?: channelSumOrderByAggregateInput
  }

  export type channelScalarWhereWithAggregatesInput = {
    AND?: channelScalarWhereWithAggregatesInput | channelScalarWhereWithAggregatesInput[]
    OR?: channelScalarWhereWithAggregatesInput[]
    NOT?: channelScalarWhereWithAggregatesInput | channelScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"channel"> | number
    hash?: StringWithAggregatesFilter<"channel"> | string
  }

  export type msgCreateInput = {
    userID: number
    channel: number
    create_time: Date | string
    text: string
  }

  export type msgUncheckedCreateInput = {
    id?: number
    userID: number
    channel: number
    create_time: Date | string
    text: string
  }

  export type msgUpdateInput = {
    userID?: IntFieldUpdateOperationsInput | number
    channel?: IntFieldUpdateOperationsInput | number
    create_time?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
  }

  export type msgUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    channel?: IntFieldUpdateOperationsInput | number
    create_time?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
  }

  export type msgCreateManyInput = {
    id?: number
    userID: number
    channel: number
    create_time: Date | string
    text: string
  }

  export type msgUpdateManyMutationInput = {
    userID?: IntFieldUpdateOperationsInput | number
    channel?: IntFieldUpdateOperationsInput | number
    create_time?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
  }

  export type msgUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userID?: IntFieldUpdateOperationsInput | number
    channel?: IntFieldUpdateOperationsInput | number
    create_time?: DateTimeFieldUpdateOperationsInput | Date | string
    text?: StringFieldUpdateOperationsInput | string
  }

  export type channelCreateInput = {
    hash: string
  }

  export type channelUncheckedCreateInput = {
    id?: number
    hash: string
  }

  export type channelUpdateInput = {
    hash?: StringFieldUpdateOperationsInput | string
  }

  export type channelUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    hash?: StringFieldUpdateOperationsInput | string
  }

  export type channelCreateManyInput = {
    id?: number
    hash: string
  }

  export type channelUpdateManyMutationInput = {
    hash?: StringFieldUpdateOperationsInput | string
  }

  export type channelUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    hash?: StringFieldUpdateOperationsInput | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type msgCountOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    channel?: SortOrder
    create_time?: SortOrder
    text?: SortOrder
  }

  export type msgAvgOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    channel?: SortOrder
  }

  export type msgMaxOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    channel?: SortOrder
    create_time?: SortOrder
    text?: SortOrder
  }

  export type msgMinOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    channel?: SortOrder
    create_time?: SortOrder
    text?: SortOrder
  }

  export type msgSumOrderByAggregateInput = {
    id?: SortOrder
    userID?: SortOrder
    channel?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type channelCountOrderByAggregateInput = {
    id?: SortOrder
    hash?: SortOrder
  }

  export type channelAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type channelMaxOrderByAggregateInput = {
    id?: SortOrder
    hash?: SortOrder
  }

  export type channelMinOrderByAggregateInput = {
    id?: SortOrder
    hash?: SortOrder
  }

  export type channelSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}