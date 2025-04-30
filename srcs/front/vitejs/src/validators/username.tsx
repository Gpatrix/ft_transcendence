import AuthError from "../pages/Auth/ErrorClass";
import { ErrorTypes } from "../pages/Auth/ErrorClass";

export default function check_username(username : string) {
    if (!username.length)
        throw new AuthError("Please specify a username.", ErrorTypes.USERNAME)
    if (!username.match(/^[a-zA-Z0-9._-]+$/))
        throw new AuthError("Invalid characters in username", ErrorTypes.USERNAME)
    if (username.length > 20)
        throw new AuthError("Username too long.", ErrorTypes.USERNAME)
}