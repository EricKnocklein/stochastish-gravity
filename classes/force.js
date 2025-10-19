import Modal from "../components/modal.js";
import forceinput from "../components/forceInput.js";

class Force {
  // Global array of coefficients for a force function
  static coefficients = [0, 20, -20]; // Example default coefficients
  static dampening = 0.75;
  static extraTemperature = 0;
  static inefficienctyFactor = 2;
  static unit = 1;

  // Method to update the coefficients array
  static setCoefficients(newCoefficients) {
    if (newCoefficients !== Force.coefficients) {
      Force.coefficients = Array.isArray(newCoefficients)
        ? newCoefficients
        : Force.coefficients;
    }

    document.querySelectorAll('.force-equation').forEach((el) => {
      el.replaceWith(Force.renderForceEquation());
    });
  }

  static calculateForceMagnitude(dist) {
    dist = dist / Force.unit
    return Force.coefficients.reduce((sum, coeff, idx) => {
      return sum + coeff * (1 / Math.pow(dist, idx + 1));
    }, 0);
  }

  static buildMenu(container) {
    container.innerHTML = ""; // Clear previous content

    // Create the list of coefficient inputs
    const list = document.createElement("ul");

    // Helper to render the coefficient inputs
    function renderCoefficients() {
      list.innerHTML = "";
      Force.coefficients.forEach((value, idx) => {
        const item = document.createElement("li");
        item.style.display = "flex";
        item.style.alignItems = "center";
        item.style.marginBottom = "4px";

        // Input for coefficient value
        const input = document.createElement("input");
        input.type = "number";
        input.value = value;
        input.style.width = "80px";
        input.onchange = () => {
          Force.coefficients[idx] = parseFloat(input.value);
          Force.setCoefficients(Force.coefficients);
        };

        const btnDiv = document.createElement("div");
        btnDiv.style.display = "flex";
        btnDiv.style.flexWrap = "no-wrap";
        // Remove button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "X";
        removeBtn.onclick = () => {
          Force.coefficients.splice(idx, 1);
          Force.setCoefficients(Force.coefficients);
          renderCoefficients();
        };

        // Move up button
        const upBtn = document.createElement("button");
        upBtn.classList.add("up-btn");
        upBtn.textContent = "↑";
        upBtn.disabled = idx === 0;
        upBtn.onclick = () => {
          if (idx > 0) {
            [Force.coefficients[idx - 1], Force.coefficients[idx]] = [
              Force.coefficients[idx],
              Force.coefficients[idx - 1],
            ];
            Force.setCoefficients(Force.coefficients);
            renderCoefficients();
          }
        };

        // Move down button
        const downBtn = document.createElement("button");
        downBtn.classList.add("down-btn");
        downBtn.textContent = "↓";
        downBtn.disabled = idx === Force.coefficients.length - 1;
        downBtn.onclick = () => {
          if (idx < Force.coefficients.length - 1) {
            [Force.coefficients[idx + 1], Force.coefficients[idx]] = [
              Force.coefficients[idx],
              Force.coefficients[idx + 1],
            ];
            Force.setCoefficients(Force.coefficients);
            renderCoefficients();
          }
        };

        item.appendChild(input);
        btnDiv.appendChild(upBtn);
        btnDiv.appendChild(downBtn);
        item.appendChild(btnDiv);
        item.appendChild(removeBtn);
        list.appendChild(item);
      });
    }

    renderCoefficients();

    const coefTitle = document.createElement("div");
    coefTitle.classList.add("title");
    coefTitle.textContent = "Force Coefficients";

    // Add coefficient button
    const addBtn = document.createElement("button");
    addBtn.classList.add("add-coefficient-btn");
    addBtn.textContent = "Add Coefficient";
    addBtn.onclick = () => {
      Force.coefficients.push(0);
      renderCoefficients();
    };

    // Show Equation button
    const showEquationBtn = document.createElement("button");
    showEquationBtn.classList.add("add-coefficient-btn");
    showEquationBtn.textContent = "Show Equation";
    showEquationBtn.onclick = () => {
      const holder = document.createElement("div");
      holder.className = "force-equation-holder";
      holder.style.display = "flex";
      holder.style.flexDirection = "column";
      holder.style.alignItems = "center";
      holder.style.justifyContent = "center";
      holder.style.width = "100%";

      holder.append(Force.renderForceEquation());
      holder.append(Force.renderForceGraph());
      new Modal(holder);
    };

    container.appendChild(coefTitle);
    container.appendChild(list);
    container.appendChild(addBtn);
    container.appendChild(showEquationBtn);

    const otherParamTitle = document.createElement("div");
    otherParamTitle.classList.add("title");
    otherParamTitle.textContent = "Physics Options";
    
    // Unit input
    const unitDiv = forceinput.createinput('unit', 'Unit:');

    // Dampening input
    const dampeningDiv = forceinput.createinput("dampening", "Damp:");

    // Temperature input
    const tempDiv = forceinput.createinput("extraTemperature", "Temp:");

    // Temperature input
    const ineffDiv = forceinput.createinput("inefficienctyFactor", "Prop:");

    container.appendChild(otherParamTitle);
    container.appendChild(unitDiv);
    container.appendChild(dampeningDiv);
    container.appendChild(tempDiv);
    container.appendChild(ineffDiv);
  }

