import { updateTextAtLocation } from "santoku-store/dist/lines/actions";
import { ACTION_MESSAGE, stateUpdateMessage } from "../src/message";
import { SantokuAdapter } from "../src/santoku-adapter";
import { emptyState, SimpleSantokuConnector } from "./test-utils";

describe("SantokuAdapter", () => {
  it("notifies listeners of state changes", done => {
    const connector = new SimpleSantokuConnector();
    const adapter = new SantokuAdapter(connector);
    const updatedState = emptyState();
    adapter.addStateChangeListener((state) => {
      expect(state).toEqual(updatedState);
      done();
    });

    const message = stateUpdateMessage(updatedState);
    connector.triggerIncomingMessage(message);
  });

  it("dispatches actions through the connector", () => {
    const connector = new SimpleSantokuConnector();
    const adapter = new SantokuAdapter(connector);
    const location = { path: "path", index: 0 };
    const text = "Updated text";
    const version = 0;
    const action = updateTextAtLocation(location, text, version);
    adapter.dispatch(action);
    expect(connector.lastSentMessage).toMatchObject({ type: ACTION_MESSAGE, data: action });
  });
});
