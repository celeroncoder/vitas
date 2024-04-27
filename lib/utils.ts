import { env } from "@/env.mjs";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const absoluteUrl = (path: string) => {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function csvToArray(
  csv: string,
  delimiter = ","
): [{ [key: string]: string }[], string[]] {
  csv.trim();

  const headers = csv
    .slice(0, csv.indexOf("\n"))
    .split(delimiter)
    .map((header) => header.trim().toLowerCase());

  let rows = csv.slice(csv.indexOf("\n") + 1).split("\n");
  rows = rows.slice(0, rows.length - 1);

  const rowObjects = rows.map((row, idx) => {
    let elms = row.split(delimiter);
    // remove any escape characters
    elms = elms.map((elm) => {
      elm = elm.replace("\r", "").replace("\n", "").replace("\t", "");
      return elm;
    });

    let rowObj: { [key: string]: string } = {};

    elms.forEach((elm, idx) => (rowObj[headers[idx]] = elm));

    return rowObj;
  });

  return [rowObjects, headers];
}

export function getBaseUrl() {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
}

export function formatCurrency(
  value: number,
  currency: string,
  locale?: string,
  options?: Intl.NumberFormatOptions
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    ...options,
  });
  return formatter.format(value);
}
