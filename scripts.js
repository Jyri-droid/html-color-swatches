

// Luminance checker
getLuminance = (hex) => {
    let r = 0, g = 0, b = 0;
    // Convert hex into rgb
    // Hex with 3 digits
    if (hex.length == 4) {
        r = "0x" + hex[1] + hex[1];
        g = "0x" + hex[2] + hex[2];
        b = "0x" + hex[3] + hex[3];
    // Hex with 6 digits
    } else if (hex.length == 7) {
        r = "0x" + hex[1] + hex[2];
        g = "0x" + hex[3] + hex[4];
        b = "0x" + hex[5] + hex[6];
    }
    // Luminance counter
    let a = [r, g ,b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    // Return a value between 0-1
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Function to build one single color swatch
addColorSwatch = (colorName, textColor) => {
    // Create & style element
    const colorSwatch = document.createElement("button");
    colorSwatch.classList.add("colorSwatch");
    colorSwatch.style.backgroundColor = colorName;
    colorSwatch.style.color = textColor;
    colorSwatch.innerHTML = colorSwatch.style.backgroundColor;
    // Add event listeners
    colorSwatch.addEventListener("mouseover", function() {
        colorSwatch.innerHTML = "<span class='material-icons'>content_copy</span>&nbsp;" + toHex(colorSwatch.style.backgroundColor);
    });
    colorSwatch.addEventListener("mouseleave", function() {
        colorSwatch.innerHTML = colorSwatch.style.backgroundColor;
    });
    colorSwatch.addEventListener("click", function() {
        const hexColor = toHex(colorSwatch.style.backgroundColor);
        const hexWithoutHashtag = hexColor.match(/\w/g).join("");
        navigator.clipboard.writeText(hexWithoutHashtag);
        showToaster("done", "Hex value copied to clipboard!");
    });
    // Append element to DOM
    document.getElementById("htmlColors").appendChild(colorSwatch);
}

// Create a function to convert color name to hex
toHex = (color) => wordToHex[color.toLowerCase()];

// Create a function to remove all children of a node
removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Create a swatch for each color in an array
renderSwatches = (array) => {
    // Clear old swatches
    removeAllChildNodes(document.getElementById("htmlColors"));
    // Render new swatches
    for (let i = 0; i < array.length; i++) {
        // Get color name from JS object
        const colorName = array[i];
        // Decide text color based on luminosity
        let textColorBasedOnLuminance;
        const luminance = getLuminance(toHex(colorName));
        if (luminance > .35) {
            textColorBasedOnLuminance = "rgb(50,50,50)";
        } else {
            textColorBasedOnLuminance = "white";
        }
        // Create swatch
        addColorSwatch(colorName, textColorBasedOnLuminance);
    }
}

// Create an array with keys to the html color name object
const colorKeys = Object.keys(wordToHex);

// Render all swatches in the initial view
renderSwatches(colorKeys);

// Make a search through all color names
getColors = (searchWord) => {
    const pattern = new RegExp(searchWord, "i");
    let searchResults = [];
    for (let i = 0; i < colorKeys.length; i++) {
        if (pattern.test(colorKeys[i])) {
            searchResults.push(colorKeys[i]);
        }
    }
    return searchResults;
}

// Render search result
const inputElement = document.getElementById("search");
inputElement.addEventListener("input", function() {
    const currentValue = inputElement.value;
    const foundColors = getColors(currentValue);
    renderSwatches(foundColors);
});

// Show toaster
const toaster = document.getElementsByClassName("toaster");
showToaster = (icon, text) => {
    // Copy toaster node and place it again so animation can run more than once
    var copiedNode = toaster[0].cloneNode(true);
    toaster[0].parentNode.replaceChild(copiedNode, toaster[0]);
    toaster[0].innerHTML = "<span class='material-icons toasterIcon'>" + icon + "</span>&nbsp;" + text;
    toaster[0].style.animation = "toaster 3s ease-in-out";
}