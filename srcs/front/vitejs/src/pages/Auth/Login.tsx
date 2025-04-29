import { Link } from "react-router"
import InputWithLabel from "../../components/InputWithLabel"
import Button from "../../components/Button"
import { useState } from "react";
import { useNavigate } from "react-router";
import LoginErrorMsg from "../../components/LoginErrorMsg";
import { get_server_translation } from "../../translations/server_responses";
import { get_page_translation } from "../../translations/pages_reponses";


export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const navigate = useNavigate(); // redirect to home

    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        get_server_translation("1001")
        event.preventDefault();
        try {
            const requestData = {
                method :  'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                {
                    email,
                    password,
                })
            }
            fetch('/api/auth/login', requestData)
            .then(response => {
                if (response.ok) {
                    setError("")
                    navigate("/yeahloggin")
                }
                else {
                    return (response.json().then(data => {
                        setError(data.error)
                    }))
                }
            })
        }
        catch(e) {
            if (e instanceof Error) { // backend error
                setError("")
            }
        }
    }

    return (
        <form onSubmit={(e)=>handleSubmit(e)} className="flex flex-col  max-w-[100%] min-w-[60%] px-5">
            <InputWithLabel type={error ? "error" : "ok"} onChange={(e)=>setEmail(e.target.value)} placeholder={get_page_translation("email_placeholder")} label={get_page_translation("email")} />
            <InputWithLabel type={error ? "error" : "ok"} onChange={(e)=>setPassword(e.target.value)} hidechars={true} placeholder={get_page_translation("password_placeholder")} label={get_page_translation("password")} />
            <Link className="ml-auto text-dark-yellow text-xs py-2 hover:text-yellow">{get_page_translation("forgotten")}</Link> 
            
            { error && 
                <LoginErrorMsg>{error}</LoginErrorMsg>
            }

            <Button type="full" className="mt-5">{get_page_translation("connexion")}</Button>

            <span className="flex text-xs text-yellow items-center my-[10px]">
                <span className="w-full h-[1px] mr-[12px] bg-yellow"/>
                <span>{get_page_translation("or")}</span>
                <span className="w-full h-[1px] ml-[12px] bg-yellow"/>
            </span>

            <Link to="/register" className="text-yellow ml-auto mr-auto underline py-2 mb-4 hover:text-yellow">{get_page_translation("register")}</Link>


        </form>
    )
}
