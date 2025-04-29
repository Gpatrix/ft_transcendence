import serverTranslations from './server.json';

export function get_server_translation(code: string) : string {
    const translation = serverTranslations[code as keyof typeof serverTranslations];
    let language : number | null = Number(localStorage.getItem("LANGUAGE"))

    if (translation) {
        if (language != null)
            return (translation[language])
        return (translation[0])
    }
    return ("UNDEFINED")
}
