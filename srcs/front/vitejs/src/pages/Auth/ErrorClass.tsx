export enum ErrorTypes {
    PASS = 1,
    MAIL,
    USERNAME,
    PASS_MATCH,
    UNDEDINED
}

export default class AuthError extends Error {
    code: number;

    constructor(message: string, code: number) {
        super(message);
        this.name = "CustomError";
        this.code = code;
    }
}