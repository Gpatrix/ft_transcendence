import { useState } from "react"
import InputWithLabel from "../../components/InputWithLabel";
import { gpt } from "../../translations/pages_reponses";
import Button from "../../components/Button";
import { useNavigate } from "react-router";
import { get_server_translation } from "../../translations/server_responses";
import LoginErrorMsg from "../../components/LoginErrorMsg";
import { useAuth } from "../../AuthProvider";

export default function DfaSetup() {
    const [error, setError] = useState<string | null>(null)
    const auth = useAuth()
    const [code, setCode] = useState<string>("")
    const navigate = useNavigate()

    
    async function handleSubmit(e : React.FormEvent) {
        e.preventDefault()

        const response = await fetch("/api/auth/2fa/submit", {
            method: "POST",
            body: code
        })
        if (response.status == 200) {
            navigate("/")
        }
        else {
            const json = await response.json()
            setError(get_server_translation(json.error))
        }
    }

    return (
        <div> 
            <h2 className="text-xl text-yellow">{gpt("2fa")}</h2>
            <p className="text-light-yellow text-xs mt-2">{gpt("text_check_2fa")}</p>
            <span>
                <form className="flex place-items-end" onSubmit={(e)=>handleSubmit(e)}>

                <InputWithLabel className="text-xl w-1/4" type={error ? "error" : "ok"} onChange={(e)=>setCode(e.target.value)} placeholder={gpt("code_placeholder")} label={gpt("code")}/>
                { code.length >= 6 &&
                    <Button type="full" className="h-fit px-4 mx-4">{gpt("confirm")}</Button>
                }
                </form>
                {error && <LoginErrorMsg>{error}</LoginErrorMsg> }
            </span>
            {(code.length < 6 || error) && <span className="flex w-full">
                <Button onClick={()=>{auth.logout()}} className="mt-8 ml-auto  mr-auto w-fit h-fit px-1 ">Logout</Button>
            </span>
            }
        </div>
    )
}