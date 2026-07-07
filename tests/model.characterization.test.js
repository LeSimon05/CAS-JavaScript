"use strict";

/*
 * Charakterisierungstests für js/Model.js.
 *
 * Sie schreiben das AKTUELLE Verhalten fest — inklusive bekannter Bugs
 * (siehe getVectorAngle). Das ist Absicht: vorher grün + nachher grün belegt,
 * dass reines Refactoring verhaltenserhaltend war. Bewusste Bugfixes ändern
 * diese Erwartungen explizit in einem separaten Commit.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const { loadModel } = require("./_loadModel.js");

const { Model, Operators, InvalidOperatorError, DivisionByZeroError, math } =
  loadModel();
const complex = (value) => math.complex(value);
const asString = (value) =>
  value && value.toString ? value.toString() : String(value);

test("calculateTwoNumbers: Grundrechenarten, auf 2 Nachkommastellen gerundet", () => {
  const model = new Model();
  assert.equal(
    asString(
      model.calculateTwoNumbers(
        complex("1+2i"),
        complex("3+4i"),
        Operators.add,
      ),
    ),
    "4 + 6i",
  );
  assert.equal(
    asString(
      model.calculateTwoNumbers(
        complex("1+2i"),
        complex("3+4i"),
        Operators.subtract,
      ),
    ),
    "-2 - 2i",
  );
  assert.equal(
    asString(
      model.calculateTwoNumbers(
        complex("1+2i"),
        complex("3+4i"),
        Operators.multiply,
      ),
    ),
    "-5 + 10i",
  );
  assert.equal(
    asString(
      model.calculateTwoNumbers(
        complex("1+2i"),
        complex("3+4i"),
        Operators.divide,
      ),
    ),
    "0.44 + 0.08i",
  );
});

test("calculateTwoNumbers: Division (ungleich 0) durch 0 wirft DivisionByZeroError", () => {
  const model = new Model();
  assert.throws(
    () =>
      model.calculateTwoNumbers(
        complex("1+2i"),
        complex("0"),
        Operators.divide,
      ),
    DivisionByZeroError,
  );
});

test("calculateTwoNumbers: 0/0 wirft NICHT, sondern liefert NaN (erhaltene Eigenheit)", () => {
  const model = new Model();
  const result = model.calculateTwoNumbers(
    complex("0"),
    complex("0"),
    Operators.divide,
  );
  assert.ok(Number.isNaN(result.re));
});

test("calculateTwoNumbers: unbekannter Operator wirft InvalidOperatorError", () => {
  const model = new Model();
  assert.throws(
    () => model.calculateTwoNumbers(complex("1+2i"), complex("3+4i"), "bogus"),
    InvalidOperatorError,
  );
});

test("calculateOneNumber: Betrag, Konjugierte, Kehrwert", () => {
  const model = new Model();
  assert.equal(
    asString(
      model.calculateOneNumber(complex("3+4i"), Operators.absoluteValue),
    ),
    "5",
  );
  assert.equal(
    asString(model.calculateOneNumber(complex("3+4i"), Operators.conjugate)),
    "3 - 4i",
  );
  assert.equal(
    asString(model.calculateOneNumber(complex("2+0i"), Operators.inverse)),
    "0.5",
  );
});

test("calculateOneNumber: unbekannter Operator liefert undefined", () => {
  const model = new Model();
  assert.equal(model.calculateOneNumber(complex("1+1i"), "bogus"), undefined);
});

test("getVectorAngle: voller Quadranten-Bereich via atan2 (-180°, 180°]", () => {
  const model = new Model();
  // Erster/vierter Quadrant:
  assert.equal(model.getVectorAngle(complex("1+1i")), "45°");
  assert.equal(model.getVectorAngle(complex("1-1i")), "-45°");
  assert.equal(model.getVectorAngle(complex("0+1i")), "90°");
  assert.equal(model.getVectorAngle(complex("0-1i")), "-90°");
  // Zweiter/dritter Quadrant und negative reelle Achse (zuvor falsch):
  assert.equal(model.getVectorAngle(complex("-1-1i")), "-135°");
  assert.equal(model.getVectorAngle(complex("-1+1i")), "135°");
  assert.equal(model.getVectorAngle(complex("-1+0i")), "180°");
});

test("addNumber / getListofAnswers / resetListofAnswers", () => {
  const model = new Model();
  model.addNumber(complex("3+4i"));
  model.addNumber(complex("1-2i"));
  // JSON-Vergleich, weil die Objekte im VM-Kontext einen anderen Prototyp
  // haben und deepStrictEqual sonst realm-übergreifend fehlschlägt.
  assert.equal(
    JSON.stringify(model.getListofAnswers()),
    JSON.stringify([
      { re: 3, im: 4 },
      { re: 1, im: -2 },
    ]),
  );
  model.resetListofAnswers();
  assert.equal(JSON.stringify(model.getListofAnswers()), "[]");
});
