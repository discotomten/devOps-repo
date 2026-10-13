/**
 * .NET YH UTVECKLARKLASSEN - VIBECODING HQ
 * Interactive Cyberpunk Terminal, Audio Synthesizer & Chaos Engine
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. WEB AUDIO API SYNTHESIZER (No external audio files needed!)
    // =========================================================================
    class SoundEngine {
        constructor() {
            this.ctx = null;
            this.muted = true; // start muted per browser policy; unmuted on toggle/user click
        }

        initContext() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) {
                    this.ctx = new AudioCtx();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        toggleMute() {
            this.initContext();
            this.muted = !this.muted;
            if (!this.muted) {
                this.playCoin(); // audio feedback confirmation
            }
            return !this.muted;
        }

        playTone(freq, type = 'sine', duration = 0.15, vol = 0.1) {
            if (this.muted || !this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

                gain.gain.setValueAtTime(vol, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {
                console.error("Audio error", e);
            }
        }

        playKeyClick() {
            if (this.muted || !this.ctx) return;
            this.playTone(600 + Math.random() * 400, 'triangle', 0.03, 0.02);
        }

        playCoin() {
            if (this.muted || !this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(987.77, now); // B5
            osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.35);
        }

        playNullRef() {
            if (this.muted || !this.ctx) return;
            // Harsh buzz
            const now = this.ctx.currentTime;
            [120, 125, 240].forEach(f => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(f, now);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(now);
                osc.stop(now + 0.3);
            });
        }

        playBuildOk() {
            if (this.muted || !this.ctx) return;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C
            notes.forEach((freq, idx) => {
                setTimeout(() => {
                    this.playTone(freq, 'sine', 0.18, 0.08);
                }, idx * 60);
            });
        }

        playBuildFail() {
            if (this.muted || !this.ctx) return;
            const notes = [400, 350, 300, 220];
            notes.forEach((freq, idx) => {
                setTimeout(() => {
                    this.playTone(freq, 'sawtooth', 0.15, 0.1);
                }, idx * 70);
            });
        }

        playCoffee() {
            if (this.muted || !this.ctx) return;
            // Bubbling glug sounds
            for (let i = 0; i < 4; i++) {
                setTimeout(() => {
                    this.playTone(300 + i * 90, 'sine', 0.08, 0.08);
                }, i * 65);
            }
        }

        playLaser() {
            if (this.muted || !this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.2);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        }

        playSiren() {
            if (this.muted || !this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.linearRampToValueAtTime(1000, now + 0.25);
            osc.frequency.linearRampToValueAtTime(600, now + 0.5);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.5);
        }

        playVictory() {
            if (this.muted || !this.ctx) return;
            const arpeggio = [523, 659, 783, 1046, 1318];
            arpeggio.forEach((note, i) => {
                setTimeout(() => {
                    this.playTone(note, 'triangle', 0.25, 0.1);
                }, i * 90);
            });
        }
    }

    const sound = new SoundEngine();

    // =========================================================================
    // 2. MATRIX RAIN CANVAS BACKGROUND
    // =========================================================================
    function initMatrixRain() {
        const canvas = document.getElementById('matrixCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        const chars = '01{}[]()<>=>;*#C#LINQvarasyncawaitTaskEntityCoreNullRefFikaPontus';
        const fontSize = 14;
        let columns = Math.floor(canvas.width / fontSize);
        let drops = Array(columns).fill(1);

        window.addEventListener('resize', () => {
            columns = Math.floor(canvas.width / fontSize);
            drops = Array(columns).fill(1);
        });

        function draw() {
            ctx.fillStyle = 'rgba(10, 11, 16, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff66';
            ctx.font = `${fontSize}px 'Fira Code', monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 40);
    }

    // =========================================================================
    // 3. TOAST NOTIFICATION SYSTEM
    // =========================================================================
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    // =========================================================================
    // 4. LIVE TICKER
    // =========================================================================
    const tickerItems = [
        "BREAKING: En student hittade ett minnesläckage i fikarummet.",
        "LIA-intervju klar: Studenten svarade 'Det beror på' på alla frågor och erbjöds rollen som Lead Architect.",
        "Nytt NuGet-paket installerat: IsEven v4.2.0 (kräver 34 underberoenden och 1.2 GB RAM).",
        "Pontus påminner: 'Att sätta allt i en try-catch utan logging är INTE Clean Architecture!'",
        "En student råkade köra 'DROP DATABASE' på localhost - firar med kanelbulle.",
        "Entity Framework genererade en SQL-fråga på 4 200 rader för att hämta användarens förnamn.",
        "Git merge conflict löst genom att radera repositoryt och klona om.",
        "Kaffemaskinen på plan 2 rapporterar: 'OutOfCaffeineException - Stack trace unavailable.'"
    ];

    function initTicker() {
        const tickerEl = document.getElementById('tickerText');
        if (!tickerEl) return;
        let index = 0;
        tickerEl.textContent = tickerItems[index];

        setInterval(() => {
            index = (index + 1) % tickerItems.length;
            tickerEl.style.opacity = '0';
            setTimeout(() => {
                tickerEl.textContent = tickerItems[index];
                tickerEl.style.opacity = '1';
            }, 300);
        }, 5000);
    }

    // =========================================================================
    // 5. INTERACTIVE TERMINAL
    // =========================================================================
    class TerminalEngine {
        constructor() {
            this.history = [];
            this.historyIndex = -1;
            this.body = document.getElementById('terminalBody');
            this.input = document.getElementById('termInput');
            this.historyContainer = document.getElementById('terminalHistory');

            this.commands = {
                'help': () => this.cmdHelp(),
                'clear': () => this.cmdClear(),
                'cls': () => this.cmdClear(),
                'fika': () => this.cmdFika(),
                'lia': () => this.cmdLia(),
                'dotnet build': () => this.cmdDotnetBuild(),
                'dotnet run': () => this.cmdDotnetRun(),
                'dotnet test': () => this.cmdDotnetTest(),
                'smasher': () => this.cmdSmasher(),
                'quote': () => this.cmdQuote(),
                'matrix': () => this.cmdMatrix(),
                'party': () => togglePartyMode(),
                'panic': () => triggerPanicMode(),
                'nuke-production': () => triggerPanicMode(),
                'whoami': () => this.cmdWhoami(),
                'csharp': () => this.cmdCSharp(),
                'cat memelist': () => this.cmdMemes(),
                'sudo hire-us': () => this.cmdHireUs(),
                'dvd': () => toggleDvdMode()
            };

            this.initListeners();
        }

        initListeners() {
            if (!this.input) return;

            this.input.addEventListener('keydown', (e) => {
                sound.playKeyClick();

                if (e.key === 'Enter') {
                    const rawVal = this.input.value.trim();
                    if (rawVal) {
                        this.history.push(rawVal);
                        this.historyIndex = this.history.length;
                        this.execute(rawVal);
                        this.input.value = '';
                    }
                } else if (e.key === 'ArrowUp') {
                    if (this.history.length > 0 && this.historyIndex > 0) {
                        this.historyIndex--;
                        this.input.value = this.history[this.historyIndex];
                    }
                    e.preventDefault();
                } else if (e.key === 'ArrowDown') {
                    if (this.historyIndex < this.history.length - 1) {
                        this.historyIndex++;
                        this.input.value = this.history[this.historyIndex];
                    } else {
                        this.historyIndex = this.history.length;
                        this.input.value = '';
                    }
                    e.preventDefault();
                }
            });

            // Focus input on clicking anywhere in terminal body
            if (this.body) {
                this.body.addEventListener('click', () => {
                    this.input.focus();
                });
            }

            // Quick chips
            document.querySelectorAll('.terminal-quick-bar .chip').forEach(btn => {
                btn.addEventListener('click', () => {
                    const cmd = btn.getAttribute('data-cmd');
                    if (cmd) {
                        sound.initContext();
                        this.input.value = cmd;
                        this.execute(cmd);
                        this.input.value = '';
                    }
                });
            });
        }

        print(html, className = 'term-line') {
            const line = document.createElement('div');
            line.className = className;
            line.innerHTML = html;
            this.historyContainer.appendChild(line);
            this.body.scrollTop = this.body.scrollHeight;
        }

        execute(cmdStr) {
            this.print(`<span class="term-prompt">student@csharp:~$</span> <span class="term-cmd-echo">${cmdStr}</span>`);
            const lower = cmdStr.toLowerCase();

            if (this.commands[lower]) {
                this.commands[lower]();
            } else if (lower.startsWith('echo ')) {
                this.print(cmdStr.substring(5));
            } else {
                sound.playNullRef();
                this.print(`bash: ${cmdStr}: kommandot hittades inte. Skriv <span class="term-highlight">help</span> för tillgängliga kommandon.`, 'term-line term-error');
            }
        }

        cmdHelp() {
            sound.playTone(800, 'sine', 0.1, 0.05);
            const msg = `
Tillgängliga kommandon i terminalen:
  <span class="term-highlight">help</span>             - Visa denna hjälplista
  <span class="term-highlight">fika</span>             - Brygg en virtuell kopp kaffe (+koffein)
  <span class="term-highlight">lia</span>              - Kolla status på LIA-jakten
  <span class="term-highlight">dotnet build</span>     - Kör en fejkad kompilering
  <span class="term-highlight">dotnet run</span>       - Starta koden och be till högre makter
  <span class="term-highlight">smasher</span>          - Hoppa direkt till bugg-slaktar-spelet
  <span class="term-highlight">quote</span>            - Slumpa ett visdomsord från en .NET-utvecklare
  <span class="term-highlight">matrix</span>           - Förstärk Matrix-effekten
  <span class="term-highlight">party</span>            - Slå på disco/party-läge
  <span class="term-highlight">nuke-production</span>  - PUSH TILL PROD (på egen risk!)
  <span class="term-highlight">csharp</span>           - ASCII-konst av vårt favoritspråk
  <span class="term-highlight">cat memelist</span>     - Läs klassens heliga memebibel
  <span class="term-highlight">whoami</span>           - Ta reda på vem du är i klassen
  <span class="term-highlight">dvd</span>              - Slå på studsande C#-logga
  <span class="term-highlight">clear</span>            - Rensa terminalen`;
            this.print(msg);
        }

        cmdClear() {
            this.historyContainer.innerHTML = '';
        }

        cmdFika() {
            drinkCoffee();
            this.print(`☕ [FIKA DISPATCHER]: Bryggde Gevalia Mörkrost. Koffeinhalten ökade! Nuvarande hastighet: ${fikaEngine.speed}x.`, 'term-line term-success');
        }

        cmdLia() {
            sound.playCoin();
            const liaQuotes = [
                "STATUS: 42 ansökningar skickade. 15 'Vi har valt att gå vidare med en senior utvecklare med 18 års erfarenhet av .NET 10'.",
                "STATUS: Intervju inbokad på fredag! Förbereder att förklara varför Dependency Injection förändrade mitt liv.",
                "STATUS: En rekryterare på LinkedIn frågade om jag kan COBOL. Jag svarade att det i princip är som C# utan måsvingar.",
                "STATUS: 100% LIA-redo. Har installerat Visual Studio Enterprise och fyllt termosen."
            ];
            const q = liaQuotes[Math.floor(Math.random() * liaQuotes.length)];
            this.print(`💼 [LIA RADAR]: ${q}`, 'term-line term-info');
        }

        cmdDotnetBuild() {
            this.print("MSBuild version 18.2.0+d9 för .NET");
            this.print("  Bestämmer projekt som ska återställas...");
            this.print("  Alla projekt är uppdaterade för återställning.");
            sound.playTone(440, 'triangle', 0.2);

            setTimeout(() => {
                this.print("  server -> bin/Debug/net10.0/server.dll");
                this.print("  server(42,13): warning CS0168: Variabeln 'hopp' är deklarerad men används aldrig.");
                this.print("  server(69,04): warning CS8600: Konverterar null-litteral till icke-nullbart värde.");
                sound.playBuildOk();
                this.print("Kompileringen slutfördes. 0 fel, 2 varningar! 🎉", 'term-line term-success');
            }, 600);
        }

        cmdDotnetRun() {
            this.print("Bygger och startar Kestrel webbserver...");
            setTimeout(() => {
                sound.playLaser();
                this.print("info: Microsoft.Hosting.Lifetime[14]");
                this.print("      Nu lyssnar vi på: http://localhost:5000");
                this.print("info: YhStudentCore[0]");
                this.print("      Systemet körs! Minnesanvändning: 98.4%. Kaffe: Nivå kritisk.");
            }, 500);
        }

        cmdDotnetTest() {
            this.print("Kör xUnit tester...");
            setTimeout(() => {
                sound.playBuildOk();
                this.print("[Test1]: PASSED (Tog 4ms - men den innehöll inga Assertions ändå!)", 'term-line term-success');
            }, 400);
        }

        cmdSmasher() {
            const arcadeSection = document.querySelector('.arcade-window');
            if (arcadeSection) {
                arcadeSection.scrollIntoView({ behavior: 'smooth' });
                this.print("Navigerar till Bug Smasher Arcade... Gör klubban redo!", 'term-line term-highlight');
            }
        }

        cmdQuote() {
            sound.playTone(660, 'sine', 0.1);
            const quotes = [
                '"Det är inte en bugg, det är en odokumenterad feature som berikar användarupplevelsen."',
                '"Om det kompilerar utan fel på första försöket är något fruktansvärt fel."',
                '"C# är kärlek. LINQ är poesi. Entity Framework är en emotionell berg-och-dalbana."',
                '"Ett system utan NullReferenceException är ett system som inte lever på riktigt."',
                '"Först löser vi problemet. Sen skriver vi koden. Sen raderar vi allt och frågar ChatGPT varför det inte bygger."'
            ];
            this.print(`💬 ${quotes[Math.floor(Math.random() * quotes.length)]}`, 'term-line term-highlight');
        }

        cmdMatrix() {
            sound.playLaser();
            this.print("🟢 Ökar Matrix-flödet. Du är nu The One.", 'term-line term-success');
            const canvas = document.getElementById('matrixCanvas');
            if (canvas) {
                canvas.style.opacity = canvas.style.opacity === '0.5' ? '0.18' : '0.5';
            }
        }

        cmdWhoami() {
            sound.playCoin();
            this.print("Du är: En fullfjädrad .NET YH-student som dricker ljummet kaffe och drömmer i LINQ-satser.", 'term-line term-info');
        }

        cmdCSharp() {
            const art = `
   ______   ______
  / ____/  / ____/
 / /      / /# #  
/ /___   / /##### 
\\____/   \\_\\# #  
[ C-SHARP // THE CHOSEN LANGUAGE ]`;
            this.print(art, 'term-line term-highlight');
        }

        cmdMemes() {
            const memes = `
=== KLASSENS MEMEBIBEL ===
1. "Fungerar på min maskin" (Certifierad DevOps lösning)
2. Task.Delay(500) läker alla sår
3. När kunden frågar om vi använder AI och vi svarar 'if-else räknas väl?'
4. Pontus när någon pushar .env-filen till GitHub
5. Fredags-deploys är för folk som gillar spänning i livet`;
            this.print(memes, 'term-line term-info');
        }

        cmdHireUs() {
            sound.playVictory();
            this.print("🎉 SÖKER NI TALANGER? Denna klass är till 100% redo för skarpa uppdrag inom .NET, Azure, SQL och kaffekokning! Kontakta oss!", 'term-line term-success');
            spawnConfetti();
        }
    }

    // =========================================================================
    // 6. FIKA ENGINE 9000 (COFFEE CLICKER & OVERCLOCK)
    // =========================================================================
    const fikaEngine = {
        caffeine: 120,
        cupsDrank: 0,
        gifflar: 0,
        speed: 1,
        isOverclocked: false
    };

    function updateFikaUI() {
        const caffeineFill = document.getElementById('caffeineFill');
        const caffeineVal = document.getElementById('caffeineValue');
        const userCupCount = document.getElementById('userCupCount');
        const codingSpeed = document.getElementById('codingSpeed');
        const gifflarCount = document.getElementById('gifflarCount');
        const fikaLevelText = document.getElementById('fikaLevelText');
        const overclockStatus = document.getElementById('overclockStatus');
        const globalCoffee = document.getElementById('globalCoffeeCount');

        const pct = Math.min(100, Math.round((fikaEngine.caffeine / 500) * 100));

        if (caffeineFill) caffeineFill.style.width = `${pct}%`;
        if (caffeineVal) caffeineVal.textContent = `${fikaEngine.caffeine} mg`;
        if (userCupCount) userCupCount.textContent = fikaEngine.cupsDrank;
        if (codingSpeed) codingSpeed.textContent = `${fikaEngine.speed}x`;
        if (gifflarCount) gifflarCount.textContent = fikaEngine.gifflar;

        if (globalCoffee) {
            globalCoffee.textContent = (4892 + fikaEngine.cupsDrank).toLocaleString('sv-SE');
        }

        if (fikaEngine.caffeine >= 450) {
            if (fikaLevelText) fikaLevelText.textContent = "🔥 HYPER-GODMODE KODARE 🔥";
            if (overclockStatus) overclockStatus.textContent = "VARNING: KOFFEIN-NIVÅ ÖVER 9000! REKORDERLIGT!";
            if (!fikaEngine.isOverclocked) {
                fikaEngine.isOverclocked = true;
                fikaEngine.speed = 5;
                sound.playVictory();
                spawnConfetti();
                showToast("🚀 HYPER-FIKA AKTIVERAD! KODHASTIGHET x5!", "success");
            }
        } else if (fikaEngine.caffeine >= 250) {
            if (fikaLevelText) fikaLevelText.textContent = "⚡ SUPER-LADDAD SENIOR";
            if (overclockStatus) overclockStatus.textContent = "Koffeinrus! Buggarna flyr i ren skräck.";
            fikaEngine.speed = 2;
            fikaEngine.isOverclocked = false;
        } else {
            if (fikaLevelText) fikaLevelText.textContent = "NORMAL KODARE";
            if (overclockStatus) overclockStatus.textContent = "SYSTEM NOMINELLT. Tryck för boost!";
            fikaEngine.speed = 1;
            fikaEngine.isOverclocked = false;
        }
    }

    function drinkCoffee() {
        sound.initContext();
        sound.playCoffee();
        fikaEngine.caffeine += 50;
        fikaEngine.cupsDrank++;

        const cup = document.getElementById('coffeeCup');
        if (cup) {
            cup.style.transform = 'scale(1.2) rotate(10deg)';
            setTimeout(() => {
                cup.style.transform = 'scale(1) rotate(0deg)';
            }, 180);
        }

        updateFikaUI();
        showToast("☕ +50mg koffein tillförd i blodet!", "success");
    }

    function eatGiffel() {
        sound.initContext();
        sound.playCoin();
        fikaEngine.gifflar++;
        fikaEngine.caffeine += 15;
        updateFikaUI();
        showToast("🥐 Mums! En giffel slank ner. +15mg koffein & god stämning!", "info");
    }

    // Natural caffeine decay
    setInterval(() => {
        if (fikaEngine.caffeine > 80) {
            fikaEngine.caffeine = Math.max(80, fikaEngine.caffeine - 4);
            updateFikaUI();
        }
    }, 4000);

    // =========================================================================
    // 7. BUG SMASHER ARCADE MINI-GAME
    // =========================================================================
    class BugSmasherGame {
        constructor() {
            this.arena = document.getElementById('arcadeArena');
            this.overlay = document.getElementById('arcadeStartOverlay');
            this.startBtn = document.getElementById('btnStartGame');
            this.scoreEl = document.getElementById('gameScore');
            this.comboEl = document.getElementById('gameCombo');
            this.highScoreEl = document.getElementById('gameHighScore');
            this.timeFill = document.getElementById('gameTimeFill');
            this.timeNum = document.getElementById('gameTimerNum');

            this.score = 0;
            this.combo = 1;
            this.timeLeft = 15;
            this.isRunning = false;
            this.timerInterval = null;
            this.spawnInterval = null;

            this.highScore = parseInt(localStorage.getItem('net_yh_high_score') || '0', 10);
            if (this.highScoreEl) this.highScoreEl.textContent = this.highScore;

            this.bugTypes = [
                { name: 'NullReferenceException', cls: 'bug-nullref', pts: 100, icon: '💥' },
                { name: 'MemoryLeak.dll', cls: 'bug-memoryleak', pts: 150, icon: '🧠' },
                { name: 'DeadlockThread', cls: 'bug-deadlock', pts: 200, icon: '🔒' },
                { name: '<<<<<<< HEAD', cls: 'bug-mergeconflict', pts: 250, icon: '⚔️' }
            ];

            if (this.startBtn) {
                this.startBtn.addEventListener('click', () => this.start());
            }
        }

        start() {
            sound.initContext();
            sound.playBuildOk();
            this.score = 0;
            this.combo = 1;
            this.timeLeft = 15;
            this.isRunning = true;
            this.updateDisplay();

            if (this.overlay) this.overlay.style.display = 'none';

            // Clear any lingering bugs
            this.arena.querySelectorAll('.bug-target').forEach(b => b.remove());

            // Timer countdown
            this.timerInterval = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                if (this.timeLeft <= 0) {
                    this.stop();
                }
            }, 1000);

            // Bug spawner
            this.spawnBug();
            this.spawnInterval = setInterval(() => {
                if (this.isRunning) this.spawnBug();
            }, 550);
        }

        spawnBug() {
            if (!this.arena) return;
            const bugData = this.bugTypes[Math.floor(Math.random() * this.bugTypes.length)];
            const bug = document.createElement('div');
            bug.className = `bug-target ${bugData.cls}`;
            bug.innerHTML = `<span>${bugData.icon}</span> <span>${bugData.name}</span>`;

            // Random coordinates within arena bounds
            const arenaRect = this.arena.getBoundingClientRect();
            const padding = 50;
            const maxX = Math.max(100, arenaRect.width - 150);
            const maxY = Math.max(80, arenaRect.height - 80);

            const x = padding + Math.random() * (maxX - padding);
            const y = padding + Math.random() * (maxY - padding);

            bug.style.left = `${x}px`;
            bug.style.top = `${y}px`;

            bug.addEventListener('click', (e) => {
                e.stopPropagation();
                this.smashBug(bug, bugData, x, y);
            });

            this.arena.appendChild(bug);

            // Bug disappears after 1.8 seconds if not clicked
            setTimeout(() => {
                if (bug.parentNode) {
                    bug.remove();
                    this.combo = 1;
                    if (this.comboEl) this.comboEl.textContent = `x${this.combo}`;
                }
            }, 1800);
        }

        smashBug(bugElement, bugData, x, y) {
            sound.playLaser();
            bugElement.remove();

            const earned = bugData.pts * this.combo;
            this.score += earned;
            this.combo++;

            // Splat effect text
            const splat = document.createElement('div');
            splat.className = 'splat-effect';
            splat.style.left = `${x}px`;
            splat.style.top = `${y}px`;
            splat.textContent = `+${earned} (x${this.combo})!`;
            this.arena.appendChild(splat);
            setTimeout(() => splat.remove(), 700);

            this.updateDisplay();
        }

        updateDisplay() {
            if (this.scoreEl) this.scoreEl.textContent = this.score;
            if (this.comboEl) this.comboEl.textContent = `x${this.combo}`;
            if (this.timeNum) this.timeNum.textContent = `${this.timeLeft}s`;
            if (this.timeFill) {
                const pct = (this.timeLeft / 15) * 100;
                this.timeFill.style.width = `${pct}%`;
            }
        }

        stop() {
            this.isRunning = false;
            clearInterval(this.timerInterval);
            clearInterval(this.spawnInterval);
            this.arena.querySelectorAll('.bug-target').forEach(b => b.remove());

            sound.playVictory();

            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('net_yh_high_score', this.highScore);
                if (this.highScoreEl) this.highScoreEl.textContent = this.highScore;
                showToast(`🏆 NYTT REKORD: ${this.score} POÄNG!`, "success");
                spawnConfetti();
            }

            if (this.overlay) {
                this.overlay.style.display = 'flex';
                this.overlay.innerHTML = `
                    <h3>TIDEN ÄR UTE!</h3>
                    <p>Du fick ihop hela <strong>${this.score} poäng</strong> och räddade fredagsreleasen!</p>
                    <button id="btnRestartGame" class="cyber-btn start-game-btn">SPELA IGEN</button>
                `;
                document.getElementById('btnRestartGame').addEventListener('click', () => this.start());
            }
        }
    }

    // =========================================================================
    // 8. KLASSENS ARKETYPER (SQUAD ROSTER)
    // =========================================================================
    const archetypesData = [
        {
            avatar: '🧙‍♂️',
            name: 'LINQ-Trollkarlen',
            role: 'Code Obfuscator Pro',
            quote: '"Varför skriva en enkel foreach när man kan skriva en 40-raders LINQ-sats med 7 SelectMany?"',
            stats: { 'C# Power': 95, 'Fika-behov': 60, 'Läsbarhet': 15 },
            favorite: 'GroupBy().SelectMany().AsParallel()'
        },
        {
            avatar: '🤠',
            name: 'Async/Await Cowboyen',
            role: 'Concurrency Gambler',
            quote: '"Await är för de svaga. Kör .Result eller fire-and-forget och låt trådpoolen brinna!"',
            stats: { 'C# Power': 78, 'Fika-behov': 85, 'Deadlocks': 99 },
            favorite: 'Task.Run(() => NukeEverything())'
        },
        {
            avatar: '🕶️',
            name: 'Dark Mode Fanatikern',
            role: 'Photophobic Coder',
            quote: '"Vägrar tända lampan i klassrummet. Ljusa teman ger 3:e gradens brännskador på hornhinnan."',
            stats: { 'C# Power': 82, 'Fika-behov': 70, 'Natt-kodning': 100 },
            favorite: 'Theme = "Dracula-Ultra-Pitch-Black"'
        },
        {
            avatar: '💼',
            name: 'LIA-Jägaren 3000',
            role: 'LinkedIn Stalker Extraordinaire',
            quote: '"Har connectat med 1 200 tech-leads på LinkedIn idag. Fikar med tre VD:ar innan lunch."',
            stats: { 'C# Power': 70, 'Fika-behov': 95, 'Mingel-skills': 100 },
            favorite: 'OpenToWorkBadge.IsActive = true'
        },
        {
            avatar: '🏛️',
            name: 'Clean Architecture Talmannen',
            role: 'Domain Layer Priest',
            quote: '"Jag har skapat 14 projekt, 8 interfaces och 4 DTO-mappar för att skriva ut \'Hello World\'."',
            stats: { 'C# Power': 90, 'Fika-behov': 50, 'Mapp-djup': 98 },
            favorite: 'IHelloWorldExecutionStrategyFactory'
        },
        {
            avatar: '💣',
            name: 'Git Force-Pushern',
            role: 'Version Control Kamikaze',
            quote: '"git push --force direkt till main är min morgon-cardio. Konflikter löses bäst genom att skriva över allt."',
            stats: { 'C# Power': 65, 'Fika-behov': 80, 'Pulsnivå': 100 },
            favorite: 'git push --force origin main'
        },
        {
            avatar: '🥐',
            name: 'Fika-Generalen',
            role: 'Chief Pastry Officer',
            quote: '"Vet exakt när Ica har extrapris på Gifflar och startar kaffebryggaren innan läraren ens vaknat."',
            stats: { 'C# Power': 75, 'Fika-behov': 100, 'Klass-moral': 100 },
            favorite: 'builder.Services.AddSingleton<IGiffel>()'
        },
        {
            avatar: '☁️',
            name: 'Azure Miljardären',
            role: 'Cloud Bill Generator',
            quote: '"Råkade spinna upp ett Kubernetes-kluster med 8 noder på gratis-krediten över helgen."',
            stats: { 'C# Power': 88, 'Fika-behov': 75, 'Månadsfaktura': 99 },
            favorite: 'az group delete --name Everything --yes'
        }
    ];

    function renderArchetypes() {
        const grid = document.getElementById('archetypesGrid');
        if (!grid) return;

        grid.innerHTML = archetypesData.map((arch, i) => `
            <div class="archetype-card" id="archetypeCard-${i}">
                <div class="archetype-top">
                    <div class="archetype-avatar">${arch.avatar}</div>
                    <div>
                        <div class="archetype-name">${arch.name}</div>
                        <div class="archetype-role">${arch.role}</div>
                    </div>
                </div>
                <div class="archetype-quote">${arch.quote}</div>
                <div class="archetype-stats">
                    ${Object.entries(arch.stats).map(([k, v]) => `
                        <div class="stat-row">
                            <span>${k}</span>
                            <div class="stat-bar-track">
                                <div class="stat-bar-fill" style="width: ${v}%;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="archetype-favorite">
                    Favorit-kod: <span>${arch.favorite}</span>
                </div>
            </div>
        `).join('');
    }

    function pickRandomArchetype() {
        sound.initContext();
        sound.playCoin();
        const cards = document.querySelectorAll('.archetype-card');
        cards.forEach(c => c.classList.remove('featured'));

        const randomIdx = Math.floor(Math.random() * archetypesData.length);
        const target = document.getElementById(`archetypeCard-${randomIdx}`);
        if (target) {
            target.classList.add('featured');
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            showToast(`🎉 Du fick: ${archetypesData[randomIdx].name}!`, "success");
        }
    }

    // =========================================================================
    // 9. EXCUSE & CONVENTIONAL COMMIT GENERATORS
    // =========================================================================
    const standupExcuses = [
        "Det funkade perfekt i min lokala Docker-container i morse...",
        "Entity Framework genererade en SQL-fråga som lade ner hela Azure-regionen North Europe.",
        "Jag råkade köra 'Update-Database' mot produktionsmiljön av misstag.",
        "Jag fastnade i en oändlig cirkulär referens i Dependency Injection-containern.",
        "Kaffebryggaren var trasig så koden vägrade kompilera av ren sympati.",
        "Windows Update startade om datorn mitt i min 'git commit --amend'.",
        "Det är inte en bugg, koden är bara proaktivt asynkron.",
        "Jag väntar på att Pontus ska godkänna min PR som raderar 4 000 rader kod.",
        "Min linter klagade på ett extra mellanslag på rad 892 och blockerade hela pipelinen.",
        "Det var ett hårdvarufel: tangentbordet råkade trycka på backspace i 10 sekunder."
    ];

    const conventionalCommits = [
        "fix: add Task.Delay(500) to resolve mysterious race condition",
        "feat: introduce 12 additional layers of clean architecture for Hello World",
        "fix(nullref): wrap entire application in try-catch and pray to higher power",
        "refactor: replace readable foreach loop with 40-line LINQ expression",
        "chore(fika): update Pågens Gifflar dependency to v3.14.0",
        "docs: document that this service only works between 08:00 and 16:00 on weekdays",
        "fix(db): add another index hoping EF Core stops taking 4 minutes to query 3 rows",
        "style: convert all spaces to tabs to provoke colleagues in code review",
        "ci: disable all unit tests so the build finally turns green"
    ];

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function initGenerators() {
        const excuseBox = document.getElementById('excuseBox');
        const commitBox = document.getElementById('commitBox');

        document.getElementById('btnNewExcuse')?.addEventListener('click', () => {
            sound.initContext();
            sound.playTone(550, 'triangle', 0.1);
            if (excuseBox) excuseBox.textContent = `"${getRandomItem(standupExcuses)}"`;
        });

        document.getElementById('btnCopyExcuse')?.addEventListener('click', () => {
            if (excuseBox) {
                navigator.clipboard?.writeText(excuseBox.textContent.replace(/"/g, ''));
                showToast("📋 Urskäkt kopierad till urklipp! Klistra in i Teams/Slack!", "info");
            }
        });

        document.getElementById('btnNewCommit')?.addEventListener('click', () => {
            sound.initContext();
            sound.playTone(720, 'sine', 0.1);
            if (commitBox) commitBox.textContent = getRandomItem(conventionalCommits);
        });

        document.getElementById('btnCopyCommit')?.addEventListener('click', () => {
            if (commitBox) {
                navigator.clipboard?.writeText(commitBox.textContent);
                showToast("📋 Conventional Commit kopierat till urklipp!", "success");
            }
        });
    }

    // =========================================================================
    // 10. SOUNDBOARD EVENT HANDLERS
    // =========================================================================
    function initSoundboard() {
        document.querySelectorAll('.sound-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                sound.initContext();
                const sType = btn.getAttribute('data-sound');
                switch (sType) {
                    case 'nullref': sound.playNullRef(); break;
                    case 'buildok': sound.playBuildOk(); break;
                    case 'error': sound.playBuildFail(); break;
                    case 'coin': sound.playCoin(); break;
                    case 'coffee': sound.playCoffee(); break;
                    case 'laser': sound.playLaser(); break;
                    case 'siren': sound.playSiren(); break;
                    case 'victory': sound.playVictory(); break;
                }
            });
        });
    }

    // =========================================================================
    // 11. C# CODE CHAOS PLAYGROUND
    // =========================================================================
    function initCodeChaos() {
        const out = document.getElementById('codeConsoleOutput');
        const editor = document.getElementById('codeEditor');

        document.getElementById('btnRunCode')?.addEventListener('click', () => {
            sound.initContext();
            sound.playNullRef();
            if (out) {
                out.textContent = `System.NullReferenceException: Object reference not set to an instance of an object.
   at YhStudentLife.ApplyForLiaAsync(Int32 length) in Program.cs:line 21
   at YhStudentLife.Main() in Program.cs:line 19

[PANIK]: _liaPlats är null! Ökar koffeinhalten med +50mg och försöker igen...
[STATUS]: Kaffekoppar förbrukade: ${fikaEngine.cupsDrank + 1}.`;
            }
            fikaEngine.caffeine += 25;
            updateFikaUI();
        });

        document.getElementById('btnFixCode')?.addEventListener('click', () => {
            sound.initContext();
            sound.playBuildOk();
            if (out) {
                out.textContent = `[AI REFAKTORERING KLAR]:
Alla NullReferenceExceptions har ersatts med:
string _liaPlats = "Stjärnutvecklare på Spotify (Klart!)";
Kompilerar med 0 fel! Du är nu officiellt Senior .NET Konsult!`;
            }
            showToast("🪄 Magisk refaktorering utförd!", "success");
        });

        document.getElementById('btnBreakCode')?.addEventListener('click', () => {
            sound.initContext();
            sound.playBuildFail();
            if (out) {
                out.textContent = `FATAL ERROR: StackOverflowException!
Rekursiv anrop i FikaNotFoundException.
CPU-fläkten har nått 9 000 RPM.
Koppla in brandsläckaren i USB-porten.`;
            }
            showToast("💣 Du sprängde virtuella .NET CLR!", "warning");
        });
    }

    // =========================================================================
    // 12. PANIC MODE & FLOATING WIN95 RETRO ERROR DIALOGUES
    // =========================================================================
    let panicActive = false;
    let panicInterval = null;

    function triggerPanicMode() {
        sound.initContext();
        sound.playSiren();
        panicActive = !panicActive;

        if (panicActive) {
            document.body.classList.add('panic-mode');
            showToast("🚨 VARNING: PUSH TILL PRODUKTION EN FREDAG! ALARM!", "error");

            // Spawn 5 retro error dialogues
            for (let i = 0; i < 5; i++) {
                setTimeout(() => spawnRetroError(i), i * 200);
            }

            // Loop siren
            panicInterval = setInterval(() => {
                if (panicActive) sound.playSiren();
            }, 1200);
        } else {
            document.body.classList.remove('panic-mode');
            clearInterval(panicInterval);
            document.getElementById('panicWindowsLayer').innerHTML = '';
            showToast("😌 Produktionen återställd till förra veckans backup.", "info");
        }
    }

    const retroErrorMessages = [
        "Fatal Exception: Objektet 'Framtidsutsikter' är null.",
        "Windows har upptäckt att du försöker deploya kod utan tester.",
        "Error 418: Kaffebryggaren är inte en tekanna.",
        "Pontus.exe har stött på ett oväntat fel och behöver avslutas.",
        "Minnet är slut. Var vänlig och ät en giffel för att fortsätta."
    ];

    function spawnRetroError(index = 0) {
        const layer = document.getElementById('panicWindowsLayer');
        if (!layer) return;

        const dialog = document.createElement('div');
        dialog.className = 'retro-error-dialog';

        const top = 100 + (index * 60) + Math.random() * 40;
        const left = 50 + (index * 70) + Math.random() * 60;
        dialog.style.top = `${top}px`;
        dialog.style.left = `${left}px`;

        const msg = retroErrorMessages[index % retroErrorMessages.length];

        dialog.innerHTML = `
            <div class="retro-titlebar">
                <span>⚠️ SYSTEM ERROR - PROD_DOWN</span>
                <span class="retro-close-btn" onclick="this.closest('.retro-error-dialog').remove()">✕</span>
            </div>
            <div class="retro-dialog-body">
                <span class="retro-error-icon">❌</span>
                <span>${msg}</span>
            </div>
            <div class="retro-dialog-actions">
                <button class="retro-btn" onclick="this.closest('.retro-error-dialog').remove()">Ignorera &amp; Be</button>
            </div>
        `;

        layer.appendChild(dialog);
    }

    // =========================================================================
    // 13. PARTY MODE & CONFETTI SYSTEM
    // =========================================================================
    let partyActive = false;

    function togglePartyMode() {
        sound.initContext();
        partyActive = !partyActive;
        if (partyActive) {
            document.body.classList.add('party-mode');
            sound.playVictory();
            spawnConfetti();
            showToast("🪩 PARTY MODE AKTIVERAT! DISCO I FIKARUMMET!", "success");
        } else {
            document.body.classList.remove('party-mode');
            showToast("Party pausat. Tillbaka till kodningen.", "info");
        }
    }

    function spawnConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#00ff66', '#00f3ff', '#ff007f', '#ffea00', '#7928ca'];

        for (let i = 0; i < 90; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * -canvas.height * 0.5,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                speedY: Math.random() * 5 + 3,
                speedX: (Math.random() - 0.5) * 4,
                rot: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 8
            });
        }

        let frames = 0;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.y += p.speedY;
                p.x += p.speedX;
                p.rot += p.rotSpeed;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rot * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });

            frames++;
            if (frames < 120) {
                requestAnimationFrame(animate);
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        animate();
    }

    // =========================================================================
    // 14. DVD BOUNCING LOGO EASTER EGG
    // =========================================================================
    let dvdRunning = false;
    let dvdAnim = null;

    function toggleDvdMode() {
        sound.initContext();
        sound.playCoin();
        const container = document.getElementById('dvdContainer');
        const logo = document.getElementById('dvdLogo');
        if (!container || !logo) return;

        dvdRunning = !dvdRunning;
        if (dvdRunning) {
            container.classList.remove('hidden');
            showToast("📺 DVD Screensaver Mode: Lycka till att se den träffa hörnet!", "info");

            let x = 100, y = 100;
            let vx = 3, vy = 2.5;
            const colors = ['#00ff66', '#00f3ff', '#ff007f', '#ffea00', '#9d4edd'];
            let colorIdx = 0;

            function bounce() {
                const maxX = window.innerWidth - 150;
                const maxY = window.innerHeight - 90;

                x += vx;
                y += vy;

                let hit = false;
                if (x <= 0 || x >= maxX) {
                    vx = -vx;
                    hit = true;
                }
                if (y <= 0 || y >= maxY) {
                    vy = -vy;
                    hit = true;
                }

                if (hit) {
                    sound.playTone(400 + Math.random() * 300, 'sine', 0.05, 0.03);
                    colorIdx = (colorIdx + 1) % colors.length;
                    logo.style.borderColor = colors[colorIdx];
                    logo.style.boxShadow = `0 0 20px ${colors[colorIdx]}`;
                }

                logo.style.transform = `translate(${x}px, ${y}px)`;
                if (dvdRunning) dvdAnim = requestAnimationFrame(bounce);
            }
            bounce();
        } else {
            container.classList.add('hidden');
            cancelAnimationFrame(dvdAnim);
            showToast("DVD-läge avslutat.", "info");
        }
    }

    // =========================================================================
    // 15. KONAMI CODE EASTER EGG (↑ ↑ ↓ ↓ ← → ← → B A)
    // =========================================================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiPos = 0;

    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === konamiCode[konamiPos].toLowerCase()) {
            konamiPos++;
            if (konamiPos === konamiCode.length) {
                konamiPos = 0;
                sound.initContext();
                sound.playVictory();
                togglePartyMode();
                spawnConfetti();
                showToast("🎮 KONAMI CODE AKTIVERAD! 30 EXTRA FIKAPAUSER BEVILJADE!", "success");
            }
        } else {
            konamiPos = 0;
        }
    });

    // =========================================================================
    // 16. INIT ALL MODULES
    // =========================================================================
    document.addEventListener('DOMContentLoaded', () => {
        initMatrixRain();
        initTicker();
        renderArchetypes();
        initGenerators();
        initSoundboard();
        initCodeChaos();

        const terminal = new TerminalEngine();
        const smasher = new BugSmasherGame();

        // Control buttons in header
        const btnAudio = document.getElementById('btnAudioToggle');
        if (btnAudio) {
            btnAudio.addEventListener('click', () => {
                const isUnmuted = sound.toggleMute();
                btnAudio.querySelector('.icon').textContent = isUnmuted ? '🔊' : '🔇';
                btnAudio.querySelector('.label').textContent = isUnmuted ? 'LJUD: PÅ' : 'LJUD: AV';
                showToast(isUnmuted ? '🔊 8-bit Ljudeffekter aktiverade!' : '🔇 Ljud avstängt.', 'info');
            });
        }

        const btnCrt = document.getElementById('btnCrtToggle');
        if (btnCrt) {
            btnCrt.addEventListener('click', () => {
                document.body.classList.toggle('crt-enabled');
                const isEnabled = document.body.classList.contains('crt-enabled');
                btnCrt.querySelector('.label').textContent = isEnabled ? 'CRT: PÅ' : 'CRT: AV';
            });
        }

        document.getElementById('btnPartyMode')?.addEventListener('click', togglePartyMode);
        document.getElementById('btnPanic')?.addEventListener('click', triggerPanicMode);

        // Fika buttons
        document.getElementById('coffeeCup')?.addEventListener('click', drinkCoffee);
        document.getElementById('btnDrinkCoffee')?.addEventListener('click', drinkCoffee);
        document.getElementById('btnEatGiffel')?.addEventListener('click', eatGiffel);

        // Archetype randomizer
        document.getElementById('btnRandomArchetype')?.addEventListener('click', pickRandomArchetype);

        updateFikaUI();
    });

})();
