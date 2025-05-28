import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import InputWithLabel from "../../components/InputWithLabel"
import Button from "../../components/Button"

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
        if (nb % 2 !== 0 || nb < 4 || nb > 10) {
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

    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-yellow mb-10">Usernames</h1>
            <form onSubmit={(e)=>handleSubmit(e)}>
                <span  className="grid gap-x-8 grid-cols-2">
                    {playerNicknames.map((nickname, i) => (
                        <InputWithLabel
                            key={i}
                            placeholder="Nickname"
                            type={errorFields[i] ? "error" : "ok"}
                            label={`Player ${i + 1}`}
                            value={nickname}
                            onChange={(e) => {
                                const updated = [...playerNicknames];
                                updated[i] = e.target.value;
                                setPlayerNicknames(updated);
                            }}
                        />
                    ))}
                </span>
                <Button className="w-full mt-10" type="full">Start</Button>
            </form>
        </div>
    )
}
