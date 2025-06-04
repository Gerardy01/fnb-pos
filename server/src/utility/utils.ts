


export function generateOrganizationNumber(organizationName: string, count: number): string {
    const words = organizationName.split(' ');
    let initials = words[0].charAt(0).toUpperCase();
    initials += (words[1] ? words[1].charAt(0).toUpperCase() : words[0].charAt(0).toUpperCase());

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const dateStr = `${day}${month}${year}`;

    const countStr = String(count).padStart(4, '0');

    return `${initials}${dateStr}${countStr}`;
}

export function validateUsername(username : string) : { valid : boolean; message : string; } {
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    // Check for minimum length
    if (username.length < 4) {
        return { valid: false, message: "USERNAME01" }; // Username must be at least 4 characters long.
    }

    // Check for maximum length
    if (username.length > 20) {
        return { valid: false, message: "USERNAME02" }; // Username must be no more than 20 characters long.
    }

    // Check for allowed characters
    if (!usernameRegex.test(username)) {
        return { valid: false, message: "USERNAME03" }; // Username can only contain letters, numbers, and underscores.
    }

    return {valid: true, message: ""}
}

export function validatePassword(password : string) : { valid : boolean; message : string; } {
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /\d/;

    // Check for minimum length
    if (password.length < 8) {
        return { valid: false, message: "PASS01" }; // Password must be at least 8 characters long.
    }

    // Check for uppercase letter
    if (!uppercaseRegex.test(password)) {
        return { valid: false, message: "PASS02" }; // Password must contain at least one uppercase letter.
    }

    // Check for number
    if (!numberRegex.test(password)) {
        return { valid: false, message: "PASS03" }; // Password must contain at least one number.
    }
    return {valid: true, message: ""}
}

export function validateEmail(email : string) : { valid : boolean, message : string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return { valid: false, message: "EMAIL01" } // Email must be a valid email.
    }

    // check maximum length
    if (email.length > 50) {
        return { valid: false, message: "EMAIL02" } //Email cannot be longer than 50 characters
    }
    return {valid: true, message: ""}
}

export function generateCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
}

export function generateRandomPassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    
    return password;
}