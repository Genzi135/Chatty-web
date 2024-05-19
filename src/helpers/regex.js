const emailRegex = /@gmail.com$/;

export function checkRegex(string, type) {
    switch (type) {
        case 'email': {
            return emailRegex.test(string)
        }
    }
}