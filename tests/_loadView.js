"use strict";

/*
 * Lädt das produktive js/View.js unverändert in einen VM-Kontext mit einem
 * Fake-DOM. Ein Recorder-Context protokolliert jeden Canvas-Aufruf (Methoden +
 * gesetzte Eigenschaften) als geordnete Liste. So lässt sich die exakte
 * Zeichen-Reihenfolge als Golden Master festschreiben und nach Refactorings
 * auf Gleichheit prüfen, ohne einen echten Browser zu brauchen.
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

function createView({
  clientWidth = 800,
  clientHeight = 600,
  devicePixelRatio = 1,
} = {}) {
  const math = require(
    path.join(__dirname, "..", "js", "lib", "mathjs", "math.js"),
  );

  const calls = [];
  const recorder = new Proxy(
    {},
    {
      get(target, prop) {
        if (prop in target) return target[prop];
        // Jede aufgerufene Methode wird mit ihren Argumenten protokolliert.
        return (...args) => calls.push([String(prop), ...args]);
      },
      set(target, prop, value) {
        // Gesetzte Eigenschaften (strokeStyle, lineWidth, font, textAlign) protokollieren.
        calls.push(["set:" + String(prop), value]);
        target[prop] = value;
        return true;
      },
    },
  );

  const canvas = {
    width: 0,
    height: 0,
    style: {},
    parentNode: { clientWidth, clientHeight },
    getContext: () => recorder,
  };

  const context = {
    math,
    document: { getElementById: () => canvas },
    window: { devicePixelRatio },
  };

  const source =
    fs.readFileSync(path.join(__dirname, "..", "js", "View.js"), "utf8") +
    "\nglobalThis.View = View;";
  vm.createContext(context);
  vm.runInContext(source, context, { filename: "View.js" });

  const view = new context.View();
  return { view, canvas, calls };
}

module.exports = { createView };
