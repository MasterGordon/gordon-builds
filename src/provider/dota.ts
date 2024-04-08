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

export const Behavior = {
  NONE: 0,
  HIDDEN: 1,
  PASSIVE: 2,
  NO_TARGET: 4,
  UNIT_TARGET: 8,
  POINT_TARGET: 16,
  AOE: 32,
  NOT_LEARNABLE: 64,
  CHANNELLED: 128,
  ITEM: 256,
  TOGGLE: 512,
  DIRECTIONAL: 1024,
  IMMEDIATE: 2048,
  AUTOCAST: 4096,
  OPTIONAL_UNIT_TARGET: 8192,
  OPTIONAL_POINT_TARGET: 16384,
  OPTIONAL_NO_TARGET: 32768,
  AURA: 65536,
  ATTACK: 131072,
  DONT_RESUME_MOVEMENT: 262144,
  ROOT_DISABLES: 524288,
  UNRESTRICTED: 1048576,
  IGNORE_PSEUDO_QUEUE: 2097152,
  IGNORE_CHANNEL: 4194304,
  DONT_CANCEL_MOVEMENT: 8388608,
  DONT_ALERT_TARGET: 16777216,
  DONT_RESUME_ATTACK: 33554432,
  NORMAL_WHEN_STOLEN: 67108864,
  IGNORE_BACKSWING: 134217728,
  RUNE_TARGET: 268435456,
  DONT_CANCEL_CHANNEL: 536870912,
  VECTOR_TARGETING: 1073741824,
  LAST: 1073741824,
} as const;

export const TargetType = {
  NONE: 0,
  UNIT: 1,
  POINT: 2,
  TREE: 3,
  BUILDING: 4,
  CUSTOM: 5,
} as const;
