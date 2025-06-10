import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import InputWithLabel from "../../components/InputWithLabel"
import Button from "../../components/Button"
import { gpt } from "../../translations/pages_reponses"

export default function CreateTournament() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const [players, setPlayers] = useState<number>(0)
    const [playerNicknames, setPlayerNicknames] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)

    const [errorFields, setErrorFields] = useState<boolean[]>([])

    useEffect(() => {
        const getPlayers = params.get("players")
        if (!getPlayers) {
            navigate("/404-error")
            return;
        }
        const nb = Number(getPlayers);
        if (![4, 8, 16].includes(nb)) {
            navigate("/404-error")
            return;
        }
        setPlayers(nb);
        setPlayerNicknames(Array(nb).fill(""));
        setErrorFields(Array(nb).fill(false))
    }, [params, navigate])


    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedNicknames = playerNicknames.map(nick => nick.trim());
    
        const emptyFields = trimmedNicknames.map(nick => nick === "");
    
        const duplicateMap: Record<string, number> = {};
        for (const nick of trimmedNicknames) {
            if (nick !== "")
                duplicateMap[nick] = (duplicateMap[nick] || 0) + 1;
        }
        const duplicateFields = trimmedNicknames.map(nick => duplicateMap[nick] > 1);
        const newErrors = emptyFields.map((isEmpty, i) => isEmpty || duplicateFields[i]);
    
        setErrorFields(newErrors);
    
        if (newErrors.includes(true)) {
            return;
        }
        let array : Array<Array<string>> =[[]];
        array[0] = playerNicknames

        let nbPlayers : number = players / 2;
        while (nbPlayers >= 2) {
            
            array.push(new Array(nbPlayers).fill(""));
            nbPlayers /= 2
        }
        array.push([""])

        const json = btoa(JSON.stringify(array))
        localStorage.setItem(`tournament`, json)
        navigate(`/play/tournament/overview`)
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-yellow mb-10">{gpt("players")}</h1>
            <form onSubmit={(e)=>handleSubmit(e)}>
                <span  className="grid gap-x-8 grid-cols-2">
                    {playerNicknames.map((nickname, i) => (
                        <InputWithLabel
                            key={i}
                            placeholder={gpt("nickname")}
                            type={errorFields[i] ? "error" : "ok"}
                            label={`${gpt("player")} ${i + 1}`}
                            value={nickname}
                            onChange={(e) => {
                                const updated = [...playerNicknames];
                                updated[i] = e.target.value;
                                setPlayerNicknames(updated);
                            }}
                        />
                    ))}
                </span>
                <Button className="w-full mt-10" type="full">{gpt("start")}</Button>
            </form>
        </div>
    )
}
