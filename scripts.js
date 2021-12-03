// HTML color generator

    // Luminance checker
    getLuminance = (hex) => {
        let r = 0, g = 0, b = 0;
        // Convert hex into rgb
        // 3 digits
        if (hex.length == 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
        // 6 digits
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

    // Function to build a color swatch
    addColorSwatch = (colorName, textColor) => {
        const colorSwatch = document.createElement("button");
        colorSwatch.classList.add("colorSwatch");
        colorSwatch.style.backgroundColor = colorName;
        colorSwatch.style.color = textColor;
        colorSwatch.innerHTML = colorSwatch.style.backgroundColor;
        document.getElementById("htmlColors").appendChild(colorSwatch);
    }

    // Create an array with keys to the html color name object
    const colorKeys = Object.keys(wordToHex);

    // Create a function to convert color name to hex
    toHex = (color) => wordToHex[color.toLowerCase()];

    // Create a swatch from each color
    for (let i = 0; i < colorKeys.length; i++) {
        // Get color name from JS object
        const colorName = colorKeys[i];
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

    // Swatch hover and click events
    const allSwatches = document.getElementsByClassName("colorSwatch");
    for (let j of allSwatches) {
        // Hover
        j.addEventListener("mouseover", function() {
            j.innerHTML = "<span class='material-icons'>content_copy</span>&nbsp;" + toHex(j.style.backgroundColor);
        });
        // Hover end
        j.addEventListener("mouseleave", function() {
            j.innerHTML = j.style.backgroundColor;
        });
        // Click
        j.addEventListener("click", function() {
            const hexColor = toHex(j.style.backgroundColor);
            const hexWithoutHashtag = hexColor.match(/\w/g).join("");
            navigator.clipboard.writeText(hexWithoutHashtag);
            showToaster("<span class='material-icons verifyIcon'>done</span>&nbsp;Hex value copied to clipboard!");
        });
    }

    // Show toaster
    const toaster = document.getElementsByClassName("toaster");
    showToaster = (text) => {
        // Copy toaster node and place it again so animation can run more than once
        var copiedNode = toaster[0].cloneNode(true);
        toaster[0].parentNode.replaceChild(copiedNode, toaster[0]);
        toaster[0].innerHTML = text;
        toaster[0].style.animation = "toaster 3s ease-in-out";
    }