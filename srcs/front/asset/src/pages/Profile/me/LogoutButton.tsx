import { useAuth } from "../../../AuthProvider";

export default function LogoutButton() {
    const auth = useAuth()

    return (
            <a onClick={()=>auth.logout()} 
            className="block w-1/2 border-1 text-center border-yellow px-3 py-2 rounded-md mt-7 cursor-pointer"
            >
                Logout
            </a>
    )
}