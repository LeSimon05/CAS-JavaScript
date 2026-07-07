"use strict";

/*
 * Charakterisierungstests für js/Controller.js über ein Fake-DOM (siehe
 * _loadApp.js). Sie pinnen das beobachtbare Verhalten der echten
 * onclick-Handler: Text im Ergebnisfeld, Sichtbarkeit, Zeichnen eines Zeigers,
 * Eingabe-Reset. Sicherheitsnetz für die Controller-Refactorings (W1, W2).
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const { createApp } = require("./_loadApp.js");

// Ein roter Zeiger wurde gezeichnet, wenn drawArrow seine Stroke-Farbe gesetzt hat.
const arrowDrawn = (app) =>
  app.canvasCalls.some((c) => c[0] === "set:strokeStyle" && c[1] === "#ff0000");

test("Betrag z1 = 3+4i → '5', sichtbar, Zeiger gezeichnet", () => {
  const app = createApp();
  app.clickOperator("operatorButtonCellZ1", "absoluteValue", "3+4i");
  assert.equal(app.byId.resultCell.innerHTML, "5");
  assert.equal(app.byId.resultCell.style.visibility, "visible");
  assert.ok(arrowDrawn(app));
});

test("Zeigerwinkel z1 = -1-1i → '-135°' (Quadranten-Fix wirkt im Flow)", () => {
  const app = createApp();
  app.clickOperator("operatorButtonCellZ1", "vectorAngle", "-1-1i");
  assert.equal(app.byId.resultCell.innerHTML, "-135°");
  assert.ok(arrowDrawn(app));
});

test("konjugieren z1 = 3+4i → '3 - 4i'", () => {
  const app = createApp();
  app.clickOperator("operatorButtonCellZ1", "conjugate", "3+4i");
  assert.equal(app.byId.resultCell.innerHTML, "3 - 4i");
  assert.ok(arrowDrawn(app));
});

test("Kehrwert z2 = 2 → '0.5'", () => {
  const app = createApp();
  app.clickOperator("operatorButtonCellZ2", "inverse", undefined, "2");
  assert.equal(app.byId.resultCell.innerHTML, "0.5");
  assert.ok(arrowDrawn(app));
});

test("ungültige Eingabe → 'ungültige Eingabe', kein Zeiger, Fehler geloggt", () => {
  const app = createApp();
  app.clickOperator("operatorButtonCellZ1", "absoluteValue", "abc");
  assert.equal(app.byId.resultCell.innerHTML, "ungültige Eingabe");
  assert.ok(!arrowDrawn(app));
  assert.equal(app.logs.length, 1);
});

test("addieren 1+2i, 3+4i → '4 + 6i', Zeiger gezeichnet", () => {
  const app = createApp();
  app.clickOperator("operator2ButtonCell", "add", "1+2i", "3+4i");
  assert.equal(app.byId.resultCell.innerHTML, "4 + 6i");
  assert.ok(arrowDrawn(app));
});

test("dividieren durch 0 → 'Nicht definiert!', kein Zeiger", () => {
  const app = createApp();
  app.clickOperator("operator2ButtonCell", "divide", "1+2i", "0");
  assert.equal(app.byId.resultCell.innerHTML, "Nicht definiert!");
  assert.ok(!arrowDrawn(app));
});

test("0 / 0 → 'NaN' (erhaltene Eigenheit, Zeiger-Aufruf erfolgt)", () => {
  const app = createApp();
  app.clickOperator("operator2ButtonCell", "divide", "0", "0");
  assert.equal(app.byId.resultCell.innerHTML, "NaN");
  assert.ok(arrowDrawn(app));
});

test("Komma in Real- und Imaginärteil: 1,5+2,5i Betrag → '2.92'", () => {
  const app = createApp();
  app.clickOperator("operatorButtonCellZ1", "absoluteValue", "1,5+2,5i");
  assert.equal(app.byId.resultCell.innerHTML, "2.92");
});

test("Maßstab-Klick zeichnet gespeicherte Zeiger neu (mit halbierter Skalierung)", () => {
  const app = createApp();
  app.clickOperator("operatorButtonCellZ1", "absoluteValue", "3+4i");
  const baseline = app.canvasCalls.length;
  app.byId.increaseScaleButton.onclick(); // userScaling 1 -> 2
  assert.equal(app.byId.scaleLabel.innerHTML, "2");
  // Der Zeiger zu (3,4) wird mit canvasScaling/userScaling = 25 px/Einheit neu
  // gezeichnet: von (400,300) nach (400+3*25, 300-4*25) = (475,200).
  const arrowLineTo = app.canvasCalls
    .slice(baseline)
    .find((c) => c[0] === "lineTo" && c[1] === 475 && c[2] === 200);
  assert.ok(arrowLineTo, "erwarteter lineTo(475,200) des neu skalierten Zeigers fehlt");
});

test("zurücksetzen leert Felder und versteckt das Ergebnis", () => {
  const app = createApp();
  app.clickOperator("operator2ButtonCell", "add", "1+2i", "3+4i");
  app.byId.resetButton.onclick();
  assert.equal(app.byId.resultCell.innerHTML, "cleared");
  assert.equal(app.byId.resultCell.style.visibility, "hidden");
  assert.equal(app.byId.z1Input.value, "");
  assert.equal(app.byId.z2Input.value, "");
});
