import { use, useEffect, useState } from "react"
import { useSearchParams } from "react-router"
import Button from "../../components/Button"
import InputWithLabel from "../../components/InputWithLabel"
import { gpt } from "../../translations/pages_reponses"
import { get_server_translation } from "../../translations/server_responses"
import { confirm_password, check_password } from "../../validators/password"
import AuthError from "./ErrorClass"
import { ErrorTypes } from "./ErrorClass"
import LoginErrorMsg from "../../components/LoginErrorMsg"
import { useNavigate } from "react-router"

export default function NewPassword() {
    const [params] = useSearchParams()
    const [token, setToken] = useState<string | null>(null)
    const [password, setPassword] = useState<string>("")
    const [passwordConfirm, setPasswordConfirm] = useState<string>("")
    const [error, setError] = useState<string>("");
    const [errorfield, setErrorField] = useState<number>(0);

    const navigate = useNavigate(); // redirect to home
    useEffect(()=> {
        setToken(params.get("token"))
    }, [params])

    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            check_password(password)
            confirm_password(password, passwordConfirm)


            const requestData = {
                method :  'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, token })
            }
            setError("")
            setErrorField(-1) // all front-end tests passed, restore red fields
            fetch('/api/auth/passwordReset/submit', requestData)
            .then(response=> {
                if (response) {
                    if (response.status == 200) {
                        navigate("/")
                    }
                    else {
                        response.json().then(data => {
                            setError(get_server_translation(data.error))
                        })
                    }
                }
                else {
                    throw Error("0500")
                }
            })
        }
        catch(e) {
            if (e instanceof AuthError) { // frontend error
                setError(get_server_translation(e.message))
                setErrorField(e.code)
            }
            else if (e instanceof Error) { // backend error
                setError(get_server_translation(e.message))
            }
        }
    }
    

    return (
            <form onSubmit={(e)=>handleSubmit(e)}>
                <h2 className="text-xl text-yellow underline">{gpt("reset")}</h2>
                <InputWithLabel hidechars={true} type={errorfield == ErrorTypes.PASS ? "error" : "ok"} onChange={(e)=>setPassword(e.target.value)} placeholder={gpt("password_placeholder")} label={gpt("password")}/>
                <InputWithLabel hidechars={true} type={errorfield == ErrorTypes.PASS_MATCH ? "error" : "ok"} onChange={(e)=>setPasswordConfirm(e.target.value)} placeholder={gpt("password_confirm_placeholder")} label={gpt("password_confirm")}/>
                <Button className="w-full mt-10" type="full">{gpt("confirm")}</Button>
                { error && 
                    <LoginErrorMsg>{error}</LoginErrorMsg>
                }
            </form>
    )

}