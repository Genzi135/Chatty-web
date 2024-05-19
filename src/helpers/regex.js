const emailRegex = /@gmail.com$/;
const passwordRegex = /.{8,}/;

export function checkRegex(string, type) {
    switch (type) {
        case 'email': {
            return emailRegex.test(string)
        }
        case 'password': {
            return passwordRegex.test(string)
        }
    }
}