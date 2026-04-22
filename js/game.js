const MIN_BITS = 8;
const MAX_BITS = 64;
let bits = MIN_BITS;
let currentNumber = null;

function randomBigInt(min, max) {
    const range = max - min + 1n;
    const bitLength = range.toString(2).length;
    let result;
    do {
        result = 0n;
        for (let i = 0; i < bitLength; i++) {
            if (Math.random() < 0.5) {
                result |= (1n << BigInt(i));
            }
        }
        result = min + (result % range);
    } while (result >= max + 1n || result < min); // Double check for safety, though modulo should handle most
    return result;
}

function isPrime(n) {
    if (n < 2n) return false;
    if (n === 2n || n === 3n) return true;
    if (n % 2n === 0n) return false;

    let d = n - 1n;
    let s = 0n;
    while (d % 2n === 0n) {
        d /= 2n;
        s += 1n;
    }

    const witnesses = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];

    for (const a of witnesses) {
        if (a >= n) continue;
        let x = powMod(a, d, n);
        if (x === 1n || x === n - 1n) continue;

        let composite = true;
        for (let r = 1n; r < s; r++) {
            x = powMod(x, 2n, n);
            if (x === n - 1n) {
                composite = false;
                break;
            }
        }
        if (composite) return false;
    }
    return true;
}

function powMod(a, e, m) {
    let result = 1n;
    a = a % m;
    while (e > 0n) {
        if (e % 2n === 1n) {
            result = (result * a) % m;
        }
        e = e / 2n;
        a = (a * a) % m;
    }
    return result;
}

function generatePrime(bitLen) {
    const min = 2n ** BigInt(bitLen - 1);
    const max = 2n ** BigInt(bitLen) - 1n;
    let prime;
    do {
        prime = randomBigInt(min, max);
        if (prime % 2n === 0n && prime > 2n) prime += 1n;
    } while (!isPrime(prime));
    return prime;
}

function generateSemiprime(targetBits) {
    const minBoundary = 2n ** BigInt(targetBits - 1);
    const maxBoundary = 2n ** BigInt(targetBits) - 1n;

    for (let attempt = 0; attempt < 50; attempt++) {
        const pBits = Math.floor(targetBits / 2) * 1 - (Math.random() < 0.5 ? 0 : 1);
        const p = generatePrime(pBits);

        const qMin = (minBoundary + p - 1n) / p;
        const qMax = maxBoundary / p;

        if (qMin <= qMax) {
            for (let qAttempt = 0; qAttempt < 20; qAttempt++) {
                const q = randomBigInt(qMin, qMax);
                if (isPrime(q)) {
                    return { s: p * q, p, q };
                }
            }
        }
    }

    const p = 3n;
    const qMin = (minBoundary + p - 1n) / p;
    const qMax = maxBoundary / p;
    let q = qMin;
    if (q % 2n === 0n) q += 1n;
    while (q <= qMax && !isPrime(q)) {
        q += 2n;
    }
    return { s: p * q, p, q };
}

function generateNumber(currentBits) {
    if (Math.random() < 0.5) {
        const prime = generatePrime(currentBits);
        return { value: prime, isPrime: true, isSemiprime: false };
    } else {
        const semi = generateSemiprime(currentBits);
        return { value: semi.s, isPrime: false, isSemiprime: true, p: semi.p, q: semi.q };
    }
}

function updateDisplay() {
    document.getElementById('bits').textContent = bits;
    document.getElementById('number').textContent = currentNumber.value.toString();
    document.getElementById('buttons').style.display = 'flex';
    document.getElementById('result').className = 'result';
    document.getElementById('result').style.display = 'none';
    document.getElementById('message').textContent = '';
    document.getElementById('factor').textContent = '';
}

function guess(userGuessIsPrime) {
    const isCorrect = (userGuessIsPrime === currentNumber.isPrime);

    if (isCorrect) {
        if (bits < MAX_BITS) bits++;
        document.getElementById('message').textContent = '✓ 正確！';
        document.getElementById('result').className = 'result correct';
    } else {
        if (bits > MIN_BITS) bits--;
        document.getElementById('message').textContent = '✗ 錯誤！';
        document.getElementById('result').className = 'result wrong';
    }

    if (currentNumber.isSemiprime) {
        document.getElementById('factor').textContent =
            `${currentNumber.p} × ${currentNumber.q} = ${currentNumber.value}`;
    } else {
        document.getElementById('factor').textContent = '這是一個質數';
    }

    document.getElementById('buttons').style.display = 'none';
    document.getElementById('result').style.display = 'block';
}

function nextQuestion() {
    currentNumber = generateNumber(bits);
    updateDisplay();
}

nextQuestion();
