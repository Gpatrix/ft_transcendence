import { useState } from "react";
import Button from "../../../components/Button";
import InputWithLabel from "../../../components/InputWithLabel";
import LoginErrorMsg from "../../../components/LoginErrorMsg";
import { get_server_translation } from "../../../translations/server_responses";

type FormType = {
    title : string | null
    players : string | null
}

const initialForm = {
    title : null,
    players :null
}

export default function PopupCreate() {
    const [formValues, setFormValues] = useState<FormType>(initialForm)
    const [error, setError] = useState<string | null>(null)

    function createNullSetter<K extends keyof FormType>(key: K, isNumber = false) {
        return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
          let value: string | number | null = e.target.value;
          if (!value.length) {
            value = null;
          } else if (isNumber) {
            value = Number(value);
          }
          setFormValues((prev) => ({ ...prev, [key]: value as FormType[K] }));
        };
      }


    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault()
        if (!formValues.title || !formValues.players) {
            setError(get_server_translation(""))
            return ;
        }

        if ((Number(formValues.players) % 2) != 0)
            setError(get_server_translation("5003"))
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-1/2 ml-auto mr-auto flex-col gap-8  p-10 rounded-2xl shadow-xl">
            <h2 className="text-yellow text-2xl">Create a new room</h2>
            <InputWithLabel onChange={createNullSetter("title")} label="Room title" placeholder="Please entre your room's title" />
            <span className="flex flex-col">
                <label className="text-yellow py-2 text-2">Players</label>
                <input  className="px-4 rounded-lg py-2 w-1/2 text-2 bg-grey placeholder-opacity-0 outline-none text-yellow border border-yellow" 
                        type="number"
                        min={2}
                        max={5}
                        onChange={createNullSetter("players")}
                />
            </span>
            <Button type="full">Confirm</Button>
            {error && <LoginErrorMsg>{error}</LoginErrorMsg>}
        </form>
    )
}