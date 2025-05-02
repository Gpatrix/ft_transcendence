import { useLocation } from 'react-router';
import translations from './translations.json';

export function get_page_translation(str: string) : string {
    const location : string  = useLocation().pathname.slice(1)

    let normalizedLocation = location.endsWith('/') ? location.slice(0, -1) : location;
    let pageName = (translations.Routes as Record<string, string>)[normalizedLocation];

    if (pageName && pageName.length > 0 && pageName.slice(-1) == '/')
        pageName = pageName.slice(0, -1)
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
