import { z } from "zod";
import { LensType, SensorType } from "@/generated/prisma/enums";
import { hasForbiddenChars } from "@/lib/validators/text";

export const LENS_SEARCH_LIMITS = {
  focal: { min: 1, max: 2000 }, // mm, comme le simulateur
  price: { min: 0, max: 100_000 }, // €
  pageSize: { default: 12, max: 50 },
} as const;

export const LENS_SORTS = [
  "brand",
  "price_asc",
  "price_desc",
  "focal",
  "aperture",
] as const;

export type LensSort = (typeof LENS_SORTS)[number];

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null ? undefined : value;

const optionalInt = (min: number, max: number) =>
  z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(min).max(max).optional(),
  );

export const lensSearchSchema = z
  .strictObject({
    brand: z.preprocess(
      emptyToUndefined,
      z
        .string()
        .trim()
        .max(40)
        .refine((v) => !hasForbiddenChars(v), "validation.forbiddenChars")
        .optional(),
    ),
    type: z.preprocess(emptyToUndefined, z.enum(LensType).optional()),
    coverage: z.preprocess(emptyToUndefined, z.enum(SensorType).optional()),
    focalFrom: optionalInt(
      LENS_SEARCH_LIMITS.focal.min,
      LENS_SEARCH_LIMITS.focal.max,
    ),
    focalTo: optionalInt(
      LENS_SEARCH_LIMITS.focal.min,
      LENS_SEARCH_LIMITS.focal.max,
    ),
    priceMin: optionalInt(
      LENS_SEARCH_LIMITS.price.min,
      LENS_SEARCH_LIMITS.price.max,
    ),
    priceMax: optionalInt(
      LENS_SEARCH_LIMITS.price.min,
      LENS_SEARCH_LIMITS.price.max,
    ),
    sort: z.preprocess(emptyToUndefined, z.enum(LENS_SORTS).default("brand")),
    page: z.preprocess(
      emptyToUndefined,
      z.coerce.number().int().min(1).max(10_000).default(1),
    ),
    pageSize: z.preprocess(
      emptyToUndefined,
      z.coerce
        .number()
        .int()
        .min(1)
        .max(LENS_SEARCH_LIMITS.pageSize.max)
        .default(LENS_SEARCH_LIMITS.pageSize.default),
    ),
  })
  .refine(
    (d) =>
      d.focalFrom === undefined ||
      d.focalTo === undefined ||
      d.focalFrom <= d.focalTo,
    { message: "validation.rangeInvalid", path: ["focalTo"] },
  )
  .refine(
    (d) =>
      d.priceMin === undefined ||
      d.priceMax === undefined ||
      d.priceMin <= d.priceMax,
    { message: "validation.rangeInvalid", path: ["priceMax"] },
  );

export type LensSearch = z.infer<typeof lensSearchSchema>;

export type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseLensSearch(raw: RawSearchParams) {
  const flat: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(raw)) {
    flat[key] = Array.isArray(value) ? value[0] : value;
  }
  return lensSearchSchema.safeParse(flat);
}

export function lensSearchToParams(search: LensSearch): URLSearchParams {
  const params = new URLSearchParams();
  const set = (key: string, value: string | number | undefined) => {
    if (value !== undefined) params.set(key, String(value));
  };

  set("brand", search.brand);
  set("type", search.type);
  set("coverage", search.coverage);
  set("focalFrom", search.focalFrom);
  set("focalTo", search.focalTo);
  set("priceMin", search.priceMin);
  set("priceMax", search.priceMax);
  if (search.sort !== "brand") set("sort", search.sort);
  if (search.page !== 1) set("page", search.page);
  if (search.pageSize !== LENS_SEARCH_LIMITS.pageSize.default) {
    set("pageSize", search.pageSize);
  }
  return params;
}
