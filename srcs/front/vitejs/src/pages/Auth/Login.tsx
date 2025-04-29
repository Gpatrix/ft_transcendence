import { Link } from "react-router"
import InputWithLabel from "../../components/InputWithLabel"
import Button from "../../components/Button"
import { useState } from "react";
import { useNavigate } from "react-router";
import LoginErrorMsg from "../../components/LoginErrorMsg";


export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const navigate = useNavigate(); // redirect to home

    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
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
            <InputWithLabel type={error ? "error" : "ok"} onChange={(e)=>setEmail(e.target.value)} placeholder="Addresse mail" label="Addresse mail" />
            <InputWithLabel type={error ? "error" : "ok"} onChange={(e)=>setPassword(e.target.value)} hidechars={true} placeholder="Mot de passe" label="Mot de passe" />
            <Link className="ml-auto text-dark-yellow text-xs py-2 hover:text-yellow">Mot de passe oublie?</Link> 
            
            { error && 
                <LoginErrorMsg>{error}</LoginErrorMsg>
            }

            <Button type="full" className="mt-5">Connexion</Button>

            <span className="flex text-xs text-yellow items-center my-[10px]">
                <span className="w-full h-[1px] mr-[12px] bg-yellow"/>
                <span>OU</span>
                <span className="w-full h-[1px] ml-[12px] bg-yellow"/>
            </span>

            <Link to="/register" className="text-yellow ml-auto mr-auto underline py-2 mb-4 hover:text-yellow">S'inscrire gratuitement</Link>

        </form>
    )
}
