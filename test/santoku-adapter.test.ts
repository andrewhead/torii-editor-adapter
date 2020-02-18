import { stateUtils } from "torii-store";
import {
  ACTION_MESSAGE,
  editorRequestMessage,
  EditorRequestType,
  insertSnippetRequest,
  stateUpdateMessage
} from "../src/message";
import { SantokuAdapter } from "../src/santoku-adapter";
import { simpleAction, SimpleSantokuConnector } from "./test-utils";

describe("SantokuAdapter", () => {
  it("notifies listeners of state changes", done => {
    const connector = new SimpleSantokuConnector();
    const adapter = new SantokuAdapter(connector);
    const updatedState = stateUtils.createState();
    adapter.subscribe(state => {
      expect(state).toEqual(updatedState);
      done();
    });

    const message = stateUpdateMessage(updatedState);
    connector.triggerIncomingMessage(message);
  });

  it("notifies listeners of requests", done => {
    const connector = new SimpleSantokuConnector();
    const adapter = new SantokuAdapter(connector);
    adapter.onRequestReceived(request => {
      expect(request).toEqual({
        type: EditorRequestType.INSERT_SNIPPET,
        data: undefined
      });
      done();
    });

    const message = editorRequestMessage(insertSnippetRequest());
    connector.triggerIncomingMessage(message);
  });

  it("dispatches actions through the connector", () => {
    const connector = new SimpleSantokuConnector();
    const adapter = new SantokuAdapter(connector);
    const action = simpleAction();
    adapter.dispatch(action);
    expect(connector.lastSentMessage).toMatchObject({
      type: ACTION_MESSAGE,
      data: action
    });
  });
});
