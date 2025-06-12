import { useState } from "react";
import InputWithLabel from "../../../components/InputWithLabel";
import Button from "../../../components/Button";
import { gpt } from "../../../translations/pages_reponses";
import TextAreaWithLabel from "../../../components/TextAreaWithLabel";
import LanguageSelect from "./LanguageSelect";
import { ProfileDataType } from "./MyProfile";
import LoginErrorMsg from "../../../components/LoginErrorMsg";
import { get_server_translation } from "../../../translations/server_responses";
import { useAuth } from "../../../AuthProvider";
import { useNavigate } from "react-router";
import LogoutButton from "./LogoutButton";


interface EditParamsProps {
    placeholders : ProfileDataType
}


export default function EditParams({placeholders} : EditParamsProps) {
    type FormType = {
        name: string | null
        email: string | null
        bio: string | null
        actual_password: string | null
        new_password: string | null
        confirm_new_password: string | null
        lang: number | null
        isTwoFactorEnabled:  boolean | null
    }

    const initialFormValues = {
        name: null,
        email: null,
        bio: null,
        actual_password: null,
        new_password: null,
        confirm_new_password: null,
        lang: null,
        isTwoFactorEnabled: null
      };
    const [formValues, setFormValues] = useState<FormType>(initialFormValues);
    const [init, setInit] = useState<number | null>(placeholders.lang);
    const [error, setError] = useState<string | null>(null)
    const { fetchWithAuth } = useAuth();
    const navigate = useNavigate()

 
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

        fetchWithAuth("/api/user/edit", {
            method: "PUT",
            body: form,
        }).then((response)=>{
            if (response.status == 200) {
                setFormValues(initialFormValues)
                formValues.lang != null && localStorage.setItem('LANGUAGE', JSON.stringify(formValues.lang));
                if (formValues.isTwoFactorEnabled == true) {
                    navigate("/2fa-setup")
                }
                if (formValues.isTwoFactorEnabled == false) {
                    fetchWithAuth("/api/auth/2fa/delete", {method: "DELETE"})
                }
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
                        value={formValues.email ?? ""}
                        onChange={createNullSetter("email")}
                        label={gpt("email")}    
                        placeholder={placeholders.email ?? gpt("email_placeholder")}
                        disabled={placeholders.provider ? true : false}
                    />
                    <TextAreaWithLabel
                        value={formValues.bio ?? ""}
                        onChange={createNullSetter("bio")}   
                        label={gpt("bio")}   
                        placeholder={placeholders.bio ?? gpt("bio_placeholder")} 
                    />
                    <div className=" mt-[8px]">
                    <label className="py-2">{gpt("language")}</label>
                    <LanguageSelect setValue={(lang: number) => setFormValues((prev) => ({ ...prev, lang: lang }))} init={init} resetInit={()=>setInit(null)} lang={formValues.lang} />
                    <LogoutButton/>
                    </div>


                </span>
                <span className="md:w-3/7 flex-col flex">
                    {
                    !(placeholders.provider) ? 
                        <><InputWithLabel
                            hidechars={true}
                            value={formValues.actual_password ?? ""}
                            onChange={createNullSetter("actual_password")}
                            label={gpt("actual_password")}
                            placeholder={gpt("password_placeholder")} /><InputWithLabel
                                hidechars={true}
                                value={formValues.new_password ?? ""}
                                onChange={createNullSetter("new_password")}
                                label={gpt("new_password")}
                                placeholder={gpt("new_password_placeholder")} /><InputWithLabel className="mb-5" hidechars={true}
                                    value={formValues.confirm_new_password ?? ""}
                                    onChange={createNullSetter("confirm_new_password")}
                                    label={gpt("password_confirm")}
                                    placeholder={gpt("password_confirm_placeholder")} /><span>
                                <label>{gpt("2fa")}</label>
                                <span className="w-2/5 h-[40px] flex justify-evenly border-1 p-1 rounded-xl border-yellow bg-grey mt-[8px]">
                                    {((formValues.isTwoFactorEnabled == null && placeholders.isTwoFactorEnabled == false)
                                        || formValues.isTwoFactorEnabled == false)
                                        ? <span onClick={() => setFormValues((prev) => ({ ...prev, isTwoFactorEnabled: true }))}
                                            className="w-[50%] h-full rounded-full bg-light-yellow opacity-10 mr-auto cursor-pointer"></span>

                                        : <span onClick={() => setFormValues((prev) => ({ ...prev, isTwoFactorEnabled: false }))}
                                            className="w-[50%] h-full rounded-full bg-yellow ml-auto cursor-pointer"></span>}
                                </span>
                            </span></>
                        : null
                    }

                    { (formValues.name || formValues.email || formValues.bio 
                    || formValues.new_password || formValues.lang != null 
                    || formValues.isTwoFactorEnabled != null)
                    && <Button className="w-full ml-auto px-5 rounded-tl-2xl rounded-br-2xl mt-10 md:mt-auto" type="full">
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