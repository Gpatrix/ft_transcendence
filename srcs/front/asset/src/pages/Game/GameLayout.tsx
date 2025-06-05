import { Outlet } from "react-router"
import Header from "../../components/Header"

export default function GameLayout() {
    return (
        <div>
            <Header />
            <span className="w-full flex justify-center align-bottom mt-10">
                <Outlet/>
            </span>
        </div>
    )
}