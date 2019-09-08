import configureStore from "redux-mock-store";
import { EditorAdapter } from "../src/editor-adapter";
import {
  actionMessage,
  EDITOR_REQUEST_MESSAGE,
  insertSnippetRequest,
  STATE_UPDATED_MESSAGE
} from "../src/message";
import { simpleAction, SimpleEditorAdapter, SimpleEditorConnector } from "./test-utils";

describe("EditorAdaptor", () => {
  it("dispatches actions to the store", () => {
    const action = simpleAction();
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
    const connector = new SimpleEditorConnector();
    new EditorAdapter(store, connector);
    store.dispatch({ type: "noop-action" });
    expect(connector.lastSentMessage).toMatchObject({
      type: STATE_UPDATED_MESSAGE,
      data: {
        field: "value"
      }
    });
  });

  it("sends editor requests", () => {
    const connector = new SimpleEditorConnector();
    const adapter = new SimpleEditorAdapter(undefined, connector);
    adapter.request(insertSnippetRequest());
    expect(connector.lastSentMessage).toMatchObject({
      type: EDITOR_REQUEST_MESSAGE
    });
  });
});
