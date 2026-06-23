const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.getElementById("palette-container");
const paletteSize = document.getElementById("palette-size");

function randomColor() {

    const hue = Math.floor(Math.random() * 360);

    return `hsl(${hue}, 70%, 75%)`;
}

function hslToHex(h, s, l) {

    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0;
    let g = 0;
    let b = 0;

    if (h < 60) {
        r = c;
        g = x;
    } else if (h < 120) {
        r = x;
        g = c;
    } else if (h < 180) {
        g = c;
        b = x;
    } else if (h < 240) {
        g = x;
        b = c;
    } else if (h < 300) {
        r = x;
        b = c;
    } else {
        r = c;
        b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return "#" +
        r.toString(16).padStart(2, "0") +
        g.toString(16).padStart(2, "0") +
        b.toString(16).padStart(2, "0");
}

function generatePalette() {

    paletteContainer.innerHTML = "";

    const amount = Number(paletteSize.value);

    if (amount === 6) {
        paletteContainer.style.gridTemplateColumns =
            "repeat(3, 180px)";
    } else if (amount === 8) {
        paletteContainer.style.gridTemplateColumns =
            "repeat(4, 180px)";
    } else {
        paletteContainer.style.gridTemplateColumns =
            "repeat(3, 180px)";
    }

    for(let i = 0; i < amount; i++) {

        const card = document.createElement("div");

        const color = randomColor();

        const hue =
            Number(color.match(/\d+/)[0]);

        const hexColor =
            hslToHex(hue, 70, 75);

        card.classList.add("color-card");

        card.innerHTML = `
            <div
                class="color-preview"
                style="background:${color}">
            </div>

            <p class="color-code">
                ${hexColor}
            </p>
        `;

        paletteContainer.appendChild(card);
    }
}

generateBtn.addEventListener(
    "click",
    generatePalette
);