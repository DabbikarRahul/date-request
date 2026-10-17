/* ==========================================================================
   A DATE WITH KANNA ❤️ - INTERACTIVE LOGIC & ANIMATIONS
   ========================================================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // ----------------------------------------------------------------------
    // State & Elements
    // ----------------------------------------------------------------------
    const pageIds = ["page1", "page2", "page3", "page4", "page5"];
    let currentPageIndex = 0;
    let noButtonAttempts = 0;
    let yesScale = 1;

    const noButtonTexts = [
        "NO 😜",
        "Are you sure? 🥺",
        "Wait, really?! 💔",
        "Think about the snacks! 🍗",
        "Don't break my heart! 😭",
        "Nice try, Kanna! 🏃‍♀️",
        "Error 404: NO not found! 🙈",
        "Resistance is futile! 😂",
        "Just click YES already! 💕"
    ];

    const yesBtn = document.getElementById("yesButton");
    const noBtn = document.getElementById("noButton");
    const dateInput = document.getElementById("dateInput");
    const timeInput = document.getElementById("timeInput");
    const music = document.getElementById("loveMusic");
    const musicBtn = document.getElementById("musicWidget");
    const musicText = document.getElementById("musicText");
    const stepDots = document.querySelectorAll(".step-dot");

    // Initialize earliest selectable date as today
    const now = new Date();
    const todayFormatted = now.toISOString().split("T")[0];
    if (dateInput) {
        dateInput.min = todayFormatted;
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() + 1);
        dateInput.value = defaultDate.toISOString().split("T")[0];
    }
    if (timeInput) {
        timeInput.value = "19:30"; // Default 7:30 PM
    }

    // ----------------------------------------------------------------------
    // Zero-Scroll Enforcer
    // ----------------------------------------------------------------------
    window.addEventListener("scroll", () => {
        if (window.scrollY !== 0 || window.scrollX !== 0) {
            window.scrollTo(0, 0);
        }
    }, { passive: false });

    // ----------------------------------------------------------------------
    // Toast Notifications
    // ----------------------------------------------------------------------
    function showToast(message, emoji = "💖") {
        const existingToasts = document.querySelectorAll(".toast");
        existingToasts.forEach(t => t.remove());

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `<span>${emoji}</span><span>${message}</span>`;

        let container = document.querySelector(".toast-container");
        if (!container) {
            container = document.createElement("div");
            container.className = "toast-container";
            document.body.appendChild(container);
        }
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(15px) scale(0.95)";
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // ----------------------------------------------------------------------
    // Page Navigation & Stepper
    // ----------------------------------------------------------------------
    window.showPage = function(pageId) {
        const targetIndex = pageIds.indexOf(pageId);
        if (targetIndex === -1) return;
        currentPageIndex = targetIndex;

        pageIds.forEach((id, index) => {
            const pageElem = document.getElementById(id);
            if (!pageElem) return;

            if (id === pageId) {
                pageElem.classList.remove("hidden");
                pageElem.style.animation = "none";
                pageElem.offsetHeight; // Reflow
                pageElem.style.animation = "";
            } else {
                pageElem.classList.add("hidden");
            }

            if (stepDots[index]) {
                stepDots[index].classList.remove("active", "completed");
                if (index === targetIndex) {
                    stepDots[index].classList.add("active");
                } else if (index < targetIndex) {
                    stepDots[index].classList.add("completed");
                }
            }
        });

        // Hide runaway NO button on pages other than page 1
        if (noBtn) {
            if (pageId !== "page1") {
                noBtn.style.display = "none";
            } else {
                noBtn.style.display = "";
                // If restarting, return to button group
                const buttonGroup = document.querySelector("#page1 .button-group");
                if (buttonGroup && noBtn.parentElement !== buttonGroup) {
                    noBtn.style.position = "";
                    noBtn.style.left = "";
                    noBtn.style.top = "";
                    noBtn.style.margin = "";
                    noBtn.textContent = "NO 😜";
                    buttonGroup.appendChild(noBtn);
                }
            }
        }

        window.scrollTo(0, 0);

        if (pageId === "page4" || pageId === "page5") {
            triggerConfetti();
        }
    };

    // ----------------------------------------------------------------------
    // ----------------------------------------------------------------------
    // Runaway "NO" Button (Unbeatable: Proximity Radar + Full 100vh Freedom)
    // ----------------------------------------------------------------------
    let lastEvasionTime = 0;

    function moveNoButton(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const nowTime = Date.now();
        // Snappy throttle (80ms) so it can glide continuously without freezing
        if (nowTime - lastEvasionTime < 80) return;
        lastEvasionTime = nowTime;

        noButtonAttempts++;

        const textIndex = Math.min(noButtonAttempts, noButtonTexts.length - 1);
        noBtn.textContent = noButtonTexts[textIndex];

        if (yesScale < 1.45) {
            yesScale += 0.05;
            yesBtn.style.transform = `scale(${yesScale})`;
        }

        // On first evasion, detach and append to body so it floats over EVERYTHING
        if (noBtn.parentElement !== document.body) {
            const initialRect = noBtn.getBoundingClientRect();
            noBtn.style.position = "fixed";
            noBtn.style.left = `${initialRect.left}px`;
            noBtn.style.top = `${initialRect.top}px`;
            noBtn.style.margin = "0";
            noBtn.style.zIndex = "9999";
            document.body.appendChild(noBtn);
            noBtn.offsetHeight; // Force reflow
        }

        const btnWidth = noBtn.offsetWidth || 100;
        const btnHeight = noBtn.offsetHeight || 42;

        const currentRect = noBtn.getBoundingClientRect();
        const currentCenterX = currentRect.left + btnWidth / 2;
        const currentCenterY = currentRect.top + btnHeight / 2;

        const ptrX = (event && typeof event.clientX === "number") ? event.clientX : currentCenterX;
        const ptrY = (event && typeof event.clientY === "number") ? event.clientY : currentCenterY;

        // Viewport safe bounds: entire screen, strictly inside 100vh
        const marginX = 25;
        const minX = marginX;
        const maxX = Math.max(minX, window.innerWidth - btnWidth - marginX);

        const minY = 55; // Below the music pill
        const maxY = Math.max(minY, window.innerHeight - btnHeight - 25);

        // Pick a new position across the entire 100vh screen that is far from the pointer (at least 220px away)
        let newX, newY;
        let attempts = 0;
        do {
            newX = minX + Math.random() * (maxX - minX);
            newY = minY + Math.random() * (maxY - minY);
            attempts++;
        } while (attempts < 30 && Math.hypot(newX - ptrX, newY - ptrY) < 220);

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));

        noBtn.style.left = `${Math.round(newX)}px`;
        noBtn.style.top = `${Math.round(newY)}px`;

        spawnEmojiParticle(currentCenterX, currentCenterY, "💨");
    }

    // PROXIMITY RADAR: As soon as the cursor gets within 85px, FLEE! It won't let you come close at all!
    document.addEventListener("pointermove", (e) => {
        if (currentPageIndex !== 0 || !noBtn || noBtn.style.display === "none") return;
        const rect = noBtn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

        if (dist < 85) {
            moveNoButton(e);
        }
    });

    if (noBtn) {
        // Intercept every possible interaction so it's 100% impossible to click or catch
        ["pointerenter", "pointerover", "pointerdown", "touchstart", "mousedown", "click", "focus"].forEach(evt => {
            noBtn.addEventListener(evt, (e) => {
                e.preventDefault();
                e.stopPropagation();
                moveNoButton(e);
            }, { passive: false });
        });
    }

    // ----------------------------------------------------------------------
    // YES Button Click
    // ----------------------------------------------------------------------
    if (yesBtn) {
        yesBtn.addEventListener("click", () => {
            triggerConfetti();
            showToast("She said YES! Best day ever! 🎉❤️", "💍");
            setTimeout(() => {
                showPage("page2");
            }, 550);
        });
    }

    // ----------------------------------------------------------------------
    // Page 2: Presets & Validation
    // ----------------------------------------------------------------------
    const dateChips = document.querySelectorAll(".date-preset");
    dateChips.forEach(chip => {
        chip.addEventListener("click", () => {
            dateChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            const daysToAdd = parseInt(chip.dataset.days || "1", 10);
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + daysToAdd);
            dateInput.value = targetDate.toISOString().split("T")[0];
        });
    });

    const timeChips = document.querySelectorAll(".time-preset");
    timeChips.forEach(chip => {
        chip.addEventListener("click", () => {
            timeChips.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            timeInput.value = chip.dataset.time || "19:30";
        });
    });

    const dateNextBtn = document.getElementById("dateNext");
    if (dateNextBtn) {
        dateNextBtn.addEventListener("click", () => {
            if (!dateInput.value) {
                showToast("Please choose our special date! 📅", "⚠️");
                dateInput.focus();
                return;
            }
            if (!timeInput.value) {
                showToast("Please select what time we're meeting! ⏰", "⚠️");
                timeInput.focus();
                return;
            }
            showPage("page3");
        });
    }

    // ----------------------------------------------------------------------
    // Page 3: Food Selection (Multi-Select Checkboxes with Instant Sync)
    // ----------------------------------------------------------------------
    const foodCheckboxes = document.querySelectorAll('.food-card input[type="checkbox"]');

    foodCheckboxes.forEach(checkbox => {
        function syncCard() {
            const card = checkbox.closest(".food-card");
            const indicator = card.querySelector(".food-check-indicator");
            if (checkbox.checked) {
                card.classList.add("selected");
                if (indicator) indicator.textContent = "✓";
            } else {
                card.classList.remove("selected");
                if (indicator) indicator.textContent = "";
            }
        }

        // Native checkbox change event
        checkbox.addEventListener("change", () => {
            syncCard();
            if (checkbox.checked) {
                const card = checkbox.closest(".food-card");
                spawnEmojiParticle(card.getBoundingClientRect().right - 25, card.getBoundingClientRect().top + 15, "✨");
            }
        });

        // Initialize state on page load
        syncCard();
    });

    const foodNextBtn = document.getElementById("foodNext");
    if (foodNextBtn) {
        foodNextBtn.addEventListener("click", () => {
            const selectedFoods = Array.from(
                document.querySelectorAll('.food-card input[type="checkbox"]:checked')
            ).map(cb => cb.value);

            if (selectedFoods.length === 0) {
                showToast("Pick at least one delicious treat, Kanna! 🍜", "😋");
                return;
            }

            populateSummary(selectedFoods);
            showPage("page4");
        });
    }

    // ----------------------------------------------------------------------
    // Format and Populate Ticket / Summary
    // ----------------------------------------------------------------------
    function formatTime12h(time24) {
        if (!time24) return "7:30 PM";
        const [hours, minutes] = time24.split(":");
        let h = parseInt(hours, 10);
        const ampm = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
        return `${h}:${minutes} ${ampm}`;
    }

    function formatDateLong(dateStr) {
        if (!dateStr) return "Special Romantic Evening";
        const parts = dateStr.split("-");
        if (parts.length !== 3) return dateStr;
        const d = new Date(parts[0], parts[1] - 1, parts[2]);
        const options = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
        return d.toLocaleDateString("en-US", options);
    }

    let savedSelectedFoods = [];

    function populateSummary(selectedFoods) {
        savedSelectedFoods = selectedFoods;
        const rawDate = dateInput.value;
        const rawTime = timeInput.value;
        const formattedDate = formatDateLong(rawDate);
        const formattedTime = formatTime12h(rawTime);

        const ticketDate = document.getElementById("ticketDate");
        const ticketTime = document.getElementById("ticketTime");
        const ticketFood = document.getElementById("ticketFood");

        if (ticketDate) ticketDate.textContent = formattedDate;
        if (ticketTime) ticketTime.textContent = formattedTime;
        if (ticketFood) ticketFood.textContent = selectedFoods.join(", ");

        const contractDateElem = document.getElementById("contractDateDetail");
        if (contractDateElem) {
            contractDateElem.textContent = `${formattedDate} at ${formattedTime}`;
        }
        const contractFoodElem = document.getElementById("contractFoodDetail");
        if (contractFoodElem) {
            contractFoodElem.textContent = selectedFoods.join(", ");
        }
    }

    // ----------------------------------------------------------------------
    // Page 4: Boarding Pass Next Button
    // ----------------------------------------------------------------------
    const confirmDateBtn = document.getElementById("confirmDate");
    if (confirmDateBtn) {
        confirmDateBtn.addEventListener("click", () => {
            showPage("page5");
        });
    }

    // ----------------------------------------------------------------------
    // Page 5: WhatsApp Share to Rahul (+91 73864 82570)
    // ----------------------------------------------------------------------
    const whatsappBtn = document.getElementById("whatsappShareBtn");
    if (whatsappBtn) {
        whatsappBtn.addEventListener("click", () => {
            const rawDate = dateInput.value;
            const rawTime = timeInput.value;
            const formattedDate = formatDateLong(rawDate);
            const formattedTime = formatTime12h(rawTime);
            const foodList = savedSelectedFoods.join(", ") || "Delicious Food";

            const message = 
`Hey Rahul! ❤️🥰
I said YES to your date invitation! 💖

📅 Date: ${formattedDate}
⏰ Time: ${formattedTime}
🍽️ Our Menu: ${foodList}

⚠️ Rule Accepted: If I don't show up, ₹2,000 fine applies! 😂
See you soon, my favorite person! 💕😘`;

            // Rahul's WhatsApp number: +91 73864 82570 -> 917386482570
            const rahulNumber = "917386482570";
            const encoded = encodeURIComponent(message);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${rahulNumber}&text=${encoded}`;
            window.open(whatsappUrl, "_blank");
            showToast("Opening WhatsApp chat with Rahul! 💌", "📲");
        });
    }

    const copyBtn = document.getElementById("copyPlanBtn");
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const rawDate = dateInput.value;
            const rawTime = timeInput.value;
            const formattedDate = formatDateLong(rawDate);
            const formattedTime = formatTime12h(rawTime);
            const foodList = savedSelectedFoods.join(", ");

            const textToCopy = `A Date with Rahul & Kanna ❤️\n📅 Date: ${formattedDate}\n⏰ Time: ${formattedTime}\n🍽️ Feast: ${foodList}\nSpecial Rule: Don't break Rahul's heart! 💕`;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast("Date invitation copied! ✨", "📋");
                }).catch(() => {
                    showToast("Copied!", "📋");
                });
            } else {
                showToast("Date plan saved! ❤️", "✨");
            }
        });
    }

    // ----------------------------------------------------------------------
    // Background Music Player
    // ----------------------------------------------------------------------
    if (music && musicBtn) {
        musicBtn.addEventListener("click", async () => {
            if (music.paused) {
                try {
                    await music.play();
                    musicBtn.classList.add("playing");
                    if (musicText) musicText.textContent = "Playing Melody";
                    showToast("Playing romantic music 🎶", "🎵");
                } catch (err) {
                    showToast("Tap again to play romantic music! 🎵", "🎶");
                }
            } else {
                music.pause();
                musicBtn.classList.remove("playing");
                if (musicText) musicText.textContent = "Play Music 🎵";
            }
        });

        music.addEventListener("play", () => {
            musicBtn.classList.add("playing");
            if (musicText) musicText.textContent = "Playing Melody";
        });

        music.addEventListener("pause", () => {
            musicBtn.classList.remove("playing");
            if (musicText) musicText.textContent = "Play Music 🎵";
        });
    }

    // ----------------------------------------------------------------------
    // Floating Hearts
    // ----------------------------------------------------------------------
    const heartEmojis = ["❤️", "💕", "💖", "💗", "💘", "✨", "🌸", "🥰"];

    function spawnFloatingHeart() {
        const heart = document.createElement("span");
        heart.className = "floating-heart";
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

        const startX = Math.random() * 100;
        const size = 14 + Math.random() * 20;
        const duration = 5 + Math.random() * 5;

        heart.style.left = `${startX}vw`;
        heart.style.fontSize = `${size}px`;
        heart.style.animationDuration = `${duration}s`;
        heart.style.opacity = (0.4 + Math.random() * 0.5).toString();

        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, duration * 1000 + 400);
    }

    setInterval(spawnFloatingHeart, 600);

    function spawnEmojiParticle(x, y, emoji = "✨") {
        const spark = document.createElement("div");
        spark.textContent = emoji;
        spark.style.position = "fixed";
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.style.pointerEvents = "none";
        spark.style.zIndex = "9999";
        spark.style.fontSize = "20px";
        spark.style.transition = "transform 0.7s ease-out, opacity 0.7s ease-out";
        document.body.appendChild(spark);

        requestAnimationFrame(() => {
            const destX = (Math.random() - 0.5) * 60;
            const destY = -35 - Math.random() * 50;
            spark.style.transform = `translate(${destX}px, ${destY}px) scale(1.3) rotate(${Math.random() * 40 - 20}deg)`;
            spark.style.opacity = "0";
        });

        setTimeout(() => spark.remove(), 750);
    }

    // ----------------------------------------------------------------------
    // Built-in Confetti Engine (Zero Dependencies)
    // ----------------------------------------------------------------------
    function triggerConfetti() {
        const canvas = document.createElement("canvas");
        canvas.style.position = "fixed";
        canvas.style.inset = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.zIndex = "9998";
        canvas.style.pointerEvents = "none";
        document.body.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ["#ff2a6d", "#ff5e62", "#ffd166", "#06d6a0", "#118ab2", "#ffffff", "#ff85a2"];

        for (let i = 0; i < 75; i++) {
            pieces.push({
                x: canvas.width / 2,
                y: canvas.height * 0.45,
                w: 5 + Math.random() * 5,
                h: 7 + Math.random() * 9,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 14,
                vy: -5 - Math.random() * 10,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 12,
                gravity: 0.35 + Math.random() * 0.15,
                opacity: 1
            });
        }

        let frameId;
        function render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;

            pieces.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.vx *= 0.98;
                p.rotation += p.rotSpeed;
                p.opacity -= 0.01;

                if (p.opacity > 0 && p.y < canvas.height + 40) {
                    alive = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.globalAlpha = Math.max(0, p.opacity);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                    ctx.restore();
                }
            });

            if (alive) {
                frameId = requestAnimationFrame(render);
            } else {
                cancelAnimationFrame(frameId);
                canvas.remove();
            }
        }
        render();
    }

    // Star dust canvas in background
    const bgCanvas = document.getElementById("particleCanvas");
    if (bgCanvas) {
        const bgCtx = bgCanvas.getContext("2d");
        let stars = [];

        function resizeBgCanvas() {
            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;
            stars = [];
            const count = Math.floor((bgCanvas.width * bgCanvas.height) / 14000);
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * bgCanvas.width,
                    y: Math.random() * bgCanvas.height,
                    radius: 0.5 + Math.random() * 1.2,
                    alpha: 0.2 + Math.random() * 0.5,
                    speed: 0.15 + Math.random() * 0.3
                });
            }
        }

        resizeBgCanvas();
        window.addEventListener("resize", resizeBgCanvas);

        function animateBgStars() {
            bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
            stars.forEach(s => {
                s.y -= s.speed;
                if (s.y < 0) {
                    s.y = bgCanvas.height;
                    s.x = Math.random() * bgCanvas.width;
                }
                bgCtx.beginPath();
                bgCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                bgCtx.fillStyle = `rgba(255, 200, 225, ${s.alpha})`;
                bgCtx.fill();
            });
            requestAnimationFrame(animateBgStars);
        }
        animateBgStars();
    }
});
