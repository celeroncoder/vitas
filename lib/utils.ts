import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

  const arr: { [key: string]: string }[] = [];

  const rowObjects = rows.map((row, idx) => {
    let elms = row.split(delimiter);
    // remove any escape characters
    elms = elms.map((elm) => {
      elm = elm.replace("\r", "").replace("\n", "").replace("\t", "");
      return elm;
    });

    let rowObj: { [key: string]: string } = {};

    elms.forEach((elm, idx) => (rowObj[headers[idx]] = elm));

    arr.push(rowObj);

    return rowObj;
  });

  return [rowObjects, headers];
}
