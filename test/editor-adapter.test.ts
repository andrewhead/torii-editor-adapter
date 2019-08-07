import configureStore from "redux-mock-store";
import { actions } from "santoku-store";
import { EditorAdapter } from "../src/editor-adapter";
import { actionMessage, STATE_UPDATED_MESSAGE } from "../src/message";
import { SimpleEditorAdapter, SimpleEditorConnector } from "./test-utils";

describe("EditorAdaptor", () => {
  it("dispatches actions to the store", () => {
    const location = { path: "path", index: 0 };
    const version = 0;
    const text = "Updated text";
    const action = actions.line.updateTextAtLocation(location, text, version);
    const message = actionMessage(action);

    const mockStore = configureStore([]);
    const store = mockStore({});
    const connector = new SimpleEditorConnector();
    new SimpleEditorAdapter(store, connector);
    connector.triggerIncomingMessage(message);

    expect(store.getActions()).toEqual([action]);
  });

  it("reports state changes", () => {
    const mockStore = configureStore([]);
    const store = mockStore({ field: "value" });
    let connector = new SimpleEditorConnector();
    new EditorAdapter(store, connector);
    store.dispatch({ type: "noop-action" });
    expect(connector.lastSentMessage).toMatchObject({
      type: STATE_UPDATED_MESSAGE,
      data: {
        field: "value"
      }
    });
  });
});
