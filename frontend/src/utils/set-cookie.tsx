export function setCookie(name: string, value: string, days: number) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Convert days to milliseconds
        expires = '; expires=' + date.toUTCString(); // Set the expiration date
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/'; // Set the cookie
}
