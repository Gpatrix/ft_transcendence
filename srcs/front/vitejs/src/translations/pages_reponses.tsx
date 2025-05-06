import { useLocation } from 'react-router';
import translations from './translations.json';

export function get_page_translation(str: string): string {
    const location: string = useLocation().pathname.slice(1);
    const normalizedLocation = location.endsWith('/') ? location.slice(0, -1) : location;
    let pageName = (translations.Routes as Record<string, string>)[normalizedLocation];

    if (pageName && pageName.length > 0 && pageName.endsWith('/'))
        pageName = pageName.slice(0, -1);

    if (!pageName)
        return `No route match for "${location}"`;

    const pages = translations.Pages as Record<string, Record<string, string[]>>;
    const general = translations.General as Record<string, string[]>;

    const page = pages[pageName];

    const language = Number(localStorage.getItem("LANGUAGE"));
    const langIndex = [0, 1, 2].includes(language) ? language : 0;

    if (page && page[str])
        return page[str][langIndex];

    if (general[str])
        return general[str][langIndex];

    return `No translation found for "${str}" in page "${pageName}" or general`;
}
