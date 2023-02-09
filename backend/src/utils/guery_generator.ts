export function* alphabeticalThreeStringQueryGenerator(): Generator<string> {
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', ':'];
    const q = ['a', 'a', 'a'];
    for (let i = 2; i >= 0; i--) {
        for (let j = 0; j < alphabet.length; j++) {
            q[i] = alphabet[j];
            yield q.join('');
        }
    }

    for (let i = 2; i >= 0; i--) {
        if (i == 1) {
            q[i] = ' ';
            continue;
        }
        for (let j = 0; j < alphabet.length; j++) {
            q[i] = alphabet[j];
            yield q.join('');
        }
    }
}