  static renderForceEquation() {
    const equation = document.createElement("div");
    equation.className = "force-equation";
    if (!equation) return;

    const list = document.createElement("div");

    let terms = "";
    let first = true;
    Force.coefficients.forEach((coeff, idx) => {
      const power = idx + 1;
      if (coeff === 0) return; // Skip zero coefficients
      if (!first && coeff > 0) {
        terms += " + ";
      }
      if (coeff < 0) {
        terms += " - ";
      }
      first = false;
      const abs = Math.abs(coeff);
      if (abs !== 1) {
        terms += `${abs} \\cdot `;
      } else {
        terms += "";
      }
      terms += `\\frac{1}{r_{ij}^{${power}}}`;
    });

    const latex = `
    F_i = \\sum_{j \\neq i} \\left( ${terms} \\right)
    `;

    const katexDiv = document.createElement("div");
    katexDiv.className = "katex-equation";
    if (window.katex) {
      window.katex.render(latex, katexDiv, { throwOnError: false });
    } else {
      katexDiv.textContent = latex;
    }

    list.appendChild(katexDiv);

    equation.appendChild(list);
    return equation;
  }

  static createForceGraph(ctx) {
    const maxAbsCoeff = Math.max(...Force.coefficients.map(Math.abs));
    const resolution = 200;
    const labels = Array.from({ length: resolution }, (_, i) => 1 + (i * (maxAbsCoeff - 1)) / (resolution - 1));
    console.log("Creating force graph with labels:", labels);
    const data = labels.map((label) => Force.calculateForceMagnitude(label));

    const filteredData = data.filter((n) => !isNaN(n));
    const maxValue = filteredData.reduce(
      (a, b) => (Math.abs(b) > Math.abs(a) ? b : a),
      filteredData[0]
    );
    console.log("Max value for force graph:", maxValue);

    console.log("Force data:", data);
    new window.Chart(ctx, {
      type: "line",
      data: {
        labels: labels.map((l) => l.toFixed(2)),
        datasets: [
          {
            label: "Force Magnitude Between a Pair of Particles",
            data: data,
            borderColor: "rgba(75, 192, 192, 1)",
            fill: false,
            pointRadius: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: "Distance" } },
          y: {
            title: {
              display: true,
              text: "Force Magnitude",
            },
            // min: maxValue < 0 ? -1 * Math.log(Math.abs(maxValue)) : null,
            // max: maxValue > 0 ? Math.log(maxValue) : null,
          },
        },
      },
    });
  }

  static renderForceGraph() {
    const graph = document.createElement("div");
    graph.className = "force-graph";

    const canvas = document.createElement("canvas");
    canvas.id = "forceGraphCanvas";
    canvas.width = 400;
    canvas.height = 300;
    graph.appendChild(canvas);

    if (window.Chart) {
      window.setTimeout(() => {
        const ctx = canvas.getContext("2d");
        Force.createForceGraph(ctx);
      }, 100); // Delay to ensure DOM is ready
    }

    return graph;
  }
}

export default Force;
