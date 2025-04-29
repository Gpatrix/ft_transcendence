import { clsx } from 'clsx'
import Button from './Button';


type BlurProps = {
    className?: string;
};

export default function Blur({className} : BlurProps) {

    return (
        <div className="absolute w-1/1 top-0 left-0 h-[150px] z-100 backdrop-blur-[1px] blur-[1px]"
            style={{"background": "linear-gradient(to bottom, rgba(1, 22, 39, 0.5), rgba(1, 22, 39, 0.0))"}}>
        </div>
    );
}