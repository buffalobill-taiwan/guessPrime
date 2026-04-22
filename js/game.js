(function() {
    const MIN_BITS = 8;
    const MAX_BITS = 64;
    let bits = MIN_BITS;
    let currentNumber = null;

    // Audio context for synthesized sounds
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playTone(freq, type = 'sine', duration = 0.2) {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
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
            playTone(880, 'sine', 0.15); // High pitch for correct
        } else {
            document.body.classList.add('wrong-bg');
            playTone(220, 'sawtooth', 0.3); // Low, harsh pitch for wrong
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
        document.body.classList.remove('correct-bg', 'wrong-bg');
        currentNumber = generateNumber(bits);
        updateDisplay();
    }

    // Expose only necessary functions to the global scope
    window.guess = guess;
    window.nextQuestion = nextQuestion;

    // Start the game
    nextQuestion();
})();
