


export class NotEpoch extends Error {
    constructor(message : string) {
		super(message);
		this.name = "NoEpochError";
    }
}

export class ExistData extends Error {
	constructor(message : string) {
		super(message);
		this.name = "ExistDataError";
	}
}

export class DataNotFound extends Error {
	constructor(message : string) {
		super(message);
		this.name = "DataNotFoundError";
	}
}