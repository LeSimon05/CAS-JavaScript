"use strict";

/*
 * Verdrahtet Model.js + View.js + Controller.js unverändert in einem
 * gemeinsamen VM-Kontext mit einem Fake-DOM (wie im Browser teilen sich die
 * drei Script-Dateien einen Scope). Erlaubt das Auslösen der echten
 * onclick-Handler und das Auslesen des beobachtbaren Zustands
 * (resultCell-Text, Eingabefelder, scaleLabel) sowie der Canvas-Aufrufe.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

function jsDir(file) {
  return fs.readFileSync(path.join(__dirname, "..", "js", file), "utf8");
}

function createApp({ devicePixelRatio = 1, clientWidth = 800, clientHeight = 600 } = {}) {
  const math = require(path.join(__dirname, "..", "js", "lib", "mathjs", "math.js"));

  const canvasCalls = [];
  const recorder = new Proxy(
    {},
    {
      get: (t, p) => (p in t ? t[p] : (...a) => canvasCalls.push([String(p), ...a])),
      set: (t, p, v) => (canvasCalls.push(["set:" + String(p), v]), (t[p] = v), true),
    },
  );

  // Fake-Element: innerHTML stringifiziert beim Setzen wie ein echtes DOM-Element.
  const makeElement = (extra = {}) => {
    let html = "";
    return {
      style: {},
      value: "",
      get innerHTML() {
        return html;
      },
      set innerHTML(v) {
        html = String(v);
      },
      ...extra,
    };
  };

  const canvas = {
    width: 0,
    height: 0,
    parentNode: { clientWidth, clientHeight },
    getContext: () => recorder,
  };

  const byId = {
    Canvas: canvas,
    resultCell: makeElement(),
    z1Input: makeElement(),
    z2Input: makeElement(),
    scaleLabel: makeElement(),
    resetButton: makeElement(),
    decreaseScaleButton: makeElement(),
    increaseScaleButton: makeElement(),
  };

  const buttonCell = (name) => ({ firstChild: { name, onclick: null } });
  const byClass = {
    operatorButtonCellZ1: ["absoluteValue", "vectorAngle", "conjugate", "inverse"].map(buttonCell),
    operatorButtonCellZ2: ["absoluteValue", "vectorAngle", "conjugate", "inverse"].map(buttonCell),
    operator2ButtonCell: ["add", "subtract", "multiply", "divide"].map(buttonCell),
  };

  const logs = [];
  const context = {
    math,
    console: { log: (...a) => logs.push(a), error: (...a) => logs.push(a) },
    window: { devicePixelRatio },
    document: {
      getElementById: (id) => byId[id],
      getElementsByClassName: (cls) => byClass[cls],
    },
  };

  const source = [jsDir("Model.js"), jsDir("View.js"), jsDir("Controller.js")].join("\n");
  vm.createContext(context);
  vm.runInContext(source, context, { filename: "app.js" });

  const clickOperator = (cls, name, ...inputs) => {
    if (inputs[0] !== undefined) byId.z1Input.value = inputs[0];
    if (inputs[1] !== undefined) byId.z2Input.value = inputs[1];
    const cell = byClass[cls].find((c) => c.firstChild.name === name);
    cell.firstChild.onclick();
  };

  return { context, byId, byClass, canvasCalls, logs, clickOperator };
}

module.exports = { createApp };
