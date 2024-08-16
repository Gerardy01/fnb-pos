


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