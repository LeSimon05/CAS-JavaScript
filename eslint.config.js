"use strict";

const js = require("@eslint/js");

module.exports = [
    { ignores: ["js/lib/**", "node_modules/**"] },
    js.configs.recommended,
    {
        //Produktionscode: klassische Browser-Scripts, die sich einen Scope teilen
        files: ["js/**/*.js"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "script",
            globals: {
                document: "readonly",
                window: "readonly",
                console: "readonly",
                math: "readonly", //vendored math.js (js/lib)
                //in Model.js/View.js definiert, in Controller.js genutzt:
                Model: "readonly",
                View: "readonly",
                Operators: "readonly",
                InvalidOperatorError: "readonly",
                DivisionByZeroError: "readonly",
            },
        },
        rules: {
            //Model/View werden dateiuebergreifend genutzt und wirken pro Datei "unbenutzt"
            "no-unused-vars": ["error", { varsIgnorePattern: "^(Model|View)$" }],
            //die definierende Datei "redeklariert" zwangslaeufig ihr eigenes Global
            "no-redeclare": ["error", { builtinGlobals: false }],
        },
    },
    {
        //Tests und Konfiguration: CommonJS unter Node
        files: ["tests/**/*.js", "eslint.config.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "commonjs",
            globals: {
                require: "readonly",
                module: "writable",
                __dirname: "readonly",
                console: "readonly",
            },
        },
    },
];
