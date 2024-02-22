// core
function copyToClipboard(value) {
    navigator.clipboard.writeText(value);
    }

function saveScrollPosition(){
    document.addEventListener("DOMContentLoaded", function(event) {
        var scrollpos = localStorage.getItem('scrollpos');
            if (scrollpos) window.scrollTo(0, scrollpos);
        });

    window.onbeforeunload = function(e) {
        localStorage.setItem('scrollpos', window.scrollY);
    };
}


// random link
const links = [
    ['info', 1],
    // ['caruso', 2],
    // ['collages', 2],
    // ['elevations', 2],
    // ['plans', 2],
    // ['renders', 1],
    // ['rules', 2],
    // ['sections', 2],
    ['u015', 3],
    ['u022', 3],
    ['u037', 3],
    ['u045', 3],
    // ['wireframes', 2],
];

function randomSite(target) {
    current = location.hash
    let random = randomFromArray(links);

    while ("#" + random == current) {
        random = randomFromArray(links);
    }

    target.href = "#" + random
}

function randomFromArray(data) {
    // First, we loop the main dataset to count up the total weight.
    // We're starting the counter at one because the upper boundary
    // of Math.random() is exclusive.
    let total = 0;
    for (let i = 0; i < data.length; ++i) {
        total += data[i][1];
    }

    // Total in hand, we can now pick a random value akin to our
    // random index from before.
    const threshold = Math.random() * total;

    // Now we just need to loop through the main data one more time
    // until we discover which value would live within this
    // particular threshold. We need to keep a running count of
    // weights as we go, so let's just reuse the "total" variable
    // since it was already declared.
    total = 0;
    for (let i = 0; i < data.length - 1; ++i) {
        // Add the weight to our running total.
        total += data[i][1];

        // If this value falls within the threshold, we're done!
        if (total >= threshold) {
            return data[i][0];
        }
    }

    // Wouldn't you know it, we needed the very last entry!
    return data[data.length - 1][0];
}

// drag images
const canvasNodeList = document.querySelectorAll('.content');
const canvasArray = Array.from(canvasNodeList)

let pos1, pos2, pos3, pos4, pos5, pos6;

const mouseEps = 0.0000001; //epsilon interval
let drag = false;
let toogleDebug = false;

const convert_mm2px = function(mm) {
    var div = document.createElement('div');
    div.style.display = 'block';
    div.style.height = '100mm';
    document.body.appendChild(div);
    var convert = div.offsetHeight * mm / 100;
    div.parentNode.removeChild(div);
    return convert;
    };
const roundToNearest5 = x => Math.round(x / 5) * 5

const mm2px = convert_mm2px(1)

function toogleDrag() {
    for (let i = 0; i < canvasNodeList.length; i++) {
        canvas = canvasNodeList[i];
        canvas.addEventListener('mousedown', mouseDownHandler, false);
        canvas.addEventListener('mouseup', mouseUpHandler, false);
    }
}

function mouseDownHandler(e) {
    e.preventDefault();
    // if (!canvasArray.includes(e.target)) {
    if (e.target.tagName == "IMG") {
        pos3 = pos5 = e.clientX;
        pos4 = pos6 = e.clientY;
        drag = false;

        e.target.addEventListener('mousemove', doDrag, false);
        e.target.addEventListener('mouseup', stopDrag, false);
        e.target.addEventListener('mouseout', stopDrag, false);
    }
};

function mouseUpHandler(e) {
    e.preventDefault();
    if (Math.abs((pos5 - e.clientX)) >= mouseEps && Math.abs((pos6 - e.clientY)) >= mouseEps) {
        e.target.addEventListener('click', preventLink, false)
    } else {
        e.target.removeEventListener('click', preventLink, false)
        return
    }
};

function preventLink(e) {
    e.preventDefault();
    return false;
}

function doDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    e.target.style.top = (e.target.offsetTop - pos2) / mm2px + "mm";
    e.target.style.left = (e.target.offsetLeft - pos1) / mm2px + "mm";
}

function stopDrag(e) {
    e.target.removeEventListener('mousemove', doDrag, false);
    e.target.removeEventListener('mouseup', stopDrag, false);
    e.target.removeEventListener('mouseout', stopDrag, false);


    e.target.style.top = roundToNearest5(parseInt(e.target.style.top)) + "mm";
    e.target.style.left = roundToNearest5(parseInt(e.target.style.left)) + "mm";
    if (toogleDebug == true) {
        let canvas = e.target.parentElement
        let v = canvas.innerHTML.trim();
        console.log(v);
        copyToClipboard(v);
    }
}

function design() {
    if(toogleDebug == false) {
        toogleDebug = true;
        for (let i = 0; i < canvasNodeList.length; i++) {
            canvas = canvasNodeList[i];
            canvas.style.border = "1px solid red"
        }
    } else if(toogleDebug == true) {
        toogleDebug = false;
        for (let i = 0; i < canvasNodeList.length; i++) {
            canvas = canvasNodeList[i];
            canvas.style.border = ""
        }
    }
}

function main() {
    toogleDrag()
    saveScrollPosition()
    // toogleDebug = true
}

main()