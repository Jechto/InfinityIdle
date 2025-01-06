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
                var price = 0;
                for (const recipe of element.r) {
                    var recipe_format = "";
                    if (recipe.length == 2) {
                        recipe_format = idToElement(recipe[0]) + " + " + idToElement(recipe[1]) + "<br>";
                        price = (idToPrice(recipe[0]) + idToPrice(recipe[1])) * element.t;

                    } else {
                        recipe_format = "";
                        price = element.p;
                    }
                    buttonHTML += `<button class="btn btn-success element-list-btn" type="button" data-element-id="${key}" data-ingredients='${JSON.stringify(recipe)}'>${recipe_format}${price + currency}</button>`;
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
            console.log("Data saved successfully.");
        } catch (e) {
            console.error("Error serializing data to localStorage:", e);
        }
    }

    data = loadInfiniteIdleData();

    if (typeof data["elements"] === "undefined" || data == {} ) {
        data["elements"] = {};
        data["elements"][1] = {
            "n": "Fire", // Name
            "e": "🔥", // Emoji
            "t": 1, // Tier
            "r": [[]], // Recipe
            "p": 100 // Price
        };
        data["elements"][2] = {
            "n": "Water",
            "e": "💧",
            "t": 1,
            "r": [[]],
            "p": 100
        };
        data["elements"][3] = {
            "n": "Plant",
            "e": "🌱",
            "t": 1,
            "r": [[]],
            "p": 200
        };
        data["elements"][4] = {
            "n": "Electricity",
            "e": "⚡",
            "t": 1,
            "r": [[]],
            "p": 400
        };
        data["elements"][5] = {
            "n": "Ice",
            "e": "🧊",
            "t": 1,
            "r": [[]],
            "p": 600
        };
        data["elements"][6] = {
            "n": "Air",
            "e": "💨",
            "t": 1,
            "r": [[]],
            "p": 800
        };
    }

    if (typeof data["resources"] === "undefined") {
        data["resources"] = {};
        data["resources"]["money"] = 0
        data["resources"]["money_per_second"] = 0
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
