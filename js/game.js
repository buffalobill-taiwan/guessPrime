const MIN_BITS = 8;
const MAX_BITS = 64;
let bits = MIN_BITS;
let currentNumber = null;

function updateDisplay() {
    document.getElementById('bits').textContent = bits;
    document.getElementById('number').textContent = currentNumber.value.toString();
    document.getElementById('buttons').style.display = 'flex';
    
    const resultElem = document.getElementById('result');
    resultElem.className = 'result';
    resultElem.style.display = 'none';
    
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
