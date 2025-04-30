import AuthError from "../pages/Auth/ErrorClass";
import { ErrorTypes } from "../pages/Auth/ErrorClass";

export function check_password(password : string) {
    if (!password || password.length < 8)
        throw new AuthError("Your password must contain at least 8 characters.", ErrorTypes.PASS)
    let hasUpperCase : boolean = false;
    let hasLowerCase : boolean = false;
    let hasDigit : boolean = false;
    for (let i : number = 0; i < password.length; i++) {
        const c : string = password[i];
        if (c >= 'A' && c <= 'Z') {
            hasUpperCase = true;
        }
        else if (c >= 'a' && c <= 'z') {
            hasLowerCase = true;
        }
        else if (c >= '0' && c <= '9') {
            hasDigit = true;
        }
    }
    if (!hasUpperCase)
        throw new AuthError("Your password must contain uppercases.", ErrorTypes.PASS)
    if (!hasLowerCase)
        throw new AuthError("Your password must contain lowercases.", ErrorTypes.PASS)
    if (!hasDigit)
        throw new AuthError("Your password must contain digits.", ErrorTypes.PASS)
}

export function confirm_password(pass1:string, pass2:string) {
    if (pass1 != pass2)
        throw new AuthError("Your passwords doesn't match", ErrorTypes.PASS_MATCH)
}