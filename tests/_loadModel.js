"use strict";

/*
 * Lädt das produktive js/Model.js unverändert in einen isolierten VM-Kontext.
 * Model.js ist eine klassische Script-Datei (kein CommonJS-Modul) und nutzt
 * das globale `math` aus der vendored mathjs. Statt die Datei für die Tests
 * anzufassen, stellen wir `math` als Kontext-Global bereit und exportieren die
 * deklarierten Bindings `Model`/`Operators` per angehängtem Snippet wieder heraus.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadModel() {
  const math = require(
    path.join(__dirname, "..", "js", "lib", "mathjs", "math.js"),
  );
  const source =
    fs.readFileSync(path.join(__dirname, "..", "js", "Model.js"), "utf8") +
    "\nglobalThis.Model = Model; globalThis.Operators = Operators;" +
    " globalThis.InvalidOperatorError = InvalidOperatorError;" +
    " globalThis.DivisionByZeroError = DivisionByZeroError;";

  const context = { math, console };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: "Model.js" });

  return {
    Model: context.Model,
    Operators: context.Operators,
    InvalidOperatorError: context.InvalidOperatorError,
    DivisionByZeroError: context.DivisionByZeroError,
    math,
  };
}

module.exports = { loadModel };
