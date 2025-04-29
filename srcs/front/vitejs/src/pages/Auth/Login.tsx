import { Link } from "react-router"
import InputWithLabel from "../../components/InputWithLabel"
import Button from "../../components/Button"
import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        // console.log(email)
        // console.log(password)
        event.preventDefault();
    }

    return (
        <form onSubmit={(e)=>handleSubmit(e)} className="flex flex-col  max-w-[100%] w-[300px]  px-5">
            <InputWithLabel onChange={(e)=>setEmail(e.target.value)} placeholder="Nom d'utilisateur" label="Nom d'utilisateur" />
            <InputWithLabel onChange={(e)=>setPassword(e.target.value)} placeholder="Mot de passe" label="Mot de passe" />
            <Link className="ml-auto text-dark-yellow text-xs py-2 hover:text-yellow">Mot de passe oublie?</Link> 
            
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
