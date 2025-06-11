import { Link } from "react-router"
import InputWithLabel from "../../components/InputWithLabel"
import Button from "../../components/Button"
import { useEffect, useState } from "react";
import {check_password, confirm_password} from "../../validators/password.tsx";
import check_email from "../../validators/email.tsx";
import check_username from "../../validators/username.tsx";
import { gpt } from "../../translations/pages_reponses.tsx";

import LoginErrorMsg from "../../components/LoginErrorMsg";
import { ErrorTypes} from "./ErrorClass"
import AuthError from "./ErrorClass";
import { useNavigate } from "react-router-dom";
import { get_server_translation } from "../../translations/server_responses.tsx";
import { useSearchParams } from "react-router";

import GoogleAuth from "./GoogleAuth.tsx";
import { useAuth } from "../../AuthProvider.tsx";

export default function Register() {
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [passwordConfirm, setPasswordConfirm] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [errorfield, setErrorField] = useState<number>(0);
    const {login} = useAuth()

    const [params] = useSearchParams()
    const { isAuthenticated } = useAuth();

    useEffect(()=> {
        if (params) {
            const authError = params.get("oauth-error")
            if (authError)
                setError(get_server_translation(authError))
        }
    }, [params])

    useEffect(()=> {
        if (isAuthenticated) {
            navigate("/")
        }
    }, [])

    const navigate = useNavigate(); // redirect to home

    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            check_username(name) // LOCAL CHECKS
            check_email(email)
            check_password(password)
            confirm_password(password, passwordConfirm)  

            const requestData = {
                method :  'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                { 
                    name,
                    password,
                    email
                })
            }
            fetch('/api/auth/signup', requestData)
            .then(response => {
                if (response.status == 200)
                    login(email, password)
                else
                {
                    return (response.json().then(data => {
                        setError(get_server_translation(data.error))
                    }))
                }
            })
            setError("")
            setErrorField(-1) // all tests passed, restore red fields
        }
        catch(e) {
            if (e instanceof AuthError) { // frontend error
                setError(get_server_translation(e.message))
                setErrorField(e.code)
            }
            else if (e instanceof Error) { // backend error
                setError(get_server_translation("0500"))
            }
        }
    }

    return (
        <span className="flex flex-col w-1/1">
            <form onSubmit={(e)=>handleSubmit(e)} className="flex flex-col w-1/1">
                <InputWithLabel type={errorfield == ErrorTypes.USERNAME ? "error" : "ok"} onChange={(e)=>setName(e.target.value)} 
                placeholder={gpt("username_placeholder")} label={gpt("username")} />

                <InputWithLabel type={errorfield == ErrorTypes.MAIL ? "error" : "ok"} onChange={(e)=>setEmail(e.target.value)}
                placeholder={gpt("email_placeholder")} label={gpt("email")} />

                <InputWithLabel type={errorfield == ErrorTypes.PASS ? "error" : "ok"} onChange={(e)=>setPassword(e.target.value)} hidechars={true} 
                placeholder={gpt("password_placeholder")} label={gpt("password")} />

                <InputWithLabel type={errorfield == ErrorTypes.PASS_MATCH ? "error" : "ok"} onChange={(e)=>setPasswordConfirm(e.target.value)} hidechars={true}
                placeholder={gpt("password_confirm_placeholder")} label={gpt("password_confirm")} />



                { error && 
                    <LoginErrorMsg>{error}</LoginErrorMsg>
                }

                <Button type="full" className="mt-10">{gpt("register")}</Button>
                <span className="flex text-xs text-yellow items-center my-[10px]">
                    <span className="w-full h-[1px] mr-[12px] bg-yellow"/>
                    <span>{gpt("or")}</span>
                    <span className="w-full h-[1px] ml-[12px] bg-yellow"/>
                </span>
            </form>
            <GoogleAuth />
            <Link to="/login" className="text-yellow ml-auto mr-auto underline py-2 mb-4 hover:text-yellow">{gpt("login")}</Link>
        </span>
    )
}