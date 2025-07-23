

export interface WriteModifierOption {
    optionName : string;
    price : string;
}

export interface ICreateModifierData {
    name : string;
    modifierOptions : WriteModifierOption[];
    required : boolean;
    min : number;
    max : number;
}

export interface IEditModifierData {
    modifierId : number;
    name : string;
    modifierOptions : WriteModifierOption[];
    required : boolean;
    min : number;
    max : number;
}


export type IModifierOption = {
    // id : number
    optionName : string;
    price : string;
}

export type ModifierReturnData = {
    modifierId : number;
    name : string;
    modifierOptions : IModifierOption[];
    required : boolean;
    min : number;
    max : number;
}