import { stateUtils } from "torii-store";
import {
  ACTION_MESSAGE,
  editorRequestMessage,
  EditorRequestType,
  insertSnippetRequest,
  stateUpdateMessage
} from "../src/message";
import { ToriiAdapter } from "../src/torii-adapter";
import { simpleAction, SimpleToriiConnector } from "./test-utils";

describe("ToriiAdapter", () => {
  it("notifies listeners of state changes", done => {
    const connector = new SimpleToriiConnector();
    const adapter = new ToriiAdapter(connector);
    const updatedState = stateUtils.createState();
    adapter.subscribe(state => {
      expect(state).toEqual(updatedState);
      done();
    });

    const message = stateUpdateMessage(updatedState);
    connector.triggerIncomingMessage(message);
  });

  it("notifies listeners of requests", done => {
    const connector = new SimpleToriiConnector();
    const adapter = new ToriiAdapter(connector);
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
    const connector = new SimpleToriiConnector();
    const adapter = new ToriiAdapter(connector);
    const action = simpleAction();
    adapter.dispatch(action);
    expect(connector.lastSentMessage).toMatchObject({
      type: ACTION_MESSAGE,
      data: action
    });
  });
});
