import { Message } from "../src/message";
import { WebSocketsEditorConnector } from "../src/websockets-editor-connector";

describe("WebSocketsEditorConnector", () => {
  it("sends a message to a window", () => {
    let messageSent;
    const oldPostMessage = window.postMessage;
    window.postMessage = (message, _) => {
      messageSent = message;
    };
    const connector = new WebSocketsEditorConnector("*");
    connector.sendMessage({ type: "example-type", data: {} });
    expect(messageSent).toEqual({ type: "example-type", data: {} });
    window.postMessage = oldPostMessage;
  });

  it("forwards messages sent from the window to subscribers", done => {
    const listener = ((message: Message) => {
      expect(message).toEqual({ type: "type", data: {} });
      done();
    });
    const connector = new WebSocketsEditorConnector("*");
    connector.subscribe(listener);
    window.postMessage({ type: "type", data: {} }, "*");
  });
});
