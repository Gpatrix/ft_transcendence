import translations from './translations.json';

export function gpt(str: string): string { // get_page_translation
    const general = translations.General as Record<string, string[]>;

    const language = Number(localStorage.getItem("LANGUAGE"));
    const langIndex = [0, 1, 2].includes(language) ? language : 0;

    if (general[str]) {
        return general[str][langIndex];
    }
    return `No translation found for "${str}"`;
}