import { Link } from "react-router"
import InputWithLabel from "../../components/InputWithLabel"
import Button from "../../components/Button"

export default function Login() {
    return (
        <span className="flex flex-col  max-w-[100%] w-[300px]  px-5">
            <InputWithLabel placeholder="Nom d'utilisateur" label="Nom d'utilisateur" />
            <InputWithLabel placeholder="Mot de passe" label="Mot de passe" />
            <Link className="ml-auto text-dark-yellow text-xs py-2 hover:text-yellow">Mot de passe oublie?</Link>
            
            <Button type="full" className="my-5">Connexion</Button>
            <Link className="text-yellow ml-auto mr-auto underline py-2 mb-4 hover:text-yellow">S'inscrire gratuitement</Link>
        </span>
    )
}
