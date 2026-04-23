(function() {
    'use strict';

    function secureRandom() {
        const arr = new Uint32Array(1);
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(arr);
        } else {
            arr[0] = Math.floor(Math.random() * 0xffffffff);
        }
        return arr[0] / 0xffffffff;
    }

    function randomBigInt(min, max) {
        const range = max - min + 1n;
        if (range <= 0n) return min;

        const bitLength = range.toString(2).length;
        const byteLength = Math.ceil(bitLength / 8);
        const bytes = new Uint8Array(byteLength);

        crypto.getRandomValues(bytes);

        let result = 0n;
        for (let i = 0; i < byteLength; i++) {
            result = (result << 8n) + BigInt(bytes[i]);
        }

        return min + (result % range);
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

        const witnesses = [2n, 325n, 9375n, 28178n, 450775n, 9780504n, 1795265022n];

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
        const bitLenBI = BigInt(bitLen);
        const min = 2n ** (bitLenBI - 1n);
        const max = (2n ** bitLenBI) - 1n;
        let prime;
        do {
            prime = randomBigInt(min, max);
            prime |= 1n;
            prime |= (1n << (bitLenBI - 1n));
        } while (!isPrime(prime));
        return prime;
    }

    function generateSemiprime(targetBits) {
        const minBoundary = 2n ** BigInt(targetBits - 1);
        const maxBoundary = 2n ** BigInt(targetBits) - 1n;
        const maxAttempts = 50;

        // 1. Probabilistic attempt: random (p, q) pairs
        for (let i = 0; i < maxAttempts; i++) {
            const pBits = Math.floor(targetBits / 2) + (secureRandom() < 0.5 ? -1 : 1);
            const p = generatePrime(Math.max(2, pBits));
            const qMin = (minBoundary + p - 1n) / p;
            const qMax = maxBoundary / p;

            if (qMin <= qMax) {
                const q = randomBigInt(qMin, qMax);
                if (isPrime(q)) {
                    const fp = p < q ? p : q;
                    const fq = p < q ? q : p;
                    return { s: p * q, p: fp, q: fq };
                }
            }
        }

        // 2. Safe Fallback: bounded search with small p
        const smallPrimes = [3n, 5n, 7n, 11n, 13n, 17n];
        const p = smallPrimes[Math.floor(secureRandom() * smallPrimes.length)];
        const qMin = (minBoundary + p - 1n) / p;
        const qMax = maxBoundary / p;

        let q = qMin;
        if (q % 2n === 0n) q += 1n;
        let safetyCounter = 0;
        const maxSafetyLimit = 100;

        while (q <= qMax && !isPrime(q) && safetyCounter < maxSafetyLimit) {
            q += 2n;
            safetyCounter++;
        }
        const fp = p < q ? p : q;
        const fq = p < q ? q : p;
        return { s: p * q, p: fp, q: fq };
    }

    function generateNumber(currentBits) {
        if (secureRandom() < 0.5) {
            const prime = generatePrime(currentBits);
            return { value: prime, isPrime: true };
        } else {
            const semi = generateSemiprime(currentBits);
            return { value: semi.s, isPrime: false, p: semi.p, q: semi.q };
        }
    }

    window.mathUtils = { generateNumber, isPrime };
})();
