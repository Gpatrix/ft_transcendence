import { useEffect, useState } from "react";
import InputWithLabel from "../../../components/InputWithLabel";
import Button from "../../../components/Button";
import { get_page_translation } from "../../../translations/pages_reponses";
import TextAreaWithLabel from "../../../components/TextAreaWithLabel";
import LanguageSelect from "./LanguageSelect";

export default function EditParams() {
    const [placeholders, setPlaceholders] = useState<string>({
        name: "",
        mail: "",
        bio: "",
      });
    

    type FormType = {
        name: string | null
        mail: string | null
        bio: string | null
        actual_password: string | null
        new_password: string | null
        confirm_new_password: string | null
        lang: number | null
    }

    const [formValues, setFormValues] = useState<FormType>({
        name: null,
        mail: null,
        bio: null,
        actual_password: null,
        new_password: null,
        confirm_new_password: null,
        lang: null
    });

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

        const res = fetch("https://localhost/api/user/edit", {
            method: "PUT",
            body: form,
        }).then((response)=>{
            console.log(response)
        })
    }

    // useEffect(()=> { // fetch default user's params
    //     fetch("/api/")
    // }, []);



    return (
            <form onSubmit={(e)=>submitForm(e)} className="sm:border flex border-yellow justify-around text-yellow py-4 rounded-2xl flex-col sm:flex-row">
                <span className="md:w-3/7">
                    <InputWithLabel 
                        value={formValues.name ?? ""}
                        onChange={createNullSetter("name")}
                        label={get_page_translation("username")} 
                        placeholder={get_page_translation("username_placeholder")}
                    />
                    <InputWithLabel 
                        value={formValues.mail ?? ""}
                        onChange={createNullSetter("mail")}
                        label={get_page_translation("email")}    
                        placeholder={get_page_translation("email_placeholder")}
                    />
                    <TextAreaWithLabel
                        value={formValues.bio ?? ""}
                        onChange={createNullSetter("bio")}   
                        label={get_page_translation("bio")}   
                        placeholder={"hello"} 
                    />

                </span>
                <span className="md:w-3/7 flex-col flex">
                    <InputWithLabel
                        hidechars={true}
                        value={formValues.actual_password ?? ""}
                        onChange={createNullSetter("actual_password")}
                        label={get_page_translation("actual_password")} 
                        placeholder={get_page_translation("password_placeholder")}/>
                    <InputWithLabel
                        hidechars={true}
                        value={formValues.new_password ?? ""} 
                        onChange={createNullSetter("new_password")}
                        label={get_page_translation("new_password")}    
                        placeholder={get_page_translation("new_password_placeholder")}/>
                    <InputWithLabel className="mb-5" hidechars={true}
                        value={formValues.confirm_new_password ?? ""}
                        onChange={createNullSetter("confirm_new_password")}
                        label={get_page_translation("password_confirm")}
                        placeholder={get_page_translation("password_confirm_placeholder")} />
                    <LanguageSelect setValue={(lang: number) => setFormValues((prev) => ({ ...prev, lang: lang }))} lang={formValues.lang} />
                    <Button className="w-full ml-auto mt-auto px-5 rounded-tl-2xl rounded-br-2xl" type="full">
                            {get_page_translation("confirm")}
                    </Button>
                </span>
            </form>
    )
}