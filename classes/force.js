class Force {
  // Global array of coefficients for a force function
  static coefficients = [0, 20, -20]; // Example default coefficients

  // Method to update the coefficients array
  static setCoefficients(newCoefficients) {
    Force.coefficients = Array.isArray(newCoefficients)
      ? newCoefficients
      : Force.coefficients;
  }

  static calculateForceMagnitude(dist) {
    // console.log(`Calculating force for distance: ${dist}`);
    return Force.coefficients.reduce((sum, coeff, idx) => {
      // return sum + coeff * Math.pow(dist, 1 / (idx + 1));
      return sum + coeff * (1 / Math.pow(dist, idx + 1));
    }, 0);
  }

  static buildMenu(container) {
    container.innerHTML = ''; // Clear previous content

    // Create the list of coefficient inputs
    const list = document.createElement('ul');
    list.style.listStyle = 'none';
    list.style.padding = '0';

    // Helper to render the coefficient inputs
    function renderCoefficients() {
      list.innerHTML = '';
      Force.coefficients.forEach((value, idx) => {
        const item = document.createElement('li');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.marginBottom = '4px';

        // Input for coefficient value
        const input = document.createElement('input');
        input.type = 'number';
        input.value = value;
        input.style.width = '80px';
        input.onchange = () => {
          Force.coefficients[idx] = parseFloat(input.value);
        };

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => {
          Force.coefficients.splice(idx, 1);
          renderCoefficients();
        };

        // Move up button
        const upBtn = document.createElement('button');
        upBtn.textContent = '↑';
        upBtn.disabled = idx === 0;
        upBtn.onclick = () => {
          if (idx > 0) {
            [Force.coefficients[idx - 1], Force.coefficients[idx]] = [Force.coefficients[idx], Force.coefficients[idx - 1]];
            renderCoefficients();
          }
        };

        // Move down button
        const downBtn = document.createElement('button');
        downBtn.textContent = '↓';
        downBtn.disabled = idx === Force.coefficients.length - 1;
        downBtn.onclick = () => {
          if (idx < Force.coefficients.length - 1) {
            [Force.coefficients[idx + 1], Force.coefficients[idx]] = [Force.coefficients[idx], Force.coefficients[idx + 1]];
            renderCoefficients();
          }
        };

        item.appendChild(input);
        item.appendChild(upBtn);
        item.appendChild(downBtn);
        item.appendChild(removeBtn);
        list.appendChild(item);
      });
    }

    renderCoefficients();

    // Add coefficient button
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Coefficient';
    addBtn.onclick = () => {
      Force.coefficients.push(0);
      renderCoefficients();
    };

    // Save button
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save Coefficients';
    saveBtn.onclick = () => {
      Force.setCoefficients([...Force.coefficients]);
      alert('Coefficients saved!');
    };

    // Layout
    container.appendChild(list);
    container.appendChild(addBtn);
    container.appendChild(saveBtn);
  }
}

export default Force;
