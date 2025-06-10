export default function    generateCode(len: number): string {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < len; i++) {
        code.concat((chars.charAt(Math.floor(Math.random() * chars.length))).toUpperCase());
    }
    return (code);
}