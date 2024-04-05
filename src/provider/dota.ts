import json from "../__generated__/data/constants.json";
import { ConstantQuery } from "../__generated__/graphql";

type NotNill<T> = T extends null | undefined ? never : T;

// eslint-disable-next-line @typescript-eslint/ban-types
type Primitive = undefined | null | boolean | string | number | Function;

type DeepRequired<T> = T extends Primitive
  ? NotNill<T>
  : {
      [P in keyof T]-?: T[P] extends Array<infer U>
        ? Array<DeepRequired<U>>
        : T[P] extends ReadonlyArray<infer U2>
        ? DeepRequired<U2>
        : DeepRequired<T[P]>;
    };

export type StripTypename<T> = Omit<T, "__typename">;
export type StripTypenameDeep<T> = T extends Primitive
  ? T
  : StripTypename<{ [K in keyof T]: StripTypenameDeep<T[K]> }>;

type Constants = ConstantQuery;

// @ts-expect-error Ignore due to JSON file
const constants = json.constants as Constants;

export const heroes = constants.heroes!;

export const gameVersions = constants.gameVersions as StripTypenameDeep<
  DeepRequired<Constants["gameVersions"]>
>;

export const abilities = constants.abilities!;

export const TargetTeam = {
  NONE: 0,
  ALLY: 1,
  ENEMY: 2,
  BOTH: 3,
} as const;

export const TargetType = {
  NONE: 0,
  UNIT: 1,
  POINT: 2,
  TREE: 3,
  BUILDING: 4,
  CUSTOM: 5,
} as const;
