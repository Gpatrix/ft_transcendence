import { useLocation } from 'react-router';
import translations from './translations.json';

export function get_page_translation(str: string) : string {
    const location : string  = useLocation().pathname.slice(1)

    const pageName = (translations.Routes as Record<string, string>)[location];
    if (!pageName) 
        return (`No route match for "${location}"`);

    const page = (translations.Pages as Record<string, any>)[pageName];
    if (!page) 
        return (`No page named "${pageName}"`);

    let language : number | null = Number(localStorage.getItem("LANGUAGE"))
    if (language != null)
        return (page[str][language])
    return (page[str][0])
}
