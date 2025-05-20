import Game from "./LocalGame";
import LocalKeyLayout from "./LocalKeyLayout";

export default function LocalGameWrapper() {
    return (
        <div>
            <Game />
            <LocalKeyLayout />
        </div>
    )
}