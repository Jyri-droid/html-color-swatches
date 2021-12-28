// Show toaster
const toaster = document.getElementsByClassName("toaster");
showToaster = (icon, text) => {
    // Copy toaster node and place it again so animation can run more than once
    var copiedNode = toaster[0].cloneNode(true);
    toaster[0].parentNode.replaceChild(copiedNode, toaster[0]);
    toaster[0].innerHTML = "<span class='material-icons toasterIcon'>" + icon + "</span>&nbsp;" + text;
    toaster[0].style.animation = "toaster 4s ease-in-out";
}

// Create an array with keys to the html color name object
const colorKeys = Object.keys(wordToHex);

// Create a function to convert color name to hex
toHex = (color) => wordToHex[color.toLowerCase()];

// Create a function to convert color name to rgb
toRgb = (color) => {
    const hex = toHex(color);
    let r = 0, g = 0, b = 0;
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
    return +r + "," + +g + "," + +b
}

// Create a function to check Luminance and return a number between 0 and 1
getLuminance = (color) => {
    const getRgbValues = new RegExp("\\d+", "g");
    const rgbArray = toRgb(color).match(getRgbValues);
    let r = rgbArray[0], g = rgbArray[1], b = rgbArray[2];
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

// Create a function to build one single color swatch
addColorSwatch = (colorName, textColor) => {
    // Create & style element
    const colorSwatch = document.createElement("button");
    colorSwatch.classList.add("colorSwatch");
    colorSwatch.innerHTML = colorName;
    colorSwatch.style.backgroundColor = colorName;
    if (colorName == "black") { colorSwatch.style.border = "1px solid rgba(122,122,122,.5)"; }
    colorSwatch.style.color = textColor;
    // Add event listeners
    colorSwatch.addEventListener("mouseover", function() {
        colorSwatch.innerHTML = "<i class='material-icons'>content_copy</i>&nbsp;rgb&nbsp;" + toRgb(colorSwatch.style.backgroundColor);
    });
    colorSwatch.addEventListener("mouseleave", function() {
        colorSwatch.innerHTML = colorName;
    });
    colorSwatch.addEventListener("click", function() {
        const rgbToCopy = toRgb(colorSwatch.style.backgroundColor);
        navigator.clipboard.writeText(rgbToCopy);
        showToaster("done", "Rgb value copied to clipboard!");
    });
    // Append element to DOM
    document.getElementById("htmlColors").appendChild(colorSwatch);
}

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
        if (getLuminance(colorName) > .35) {
            textColorBasedOnLuminance = "rgb(50,50,50)";
        } else {
            textColorBasedOnLuminance = "white";
        }
        // Create swatch
        addColorSwatch(colorName, textColorBasedOnLuminance);
    }
}

// SEARCH

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

let sortInReverse;
let sortBasedOnLuminance;

document.getElementById("search").addEventListener("input", function() {
    let sortable = [];
    const currentValue = this.value;
    let foundColors = getColors(currentValue);
    if (sortBasedOnLuminance) { 
        sortable = sortColorsByLuminance(foundColors);
    } else { 
        sortable = sortColorsByAlphabet(foundColors);
    }
    if (sortInReverse) { 
        sortColorsInReverse(sortable); 
    }
    renderSwatches(sortable);
});

// REVERSE SORT

document.getElementById("sortReverse").addEventListener("click", function(event) {
    event.preventDefault();
    if (this.innerHTML.includes("downward")) {
        this.innerHTML = this.innerHTML.replace("downward", "upward");
        let toRender = sortColorsInReverse(getVisibleColors());
        renderSwatches(toRender);
        sortInReverse = true;
    } else {
        this.innerHTML = this.innerHTML.replace("upward", "downward");
        let toRender = sortColorsInReverse(getVisibleColors());
        renderSwatches(toRender);
        sortInReverse = false;
    }
});

// SORTING ORDER

document.getElementById("sortLuminance").addEventListener("click", function() {
    this.classList.add("selected");
    sortAlphabetical.classList.remove("selected");
    let toRender = sortColorsByLuminance(getVisibleColors());
    if (sortInReverse) { 
        sortColorsInReverse(toRender); 
    }
    renderSwatches(toRender);
    sortBasedOnLuminance = true;
});

document.getElementById("sortAlphabetical").addEventListener("click", function() {
    this.classList.add("selected");
    sortLuminance.classList.remove("selected");
    let toRender = sortColorsByAlphabet(getVisibleColors());
    if (sortInReverse) { 
        sortColorsInReverse(toRender); 
    }
    renderSwatches(toRender);
    sortBasedOnLuminance = false;
});

// Sort array in reverse, alphabetical or luminance order

sortColorsInReverse = (array) => {
    array.reverse();
    return array;
}

sortColorsByAlphabet = (array) => {
    let sortable = [];
    for (i = 0; i < array.length; i++) {
        sortable.push(array[i]);
    }
    sortable.sort();
    return sortable;
}

sortColorsByLuminance = (array) => {
    let sortable = [];
    for (i = 0; i < array.length; i++) {
        sortable.push([array[i], getLuminance(array[i])]);
    }
    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });
    const sorted = [];
    for (i = 0; i < sortable.length; i++) {
        sorted.push(sortable[i][0]);
    }
    return sorted;
}

// Get all swatches that are visible on the screen
getVisibleColors = () => {
    const visibleSwatches = document.getElementsByClassName("colorSwatch");
    const visibleColors = [];
    for (i of visibleSwatches) {
        visibleColors.push(i.style.backgroundColor);
    }
    return visibleColors;
}

// Render all swatches in the initial view
renderSwatches(sortColorsByAlphabet(colorKeys));