import { useEffect, useState } from "react";
import InputWithLabel from "../../../components/InputWithLabel";
import Button from "../../../components/Button";
import { gpt } from "../../../translations/pages_reponses";
import TextAreaWithLabel from "../../../components/TextAreaWithLabel";
import LanguageSelect from "./LanguageSelect";
import { ProfileDataType } from "./MyProfile";
import LoginErrorMsg from "../../../components/LoginErrorMsg";
import { get_server_translation } from "../../../translations/server_responses";
import { useAuth } from "../../../AuthProvider";


interface EditParamsProps {
    placeholders : ProfileDataType
}


export default function EditParams({placeholders} : EditParamsProps) {
    type FormType = {
        name: string | null
        mail: string | null
        bio: string | null
        actual_password: string | null
        new_password: string | null
        confirm_new_password: string | null
        lang: number | null
    }

    const initialFormValues = {
        name: null,
        mail: null,
        bio: null,
        actual_password: null,
        new_password: null,
        confirm_new_password: null,
        lang: null,
      };
    const [formValues, setFormValues] = useState<FormType>(initialFormValues);
    const [init, setInit] = useState<number | null>(placeholders.lang);
    const [error, setError] = useState<string | null>(null)
    const { fetchWithAuth } = useAuth();

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

    function submitForm(e : React.FormEvent) {
        e.preventDefault()
        const form = new FormData()

        for (const key in formValues) { // append non-null inputs
            const value = formValues[key as keyof FormType]
            if (value != null) {
                form.append(key, String(value))
            }
        }

        const res = fetchWithAuth("https://localhost/api/user/edit", {
            method: "PUT",
            body: form,
        }).then((response)=>{
            if (response.ok) {
                setFormValues(initialFormValues)
                formValues.lang != null && localStorage.setItem('LANGUAGE', JSON.stringify(formValues.lang));
                window.location.reload();
            }
            else {
                response.json().then((data) => {
                    setError(get_server_translation(data.error));
                });
            }
        })
    }

    return (
            <form onSubmit={(e)=>submitForm(e)} className="sm:border flex border-yellow justify-around text-yellow py-4 rounded-2xl flex-col sm:flex-row">
                <span className="md:w-3/7">
                    <InputWithLabel 
                        value={formValues.name ?? ""}
                        onChange={createNullSetter("name")}
                        label={gpt("username")} 
                        placeholder={placeholders.name}
                    />
                    <InputWithLabel 
                        value={formValues.mail ?? ""}
                        onChange={createNullSetter("mail")}
                        label={gpt("email")}    
                        placeholder={placeholders.email ?? gpt("email_placeholder")}
                    />
                    <TextAreaWithLabel
                        value={formValues.bio ?? ""}
                        onChange={createNullSetter("bio")}   
                        label={gpt("bio")}   
                        placeholder={placeholders.bio ?? gpt("bio_placeholder")} 
                    />

                </span>
                <span className="md:w-3/7 flex-col flex">
                    <InputWithLabel
                        hidechars={true}
                        value={formValues.actual_password ?? ""}
                        onChange={createNullSetter("actual_password")}
                        label={gpt("actual_password")} 
                        placeholder={gpt("password_placeholder")}/>
                    <InputWithLabel
                        hidechars={true}
                        value={formValues.new_password ?? ""} 
                        onChange={createNullSetter("new_password")}
                        label={gpt("new_password")}    
                        placeholder={gpt("new_password_placeholder")}/>
                    <InputWithLabel className="mb-5" hidechars={true}
                        value={formValues.confirm_new_password ?? ""}
                        onChange={createNullSetter("confirm_new_password")}
                        label={gpt("password_confirm")}
                        placeholder={gpt("password_confirm_placeholder")} />
                    <LanguageSelect setValue={(lang: number) => setFormValues((prev) => ({ ...prev, lang: lang }))} init={init} resetInit={()=>setInit(null)} lang={formValues.lang} />
                    { (formValues.name || formValues.mail || formValues.bio || formValues.new_password || formValues.lang != null)
                    && <Button className="w-full ml-auto mt-auto px-5 rounded-tl-2xl rounded-br-2xl" type="full">
                            {gpt("confirm")}
                    </Button>
                    }
                    {
                        error && <LoginErrorMsg className="bg-grey rounded-2xl p-1">{error}</LoginErrorMsg>
                    }
                </span>
            </form>
    )
}