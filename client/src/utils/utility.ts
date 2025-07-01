
import { ErrorResponse } from "../models/globalInterface";


export const getShortenName = (name : string) : string => {
    return name.split(" ").map(word => word[0].toUpperCase()).join("");
}

export const catchFetchError = <T>(promise : Promise<T>) : Promise<[undefined, T] | [ErrorResponse]> => {
    return promise.then(data => {
        return [undefined, data] as [undefined, T]
    }).catch(err => {
        return [err];
    });
}

export const formatAmountToReadable = (value: string): string => {
  const num = Number(value);
  if (isNaN(num)) return value;

  return num % 1 === 0
    ? num.toLocaleString("id-ID", { maximumFractionDigits: 0 })
    : num.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}