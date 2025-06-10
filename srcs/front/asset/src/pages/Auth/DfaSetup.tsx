import { useEffect, useState } from "react"
import InputWithLabel from "../../components/InputWithLabel";
import { gpt } from "../../translations/pages_reponses";
import Button from "../../components/Button";
import { useNavigate } from "react-router";
import { get_server_translation } from "../../translations/server_responses";
import LoginErrorMsg from "../../components/LoginErrorMsg";

export default function DfaSetup() {
    const [error, setError] = useState<string | null>(null)
    const [qr, setQr] = useState<string | null>(null)
    const [code, setCode] = useState<string>("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/auth/2fa/setup/ask");
                const json = await res.json();
                if (!res.ok) {
                    
                    setError(json.message)
                    return ;
                }
                setQr(json.data_url)
            }
            catch (error) {
                setError("0500")
            }
        };
        fetchData();
    }, []);
    
    async function handleSubmit(e : React.FormEvent) {
        e.preventDefault()

        const response = await fetch("/api/auth/2fa/setup/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({userToken: code})
        })
        if (response.status == 200) {
            navigate("/login")
        }
        else {
            const json = await response.json()
            setError(get_server_translation(json.error))
        }
    }

    return (
        <div> 
            <h2 className="text-xl text-yellow">{gpt("2fa")}</h2>
            <p className="text-light-yellow text-xs mt-2">{gpt("text_2fa")}</p>
            { qr && 
            <span>
                <img className="ml-auto mr-auto" src={qr} />
                <form className="flex place-items-end" onSubmit={(e)=>handleSubmit(e)}>

                <InputWithLabel className="text-xl w-1/4" type={error ? "error" : "ok"} onChange={(e)=>setCode(e.target.value)} placeholder={gpt("code_placeholder")} label={gpt("code")}/>
                { code.length >= 6 &&
                    <Button type="full" className="h-fit px-4 mx-4">{gpt("confirm")}</Button>
                }
                </form>
                {error && <LoginErrorMsg>{error}</LoginErrorMsg> }
            </span>
            }
        </div>
    )
}