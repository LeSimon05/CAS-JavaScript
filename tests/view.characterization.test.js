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
