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
        console.log("Buying element", elementId, ingredients);
    }

    function buyUpgrade(elementId, upgrade, price) {
        console.log("Buying upgrade", elementId, upgrade, price);
        element = data["elements"][elementId]
        price_int = parseInt(price)
        if (price_int <= data["resources"]["money"]) {
            console.log("Upgrade Complete")
            element.gl += 1
            console.log(element)
            data["resources"]["money"] -= price_int
        }
        renderElements(data["elements"],elementId)
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

    function renderElements(elementArray, selected_accordion=0) {
        const elementListDiv = document.getElementById("element_list");
        elementListDiv.innerHTML = ""; // Clear any existing content

        for (const key in elementArray) {
            if (elementArray.hasOwnProperty(key)) {
                const element = elementArray[key];
                const elementDiv = document.createElement("div");
                const paddingzero = Math.max(7 - key.toString().length, 0);
                var innerHTML = "";
                for (const recipe of element.r) {
                    var recipe_format = "";
                    if (recipe.length == 2) {
                        recipe_format = idToElement(recipe[0]) + " + " + idToElement(recipe[1]) + "<br>";
                    } else {
                        recipe_format = "";
                    }
                    //var price = calculatePriceForElement(element)
                    innerHTML += `<button class="btn btn-outline-success element-list-btn" type="button" data-element-id="${key}" data-ingredients='${JSON.stringify(element.r)}'>Place ${element.n}</button>`;

                    if (typeof element.g != "undefined") { // check if element produces
                        level = 0
                        if (typeof element.gl != "undefined") { // check if level is 0
                            level = element.gl
                        } else {
                            element.gl = 0;
                        }

                        percent_filled = (level / element.gu) * 100

                        production = element.g * level
                        production_upgrade_cost = element.p * (level + 1)

                        innerHTML += `
                            <div>${production} ⛀ / cycle </div>
                            <div class="progress" role="progressbar" aria-label="Warning example" aria-valuenow="${level}" aria-valuemin="0" aria-valuemax="${element.gu}">
                                <div class="progress-bar text-bg-warning overflow-visible text-dark" style="width: ${percent_filled}%">
                                    Level: ${level + "/" + element.gu}
                                </div>
                            </div>`;
                        if (level < element.gu) {
                            innerHTML += `
                            <div>
                                <button class="btn btn-primary element-upgrade-btn btn-sm w-50" style="font-size: 12px;" type="button" data-element-id="${key}" data-upgrade-type="production" data-upgrade-cost=${production_upgrade_cost}>
                                    Buy +${element.g} ⛀ / cycle
                                </button> Cost: ${production_upgrade_cost}
                            </div>`;
                        }
                    }

                }

                const isActive = selected_accordion == key ? "show" : "";
                const isCollapsed = selected_accordion == key ? "" : "collapsed";

                elementDiv.id = element.n + "-box";
                elementDiv.className = "element-box accordion-item";
                elementDiv.innerHTML = `
                    <h2 class="accordion-header">
                        <button class="accordion-button ${isCollapsed}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${element.n}" aria-expanded="false" aria-controls="collapse-${element.n}">
                            <strong class="element-box-ln1">${element.n} 
                                <span class="badge badge-tier">T${element.t}</span>
                            </strong>
                            <div class="element-box-ln2">
                                E-<span>${'0'.repeat(paddingzero)}</span><strong>${key}</strong>
                                <span>${element.e}</span>
                            </div>
                        </button>
                    </h2>
                    <div id="collapse-${element.n}" class="accordion-collapse collapse ${isActive}" data-bs-parent="#element_list">
                        <div class="accordion-body">
                            <div class="d-grid gap-2 mx-auto">
                                ${innerHTML}
                            </div>
                        </div>
                    </div>
                `;
                elementListDiv.appendChild(elementDiv);
            }
        }
        const buy_buttons = document.querySelectorAll(".element-list-btn");
        buy_buttons.forEach(buy_buttons => {
            buy_buttons.addEventListener("click", function () {
                const elementId = this.getAttribute("data-element-id");
                const ingredients = JSON.parse(this.getAttribute("data-ingredients"));
                buyElement(elementId, ingredients);
            });
        });

        const upgrade_buttons = document.querySelectorAll(".element-upgrade-btn");
        upgrade_buttons.forEach(upgrade_buttons => {
            upgrade_buttons.addEventListener("click", function () {
                const elementId = this.getAttribute("data-element-id");
                const upgrade = this.getAttribute("data-upgrade-type");
                const price = this.getAttribute("data-upgrade-cost");
                buyUpgrade(elementId, upgrade, price);
            });
        });
    }

    function loadInfiniteIdleData() {
        return {}

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
});
