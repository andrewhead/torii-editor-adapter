import { WebSocketsEditorConnector } from "../src/websockets-editor-connector";
import { SimpleEditorAdapter } from "./test-utils";
import { Message } from "../src/editor-connector";

describe("WebSocketsEditorConnector", () => {
  it("sends a message to a window", () => {
    let messageSent;
    const oldPostMessage = window.postMessage;
    window.postMessage = (message, _) => {
      messageSent = message;
    };
    const connector = new WebSocketsEditorConnector(new SimpleEditorAdapter(), "*");
    connector.sendMessage({ type: "example-type", data: {} });
    expect(messageSent).toEqual({ type: "example-type", data: {} });
    window.postMessage = oldPostMessage;
  });

  it("forwards messages sent from the window to the adapter", done => {
    const adapter = new SimpleEditorAdapter();
    adapter.notify = (message: Message) => {
      expect(message).toEqual({ type: "type", data: {} });
      done();
    };
    new WebSocketsEditorConnector(adapter, "*");
    window.postMessage({ type: "type", data: {} }, "*");
  });
});
