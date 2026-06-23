const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.getElementById("palette-container");

function randomColor() {

    const letters = "0123456789ABCDEF";

    let color = "#";

    for(let i = 0; i < 6; i++) {

        color += letters[Math.floor(Math.random() * 16)];

    }

    return color;
}

function generatePalette() {

    paletteContainer.innerHTML = "";

    for(let i = 0; i < 6; i++) {

        const card = document.createElement("div");

        const color = randomColor();

        card.classList.add("color-card");

        card.innerHTML = `
            <div
                class="color-preview"
                style="background:${color}">
            </div>

            <p class="color-code">
                ${color}
            </p>
        `;

        paletteContainer.appendChild(card);
    }
}

generateBtn.addEventListener(
    "click",
    generatePalette
);