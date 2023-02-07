export function* alphabeticalThreeStringQueryGenerator(): Generator<string> {
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const q = ['a', 'a', 'a'];
    for (let i = 2; i >= 0; i--) {
        for (let j = 0; j < alphabet.length; j++) {
            q[i] = alphabet[j];
            yield q.join('');
        }
    }
}
