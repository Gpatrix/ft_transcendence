import { Link } from "react-router"
import InputWithLabel from "../../components/InputWithLabel"
import Button from "../../components/Button"
import Header from "../../components/Header"
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
        <div className="">
            <Header  />
        </div>
    )
}
