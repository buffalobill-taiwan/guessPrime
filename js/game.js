(function() {
    const MIN_BITS = 8;
    const MAX_BITS = 64;
    let bits = MIN_BITS;
    let currentNumber = null;

    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtx;
    }

    function playTone(freq, type = 'sine', duration = 0.2) {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + duration);
    }

    function updateDisplay() {
        document.getElementById('bits').textContent = bits;
        const numberElem = document.getElementById('number');
        numberElem.textContent = currentNumber.value.toString();
        
        // Trigger pop animation
        numberElem.classList.remove('number-pop');
        void numberElem.offsetWidth; // Trigger reflow
        numberElem.classList.add('number-pop');

        document.getElementById('buttons').style.display = 'flex';
        
        const resultElem = document.getElementById('result');
        resultElem.className = 'result';
        resultElem.style.display = 'none';
        
        document.getElementById('message').textContent = '';
        document.getElementById('factor').textContent = '';
    }

    function guess(userGuessIsPrime) {
        const isCorrect = (userGuessIsPrime === currentNumber.isPrime);

        // Update body background
        document.body.classList.remove('correct-bg', 'wrong-bg');
        if (isCorrect) {
            document.body.classList.add('correct-bg');
            playTone(880, 'sine', 0.15);
            if (navigator.vibrate) navigator.vibrate(50);
        } else {
            document.body.classList.add('wrong-bg');
            playTone(220, 'sawtooth', 0.3);
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }

        const resultElem = document.getElementById('result');
        if (isCorrect) {
            if (bits < MAX_BITS) bits++;
            document.getElementById('message').textContent = '✓ 正確！';
            resultElem.className = 'result correct';
        } else {
            if (bits > MIN_BITS) bits--;
            document.getElementById('message').textContent = '✗ 錯誤！';
            resultElem.className = 'result wrong';
        }

        if (currentNumber.isSemiprime) {
            document.getElementById('factor').textContent =
                `${currentNumber.p} × ${currentNumber.q} = ${currentNumber.value}`;
        } else {
            document.getElementById('factor').textContent = '這是一個質數';
        }

        document.getElementById('buttons').style.display = 'none';
        resultElem.style.display = 'block';
    }


    function nextQuestion() {
        document.body.classList.remove('correct-bg', 'wrong-bg');
        currentNumber = window.mathUtils.generateNumber(bits);
        updateDisplay();
    }

    // Expose only necessary functions to the global scope
    window.guess = guess;
    window.nextQuestion = nextQuestion;

    // Start the game
    nextQuestion();
})();
