import { Link, useParams } from "react-router"
import InputWithLabel from "../../components/InputWithLabel"
import Button from "../../components/Button"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import LoginErrorMsg from "../../components/LoginErrorMsg";
import { get_server_translation } from "../../translations/server_responses";
import { gpt } from "../../translations/pages_reponses";
import GoogleAuth from "./GoogleAuth";
import { useAuth } from "../../AuthProvider";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate(); // redirect to home
    const { login, setLogged } = useAuth();

    const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await login(email, password);
            setError("");
        } catch (e) {
            if (e instanceof Error) {
                setError(get_server_translation(e.message));
            } else {
                setError(gpt("0500"));
            }
        }
    }

    useEffect(()=> { 
        const queryParameters = new URLSearchParams(window.location.search) //  oauth forcing authProvider
        const callback = queryParameters.get("oauth")
        if (callback) {
            setLogged()
            navigate("/")
            return ;
            // alert()
        }
    }, [])


    return (
        <span className="flex flex-col w-1/1">
            <form onSubmit={(e)=>handleSubmit(e)} className="flex flex-col w-1/1">
                <InputWithLabel type={error ? "error" : "ok"} onChange={(e)=>setEmail(e.target.value)} placeholder={gpt("email_placeholder")} label={gpt("email")} />
                <InputWithLabel type={error ? "error" : "ok"} onChange={(e)=>setPassword(e.target.value)} hidechars={true} placeholder={gpt("password_placeholder")} label={gpt("password")} />

                { error && 
                    <LoginErrorMsg>{error}</LoginErrorMsg>
                }

                <Button type="full" className="mt-5">{gpt("connexion")}</Button>

                <span className="flex text-xs text-yellow items-center my-[10px]">
                    <span className="w-full h-[1px] mr-[12px] bg-yellow"/>
                    <span>{gpt("or")}</span>
                    <span className="w-full h-[1px] ml-[12px] bg-yellow"/>
                </span>
                </form>
            <GoogleAuth />
            <Link to="/register" className="text-yellow ml-auto mr-auto underline py-2 mb-4 hover:text-yellow">{gpt("register")}</Link>
        </span>

    )
}
