/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const TEST_URI = `<html>
  <head>
    <meta charset="utf-8"/>
    <title>Accessibility Panel Test for numeric values</title>
  </head>
  <body>
  <input type="range" value="4" min="-2" max="6" step="2">
  </body>
</html>`;

/**
 * Test data has the format of:
 * {
 *   desc     {String}    description for better logging
 *   setup   {Function}  An optional setup that needs to be performed before
 *                        the state of the tree and the sidebar can be checked.
 *   expected {JSON}      An expected states for the tree and the sidebar.
 * }
 */
const tests = [
  {
    desc: "Test the initial accessibility sidebar state.",
    expected: {
      sidebar: {
        name: "Accessibility Panel Test for numeric values",
        role: "document",
        actions: [],
        value: "",
        description: "",
        keyboardShortcut: "",
        childCount: 1,
        indexInParent: 0,
        states: ["readonly", "focusable", "opaque", "enabled", "sensitive"],
      },
    },
  },
  {
    desc: "Test the accessibility sidebar state for numeric values.",
    setup: async ({ doc }) => {
      await toggleRow(doc, 0);
      selectRow(doc, 1);
    },
    expected: {
      sidebar: {
        name: null,
        role: "slider",
        actions: [],
        value: "4",
        description: "",
        keyboardShortcut: "",
        childCount: 0,
        indexInParent: 0,
        states: ["focusable", "opaque", "enabled", "sensitive"],
        currentValue: 4,
        minimumValue: -2,
        maximumValue: 6,
        minimumIncrement: 2,
      },
    },
  },
];

/**
 * Test that checks the Accessibility panel sidebar.
 */
addA11yPanelTestsTask(
  tests,
  TEST_URI,
  "Test Accessibility panel sidebar for numeric values."
);
