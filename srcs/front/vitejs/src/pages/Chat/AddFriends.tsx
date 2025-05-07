import Button from "../../components/Button.tsx"
import InputWithIco from "../../components/InputWithIco.tsx"

import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState, SetStateAction } from "react";
import Friend from "../../classes/Friend.tsx"
import UserContact from "../../components/UserContact.tsx";

type AddFriendsProps = {
    test?: React.Dispatch<SetStateAction<number>>,
    // ajouter un 2eme conClick pour l'ajout d'ami
}

export default function AddFriends({} : AddFriendsProps) {

    const [inputSearch, setInputSearch] = useState<string>("");

    const handleSubmitSearch = (event : FormEvent<HTMLFormElement>) => {
        console.log("test");

        // faire la recherche d'amis

        event.preventDefault();
    }

    const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setInputSearch(e.target.value);
    };


    return (
        <div className="w-[100%]">
            <InputWithIco
                            className="m-3"
                            placeholder={"ex : Pseudo1234..."}
                            iconSrc={"/icons/search-alt.svg"}
                            value={inputSearch}
                            onChange={handleChangeSearch}
                            onSubmit={handleSubmitSearch}
            />

            
            <UserContact userName={"test"} />

        </div>
    )
}
