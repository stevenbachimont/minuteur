class ChessTimer {
    constructor() {
        this.player1Time = 600; // 10 minutes en secondes
        this.player2Time = 600;
        this.currentPlayer = null;
        this.interval = null;
        this.isRunning = false;

        this.player1Element = document.getElementById('player1');
        this.player2Element = document.getElementById('player2');
        this.startButton = document.getElementById('start');
        this.resetButton = document.getElementById('reset');

        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        this.player1Element.addEventListener('click', () => this.switchPlayer(1));
        this.player2Element.addEventListener('click', () => this.switchPlayer(2));
        this.startButton.addEventListener('click', () => this.toggleTimer());
        this.resetButton.addEventListener('click', () => this.reset());
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    updateDisplay() {
        this.player1Element.querySelector('.timer').textContent = 
            this.formatTime(this.player1Time);
        this.player2Element.querySelector('.timer').textContent = 
            this.formatTime(this.player2Time);
    }

    switchPlayer(player) {
        if (!this.isRunning) return;
        
        this.player1Element.classList.remove('active');
        this.player2Element.classList.remove('active');

        if (player === 1) {
            this.currentPlayer = 1;
            this.player1Element.classList.add('active');
        } else {
            this.currentPlayer = 2;
            this.player2Element.classList.add('active');
        }
    }

    toggleTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startButton.textContent = 'Pause';
            this.currentPlayer = 1;
            this.player1Element.classList.add('active');
            this.startInterval();
        } else {
            this.isRunning = false;
            this.startButton.textContent = 'Démarrer';
            this.clearInterval();
        }
    }

    startInterval() {
        this.interval = setInterval(() => {
            if (this.currentPlayer === 1) {
                this.player1Time--;
            } else {
                this.player2Time--;
            }

            if (this.player1Time <= 0 || this.player2Time <= 0) {
                this.gameOver();
            }

            this.updateDisplay();
        }, 1000);
    }

    clearInterval() {
        clearInterval(this.interval);
        this.interval = null;
    }

    gameOver() {
        this.isRunning = false;
        this.clearInterval();
        this.startButton.textContent = 'Démarrer';
        alert(`Partie terminée ! ${this.currentPlayer === 1 ? 'Joueur 2' : 'Joueur 1'} gagne !`);
    }

    reset() {
        this.player1Time = 600;
        this.player2Time = 600;
        this.currentPlayer = null;
        this.isRunning = false;
        this.clearInterval();
        this.startButton.textContent = 'Démarrer';
        this.player1Element.classList.remove('active');
        this.player2Element.classList.remove('active');
        this.updateDisplay();
    }
}

const timer = new ChessTimer(); 