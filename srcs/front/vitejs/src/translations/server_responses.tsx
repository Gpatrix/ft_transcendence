import serverTranslations from './server.json';

export function get_server_translation(code: string) : string {
    const translation = serverTranslations[code as keyof typeof serverTranslations];
    let language : number | null = Number(localStorage.getItem("LANGUAGE"))
    const langIndex = [0, 1, 2].includes(language) ? language : 0;

    if (translation) {
        return (translation[langIndex])
    }
    return (translation["0500"][langIndex])
}
