import AuthError from "../pages/Auth/ErrorClass";
import { ErrorTypes } from "../pages/Auth/ErrorClass";

export default function check_email(email : string) {
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) || email.length > 50)
        throw new AuthError("1004", ErrorTypes.MAIL)
}