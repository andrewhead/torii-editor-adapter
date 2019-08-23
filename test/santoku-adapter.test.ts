import { testUtils } from "santoku-store";
import { ACTION_MESSAGE, stateUpdateMessage } from "../src/message";
import { SantokuAdapter } from "../src/santoku-adapter";
import { simpleAction, SimpleSantokuConnector } from "./test-utils";

describe("SantokuAdapter", () => {
  it("notifies listeners of state changes", done => {
    const connector = new SimpleSantokuConnector();
    const adapter = new SantokuAdapter(connector);
    const updatedState = testUtils.createState();
    adapter.subscribe(state => {
      expect(state).toEqual(updatedState);
      done();
    });

    const message = stateUpdateMessage(updatedState);
    connector.triggerIncomingMessage(message);
  });

  it("dispatches actions through the connector", () => {
    const connector = new SimpleSantokuConnector();
    const adapter = new SantokuAdapter(connector);
    const action = simpleAction();
    adapter.dispatch(action);
    expect(connector.lastSentMessage).toMatchObject({ type: ACTION_MESSAGE, data: action });
  });
});
