document.addEventListener("DOMContentLoaded", function () {

    var data = {}
    const currency = "⛀"
    const playfield = document.getElementById("playfield");
    var mousepos = {x: 0, y: 0}


    function idToElementObject(id) {
        return data["elements"][id]
    }


    function setCurrentMoneyOnUi(money, mps) {
        document.getElementById("money-count").innerHTML = Math.round(money) + currency + "<div>" + mps + currency + " per Second</div>";
    }


    // I need to think if it just makes more sense to prebake the best recipe for each element
    function placeElement(elementId, ingredients) {
        console.log("Buying element", elementId, ingredients);
        const js = {
            element: idToElementObject(elementId),
            position: { x: Math.random() * 85, y: Math.random() * 75 },
            production_progress: 0,
            electric_bonus: 0,
            selected: false,
        };
        data["field"].push(js);
        fullrenderField(data["field"])
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
        renderElements(data["elements"], elementId)
        fullrenderField(data["field"]);
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

                innerHTML += `<button class="btn btn-outline-success element-list-btn" type="button" data-element-id="${key}" data-ingredients='${JSON.stringify(element.r[0])}'>Place ${element.n}</button>`;

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

                    production_time = element.gt * Math.pow(0.9, level)
                    production_time_decrease = element.gt * Math.pow(0.9, level + 1) - production_time
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

                const isActive = selected_accordion == key ? "show" : "";
                const isCollapsed = selected_accordion == key ? "" : "collapsed";

                elementDiv.id = element.n + "-box";
                elementDiv.className = "element-box accordion-item";
                elementDiv.innerHTML = `
                    <h2 class="accordion-header">
                        <button class="accordion-button ${isCollapsed}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${element.n.replace(/\s/g, "")}" aria-expanded="false" aria-controls="collapse-${element.n.replace(/\s/g, "") }">
                            <strong class="element-box-ln1">${element.n} 
                                <span class="badge badge-tier">T${element.t}</span>
                            </strong>
                            <div class="element-box-ln2">
                                E-<span>${'0'.repeat(paddingzero)}</span><strong>${key}</strong>
                                <span>${element.e}</span>
                            </div>
                        </button>
                    </h2>
                    <div id="collapse-${element.n.replace(/\s/g, "") }" class="accordion-collapse collapse ${isActive}" data-bs-parent="#element_list">
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
                placeElement(elementId, ingredients);
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

    function fullrenderField(fieldArray) {
        var innerHTML = `<div id="money-count" class="no-select">This is Money<div>Per Second</div></div>`;
        for (const key in fieldArray) {
            percent_filled = fieldArray[key]["production_progress"] / (fieldArray[key]["element"]["gt"] * Math.pow(0.9, fieldArray[key]["element"]["gtl"])) * 100

            fieldBadges = ""
            if (typeof fieldArray[key]["element"]["b"]["f"] != "undefined") {
                fieldBadges += `<span class="badge rounded-pill bg-danger">${fieldArray[key]["element"]["b"]["f"]}</span>`
            }
            if (typeof fieldArray[key]["element"]["b"]["w"] != "undefined") {
                fieldBadges += `<span class="badge rounded-pill bg-primary">${fieldArray[key]["element"]["b"]["w"]}</span>`
            }
            if (typeof fieldArray[key]["element"]["b"]["p"] != "undefined") {
                fieldBadges += `<span class="badge rounded-pill bg-success">${fieldArray[key]["element"]["b"]["p"]}</span>`
            }
            if (typeof fieldArray[key]["element"]["b"]["e"] != "undefined") {
                fieldBadges += `<span class="badge rounded-pill bg-warning">${fieldArray[key]["element"]["b"]["e"]}</span>`
            }
            if (typeof fieldArray[key]["element"]["b"]["i"] != "undefined") {
                fieldBadges += `<span class="badge rounded-pill bg-info">${fieldArray[key]["element"]["b"]["i"]}</span>`
            }
            if (typeof fieldArray[key]["element"]["b"]["a"] != "undefined") {
                fieldBadges += `<span class="badge rounded-pill bg-secondary">${fieldArray[key]["element"]["b"]["a"]}</span>`
            }



            innerHTML += `
            <div class="field_element" style="left: ${fieldArray[key]["position"]["x"]}%;top: ${fieldArray[key]["position"]["y"]}%" data-key="${key}">
                <strong>${fieldArray[key]["element"]["n"] + fieldArray[key]["element"]["e"]}</strong><span class="badge badge-tier">T${fieldArray[key]["element"]["t"]}</span>
                <div class="progress production-bar" role="progressbar" aria-label="Animated striped example" aria-valuemin="0" aria-valuemax="${fieldArray[key]["element"]["gt"] * Math.pow(0.9, fieldArray[key]["element"]["gtl"])}">
                    <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" style="width: ${percent_filled}%"></div>
                </div>
                <div>
                    <span class="progress-bar-timer"></span>
                    <span class="progress-bar-production"></span>
                </div>
                <div class="misc-prod-info"></div>
                <div class="misc-prod-bonus"></div>
                <div>
                    ${fieldBadges}
                </div>

            </div>`;
        }

        playfield.innerHTML = innerHTML;
    }

    function renderField(fieldArray) {
        for (const key in fieldArray) {
            const percentFilled = fieldArray[key]["production_progress"] / (fieldArray[key]["element"]["gt"] * Math.pow(0.9, fieldArray[key]["element"]["gtl"])) * 100;
            const fieldElement = document.querySelector(`.field_element[data-key="${key}"]`);


            var production = fieldArray[key]["element"]["g"] * fieldArray[key]["element"]["gl"]

            if (typeof fieldArray[key]["element"]["go"] != "undefined") {
                production += fieldArray[key]["element"]["go"] * fieldArray[key]["element"]["gol"]
            }
            if (typeof fieldArray[key]["element"]["gi"] != "undefined") {
                production += fieldArray[key]["electric_bonus"]
            }

            if (fieldElement) {
                const progressBar = fieldElement.querySelector(".progress-bar");
                const progressBarTimer = fieldElement.querySelector(".progress-bar-timer");
                const progressBarProduction = fieldElement.querySelector(".progress-bar-production");
                const miscprodinfo = fieldElement.querySelector(".misc-prod-info");
                const miscprodbonus = fieldElement.querySelector(".misc-prod-bonus");

                progressBar.style.transition = 'width 0.1s linear';
                progressBar.style.width = `${percentFilled}%`;
                progressBarTimer.textContent = `${Math.round((fieldArray[key]["element"]["gt"] * Math.pow(0.9, fieldArray[key]["element"]["gtl"]) - fieldArray[key]["production_progress"]) * 10) / 10}s`;
                progressBarProduction.textContent = `${Math.round(production * 100) / 100} ${currency}`;
                miscprodinfo.textContent = `Production: ${Math.round(production / (fieldArray[key]["element"]["gt"] * Math.pow(0.9, fieldArray[key]["element"]["gtl"])) * 10) / 10 + currency} / Sec`;
                miscprodbonus.textContent = `Bonus From merged elements ${0 + currency}`
            }
        }
    }

    function updateFieldElementPositions(fieldArray) {
        for (const key in fieldArray) {
            const fieldElement = document.querySelector(`.field_element[data-key="${key}"]`);
            if (fieldElement) {
                fieldElement.style.left = `${fieldArray[key]["position"]["x"]}%`;
                fieldElement.style.top = `${fieldArray[key]["position"]["y"]}%`;

                if (fieldArray[key]["selected"]) {
                    fieldElement.classList.add("field_selected");
                } else {
                    fieldElement.classList.remove("field_selected");
                }
            }
        }
    }

    function addElementToElementList(element, id) {
        if (typeof data["elements"][id] != "undefined") {
            const existingElement = data["elements"][id];
            existingElement.n = element.n;
            existingElement.e = element.e;
            existingElement.t = Math.max(existingElement.t, element.t);
            existingElement.p = Math.max(existingElement.p, element.p);
            existingElement.g = Math.max(existingElement.g, element.g);
            existingElement.gt = Math.min(existingElement.gt, element.gt);
            existingElement.gu = Math.max(existingElement.gu, element.gu);
            existingElement.gtu = Math.max(existingElement.gtu, element.gtu);
            if (element.gi) existingElement.gi = Math.max(existingElement.gi || 0, element.gi);
            if (element.giu) existingElement.giu = Math.max(existingElement.giu || 0, element.giu);
            if (element.go) existingElement.go = Math.max(existingElement.go || 0, element.go);
            if (element.gou) existingElement.gou = Math.max(existingElement.gou || 0, element.gou);
            if (element.gc) existingElement.gc = Math.max(existingElement.gc || 0, element.gc);
            if (element.gcu) existingElement.gcu = Math.max(existingElement.gcu || 0, element.gcu);
            existingElement.r.push(element.r[0])
        } else {
            data["elements"][id] = element;
        }

        for (const key in element.b) {
            if (data["elements"][id].b.hasOwnProperty(key)) {
                data["elements"][id].b[key] = Math.max(data["elements"][id].b[key], element.b[key]);
            } else {
                data["elements"][id].b[key] = element.b[key];
            }
        }


        renderElements(data["elements"])
        console.log(data["elements"])
    }

    async function performMerge(element1, element2) {
        console.log(element1, element2)
        const url = `/api/merge?element1=${encodeURIComponent(element1["n"])}&element2=${encodeURIComponent(element2["n"])}`;

        let response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        let data = await response.json();
        console.log(data);
        let total_base_elements = {}
        for (const key in element1["b"]) {
            if (typeof total_base_elements[key] == "undefined") {
                total_base_elements[key] = element1["b"][key]
            } else {
                total_base_elements[key] += element1["b"][key]
            }
        }
        for (const key in element2["b"]) {
            if (typeof total_base_elements[key] == "undefined") {
                total_base_elements[key] = element2["b"][key]
            } else {
                total_base_elements[key] += element1["b"][key]
            }
        }


        let new_element = { 
            "n": data.name, // Name
            "e": data.emoji, // Emoji
            "t": data.tier, // Tier
            "r": [[element1["n"], element2["n"]]], // Recipe
            "p": (element1["p"] + element2["p"]) * data.tier,
            "g": (element1["g"] + element2["g"]) / 2 * data.tier, // Generate pr cycle
            "gt": (element1["gt"] + element2["gt"]) / 2, // Generate time in seconds
            "gu": Math.round((element1["gu"] + element2["gu"]) / 2 + 1), // Generate pr cycle upgrade count (max level)
            "gtu": Math.round((element1["gtu"] + element2["gtu"]) / 2 + 1), // Generate time in seconds upgrade count (max level)
            "b": total_base_elements,
        };

        if (element1.gi || element2.gi) {
            new_element.gi = (element1.gi || 0) + (element2.gi || 0);
            if (element1.giu && element2.giu) {
                new_element.giu = Math.round((element1.giu + element2.giu) / 2 + 1);
            } else {
                new_element.giu = Math.max((element1.giu + 1) || 0, (element2.giu + 1) || 0);
            }
        }
        if (element1.go || element2.go) {
            new_element.go = (element1.go || 0) + (element2.go || 0);
            if (element1.gou && element2.gou) {
                new_element.gou = Math.round((element1.gou + element2.gou) / 2 + 1);
            } else {
                new_element.gou = Math.max((element1.gou + 1) || 0, (element2.gou + 1) || 0);
            }
        }
        if (element1.gc || element2.gc) {
            new_element.gc = (element1.gc || 0) + (element2.gc || 0);
            if (element1.gcu && element2.gcu) {
                new_element.gcu = Math.round((element1.gcu + element2.gcu) / 2 + 1);
            } else {
                new_element.gcu = Math.max((element1.gcu + 1) || 0, (element2.gcu + 1) || 0);
            }
        }
           

        addElementToElementList(new_element,data._id)


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

    // IDEA: make merged element have bonus based on total amount of primitive elements are used
    if (typeof data["elements"] === "undefined" || data == {} ) {
        data["elements"] = {};
        data["elements"][1] = {
            "n": "Fire", // Name
            "e": "🔥", // Emoji
            "t": 1, // Tier
            "r": [[]], // Recipe
            "p": 100, // Price (make it a one time thing that unlocks upgrades )
            "g": 5, // Generate pr cycle
            "gt": 1, // Generate time in seconds
            "gu": 1, // Generate pr cycle upgrade count (max level)
            "gtu": 3, // Generate time in seconds upgrade count (max level)
            "b": {"f": 1}, // amount of basic elements used to craft it  
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
            "b": { "w": 1 }, 
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
            "b": { "p": 1 }, 
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
            "b": { "e": 1 }, 
        };
        data["elements"][5] = {
            "n": "Ice",
            "e": "🧊",
            "t": 1,
            "r": [[]],
            "p": 300,
            "g": 5,
            "gt": 7.5,
            "go": 25, // Generate pr cycle offline untop of normal
            "gu": 2,
            "gtu": 2,
            "gou": 3, // Generate pr cycle offline untop of normal upgrade count (max level)
            "b": { "i": 1 }, 
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
            "b": { "a": 1 }, 
        };
    }

    if (typeof data["resources"] === "undefined") {
        data["resources"] = {};
        data["resources"]["money"] = 100000000
        data["resources"]["money_per_second"] = 0
    }

    if (typeof data["field"] === "undefined") {
        data["field"] = [];
    }


    console.log(data)
    console.log("Loaded data:", data);

    renderElements(data["elements"]);
    fullrenderField(data["field"]);

    function mainClock() { // 30 ticks per second
        data["resources"]["money"] += data["resources"]["money_per_second"];
        for (const key in data["field"]) {
            data["field"][key]["production_progress"] += 1/60;

            // Perform logic when production complete
            if (data["field"][key]["production_progress"] >= data["field"][key]["element"]["gt"] * Math.pow(0.85, data["field"][key]["element"]["gtl"])) {
                data["field"][key]["production_progress"] = 0;
                if (typeof data["field"][key]["element"]["gi"] != "undefined") {
                    data["field"][key]["electric_bonus"] += data["field"][key]["element"]["gi"] * data["field"][key]["element"]["gil"];
                }
                if (typeof data["field"][key]["element"]["go"] != "undefined") {
                    data["resources"]["money"] += data["field"][key]["element"]["gol"] * data["field"][key]["element"]["go"]; // TODO: make this tick offline
                }

                data["resources"]["money"] += data["field"][key]["element"]["g"] * data["field"][key]["element"]["gl"] + data["field"][key]["electric_bonus"];
            }

            if (data["field"][key]["selected"]) {
                const rect = playfield.getBoundingClientRect();

                data["field"][key]["position"]["x"] = mousepos.x - (100 / rect.width * 100)
                data["field"][key]["position"]["y"] = mousepos.y - (50 / rect.width * 100)

                if (data["field"][key]["position"]["x"] >= 89) { // delete element if outside of playfield
                    data["field"].splice(key, 1); // Remove element by key
                    fullrenderField(data["field"]);
                    return;
                }
            }

        }
    }

    function renderClock() {
        updateFieldElementPositions(data["field"])
        renderField(data["field"])
        setCurrentMoneyOnUi(data["resources"]["money"], data["resources"]["money_per_second"])
    }

    setInterval(mainClock, 1000/60);
    setInterval(renderClock, 1000/60);
    setInterval(saveInfiniteIdleData, 1000);

    playfield.addEventListener('mousemove', function (event) {
        const rect = playfield.getBoundingClientRect();

        mousepos.x = (event.clientX - rect.left) / rect.width * 100;
        mousepos.y = (event.clientY - rect.top) / rect.height * 100;

    });

    playfield.addEventListener('mouseleave', function (event) {
        const rect = playfield.getBoundingClientRect();

        if (event.clientX < rect.left) {
            mousepos.x = 0;
        } else if (event.clientX > rect.right) {
            mousepos.x = 100;
        }

        if (event.clientY < rect.top) {
            mousepos.y = 0;
        } else if (event.clientY > rect.bottom) {
            mousepos.y = 100;
        }
    });

    playfield.addEventListener("mousedown", async function (event) {
        console.log("Playfield clicked!");
        data["resources"]["money"] += 10;
        for (const key in data["field"]) {
            if (typeof data["field"][key]["element"]["gc"] != "undefined") {
                data["resources"]["money"] += data["field"][key]["element"]["gcl"] * data["field"][key]["element"]["gc"];
            }
        }

        const fieldElement = event.target.closest(".field_element");
        if (fieldElement) {
            const dataKey = fieldElement.getAttribute("data-key");
            data["field"][dataKey]["selected"] = !data["field"][dataKey]["selected"]

            if (!data["field"][dataKey]["selected"]) {
                console.log("Place")
                // Check all items on field if they below the placed object
                for (const key in data["field"]) {
                    if (key == dataKey)
                        continue // skip itself

                    xdist = Math.abs(data["field"][dataKey]["position"]["x"] - data["field"][key]["position"]["x"])
                    ydist = Math.abs(data["field"][dataKey]["position"]["y"] - data["field"][key]["position"]["y"])

                    if (xdist < 8 && ydist < 5) {

                        await performMerge(data["field"][dataKey]["element"], data["field"][key]["element"])
                        data["field"].splice(Math.max(dataKey, key), 1);
                        data["field"].splice(Math.min(dataKey, key), 1);
                        fullrenderField(data["field"]);
                        return;

                    }
                }
            }

        }
    });



});
