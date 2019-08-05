import configureStore from "redux-mock-store";
import { actions } from "santoku-store";
import { SimpleEditorAdapter } from "./test-utils";
import { ACTION_MESSAGE, Message, STATE_UPDATED_MESSAGE } from "../src/message";
import { EditorAdapter } from "../src/editor-adapter";

describe("EditorAdaptor", () => {
  it("dispatches actions to the store", () => {
    const location = { path: "path", index: 0 };
    const version = 0;
    const text = "Updated text";
    const action = actions.line.updateTextAtLocation(location, text, version);
    const message = { type: ACTION_MESSAGE, data: action };

    const mockStore = configureStore([]);
    const store = mockStore({});
    const editorAdapter = new SimpleEditorAdapter(store);
    editorAdapter.notify(message);

    expect(store.getActions()).toEqual([action]);
  });

  it("reports state changes", (done) => {
    const mockStore = configureStore([]);
    const store = mockStore({
      field: "value"
    });
    new EditorAdapter(store, (message: Message) => {
      expect(message).toEqual({
        type: STATE_UPDATED_MESSAGE,
        data: {
          field: "value"
        }
      })
      done();
    });
    store.dispatch({ type: "noop-action" });
  });
});
