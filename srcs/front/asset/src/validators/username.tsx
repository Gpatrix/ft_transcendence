import AuthError from "../pages/Auth/ErrorClass";
import { ErrorTypes } from "../pages/Auth/ErrorClass";

export default function check_username(username : string) {
    if (!username.length)
        throw new AuthError("1008", ErrorTypes.USERNAME)
    if (!username.match(/^[a-zA-Z0-9._-]+$/))
        throw new AuthError("1005", ErrorTypes.USERNAME)
    if (username.length > 20)
        throw new AuthError("0413", ErrorTypes.USERNAME)
}