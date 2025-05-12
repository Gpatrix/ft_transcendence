import AuthLayout from "../Auth/AuthLayout";
import { gpt } from "../../translations/pages_reponses";
import Button from "../../components/Button";
import { useNavigate } from "react-router";

export default function NotFound () {
    const navigate = useNavigate()
    return (
        <span className="flex flex-col">
            <h1 className="ml-auto mr-auto text-yellow text-5xl mb-19">404</h1>
            <h2 className="ml-auto mr-auto text-yellow w-[75%] text-center">{gpt("page_not_found")}</h2>
            <Button type="full" className="ml-auto mr-auto mt-10 px-10" onClick={()=>navigate("/")}>{gpt("back_to_home")}</Button>
        </span>
    )
}