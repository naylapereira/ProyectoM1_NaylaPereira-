const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.getElementById("palette-container");
const paletteSize = document.getElementById("palette-size");
const toast = document.getElementById("toast");
const hexBtn = document.getElementById("hex-btn");
const hslBtn = document.getElementById("hsl-btn");

let currentFormat = "hex";

let currentPalette = [];

let lockedColors = [];

function randomHexColor() {

    const hue = Math.floor(Math.random() * 360);

    return `hsl(${hue}, 70%, 60%)`;
}

function createColorObject() {

    const hsl = randomHexColor();

    const hue = Number(hsl.match(/\d+/)[0]);

    const hex = hslToHex(hue, 70, 75);

    return {
        hsl,
        hex
    };
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h < 60) {
        r = c; g = x;
    } else if (h < 120) {
        r = x; g = c;
    } else if (h < 180) {
        g = c; b = x;
    } else if (h < 240) {
        g = x; b = c;
    } else if (h < 300) {
        r = x; b = c;
    } else {
        r = c; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return "#" +
        r.toString(16).padStart(2, "0") +
        g.toString(16).padStart(2, "0") +
        b.toString(16).padStart(2, "0");
}

function showToast(message) {

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1500);
}

function updateFormat() {

    const codes =
        document.querySelectorAll(".color-code");

    codes.forEach((code, index) => {

        code.textContent =
            currentFormat === "hex"
                ? currentPalette[index].hex
                : currentPalette[index].hsl;
    });
}

function renderPalette() {

    paletteContainer.innerHTML = "";

    const amount = currentPalette.length;

    if (amount === 6) {
        paletteContainer.style.gridTemplateColumns = "repeat(3, 170px)";
    } else if (amount === 8) {
        paletteContainer.style.gridTemplateColumns = "repeat(4, 170px)";
    } else {
        paletteContainer.style.gridTemplateColumns = "repeat(3, 170px)";
    }

    currentPalette.forEach((paletteColor, i) => {

        const card = document.createElement("article");

        card.classList.add("color-card");

        card.style.cursor = "default";

        card.innerHTML = `
            <div class="color-preview"></div>

            <button class="lock-btn">
                ${lockedColors.some(c => c.hsl === paletteColor.hsl) ? "🔒" : "🔓"}
            </button>

            <span class="color-name">
                Color ${i + 1}
            </span>

            <div class="color-code-container" style="display: flex; align-items: center; gap: 8px; justify-content: center;">
                <span class="color-code">
                    ${
                        currentFormat === "hex"
                            ? paletteColor.hex
                            : paletteColor.hsl
                    }
                </span>
                <button class="copy-btn" style="cursor: pointer; background: none; border: none; font-size: 1.1rem; padding: 4px;">
                    📋
                </button>
            </div>
        `;

        card.querySelector(".color-preview").style.backgroundColor =
            paletteColor.hsl;

        const lockBtn = card.querySelector(".lock-btn");

        lockBtn.addEventListener("click", (event) => {
            event.stopPropagation();

            const isLocked = lockedColors.some(c => c.hsl === paletteColor.hsl);

            if (isLocked) {
                lockedColors = lockedColors.filter(c => c.hsl !== paletteColor.hsl);
                lockBtn.textContent = "🔓";
            } else {
                lockedColors.push(paletteColor);
                lockBtn.textContent = "🔒";
            }
        });

        const copyBtn = card.querySelector(".copy-btn");
        
        if (copyBtn) {
            copyBtn.addEventListener("click", (event) => {
                event.stopPropagation();

                navigator.clipboard.writeText(
                    currentFormat === "hex"
                        ? paletteColor.hex
                        : paletteColor.hsl
                );

                showToast(
                    currentFormat === "hex"
                        ? `Código HEX Color ${i + 1} copiado`
                        : `Código HSL Color ${i + 1} copiado`
                );
            });
        }

        paletteContainer.appendChild(card);
    });
}

function generatePalette() {
    paletteContainer.innerHTML = "";

    const amount = Number(paletteSize.value);

    if (amount === 6) {
        paletteContainer.style.gridTemplateColumns = "repeat(3, 170px)";
    } else if (amount === 8) {
        paletteContainer.style.gridTemplateColumns = "repeat(4, 170px)";
    } else {
        paletteContainer.style.gridTemplateColumns = "repeat(3, 170px)";
    }

    currentPalette = [...lockedColors].slice(0, amount);

    const usedColors = currentPalette.map(color => color.hsl);

    while (currentPalette.length < amount) {
        let color;

        do {
            color = randomHexColor();
        } while (usedColors.includes(color));

        usedColors.push(color);

        const hue = Number(color.match(/\d+/)[0]);
        const hexColor = hslToHex(hue, 70, 75);

        currentPalette.push({
            hsl: color,
            hex: hexColor
        });
    }

    renderPalette();
}

hexBtn.addEventListener("click", () => {

    currentFormat = "hex";

    hexBtn.classList.add("active-format");
    hslBtn.classList.remove("active-format");

    updateFormat();
});

hslBtn.addEventListener("click", () => {

    currentFormat = "hsl";

    hslBtn.classList.add("active-format");
    hexBtn.classList.remove("active-format");

    updateFormat();
});

generateBtn.addEventListener(
    "click", 
    generatePalette
);

paletteSize.addEventListener(
    "change",
    generatePalette
);

generatePalette();