"use strict";

/*
 * Golden-Master-Charakterisierungstest für js/View.js.
 *
 * Zeichnet Koordinatensystem und einen Pfeil in einen Recorder-Context und
 * vergleicht die exakte Abfolge der Canvas-Aufrufe mit einer eingefrorenen
 * Fixture (tests/fixtures/view-calls.json), die aus dem Stand VOR dem
 * Refactoring erzeugt wurde. So ist belegt, dass das Umbauen der
 * Achsenbeschriftung pixelgleich bleibt.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const { createView } = require("./_loadView.js");

const golden = JSON.parse(fs.readFileSync(path.join(__dirname, "fixtures", "view-calls.json"), "utf8"));

test("drawCoordinateSystem erzeugt unveränderte Canvas-Aufrufe (800x600, ppi 1)", () => {
  const { calls } = createView({ clientWidth: 800, clientHeight: 600, devicePixelRatio: 1 });
  assert.deepEqual(calls, golden.coordinateSystem);
});

test("drawArrow erzeugt unveränderte Canvas-Aufrufe", () => {
  const { view, calls } = createView({ clientWidth: 800, clientHeight: 600, devicePixelRatio: 1 });
  const baseline = calls.length;
  view.drawArrow(3, 4);
  assert.deepEqual(calls.slice(baseline), golden.afterArrow);
});

test("High-DPI: Bitmap skaliert, CSS-Groesse fixiert, Zeichenkoordinaten unveraendert", () => {
  const lowDpi = createView({ clientWidth: 800, clientHeight: 600, devicePixelRatio: 1 });
  const highDpi = createView({ clientWidth: 800, clientHeight: 600, devicePixelRatio: 2 });

  // Bitmap dpr-fach, Anzeige (CSS) auf Containergroesse fixiert:
  assert.equal(highDpi.canvas.width, 1600);
  assert.equal(highDpi.canvas.height, 1200);
  assert.equal(highDpi.canvas.style.width, "800px");
  assert.equal(highDpi.canvas.style.height, "600px");

  // Kontext einmalig um dpr skaliert:
  assert.deepEqual(highDpi.calls[0], ["scale", 2, 2]);

  // Die logischen Zeichenaufrufe sind unabhaengig vom devicePixelRatio identisch:
  const withoutScale = (calls) => calls.filter((c) => c[0] !== "scale");
  assert.deepEqual(withoutScale(highDpi.calls), withoutScale(lowDpi.calls));
});

const stepScale = (view, direction, steps) => {
  const out = [];
  for (let i = 0; i < steps; i++) out.push(view.toggleScale(direction));
  return out;
};

test("toggleScale increase: vollständige aufsteigende Skalenleiter ab Minimum", () => {
  const { view } = createView();
  view.userScaling = 0.00001;
  assert.deepEqual(
    stepScale(view, "increase", 28),
    [
      0.0001, 0.001, 0.01, 0.1, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300,
    ],
  );
});

test("toggleScale decrease: absteigend bis zum Minimum, danach geklemmt", () => {
  const { view } = createView();
  view.userScaling = 1;
  assert.deepEqual(
    stepScale(view, "decrease", 10),
    [0.5, 0.25, 0.125, 0.1, 0.01, 0.001, 0.0001, 0.00001, 0.00001, 0.00001],
  );
});

test("toggleScale: unbekannte Richtung lässt den Maßstab unverändert", () => {
  const { view } = createView();
  view.userScaling = 7;
  assert.equal(view.toggleScale("foo"), 7);
});
