// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

document.addEventListener("DOMContentLoaded", function () {

    function renderElements(elementArray) {
        const elementListDiv = document.getElementById("element_list");
        elementListDiv.innerHTML = ""; // Clear any existing content

        for (const key in elementArray) {
            if (elementArray.hasOwnProperty(key)) {
                const element = elementArray[key];
                const elementDiv = document.createElement("div");
                const paddingzero = Math.max(7 - key.toString().length,0)
                elementDiv.id = element.n + "-box";
                elementDiv.className = "element-box accordion-item"
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
                           u clicked kekw
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

    var data = loadInfiniteIdleData();

    if (typeof data["elements"] === "undefined") {
        data["elements"] = {}
        data["elements"][1] = {
            "n": "Fire",
            "e": "🔥",
            "t": 1
        }
        data["elements"][2] = {
            "n": "Water",
            "e": "💧",
            "t": 1
        } 
        data["elements"][3] = {
            "n": "Plant",
            "e": "🌱",
            "t": 1
        } 
        data["elements"][4] = {
            "n": "Electricity",
            "e": "⚡",
            "t": 1
        } 
        data["elements"][5] = {
            "n": "Ice",
            "e": "🧊",
            "t": 1
        } 
        data["elements"][6] = {
            "n": "Air",
            "e": "💨",
            "t": 1
        }
    }

    console.log("Loaded data:", data);

    renderElements(data["elements"]);
});
