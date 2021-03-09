export type RemoveKeys<Obj, Keys> = keyof Obj extends Exclude<keyof Obj, Keys>
  ? Obj
  : Exclude<keyof Obj, Keys> extends never
  ? Record<string, never>
  : Record<Exclude<keyof Obj, Keys>, string>;

export type SymbolWithDescription = symbol & { description: string };
