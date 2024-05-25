/* eslint-disable default-case */
const emailRegex = /.@./;
const passwordRegex = /.{6,}/;

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