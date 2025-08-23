import Force from "../classes/force.js";

class forceinput {
  static createinput(key, text) {
    //  input
    const holder = document.createElement("div");
    holder.style.margin = "8px 0";
    holder.style.display = "flex";
    holder.style.alignItems = "center";

    const label = document.createElement("label");
    label.textContent = text;
    label.style.marginRight = "8px";
    label.style.width = "50%";

    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.01";
    input.style.width = "50%";
    input.value = Force[key];
    input.onchange = () => {
      Force[key]= parseFloat(input.value);
    };

    holder.appendChild(label);
    holder.appendChild(input);

    return holder;
  }
}

export default forceinput;