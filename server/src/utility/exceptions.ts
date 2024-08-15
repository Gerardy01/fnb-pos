


export class NotEpoch extends Error {
    constructor(message : string) {
      super(message);
      this.name = "ValidationError";
    }
}