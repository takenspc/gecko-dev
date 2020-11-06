/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

const TEST_URI = "<input type='range' value='4' min='-2' max='6' step='2'>";

function getMenuItems(toolbox) {
  const menuDoc = toolbox.doc.defaultView.windowRoot.ownerGlobal.document;
  const menu = menuDoc.getElementById("accessibility-row-contextmenu");
  return [...menu.getElementsByTagName("menuitem")];
}

async function newTabSelected(tab) {
  info("Waiting for the JSON viewer tab.");
  await BrowserTestUtils.waitForCondition(
    () => gBrowser.selectedTab !== tab,
    "Current tab updated."
  );
  return gBrowser.selectedTab;
}

function parseSnapshotFromTabURI(tab) {
  let snapshot = tab.label.split("data:application/json;charset=UTF-8,")[1];
  snapshot = decodeURIComponent(snapshot);
  return JSON.parse(snapshot);
}

async function checkJSONSnapshotForRow({ doc, tab, toolbox }, index, expected) {
  info(`Triggering context menu for row #${index}.`);
  EventUtils.synthesizeMouseAtCenter(
    doc.querySelectorAll(".treeRow")[index],
    { type: "contextmenu" },
    doc.defaultView
  );

  info(`Triggering "Print To JSON" menu item for row ${index}.`);
  const [printToJSON] = getMenuItems(toolbox);
  printToJSON.click();

  const jsonViewTab = await newTabSelected(tab);
  Assert.deepEqual(
    parseSnapshotFromTabURI(jsonViewTab),
    expected,
    "JSON snapshot for the whole document is correct"
  );

  await removeTab(jsonViewTab);
}

const OOP_FRAME_DOCUMENT_SNAPSHOT = {
  childCount: 1,
  description: "",
  indexInParent: 0,
  keyboardShortcut: "",
  name: "Accessibility Panel Test (OOP)",
  nodeCssSelector: "",
  nodeType: 9,
  role: "document",
  value: "",
  actions: [],
  attributes: {
    display: "block",
    "explicit-name": "true",
    "margin-bottom": "8px",
    "margin-left": "8px",
    "margin-right": "8px",
    "margin-top": "8px",
    tag: "body",
    "text-align": "start",
    "text-indent": "0px",
  },
  states: ["readonly", "focusable", "opaque", "enabled", "sensitive"],
  children: [
    {
      name: null,
      role: "slider",
      actions: [],
      value: "4",
      nodeCssSelector: "body > input:nth-child(1)",
      nodeType: 1,
      description: "",
      keyboardShortcut: "",
      childCount: 0,
      indexInParent: 0,
      states: ["focusable", "opaque", "enabled", "sensitive"],
      children: [],
      attributes: {
        "margin-left": "2px",
        "text-align": "start",
        "text-indent": "0px",
        "margin-right": "2px",
        tag: "input",
        valuetext: "4",
        "margin-top": "2px",
        "margin-bottom": "2px",
        display: "inline-block",
      },
      currentValue: 4,
      minimumValue: -2,
      maximumValue: 6,
      minimumIncrement: 2,
    },
  ],
};

const OOP_FRAME_SNAPSHOT = {
  childCount: 1,
  description: "",
  indexInParent: 0,
  keyboardShortcut: "",
  name: "Accessibility Panel Test (OOP)",
  nodeCssSelector: "body > iframe:nth-child(1)",
  nodeType: 1,
  role: "internal frame",
  value: "",
  actions: [],
  attributes: {
    display: "inline",
    "explicit-name": "true",
    "margin-bottom": "0px",
    "margin-left": "0px",
    "margin-right": "0px",
    "margin-top": "0px",
    tag: "iframe",
    "text-align": "start",
    "text-indent": "0px",
  },
  states: ["focusable", "opaque", "enabled", "sensitive"],
  children: [OOP_FRAME_DOCUMENT_SNAPSHOT],
};

const EXPECTED_SNAPSHOT = {
  childCount: 1,
  description: "",
  indexInParent: 0,
  keyboardShortcut: "",
  name: "",
  nodeCssSelector: "",
  nodeType: 9,
  role: "document",
  value: "",
  actions: [],
  attributes: {
    display: "block",
    "explicit-name": "true",
    "margin-bottom": "8px",
    "margin-left": "8px",
    "margin-right": "8px",
    "margin-top": "8px",
    tag: "body",
    "text-align": "start",
    "text-indent": "0px",
  },
  states: ["readonly", "focusable", "opaque", "enabled", "sensitive"],
  children: [OOP_FRAME_SNAPSHOT],
};

addA11YPanelTask(
  "Test print to JSON functionality for numeric values.",
  TEST_URI,
  async env => {
    const { doc } = env;
    await runA11yPanelTests(
      [
        {
          desc: "Test the initial accessibility tree for numeric values.",
          expected: {
            tree: [
              {
                role: "document",
                name: `""text label`,
                badges: ["text label"],
              },
            ],
          },
        },
      ],
      env
    );

    await toggleRow(doc, 0);
    await toggleRow(doc, 1);

    await runA11yPanelTests(
      [
        {
          desc: "Test expanded accessibility tree for numeric values.",
          expected: {
            tree: [
              {
                role: "document",
                name: `""text label`,
                badges: ["text label"],
              },
              {
                role: "internal frame",
                name: `"Accessibility Panel Test (OOP)"`,
              },
              {
                role: "document",
                name: `"Accessibility Panel Test (OOP)"`,
              },
            ],
          },
        },
      ],
      env
    );

    // Complete snapshot that includes OOP frame document (crossing process boundary).
    await checkJSONSnapshotForRow(env, 0, EXPECTED_SNAPSHOT);
    // Snapshot of an OOP frame (crossing process boundary).
    await checkJSONSnapshotForRow(env, 1, OOP_FRAME_SNAPSHOT);
    // Snapshot of an OOP frame document (not crossing process boundary).
    await checkJSONSnapshotForRow(env, 2, OOP_FRAME_DOCUMENT_SNAPSHOT);
  },
  {
    remoteIframe: true,
  }
);
