(function() {
    const MIN_BITS = 8;
    const MAX_BITS = 64;
    let bits = MIN_BITS;
    let isProcessing = false;
    let currentNumber = null;
    let focusedButton = 'yes';
    let lastGuess = 'yes';

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

    let cheatMode = false;
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let keyIndex = 0;

    function updateFocusIndicator() {
        const btnYes = document.getElementById('btn-yes');
        const btnNo = document.getElementById('btn-no');
        btnYes.classList.toggle('keyboard-focus', focusedButton === 'yes');
        btnNo.classList.toggle('keyboard-focus', focusedButton === 'no');
    }

    function switchFocus() {
        focusedButton = focusedButton === 'yes' ? 'no' : 'yes';
        updateFocusIndicator();
    }

    function updateCheatIndicator() {
        document.getElementById('result').classList.toggle('cheat-mode', cheatMode);
        if (cheatMode) {
            const notes = [523, 659, 784, 880, 1047, 784, 659, 523];
            notes.forEach((freq, i) => {
                setTimeout(() => playTone(freq, 'triangle', 0.15), i * 80);
            });
            showHint();
        } else {
            document.getElementById('btn-yes').textContent = '是質數';
            document.getElementById('btn-no').textContent = '不是質數';
        }
    }

    function showHint() {
        if (cheatMode && currentNumber) {
            const hint = currentNumber.isPrime ? '👉' : '👉';
            const btnYes = document.getElementById('btn-yes');
            const btnNo = document.getElementById('btn-no');
            if (currentNumber.isPrime) {
                btnYes.textContent = hint + '是質數';
                btnNo.textContent = '不是質數';
            } else {
                btnYes.textContent = '是質數';
                btnNo.textContent = hint + '不是質數';
            }
        }
    }

    function updateDisplay() {
        document.getElementById('bits').textContent = bits;
        const numberElem = document.getElementById('number');
        numberElem.textContent = currentNumber.value.toString();
        
        numberElem.style.fontSize = bits >= 40 ? '1.5rem' : '3rem';
        
        numberElem.classList.remove('number-pop');
        void numberElem.offsetWidth;
        numberElem.classList.add('number-pop');

        document.getElementById('buttons').style.display = 'flex';
        
        const resultElem = document.getElementById('result');
        resultElem.className = 'result';
        resultElem.style.display = 'none';
        
        document.getElementById('message').textContent = '';
        document.getElementById('factor').textContent = '';

        updateFocusIndicator();
    }

    function guess(userGuessIsPrime) {
        if (isProcessing) return;
        isProcessing = true;

        const isCorrect = (userGuessIsPrime === currentNumber.isPrime);
        lastGuess = userGuessIsPrime ? 'yes' : 'no';

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

        if (!currentNumber.isPrime) {
            document.getElementById('factor').textContent =
                `${currentNumber.p} × ${currentNumber.q} = ${currentNumber.value}`;
        } else {
            document.getElementById('factor').textContent = '這是一個質數';
        }

        document.getElementById('buttons').style.display = 'none';
        resultElem.style.display = 'block';
        document.getElementById('btn-next').focus();

        setTimeout(() => { isProcessing = false; }, 300);
    }


    function nextQuestion() {
        document.body.classList.remove('correct-bg', 'wrong-bg');
        currentNumber = window.mathUtils.generateNumber(bits);
        focusedButton = lastGuess;
        updateDisplay();
        showHint();
    }

    // Expose only necessary functions to the global scope
    window.guess = guess;
    window.nextQuestion = nextQuestion;

    // Setup event listeners
    document.getElementById('btn-yes').addEventListener('click', () => guess(true));
    document.getElementById('btn-no').addEventListener('click', () => guess(false));
    document.getElementById('btn-next').addEventListener('click', nextQuestion);

    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[keyIndex]) {
            keyIndex++;
            if (keyIndex === konamiCode.length) {
                cheatMode = !cheatMode;
                keyIndex = 0;
                updateCheatIndicator();
            }
        } else {
            keyIndex = 0;
        }

        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
            e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            if (document.getElementById('buttons').style.display !== 'none') {
                e.preventDefault();
                switchFocus();
            }
        }
        if (e.key === 'Enter') {
            if (document.getElementById('result').style.display === 'block') {
                e.preventDefault();
                nextQuestion();
            } else if (document.getElementById('buttons').style.display !== 'none') {
                e.preventDefault();
                guess(focusedButton === 'yes');
            }
        }
    });

    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('portrait').catch(() => {});
    }

    nextQuestion();
})();
