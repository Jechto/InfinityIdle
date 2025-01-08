document.addEventListener("DOMContentLoaded", function () {

    var data = {}
    const currency = "⛀"

    function idToElement(id) {
        return data["elements"][id]["n"]
    }
    function idToPrice(id) {
        return data["elements"][id]["p"]
    }

    function setCurrentMoneyOnUi(money, mps) {
        document.getElementById("money-count").innerHTML = money + currency + "<div>" + mps + currency + " per Second</div>";
    }

    function buyElement(elementId, ingredients) {
        console.log("Buying element with id:", elementId, "and ingredients:", ingredients);
        price = data["elements"][elementId]["p"]
        if (data["resources"]["money"] < price) {
            return;
        }
        data["resources"]["money"] -= price

        element = {
            "id": elementId, //id
            "i": ingredients //ingredients
        }

        data["field"].push(element) // core data can be fetched from "elements"

        console.log(data["elements"][elementId]["p"])
    }

    function calculatePriceForElement(element) {
        var price = element.p;
        for (const recipe of element.r) {
            if (recipe.length != 2)
                continue
            price = price + (idToPrice(recipe[0]) + idToPrice(recipe[1])) * element.t;
        }
        return price
    }

    function renderElements(elementArray) {
        const elementListDiv = document.getElementById("element_list");
        elementListDiv.innerHTML = ""; // Clear any existing content

        for (const key in elementArray) {
            if (elementArray.hasOwnProperty(key)) {
                const element = elementArray[key];
                const elementDiv = document.createElement("div");
                const paddingzero = Math.max(7 - key.toString().length, 0);
                var buttonHTML = "";
                for (const recipe of element.r) {
                    var recipe_format = "";
                    if (recipe.length == 2) {
                        recipe_format = idToElement(recipe[0]) + " + " + idToElement(recipe[1]) + "<br>";
                    } else {
                        recipe_format = "";
                    }
                    var price = calculatePriceForElement(element)
                    buttonHTML += `<button class="btn btn-success element-list-btn" type="button" data-element-id="${key}" data-ingredients='${JSON.stringify(element.r)}'>${recipe_format}${price + currency}</button>`;
                }

                elementDiv.id = element.n + "-box";
                elementDiv.className = "element-box accordion-item";
                elementDiv.innerHTML = `
                    <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${element.n}" aria-expanded="false" aria-controls="collapse-${element.n}">
                            <strong class="element-box-ln1">${element.n} 
                                <span class="badge badge-tier">T${element.t}</span>
                            </strong>
                            <div class="element-box-ln2">
                                E-<span>${'0'.repeat(paddingzero)}</span><strong>${key}</strong>
                                <span>${element.e}</span>
                            </div>
                        </button>
                    </h2>
                    <div id="collapse-${element.n}" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            <div class="d-grid gap-2 mx-auto">
                                ${buttonHTML}
                            </div>
                        </div>
                    </div>
                `;
                elementListDiv.appendChild(elementDiv);
            }
        }
    }

    function loadInfiniteIdleData() {
        const dataKey = "infiniteidle-data";
        const storedData = localStorage.getItem(dataKey);
        
        if (storedData) {
            try {
                return JSON.parse(storedData);
            } catch (e) {
                console.error("Error deserializing data from localStorage:", e);
                return {};
            }
        } else {
            return {};
        }
    }

    function saveInfiniteIdleData() {
        const dataKey = "infiniteidle-data";
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(dataKey, serializedData);
        } catch (e) {
            console.error("Error serializing data to localStorage:", e);
        }
    }

    data = loadInfiniteIdleData();

    if (typeof data["elements"] === "undefined" || data == {} ) {
        data["elements"] = {};
        data["elements"][1] = { // if merge contains fire, decrease base production time by 25%
            "n": "Fire", // Name
            "e": "🔥", // Emoji
            "t": 1, // Tier
            "r": [[]], // Recipe
            "p": 100, // Price (make it a one time thing that unlocks upgrades )
            "g": 5, // Generate pr cycle
            "gt": 1, // Generate time in seconds
            "gu": 1, // Generate pr cycle upgrade count (max level)
            "gtu": 3, // Generate time in seconds upgrade count (max level)
        };
        data["elements"][2] = {
            "n": "Water",
            "e": "💧",
            "t": 1,
            "r": [[]],
            "p": 100,
            "g": 25,
            "gt": 5,
            "gu": 3,
            "gtu": 1,
        };
        data["elements"][3] = {
            "n": "Plant",
            "e": "🌱",
            "t": 1,
            "r": [[]],
            "p": 200,
            "g": 5,
            "gt": 5,
            "gu": 4,
            "gtu": 4,
        };
        data["elements"][4] = {
            "n": "Electricity",
            "e": "⚡",
            "t": 1,
            "r": [[]],
            "p": 400,
            "g": 10,
            "gt": 5,
            "gi": 0.1, // Increase production pr cycle
            "gu": 2, 
            "gtu": 2,
            "giu": 3, // Increase production pr cycle upgrade count (max level)
        };
        data["elements"][5] = {
            "n": "Ice",
            "e": "🧊",
            "t": 1,
            "r": [[]],
            "p": 500,
            "g": 50,
            "gt": 2,
            "go": 25, // Generate pr cycle offline untop of normal
            "gu": 2,
            "gtu": 2,
            "gou": 3, // Generate pr cycle offline untop of normal upgrade count (max level)

        };
        data["elements"][6] = {
            "n": "Air",
            "e": "💨",
            "t": 1,
            "r": [[]],
            "p": 600,
            "g": 5,
            "gt": 5,
            "gc": 10, // Generate pr click
            "gu": 2,
            "gtu": 2,
            "gcu": 3, // Generate pr click upgrade count (max level)
        };
    }

    if (typeof data["resources"] === "undefined") {
        data["resources"] = {};
        data["resources"]["money"] = 0
        data["resources"]["money_per_second"] = 0
    }

    if (typeof data["field"] === "undefined") {
        data["field"] = [];
    }


    console.log(data)
    console.log("Loaded data:", data);

    renderElements(data["elements"]);

    function mainClock() {
        data["resources"]["money"] += data["resources"]["money_per_second"];
        setCurrentMoneyOnUi(data["resources"]["money"], data["resources"]["money_per_second"])
    }
    setInterval(mainClock, 100);
    setInterval(saveInfiniteIdleData, 1000);
    document.getElementById("playfield").addEventListener("click", function () {
        console.log("Playfield clicked!");
        data["resources"]["money"] += 10;
    });

    const buttons = document.querySelectorAll(".element-list-btn");
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const elementId = this.getAttribute("data-element-id");
            const ingredients = JSON.parse(this.getAttribute("data-ingredients"));
            buyElement(elementId, ingredients);
        });
    });
});
