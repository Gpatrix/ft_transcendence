import { useEffect, useState } from "react";
import SwitchButton from "./SwitchButton";
import EditParams from "./me/EditParams";

export default function RightPart() {
    const [menuSwitch, setMenuSwitch] = useState<boolean>(false)

    return (
        <div className="w-full">
            <SwitchButton setState={setMenuSwitch} state={menuSwitch}/>
            { !menuSwitch &&
                <EditParams />
            }   
        </div>
    )
}