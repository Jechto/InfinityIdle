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
            if (upgrade == "production") {
                element.gl += 1
            }
            if (upgrade == "productiontime") {
                element.gtl += 1
            }
            if (upgrade == "productionelectric") {
                element.gil += 1
            }
            if (upgrade == "productionoffline") {
                element.gol += 1
            }
            if (upgrade == "clickvalue") {
                element.gcl += 1
            }

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

                    if (typeof element.gt != "undefined") { // check if element produces
                        level = 0
                        if (typeof element.gtl != "undefined") { // check if level is 0
                            level = element.gtl
                        } else {
                            element.gtl = 0;
                        }

                        percent_filled = (level / element.gtu) * 100

                        production_time = element.gt * Math.pow(0.8, level)
                        production_time_decrease = element.gt * Math.pow(0.8, level + 1) - production_time
                        production_time_upgrade_cost = element.p * (level + 1)

                        innerHTML += `
                            <div>${Math.floor(production_time*100)/100} Sec / cycle</div>
                            <div class="progress " role="progressbar" aria-label="Warning example" aria-valuenow="${level}" aria-valuemin="0" aria-valuemax="${element.gtu}">
                                <div class="progress-bar text-bg-warning bg-danger overflow-visible text-dark" style="width: ${percent_filled}%">
                                    Level: ${level + "/" + element.gtu}
                                </div>
                            </div>`;
                        if (level < element.gtu) {
                            innerHTML += `
                            <div>
                                <button class="btn btn-danger element-upgrade-btn btn-sm w-50" style="font-size: 12px;" type="button" data-element-id="${key}" data-upgrade-type="productiontime" data-upgrade-cost=${production_time_upgrade_cost}>
                                    Buy ${Math.floor(production_time_decrease*100)/100} sec / cycle
                                </button> Cost: ${production_time_upgrade_cost}
                            </div>`;
                        }
                    }

                    if (typeof element.gi != "undefined") { // check if element produces
                        level = 0
                        if (typeof element.gil != "undefined") { // check if level is 0
                            level = element.gil
                        } else {
                            element.gil = 0;
                        }

                        percent_filled = (level / element.giu) * 100

                        production_electric = element.gi * level
                        production_electric_upgrade_cost = element.p * (level + 1) * 2

                        innerHTML += `
                            <div>${Math.floor(production_electric * 100) / 100} ⛀ / cycle / cycle</div>
                            <div class="progress " role="progressbar" aria-label="Warning example" aria-valuenow="${level}" aria-valuemin="0" aria-valuemax="${element.giu}">
                                <div class="progress-bar text-bg-warning bg-warning overflow-visible text-dark" style="width: ${percent_filled}%">
                                    Level: ${level + "/" + element.giu}
                                </div>
                            </div>`;
                        if (level < element.giu) {
                            innerHTML += `
                            <div>
                                <button class="btn btn-warning element-upgrade-btn btn-sm w-50" style="font-size: 12px;" type="button" data-element-id="${key}" data-upgrade-type="productionelectric" data-upgrade-cost=${production_time_upgrade_cost}>
                                    Buy ${element.gi} ⛀ / cycle / cycle
                                </button> Cost: ${production_electric_upgrade_cost}
                            </div>`;
                        }
                    }

                    if (typeof element.go != "undefined") { // check if element produces
                        level = 0
                        if (typeof element.gol != "undefined") { // check if level is 0
                            level = element.gol
                        } else {
                            element.gol = 0;
                        }

                        percent_filled = (level / element.gou) * 100

                        production_offline = element.go * level
                        production_offline_upgrade_cost = element.p * (level + 1) * 1.5

                        innerHTML += `
                            <div>${Math.floor(production_offline * 100) / 100} ⛀ / cycle (offline)</div>
                            <div class="progress " role="progressbar" aria-label="Warning example" aria-valuenow="${level}" aria-valuemin="0" aria-valuemax="${element.gou}">
                                <div class="progress-bar text-bg-info bg-info overflow-visible text-dark" style="width: ${percent_filled}%">
                                    Level: ${level + "/" + element.gou}
                                </div>
                            </div>`;
                        if (level < element.gou) {
                            innerHTML += `
                            <div>
                                <button class="btn btn-info element-upgrade-btn btn-sm w-50" style="font-size: 12px;" type="button" data-element-id="${key}" data-upgrade-type="productionoffline" data-upgrade-cost=${production_offline_upgrade_cost}>
                                    Buy ${element.go} ⛀ / cycle (offline)
                                </button> Cost: ${production_offline_upgrade_cost}
                            </div>`;
                        }
                    }

                    if (typeof element.gc != "undefined") { // check if element produces
                        level = 0
                        if (typeof element.gcl != "undefined") { // check if level is 0
                            level = element.gcl
                        } else {
                            element.gcl = 0;
                        }

                        percent_filled = (level / element.gcu) * 100

                        production_click = element.gc * level
                        production_click_upgrade_cost = element.p * (level + 1) * 2

                        innerHTML += `
                            <div>${Math.floor(production_click * 100) / 100} ⛀ / click</div>
                            <div class="progress " role="progressbar" aria-label="Warning example" aria-valuenow="${level}" aria-valuemin="0" aria-valuemax="${element.gcu}">
                                <div class="progress-bar text-bg-secondary bg-secondary overflow-visible text-dark" style="width: ${percent_filled}%">
                                    Level: ${level + "/" + element.gcu}
                                </div>
                            </div>`;
                        if (level < element.gcu) {
                            innerHTML += `
                            <div>
                                <button class="btn btn-secondary element-upgrade-btn btn-sm w-50" style="font-size: 12px;" type="button" data-element-id="${key}" data-upgrade-type="clickvalue" data-upgrade-cost=${production_click_upgrade_cost}>
                                    Buy ${element.gc} ⛀ / click
                                </button> Cost: ${production_click_upgrade_cost}
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
            "gt": 7.5,
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
            "p": 200,
            "g": 5,
            "gt": 5,
            "gi": 0.05, // Increase production pr cycle
            "gu": 2, 
            "gtu": 2,
            "giu": 4, // Increase production pr cycle upgrade count (max level)
        };
        data["elements"][5] = {
            "n": "Ice",
            "e": "🧊",
            "t": 1,
            "r": [[]],
            "p": 300,
            "g": 25,
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
            "p": 300,
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
        data["resources"]["money"] = 100000
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
