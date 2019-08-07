import { Message } from "../src/message";
import { WebSocketsEditorConnector } from "../src/websockets-editor-connector";
import { simpleMessage } from "./test-utils";

describe("WebSocketsEditorConnector", () => {
  it("sends a message to a window", () => {
    let messageSent;
    const oldPostMessage = window.postMessage;
    window.postMessage = (message, _) => {
      messageSent = message;
    };
    const connector = new WebSocketsEditorConnector("*");
    connector.sendMessage(simpleMessage("message-id"));
    expect(messageSent).toMatchObject({ id: "message-id" });
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
