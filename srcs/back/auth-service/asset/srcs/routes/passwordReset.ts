type ResetCode {
    code: string;
    expiresAt: Date;
}

const resetCodes: Map<string, ResetCode> = new Map();
