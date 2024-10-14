const n = 10;
const array = [];
let stopAnimation = false;
let updates = [];
let isScrambled = false;
let isSuccessful = false;

//Add animation speed global variable

sort();

function sort() {

    for (let i = 0; i < 100; i++) {
        array[i] = i / 100 + 5/100;
    }

    updateBars();
}

function init() {

    if (updates.length == 0) {
        const copy = [...array];
        updates = shuffle(copy);
        isScrambled = true
        animate();
    }
}

function play() {

    if (stopAnimation) {
        
        stopAnimation = false;
        return;
    }

    if (updates.length == 0) {

        const copy = [...array];
        updates = bubbleSort(copy);
        isScrambled = false;
        isSuccessful = true;
        animate();
    }
    else {
        stopAnimation = true;
    }
}

function doSuccessfulAnimation(array) {

    const updates = [];

    for (let i = 0; i < array.length + 6; i++) {

        const indices = [];

        for (let j = i; j > i - 6; j--) {

            if (j > - 1 && j < array.length) {
                indices.push(j);
            }
            updates.push({indices: indices,
                          type: "highlight"
            });
        }
    }

    return updates;
}

function shuffle(array) {

    const updates = [];

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * i + 1);

        updates.push({indices: [i, j],
                      type: "swap"
        });
    }

    return updates;
}

function updateBars(update) {

    container.innerHTML = "";

    for (let i = 0; i < array.length; i++) {

        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%";
        bar.classList.add("bar");

        if (update && update.indices.includes(i)) {

            if (update.type == "swap")
                bar.style.backgroundColor = "red";
            else if (update.type == "highlight")
                bar.style.backgroundColor = "green"
            else
                bar.style.backgroundColor = "blue";
        }

        container.appendChild(bar);
    }
}


function animate() {

    if (isScrambled && updates.length === 0) {
        updateBars();
        return;
    }
    else if (!isScrambled && isSuccessful && updates.length === 0) {

        const copy = [...array];
        updates = doSuccessfulAnimation(copy);
        isSuccessful = false;
        animate();
    }

    if (!stopAnimation) {
        
        const update = updates.shift();

        if (update) {
            if (update.type === "swap") {
                const [i, j] = update.indices;
                [array[i], array[j]] = [array[j], array[i]];
            }

            updateBars(update);
            setTimeout(animate, 1);
        }
    }
    else {

        updates = [];
        updateBars();
        stopAnimation = false;
        isScrambled = false;
        isSuccessful = false;
        sort();
    }
}


function bubbleSort(arr) {

    const updates = [];

    var i, temp;
    var n = arr.length;
    var swapped = true;

    while (swapped) {

        swapped = false;

        for (i = 1; i < n; i++) {

            updates.push({indices: [i - 1, i],
                          type: "compare"
            });

            if (arr[i - 1] > arr[i]) {

                updates.push({indices: [i - 1, i],
                              type: "swap"
                });

                swapped = true;
                temp = arr[i];
                arr[i] = arr[i - 1];
                arr[i - 1] = temp;
            }
        }

        n--;
    }

    return updates;
}