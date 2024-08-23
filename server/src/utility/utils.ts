


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
        return { valid: false, message: "Username must be at least 4 characters long." };
    }

    // Check for maximum length
    if (username.length > 20) {
        return { valid: false, message: "Username must be no more than 20 characters long." };
    }

    // Check for allowed characters
    if (!usernameRegex.test(username)) {
        return { valid: false, message: "Username can only contain letters, numbers, and underscores." };
    }

    return {valid: true, message: ""}
}

export function validatePassword(password : string) : { valid : boolean; message : string; }  {
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /\d/;

    // Check for minimum length
    if (password.length < 5) {
        return { valid: false, message: "Password must be at least 8 characters long." };
    }

    // Check for uppercase letter
    if (!uppercaseRegex.test(password)) {
        return { valid: false, message: "Password must contain at least one uppercase letter." };
    }

    // Check for number
    if (!numberRegex.test(password)) {
        return { valid: false, message: "Password must contain at least one number." };
    }
    return {valid: true, message: ""}
}