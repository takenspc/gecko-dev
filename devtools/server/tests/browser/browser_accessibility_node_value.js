/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Checks for the AccessibleActor for Value

add_task(async function() {
  const {
    target,
    walker,
    a11yWalker,
    parentAccessibility,
  } = await initAccessibilityFrontsForUrl(
    MAIN_DOMAIN + "doc_accessibility.html"
  );

  const sliderNode = await walker.querySelector(walker.rootNode, "#slider");
  const accessibleFront = await a11yWalker.getAccessibleFor(sliderNode);

  checkA11yFront(accessibleFront, {
    name: null,
    role: "slider",
    childCount: 1,
  });

  await accessibleFront.hydrate();

  checkA11yFront(accessibleFront, {
    name: null,
    role: "slider",
    value: "5",
    description: "",
    keyboardShortcut: "",
    childCount: 1,
    domNodeType: 1,
    indexInParent: 2,
    states: ["selectable text", "horizontal", "opaque", "enabled", "sensitive"],
    actions: [],
    attributes: {
      "margin-left": "0px",
      "text-align": "start",
      "text-indent": "0px",
      id: "slider",
      tag: "div",
      valuetext: "5",
      "xml-roles": "slider",
      "margin-top": "0px",
      "margin-bottom": "0px",
      "margin-right": "0px",
      display: "block",
      formatting: "block",
    },
    currentValue: 5,
    minimumValue: 0,
    maximumValue: 7,
    minimumIncrement: 0,
  });

  info("Snapshot");
  const snapshot = await accessibleFront.snapshot();
  Assert.deepEqual(snapshot, {
    name: null,
    role: "slider",
    actions: [],
    value: "5",
    nodeCssSelector: "#slider",
    nodeType: 1,
    description: "",
    keyboardShortcut: "",
    childCount: 1,
    indexInParent: 2,
    states: ["selectable text", "horizontal", "opaque", "enabled", "sensitive"],
    children: [
      {
        name: "slider",
        role: "text leaf",
        actions: [],
        value: "",
        nodeCssSelector: "#slider#text",
        nodeType: 3,
        description: "",
        keyboardShortcut: "",
        childCount: 0,
        indexInParent: 0,
        states: ["opaque", "enabled", "sensitive"],
        children: [],
        attributes: { "explicit-name": "true" },
      },
    ],
    attributes: {
      "margin-left": "0px",
      "text-align": "start",
      "text-indent": "0px",
      id: "slider",
      tag: "div",
      valuetext: "5",
      "xml-roles": "slider",
      "margin-top": "0px",
      "margin-bottom": "0px",
      "margin-right": "0px",
      display: "block",
      formatting: "block",
    },
    currentValue: 5,
    minimumValue: 0,
    maximumValue: 7,
    minimumIncrement: 0,
  });

  await waitForA11yShutdown(parentAccessibility);
  await target.destroy();
  gBrowser.removeCurrentTab();
});
