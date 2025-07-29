


export interface IModifierOption {
    // id : number
    optionName : string;
    price : string;
}

export interface ModifierDataReturn {
    modifierId : number;
    name : string;
    modifierOptions : IModifierOption[];
    required : boolean;
    min : number;
    max : number;
}

export interface CreateModifierBodyData {
    name : string;
    modifierOptions : IModifierOption[];
    required : boolean;
    min : number;
    max : number;
}

export interface EditModifierBodyData {
    modifierId : number;
    name : string;
    modifierOptions : IModifierOption[];
    required : boolean;
    min : number;
    max : number;
}