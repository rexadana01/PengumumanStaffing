/**
 * @class LudoGame
 * @description Mengelola seluruh logika, status, dan interaksi UI untuk permainan Ludo berbasis kuis.
 */
class LudoGame {
  /**
   * @description Menginisialisasi state awal permainan, layout papan, dan event listener.
   */
  constructor() {
    // Properti Status Permainan
    this.gameStarted = false;
    this.gameEnded = false;
    this.isAnimating = false;
    this.isStealPhase = false;
    this.isSpecialZoneQuestion = false;

    // Properti Tim & Skor
    this.teams = ["red", "blue", "yellow", "green"];
    this.teamNames = {
      red: "Merah",
      blue: "Biru",
      yellow: "Kuning",
      green: "Hijau",
    };
    this.scores = { red: 0, blue: 0, yellow: 0, green: 0 };
    this.positions = { red: -1, blue: -1, yellow: -1, green: -1 };

    // Properti Giliran & Pertanyaan
    this.currentTeam = 0;
    this.questionCount = 0;
    this.maxQuestions = 20;
    this.currentDifficulty = null;
    this.stealingTeam = null;
    this.turnToResume = null;

    // Properti Timer
    this.timer = null;
    // this.stealTimer = null;
    this.timeLeft = 0;
    // this.stealTimeLeft = 0;

    // Konfigurasi Papan
    this.boardLayout = this.createBoardLayout();
    this.paths = this.createPaths();

    // Inisialisasi UI setelah DOM siap
    setTimeout(() => {
      this.initializeBoard();
      this.initializeEventListeners();
      this.updateDisplay();
    }, 100);
  }

  // =======================================================================
  // 1. Inisialisasi dan Konfigurasi
  // =======================================================================

