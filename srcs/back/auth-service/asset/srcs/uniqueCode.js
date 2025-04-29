"use strict";
function generateCode(len) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < len; i++) {
        code.concat((chars.charAt(Math.floor(Math.random() * chars.length))).toUpperCase());
    }
    return (code);
}
module.exports = generateCode;
