
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