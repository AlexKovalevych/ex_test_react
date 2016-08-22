let numbers_array = [];
for(var i = 48; i < 58; i++) {
    numbers_array.push(i);
}

let upper_letters_array = [];
for(i = 65; i < 91; i++) {
    upper_letters_array.push(i);
}

let lower_letters_array = [];
for(i = 97; i < 123; i++) {
    lower_letters_array.push(i);
}

let special_chars_array = [33,35,64,36,38,42,91,93,123,125,92,47,63,58,59,95,45,53];

function shuffle(o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function randomFromInterval(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

class PasswordGenerator {
    generate(settings={uppercase: true, lowercase: true, numbers: true, specialChars: true, passwordLength: 16}) {
        let password = new Array(),
            selOptions = settings.uppercase + settings.lowercase + settings.numbers + settings.specialChars,
            selected = 0,
            no_lower_letters = new Array();

        let optionLength = Math.floor(settings.passwordLength / selOptions);

        if (settings.uppercase) {
            // uppercase letters
            for (let i = 0; i < optionLength; i++) {
                password.push(String.fromCharCode(upper_letters_array[randomFromInterval(0, upper_letters_array.length - 1)]));
            }

            no_lower_letters = no_lower_letters.concat(upper_letters_array);
            selected++;
        }

        if (settings.numbers) {
            // numbers letters
            for (let i = 0; i < optionLength; i++) {
                password.push(String.fromCharCode(numbers_array[randomFromInterval(0, numbers_array.length - 1)]));
            }

            no_lower_letters = no_lower_letters.concat(numbers_array);
            selected++;
        }

        if (settings.specialChars) {
            // numbers letters
            for (let i = 0; i < optionLength; i++) {
                password.push(String.fromCharCode(special_chars_array[randomFromInterval(0, special_chars_array.length - 1)]));
            }

            no_lower_letters = no_lower_letters.concat(special_chars_array);
            selected++;
        }

        let remained = settings.passwordLength - (selected * optionLength);
        if (settings.lowercase) {
            for (let i = 0; i < remained; i++) {
                password.push(String.fromCharCode(lower_letters_array[randomFromInterval(0, lower_letters_array.length - 1)]));
            }
        } else {
            for (let i = 0; i < remained; i++) {
                password.push(String.fromCharCode(no_lower_letters[randomFromInterval(0, no_lower_letters.length - 1)]));
            }
        }
        password = shuffle(password);

        return password.join('');
    }
}

export default new PasswordGenerator();
