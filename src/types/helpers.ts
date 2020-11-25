export type RemoveKeys<Obj, Keys> = keyof Obj extends Exclude<keyof Obj, Keys>
  ? Obj
  : Record<Exclude<keyof Obj, Keys> extends never ? '' : Exclude<keyof Obj, Keys>, string>;

export type SymbolWithDescription = symbol & { description: string };