  /**
   * @description Membuat struktur data untuk semua kotak di papan permainan.
   * @returns {object[]} Array objek yang merepresentasikan setiap kotak di papan.
   */
  createBoardLayout() {
    const layout = [];
    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        const square = {
          id: row * 15 + col,
          row,
          col,
          type: "empty",
          team: null,
        };
        if (row === 6 && col >= 1 && col <= 5) {
          square.type = "path";
          if (col === 2) {
            square.type = "start";
            square.team = "blue";
          }
        }
        if (row === 8 && col >= 9 && col <= 13) {
          square.type = "path";
          if (col === 12) {
            square.type = "start";
            square.team = "green";
          }
        }
        if (col === 6 && row >= 9 && row <= 13) {
          square.type = "path";
          if (row === 12) {
            square.type = "start";
            square.team = "red";
          }
        }
        if (col === 8 && row >= 1 && row <= 5) {
          square.type = "path";
          if (row === 2) {
            square.type = "start";
            square.team = "yellow";
          }
        }
        if (row === 8 && col >= 1 && col <= 5) square.type = "path";
        if (row === 6 && col >= 9 && col <= 13) square.type = "path";
        if (col === 6 && row >= 1 && row <= 5) square.type = "path";
        if (col === 8 && row >= 9 && row <= 13) square.type = "path";
        if (row === 2 && col === 6) {
          square.type = "special";
          square.team = "red";
        }
        if (row === 6 && col === 12) {
          square.type = "special";
          square.team = "blue";
        }
        if (row === 12 && col === 8) {
          square.type = "special";
          square.team = "yellow";
        }
        if (row === 8 && col === 2) {
          square.type = "special";
          square.team = "green";
        }
        if (row === 7) {
          if (col >= 1 && col <= 6) {
            square.type = "colored";
            square.team = "blue";
            if (col === 6) square.type = "checkpoint";
          } else if (col >= 8 && col <= 13) {
            square.type = "colored";
            square.team = "green";
            if (col === 8) square.type = "checkpoint";
          }
        }
        if (col === 7) {
          if (row >= 1 && row <= 6) {
            square.type = "colored";
            square.team = "yellow";
            if (row === 6) square.type = "checkpoint";
          } else if (row >= 8 && row <= 13) {
            square.type = "colored";
            square.team = "red";
            if (row === 8) square.type = "checkpoint";
          }
        }
        if (row === 7 && col === 7) square.type = "center";
        if (square.type !== "empty") layout.push(square);
      }
    }
    return layout;
  }

  /**
   * @description Membuat data jalur (path) untuk setiap tim.
   * @returns {object} Objek yang berisi array koordinat jalur untuk setiap tim.
   */
  createPaths() {
    return {
      red: [
        { row: 12, col: 6 },
        { row: 11, col: 6 },
        { row: 10, col: 6 },
        { row: 9, col: 6 },
        { row: 8, col: 5 },
        { row: 8, col: 4 },
        { row: 8, col: 3 },
        { row: 8, col: 2 },
        { row: 8, col: 1 },
        { row: 7, col: 1 },
        { row: 6, col: 1 },
        { row: 6, col: 2 },
        { row: 6, col: 3 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 5, col: 6 },
        { row: 4, col: 6 },
        { row: 3, col: 6 },
        { row: 2, col: 6 },
        { row: 1, col: 6 },
        { row: 1, col: 7 },
        { row: 1, col: 8 },
        { row: 2, col: 8 },
        { row: 3, col: 8 },
        { row: 4, col: 8 },
        { row: 5, col: 8 },
        { row: 6, col: 9 },
        { row: 6, col: 10 },
        { row: 6, col: 11 },
        { row: 6, col: 12 },
        { row: 6, col: 13 },
        { row: 7, col: 13 },
        { row: 8, col: 13 },
        { row: 8, col: 12 },
        { row: 8, col: 11 },
        { row: 8, col: 10 },
        { row: 8, col: 9 },
        { row: 9, col: 8 },
        { row: 10, col: 8 },
        { row: 11, col: 8 },
        { row: 12, col: 8 },
        { row: 13, col: 8 },
        { row: 13, col: 7 },
        { row: 12, col: 7 },
        { row: 11, col: 7 },
        { row: 10, col: 7 },
        { row: 9, col: 7 },
        { row: 8, col: 7 },
      ],
      blue: [
        { row: 6, col: 2 },
        { row: 6, col: 3 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 5, col: 6 },
        { row: 4, col: 6 },
        { row: 3, col: 6 },
        { row: 2, col: 6 },
        { row: 1, col: 6 },
        { row: 1, col: 7 },
        { row: 1, col: 8 },
        { row: 2, col: 8 },
        { row: 3, col: 8 },
        { row: 4, col: 8 },
        { row: 5, col: 8 },
        { row: 6, col: 9 },
        { row: 6, col: 10 },
        { row: 6, col: 11 },
        { row: 6, col: 12 },
        { row: 6, col: 13 },
        { row: 7, col: 13 },
        { row: 8, col: 13 },
        { row: 8, col: 12 },
        { row: 8, col: 11 },
        { row: 8, col: 10 },
        { row: 8, col: 9 },
        { row: 9, col: 8 },
        { row: 10, col: 8 },
        { row: 11, col: 8 },
        { row: 12, col: 8 },
        { row: 13, col: 8 },
        { row: 13, col: 7 },
        { row: 13, col: 6 },
        { row: 12, col: 6 },
        { row: 11, col: 6 },
        { row: 10, col: 6 },
        { row: 9, col: 6 },
        { row: 8, col: 5 },
        { row: 8, col: 4 },
        { row: 8, col: 3 },
        { row: 8, col: 2 },
        { row: 8, col: 1 },
        { row: 7, col: 1 },
        { row: 7, col: 2 },
        { row: 7, col: 3 },
        { row: 7, col: 4 },
        { row: 7, col: 5 },
        { row: 7, col: 6 },
      ],
      yellow: [
        { row: 2, col: 8 },
        { row: 3, col: 8 },
        { row: 4, col: 8 },
        { row: 5, col: 8 },
        { row: 6, col: 9 },
        { row: 6, col: 10 },
        { row: 6, col: 11 },
        { row: 6, col: 12 },
        { row: 6, col: 13 },
        { row: 7, col: 13 },
        { row: 8, col: 13 },
        { row: 8, col: 12 },
        { row: 8, col: 11 },
        { row: 8, col: 10 },
        { row: 8, col: 9 },
        { row: 9, col: 8 },
        { row: 10, col: 8 },
        { row: 11, col: 8 },
        { row: 12, col: 8 },
        { row: 13, col: 8 },
        { row: 13, col: 7 },
        { row: 13, col: 6 },
        { row: 12, col: 6 },
        { row: 11, col: 6 },
        { row: 10, col: 6 },
        { row: 9, col: 6 },
        { row: 8, col: 5 },
        { row: 8, col: 4 },
        { row: 8, col: 3 },
        { row: 8, col: 2 },
        { row: 8, col: 1 },
        { row: 7, col: 1 },
        { row: 6, col: 1 },
        { row: 6, col: 2 },
        { row: 6, col: 3 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 5, col: 6 },
        { row: 4, col: 6 },
        { row: 3, col: 6 },
        { row: 2, col: 6 },
        { row: 1, col: 6 },
        { row: 1, col: 7 },
        { row: 2, col: 7 },
        { row: 3, col: 7 },
        { row: 4, col: 7 },
        { row: 5, col: 7 },
        { row: 6, col: 7 },
      ],
      green: [
        { row: 8, col: 12 },
        { row: 8, col: 11 },
        { row: 8, col: 10 },
        { row: 8, col: 9 },
        { row: 9, col: 8 },
        { row: 10, col: 8 },
        { row: 11, col: 8 },
        { row: 12, col: 8 },
        { row: 13, col: 8 },
        { row: 13, col: 7 },
        { row: 13, col: 6 },
        { row: 12, col: 6 },
        { row: 11, col: 6 },
        { row: 10, col: 6 },
        { row: 9, col: 6 },
        { row: 8, col: 5 },
        { row: 8, col: 4 },
        { row: 8, col: 3 },
        { row: 8, col: 2 },
        { row: 8, col: 1 },
        { row: 7, col: 1 },
        { row: 6, col: 1 },
        { row: 6, col: 2 },
        { row: 6, col: 3 },
        { row: 6, col: 4 },
        { row: 6, col: 5 },
        { row: 5, col: 6 },
        { row: 4, col: 6 },
        { row: 3, col: 6 },
        { row: 2, col: 6 },
        { row: 1, col: 6 },
        { row: 1, col: 7 },
        { row: 1, col: 8 },
        { row: 2, col: 8 },
        { row: 3, col: 8 },
        { row: 4, col: 8 },
        { row: 5, col: 8 },
        { row: 6, col: 9 },
        { row: 6, col: 10 },
        { row: 6, col: 11 },
        { row: 6, col: 12 },
        { row: 6, col: 13 },
        { row: 7, col: 13 },
        { row: 7, col: 12 },
        { row: 7, col: 11 },
        { row: 7, col: 10 },
        { row: 7, col: 9 },
        { row: 7, col: 8 },
      ],
    };
  }

  /**
   * @description Merender papan permainan, area 'home', dan pion ke dalam DOM.
   */
  initializeBoard() {
    const board = document.getElementById("gameBoard");
    board.innerHTML = "";
    const homeAreas = [
      { team: "blue", gridRow: "2 / span 5", gridColumn: "2 / span 5" },
      { team: "yellow", gridRow: "2 / span 5", gridColumn: "10 / span 5" },
      { team: "red", gridRow: "10 / span 5", gridColumn: "2 / span 5" },
      { team: "green", gridRow: "10 / span 5", gridColumn: "10 / span 5" },
    ];

    // --- Logika Penambahan Simbol di Homebase ---
    const homeSymbols = {
      red: "🔥",
      blue: "💧",
      yellow: "⚡",
      green: "🍃",
    };

    homeAreas.forEach((home) => {
      const homeAreaEl = document.createElement("div");
      homeAreaEl.classList.add("home-area", home.team);
      homeAreaEl.style.gridRow = home.gridRow;
      homeAreaEl.style.gridColumn = home.gridColumn;

      // Tambahkan elemen untuk simbol
      const homeSymbolEl = document.createElement("div");
      homeSymbolEl.classList.add("home-symbol");
      homeSymbolEl.textContent = homeSymbols[home.team] || "";
      homeAreaEl.appendChild(homeSymbolEl);

      // Buat dan tambahkan pion
      const piece = document.createElement("div");
      piece.classList.add("piece", home.team);
      piece.id = `piece-${home.team}`;
      piece.textContent = home.team.charAt(0).toUpperCase();
      homeAreaEl.appendChild(piece);

      board.appendChild(homeAreaEl);
    });
    // --- Akhir Logika Penambahan Simbol ---

    this.boardLayout.forEach((square) => {
      const squareEl = document.createElement("div");
      squareEl.classList.add("square", square.type);
      if (square.team) squareEl.classList.add(square.team);
      squareEl.id = `square-${square.id}`;
      squareEl.style.gridRow = square.row + 1;
      squareEl.style.gridColumn = square.col + 1;

      if (square.type === "start") squareEl.textContent = "★";
      else if (square.type === "special") {
        if (square.team === "red") squareEl.textContent = "🔥";
        else if (square.team === "blue") squareEl.textContent = "💧";
        else if (square.team === "yellow") squareEl.textContent = "⚡";
        else if (square.team === "green") squareEl.textContent = "🍃";
      } else if (square.type === "checkpoint") squareEl.textContent = "♦";
      else if (square.type === "center") squareEl.textContent = "♔";

      board.appendChild(squareEl);
    });
  }

  /**
   * @description Menambahkan semua event listener yang dibutuhkan untuk interaksi UI.
   */
  initializeEventListeners() {
    document
      .getElementById("startGame")
      .addEventListener("click", () => this.startGame());
    document
      .getElementById("resetGame")
      .addEventListener("click", () => this.resetGame());
    document.getElementById("showRules").addEventListener("click", () => {
      document.getElementById("rulesModal").style.display = "block";
    });
    document.querySelector(".close").addEventListener("click", () => {
      document.getElementById("rulesModal").style.display = "none";
    });
    document.querySelectorAll(".difficulty-btn").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.selectDifficulty(e.target.dataset.difficulty)
      );
    });
    document
      .getElementById("correctAnswer")
      .addEventListener("click", () => this.handleOperatorValidation(true));
    document
      .getElementById("wrongAnswer")
      .addEventListener("click", () => this.handleOperatorValidation(false));
    document
      .getElementById("stealCorrectAnswer")
      .addEventListener("click", () => this.handleStealValidation(true));
    document
      .getElementById("stealWrongAnswer")
      .addEventListener("click", () => this.handleStealValidation(false));
    document.querySelectorAll(".steal-btn").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.handleSteal(e.target.dataset.team)
      );
    });
    document
      .getElementById("skipStealButton")
      .addEventListener("click", () => this.nextTurn());
    document.getElementById("playAgain").addEventListener("click", () => {
      document.getElementById("gameOverModal").style.display = "none";
      this.resetGame();
    });

    window.addEventListener("click", (e) => {
      const rulesModal = document.getElementById("rulesModal");
      const gameOverModal = document.getElementById("gameOverModal");
      if (e.target === rulesModal) rulesModal.style.display = "none";
      if (e.target === gameOverModal) gameOverModal.style.display = "none";
    });
  }

  // =======================================================================
  // 2. Alur Utama Permainan
  // =======================================================================

  /**
   * @description Memulai permainan dengan mengatur ulang status dan memulai giliran pertama.
   */
  startGame() {
    this.gameStarted = true;
    this.gameEnded = false;
    this.questionCount = 0;
    this.currentTeam = 0;
    this.isStealPhase = false;
    this.isSpecialZoneQuestion = false;
    this.stealingTeam = null;
    this.currentDifficulty = null;
    document.getElementById("startGame").style.display = "none";
    this.advanceTurn();
  }

  /**
   * @description Mengatur ulang seluruh status permainan dan UI ke kondisi awal.
   */
  resetGame() {
    if (this.timer) clearInterval(this.timer);
    // if (this.stealTimer) clearInterval(this.stealTimer);
    this.timer = null;
    // this.stealTimer = null;

    this.gameStarted = false;
    this.gameEnded = false;
    this.questionCount = 0;
    this.currentTeam = 0;
    this.isStealPhase = false;
    this.isAnimating = false;
    this.isSpecialZoneQuestion = false;
    this.turnToResume = null;
    this.timeLeft = 0;
    // this.stealTimeLeft = 0;
    this.scores = { red: 0, blue: 0, yellow: 0, green: 0 };
    this.positions = { red: -1, blue: -1, yellow: -1, green: -1 };

    document.getElementById("startGame").style.display = "inline-block";
    document.getElementById("difficultySelection").style.display = "none";
    document.getElementById("operatorSection").style.display = "none";
    document.getElementById("stealSection").style.display = "none";
    document.getElementById("stealValidationSection").style.display = "none";
    document.getElementById("statusText").textContent =
      'Klik "Mulai Permainan" untuk memulai';
    document.getElementById("timer").textContent = "10";
    document.getElementById("timer").classList.remove("warning", "stopped");

    this.teams.forEach((team) => {
      const piece = document.getElementById(`piece-${team}`);
      const homeArea = document.querySelector(`.home-area.${team}`);
      if (homeArea && piece) {
        if (piece.parentNode && piece.parentNode !== homeArea)
          piece.parentNode.removeChild(piece);
        if (!homeArea.contains(piece)) homeArea.appendChild(piece);
        piece.classList.remove("moving", "bouncing", "celebrating", "glowing");
      }
    });
    this.updateDisplay();
  }

  /**
   * @description Memproses dan menyiapkan giliran berikutnya untuk tim yang sesuai.
   */
  advanceTurn() {
    if (this.questionCount >= this.maxQuestions || this.gameEnded) {
      this.endGame();
      return;
    }

    this.isStealPhase = false;
    this.isSpecialZoneQuestion = false;
    this.stealingTeam = null;
    this.currentDifficulty = null;

    if (this.timer) clearInterval(this.timer);
    // if (this.stealTimer) clearInterval(this.stealTimer);
    this.timer = null;
    // this.stealTimer = null;

    const sections = [
      "operatorSection",
      "stealSection",
      "stealValidationSection",
      "difficultySelection",
    ];
    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) section.style.display = "none";
    });

    const timerElement = document.getElementById("timer");
    if (timerElement) {
      timerElement.textContent = "10";
      timerElement.classList.remove("warning", "stopped");
    }
    this.updateDisplay();
    this.showDifficultySelection();
  }

  /**
   * @description Memindahkan alur ke tim berikutnya setelah giliran normal atau fase rebutan gagal.
   */
  nextTurn() {
    if (this.turnToResume !== null) {
      this.currentTeam = this.turnToResume;
      this.turnToResume = null;
    } else {
      this.currentTeam = (this.currentTeam + 1) % this.teams.length;
    }
    this.isStealPhase = false;
    this.stealingTeam = null;
    this.currentDifficulty = null;
    this.advanceTurn();
  }

  /**
   * @description Menyelesaikan giliran saat ini dan melanjutkan ke tim berikutnya.
   */
  endTurnAndAdvance() {
    if (this.turnToResume !== null) {
      this.currentTeam = this.turnToResume;
      this.turnToResume = null;
    } else {
      this.currentTeam = (this.currentTeam + 1) % this.teams.length;
    }
    this.advanceTurn();
  }

  /**
   * @description Mengakhiri permainan dan menampilkan pemenang.
   * @param {string | null} [winner=null] Tim yang menang, atau null jika ditentukan oleh skor tertinggi.
   */
  endGame(winner = null) {
    this.gameEnded = true;
    if (this.timer) clearInterval(this.timer);
    if (this.stealTimer) clearInterval(this.stealTimer);
    this.timer = null;
    this.stealTimer = null;

    const modal = document.getElementById("gameOverModal");
    const winnerMessage = document.getElementById("winnerMessage");
    const finalScores = document.getElementById("finalScores");

    if (winner) {
      winnerMessage.innerHTML = `<h3>🎉 Tim ${this.teamNames[winner]} Menang! 🎉</h3>`;
    } else {
      let highestScore = -1;
      let winningTeam = null;
      for (const team of this.teams) {
        if (this.scores[team] > highestScore) {
          highestScore = this.scores[team];
          winningTeam = team;
        }
      }
      if (winningTeam) {
        winnerMessage.innerHTML = `<h3>🎉 Tim ${this.teamNames[winningTeam]} Menang dengan Skor Tertinggi! 🎉</h3>`;
      } else {
        winnerMessage.innerHTML = `<h3>Permainan Berakhir!</h3>`;
      }
    }

    let scoresHTML = "<h4>Skor Akhir:</h4><ul>";
    for (const team of this.teams) {
      scoresHTML += `<li>${this.teamNames[team]}: ${this.scores[team]} poin</li>`;
    }
    scoresHTML += "</ul>";
    finalScores.innerHTML = scoresHTML;
    modal.style.display = "block";
  }

  // =======================================================================
  // 3. Logika Pertanyaan dan Jawaban
  // =======================================================================

  /**
   * @description Menampilkan UI untuk pemilihan tingkat kesulitan soal.
   */
  showDifficultySelection() {
    if (this.questionCount >= this.maxQuestions || this.gameEnded) {
      this.endGame();
      return;
    }
    document.getElementById("difficultySelection").style.display = "block";
    const sectionsToHide = [
      "operatorSection",
      "stealSection",
      "stealValidationSection",
    ];
    sectionsToHide.forEach((id) => {
      document.getElementById(id).style.display = "none";
    });

    const currentTeamName = this.teams[this.currentTeam];
    document.getElementById(
      "statusText"
    ).textContent = `Tim ${this.teamNames[currentTeamName]}, pilih tingkat kesulitan soal:`;
  }

  /**
   * @description Mengatur status permainan berdasarkan tingkat kesulitan yang dipilih.
   * @param {string} difficulty - Tingkat kesulitan ('easy', 'medium', 'hard', 'special').
   */
  selectDifficulty(difficulty) {
    if (
      !difficulty ||
      !["easy", "medium", "hard", "special"].includes(difficulty)
    ) {
      console.error("Invalid difficulty:", difficulty);
      return;
    }
    this.currentDifficulty = difficulty;
    if (this.currentDifficulty !== "special") {
      this.questionCount++;
    }
    const sections = [
      "difficultySelection",
      "operatorSection",
      "stealSection",
      "stealValidationSection",
    ];
    sections.forEach((id) => {
      document.getElementById(id).style.display = "none";
    });
    this.showOperatorSection();
  }

  /**
   * @description Menampilkan UI untuk operator memvalidasi jawaban tim.
   */
  showOperatorSection() {
    document.getElementById("operatorSection").style.display = "block";
    const difficultyBadge = document.getElementById("difficultyBadge");
    difficultyBadge.textContent = this.getDifficultyText(
      this.currentDifficulty
    );
    difficultyBadge.className = `difficulty-badge ${this.currentDifficulty}`;

    const currentTeamName = this.teams[this.currentTeam];
    document.getElementById(
      "statusText"
    ).textContent = `Soal ${this.getDifficultyText(
      this.currentDifficulty
    )} untuk Tim ${this.teamNames[currentTeamName]}`;

    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = "⏸";
    timerElement.classList.add("stopped");
    timerElement.classList.remove("warning");
    this.updateDisplay();
  }

  /**
   * @description Menangani hasil validasi dari operator (jawaban benar atau salah).
   * @param {boolean} isCorrect - True jika jawaban benar, false jika salah.
   * @async
   */
  async handleOperatorValidation(isCorrect) {
    document.getElementById("operatorSection").style.display = "none";
    if (isCorrect) {
      await this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }
  }

  /**
   * @description Memproses logika saat jawaban tim benar.
   * @param {boolean} [isSteal=false] - True jika ini adalah hasil dari rebutan soal.
   * @async
   */
  async handleCorrectAnswer(isSteal = false) {
    const currentTeamName = this.teams[this.currentTeam];
    const points = isSteal
      ? this.getStealPoints(this.currentDifficulty)
      : this.getPoints(this.currentDifficulty);
    const steps = isSteal
      ? this.getStealSteps(this.currentDifficulty)
      : this.getSteps(this.currentDifficulty);
    this.scores[currentTeamName] += points;

    const landedOnSpecial = await this.movePiece(currentTeamName, steps);
    if (landedOnSpecial) {
      this.updateDisplay();
      return;
    }

    const position = this.positions[currentTeamName];
    const teamPath = this.paths[currentTeamName];
    if (position >= teamPath.length - 1) {
      this.endGame(currentTeamName);
      return;
    }
    this.endTurnAndAdvance();
  }

  /**
   * @description Memproses logika saat jawaban tim salah.
   * @async
   */
  async handleWrongAnswer() {
    if (this.isSpecialZoneQuestion && !this.isStealPhase) {
      const currentTeamName = this.teams[this.currentTeam];
      this.isAnimating = false;
      await this.movePieceBackward(currentTeamName, 2);
      await this.delay(400);
      this.isSpecialZoneQuestion = false;
      this.endTurnAndAdvance();
      return;
    }

    if (!this.isStealPhase) {
      this.showStealPhase();
    } else {
      this.nextTurn();
    }
  }

  // =======================================================================
  // 4. Logika Fase Rebutan (Steal)
  // =======================================================================

  /**
   * @description Memulai fase rebutan soal setelah jawaban salah.
   */
  showStealPhase() {
    this.isStealPhase = true;
    document.getElementById("stealSection").style.display = "block";
    const currentTeamName = this.teams[this.currentTeam];
    document.querySelectorAll(".steal-btn").forEach((btn) => {
      btn.style.display =
        btn.dataset.team === currentTeamName ? "none" : "inline-block";
    });

    // this.stealTimeLeft = 5;
    // this.updateStealTimer();
    // this.stealTimer = setInterval(() => {
    //   this.stealTimeLeft--;
    //   this.updateStealTimer();
    //   if (this.stealTimeLeft <= 0) {
    //     clearInterval(this.stealTimer);
    //     this.stealTimer = null;
    //     this.nextTurn();
    //   }
    // }, 1000);
    document.getElementById("statusText").textContent =
      "Jawaban salah! Tim lain dapat merebut soal ini.";
  }

  /**
   * @description Menangani event saat tim lain mencoba merebut soal.
   * @param {string} team - Tim yang merebut.
   */
  handleSteal(team) {
    if (!this.isStealPhase) return;
    // if (this.stealTimer) clearInterval(this.stealTimer);
    // this.stealTimer = null;
    this.stealingTeam = team;

    document.getElementById("stealSection").style.display = "none";
    document.getElementById("stealValidationSection").style.display = "block";
    document.getElementById("stealingTeam").textContent = this.teamNames[team];
    document.getElementById(
      "statusText"
    ).textContent = `Tim ${this.teamNames[team]} mencoba merebut soal.`;
    document.getElementById("timer").textContent = "⏸";
    document.getElementById("timer").classList.add("stopped");
    document.getElementById("timer").classList.remove("warning");
  }

  /**
   * @description Memvalidasi jawaban dari tim yang merebut.
   * @param {boolean} isCorrect - True jika jawaban rebutan benar.
   * @async
   */
  async handleStealValidation(isCorrect) {
    document.getElementById("stealValidationSection").style.display = "none";
    if (isCorrect) {
      const originalTeamIndex = this.currentTeam;
      this.turnToResume = (originalTeamIndex + 1) % this.teams.length;
      this.currentTeam = this.teams.indexOf(this.stealingTeam);
      await this.handleCorrectAnswer(true);
      this.updateDisplay();
    } else {
      this.nextTurn();
    }
  }

  // =======================================================================
  // 5. Gerakan Pion dan Interaksi Papan
  // =======================================================================

  /**
   * @description Menggerakkan pion sebuah tim maju sebanyak beberapa langkah.
   * @param {string} team - Tim yang pionnya bergerak.
   * @param {number} steps - Jumlah langkah maju.
   * @returns {Promise<boolean>} True jika pion mendarat di kotak spesial.
   * @async
   */
  async movePiece(team, steps) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const piece = document.getElementById(`piece-${team}`);
    const currentPosition = this.positions[team];
    const teamPath = this.paths[team];
    const newPosition =
      currentPosition === -1
        ? Math.min(steps, teamPath.length - 1)
        : Math.min(currentPosition + steps, teamPath.length - 1);

    await this.animateStepByStep(
      piece,
      team,
      currentPosition,
      newPosition,
      teamPath
    );
    this.positions[team] = newPosition;
    const landedOnSpecial = this.handleSpecialSquares(team, newPosition);
    this.isAnimating = false;
    return landedOnSpecial;
  }

  /**
   * @description Menggerakkan pion sebuah tim mundur sebanyak beberapa langkah.
   * @param {string} team - Tim yang pionnya bergerak.
   * @param {number} steps - Jumlah langkah mundur.
   * @async
   */
  async movePieceBackward(team, steps) {
    if (this.isAnimating) return;
    this.isAnimating = true;
    const piece = document.getElementById('piece-${team}');
    const currentPosition = this.positions[team];
    const teamPath = this.paths[team];
    const newPosition = Math.max(currentPosition - steps, 0);
    if (newPosition < 0) {
      await this.sendToBasecamp(team);
      this.isAnimating = false;
      return;
    }
    await this.animateStepByStepBackward(
      piece,
      team,
      currentPosition,
      newPosition,
      teamPath
    );
    this.positions[team] = newPosition;
    this.checkCollisions(team, newPosition);
    this.isAnimating = false;
  }
  /**
   * @description Memeriksa tabrakan dan menangani efeknya.
   * @param {string} team - Tim yang baru saja bergerak.
   * @param {number} position - Posisi baru dari pion tim tersebut.
   */
  checkCollisions(team, position) {
    const teamPath = this.paths[team];
    if (position < 0 || position >= teamPath.length) return;
    const currentSquare = teamPath[position];
    for (const otherTeam of this.teams) {
      if (otherTeam === team) continue;
      const otherPosition = this.positions[otherTeam];
      if (otherPosition >= 0) {
        const otherPath = this.paths[otherTeam];
        if (otherPosition < otherPath.length) {
          const otherSquare = otherPath[otherPosition];
          if (
            currentSquare.row === otherSquare.row &&
            currentSquare.col === otherSquare.col
          ) {
            const square = this.boardLayout.find(
              (s) => s.row === currentSquare.row && s.col === currentSquare.col
            );
            if (square && square.type === "path")
              this.sendToBasecamp(otherTeam);
          }
        }
      }
    }
  }

  /**
   * @description Menangani logika saat pion mendarat di kotak spesial, checkpoint, atau finish.
   * @param {string} team - Tim yang pionnya mendarat.
   * @param {number} position - Posisi pendaratan.
   * @returns {boolean} True jika mendarat di kotak spesial.
   */
  handleSpecialSquares(team, position) {
    let isSpecialTrigger = false;
    const teamPath = this.paths[team];
    if (position >= 0 && position < teamPath.length) {
      const currentSquare = teamPath[position];
      const square = this.boardLayout.find(
        (s) => s.row === currentSquare.row && s.col === currentSquare.col
      );
      if (square) {
        const piece = document.getElementById(`piece-${team}`);
        if (square.type === "special" && square.team === team) {
          piece.classList.add("glowing");
          setTimeout(() => piece.classList.remove("glowing"), 2000);
          this.triggerSpecialZoneQuestion(team);
          isSpecialTrigger = true;
        } else if (square.type === "checkpoint") {
          piece.classList.add("celebrating");
          setTimeout(() => piece.classList.remove("celebrating"), 1500);
          this.scores[team] += 150;
          this.updateDisplay();
          if (position === teamPath.length - 1) this.endGame(team);
        }
      }
    }
    this.checkCollisions(team, position);
    return isSpecialTrigger;
  }

  /**
   * @description Memicu pertanyaan zona spesial untuk sebuah tim.
   * @param {string} team - Tim yang mendapat pertanyaan spesial.
   */
  triggerSpecialZoneQuestion(team) {
    this.currentTeam = this.teams.indexOf(team);
    this.isSpecialZoneQuestion = true;
    this.isStealPhase = false;
    document.getElementById("operatorSection").style.display = "none";
    document.getElementById("stealSection").style.display = "none";
    document.getElementById("stealValidationSection").style.display = "none";
    this.selectDifficulty("special");
  }

  /**
   * @description Mengirim pion kembali ke area 'home'.
   * @param {string} team - Tim yang pionnya dikirim pulang.
   * @async
   */
  async sendToBasecamp(team) {
    const piece = document.getElementById(`piece-${team}`);
    const homeArea = document.querySelector(`.home-area.${team}`);
    if (homeArea && piece) {
      piece.classList.add("bouncing");
      setTimeout(() => {
        if (piece.parentNode) piece.parentNode.removeChild(piece);
        homeArea.appendChild(piece);
        this.positions[team] = -1;
        piece.classList.remove("bouncing");
      }, 300);
    }
  }

  // =======================================================================
  // 6. Animasi dan Helper UI
  // =======================================================================

  /**
   * @description Menganimasikan gerakan pion maju dari satu posisi ke posisi lain.
   * @param {HTMLElement} piece - Elemen pion.
   * @param {string} team - Tim dari pion.
   * @param {number} startPos - Posisi awal.
   * @param {number} endPos - Posisi akhir.
   * @param {object[]} path - Jalur yang diikuti pion.
   * @async
   */
  async animateStepByStep(piece, team, startPos, endPos, path) {
    const stepDelay = 200;
    if (startPos === -1) {
      const startSquare = this.boardLayout.find(
        (s) => s.type === "start" && s.team === team
      );
      if (startSquare) {
        const homeArea = document.querySelector(`.home-area.${team}`);
        const board = document.getElementById("gameBoard");
        if (homeArea && homeArea.contains(piece)) {
          homeArea.removeChild(piece);
          board.appendChild(piece);
        }
        await this.animateSingleStep(
          piece,
          startSquare.row + 1,
          startSquare.col + 1
        );
        await this.delay(stepDelay);
      }
      startPos = 0;
    }
    for (let i = startPos + 1; i <= endPos; i++) {
      if (i < path.length) {
        const targetSquare = path[i];
        await this.animateSingleStep(
          piece,
          targetSquare.row + 1,
          targetSquare.col + 1
        );
        this.highlightSquare(targetSquare.row, targetSquare.col);
        await this.delay(stepDelay);
      }
    }
    piece.classList.add("celebrating");
    setTimeout(() => piece.classList.remove("celebrating"), 1000);
  }

  /**
   * @description Menganimasikan gerakan pion mundur dari satu posisi ke posisi lain.
   * @param {HTMLElement} piece - Elemen pion.
   * @param {string} team - Tim dari pion.
   * @param {number} startPos - Posisi awal.
   * @param {number} endPos - Posisi akhir.
   * @param {object[]} path - Jalur yang diikuti pion.
   * @async
   */
  async animateStepByStepBackward(piece, team, startPos, endPos, path) {
    const stepDelay = 200;
    for (let i = startPos - 1; i >= endPos; i--) {
      if (i >= 0 && i < path.length) {
        const targetSquare = path[i];
        await this.animateSingleStep(
          piece,
          targetSquare.row + 1,
          targetSquare.col + 1
        );
        this.highlightSquare(targetSquare.row, targetSquare.col);
        await this.delay(stepDelay);
      }
    }
    piece.classList.add("bouncing");
    setTimeout(() => piece.classList.remove("bouncing"), 600);
  }

  /**
   * @description Menganimasikan satu langkah perpindahan pion ke kotak target.
   * @param {HTMLElement} piece - Elemen pion.
   * @param {number} gridRow - Baris target di grid.
   * @param {number} gridCol - Kolom target di grid.
   * @returns {Promise<void>}
   * @async
   */
  async animateSingleStep(piece, gridRow, gridCol) {
    return new Promise((resolve) => {
      piece.classList.add("moving");
      piece.style.gridRow = gridRow;
      piece.style.gridColumn = gridCol;
      setTimeout(() => {
        piece.classList.remove("moving");
        resolve();
      }, 800);
    });
  }

  /**
   * @description Memberi efek highlight sesaat pada sebuah kotak di papan.
   * @param {number} row - Baris kotak.
   * @param {number} col - Kolom kotak.
   */
  highlightSquare(row, col) {
    const squareEl = document.querySelector(
      `[style*="grid-row: ${row + 1}"][style*="grid-column: ${col + 1}"]`
    );
    if (squareEl && squareEl.classList.contains("square")) {
      squareEl.classList.add("highlight-path");
      setTimeout(() => squareEl.classList.remove("highlight-path"), 500);
    }
  }

  /**
   * @description Memperbarui tampilan skor, giliran, dan informasi lainnya di UI.
   */
  updateDisplay() {
    const currentTeamName = this.teams[this.currentTeam];
    const teamIndicator = document.getElementById("currentTeam");
    if (teamIndicator && currentTeamName) {
      teamIndicator.textContent = this.teamNames[currentTeamName];
      teamIndicator.className = `team-indicator ${currentTeamName}`;
    }
    for (const team of this.teams) {
      const scoreElement = document.getElementById(`${team}Score`);
      if (scoreElement) scoreElement.textContent = this.scores[team];
    }
    const questionCounter = document.getElementById("questionCounter");
    if (questionCounter) questionCounter.textContent = this.questionCount;
  }

  // =======================================================================
  // 7. Getter dan Utilitas
  // =======================================================================

  /**
   * @description Mendapatkan jumlah poin berdasarkan tingkat kesulitan.
   * @param {string} difficulty - Tingkat kesulitan.
   * @returns {number} Jumlah poin.
   */
  getPoints(difficulty) {
    return { easy: 100, medium: 150, hard: 200, special: 250 }[difficulty];
  }

  /**
   * @description Mendapatkan jumlah langkah berdasarkan tingkat kesulitan.
   * @param {string} difficulty - Tingkat kesulitan.
   * @returns {number} Jumlah langkah.
   */
  getSteps(difficulty) {
    return { easy: 5, medium: 6, hard: 7, special: 5 }[difficulty];
  }

  /**
   * @description Mendapatkan jumlah poin untuk rebutan berhasil.
   * @param {string} difficulty - Tingkat kesulitan.
   * @returns {number} Jumlah poin.
   */
  getStealPoints(difficulty) {
    return { easy: 100, medium: 150, hard: 200, special: 250 }[difficulty];
  }

  /**
   * @description Mendapatkan jumlah langkah untuk rebutan berhasil.
   * @param {string} difficulty - Tingkat kesulitan.
   * @returns {number} Jumlah langkah.
   */
  getStealSteps(difficulty) {
    return { easy: 3, medium: 4, hard: 5, special: 5 }[difficulty];
  }

  /**
   * @description Mengonversi kunci kesulitan menjadi teks yang bisa dibaca.
   * @param {string} difficulty - Kunci kesulitan.
   * @returns {string} Teks kesulitan.
   */
  getDifficultyText(difficulty) {
    return {
      easy: "Mudah",
      medium: "Sedang",
      hard: "Sulit",
      special: "Special",
    }[difficulty];
  }

  /**
   * @description Memberikan jeda waktu (delay).
   * @param {number} ms - Waktu jeda dalam milidetik.
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * @description Menampilkan status permainan saat ini di console untuk debugging.
   */
  debugGameState() {
    console.log("=== Game State Debug ===");
    console.log(
      "Current Team:",
      this.currentTeam,
      "->",
      this.teams[this.currentTeam]
    );
    console.log("Question Count:", this.questionCount);
    console.log("Current Difficulty:", this.currentDifficulty);
    console.log(
      "Game Started:",
      this.gameStarted,
      "| Game Ended:",
      this.gameEnded
    );
    console.log(
      "Is Steal Phase:",
      this.isStealPhase,
      "| Is Special Zone:",
      this.isSpecialZoneQuestion
    );
    console.log("Scores:", this.scores);
    console.log("Positions:", this.positions);
  }
}

// Inisialisasi permainan saat DOM telah dimuat.
document.addEventListener("DOMContentLoaded", () => {
  new LudoGame();
});
/**
 * @description Kelas LudoGame mengelola logika permainan Ludo dengan pertanyaan matematika.
 * Mengatur papan permainan, menangani giliran, pertanyaan, dan interaksi pemain.
 */
