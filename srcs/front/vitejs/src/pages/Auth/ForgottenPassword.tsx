import { Link } from "react-router"
import InputWithLabel from "../../components/InputWithLabel"
import Button from "../../components/Button"
import { useState } from "react";
import check_email from "../../validators/email.tsx";
import { useNavigate } from "react-router-dom";
import LoginErrorMsg from "../../components/LoginErrorMsg.tsx";
import { get_page_translation } from "../../translations/pages_reponses.tsx";
import AuthError from "./ErrorClass.tsx";
import { get_server_translation } from "../../translations/server_responses.tsx";

export default function ForgottenPassword() {
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [formSent, setFormSent] = useState<boolean>(false);


    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            // setFormSent(true)
            check_email(email)
            setError("")
            const requestData = {
                method :  'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email})
            }
            fetch('/api/auth/passwordReset/ask', requestData)
            .then(response => {
                if (response && response.ok) {
                    setFormSent(true)
                }
                else {
                    setError(get_server_translation("0500"))
                }
            })
        }
        catch (e) {
            if (e instanceof AuthError) {
                setError(e.message)
            }
            else
                setError(get_server_translation("0500"))
        }
    }


    return (
        <div  className="flex flex-col w-1/1 text-yellow">
            <span className="mb-5">
                <h2 className="text-xl">{get_page_translation(formSent ? "give_code" : "reset")}</h2>
                <p className="text-light-yellow text-xs">{get_page_translation(formSent ? "check_spam" : "description")}</p>
            </span>
            <form onSubmit={(e)=>handleSubmit(e)} className="flex flex-col w-1/1" >
                <InputWithLabel type={(error && !formSent) ? "error" : "ok"} onChange={(e)=>setEmail(e.target.value)} label={get_page_translation("email")} placeholder={get_page_translation("email_placeholder")}/>
                <Button className="mt-5" type="full">{get_page_translation(formSent ? "confirm" : "continue")}</Button>
                {formSent &&  
                    <p>FORM SENT</p>    
                }

                { error && 
                    <LoginErrorMsg>{error}</LoginErrorMsg>
                }
            </form>
        </div>

    )
}