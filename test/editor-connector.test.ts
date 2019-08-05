import { MessageListenerSetup } from "../src/editor-connector";
import { SimpleEditorConnector } from "./test-utils";

class SimpleNotifier {
  onNotification(handler: () => void) {
    this._handler = handler;
  }

  triggerNotification() {
    this._handler();
  }

  private _handler: () => void;
}

describe("EditorConnector", () => {

  const notifier = new SimpleNotifier();
  const listenerSetup: MessageListenerSetup = function (handleMessage) {
    notifier.onNotification(() => { handleMessage({ type: "type", data: {} }) })
  }

  it("it forwards messages from listener setup function to subscribers", (done) => {
    const connector = new SimpleEditorConnector(listenerSetup);
    connector.subscribe((message) => {
      expect(message).toEqual({ type: "type", data: {} });
      done();
    });
    notifier.triggerNotification();
  });

  it("unsubscribes listener", () => {
    const connector = new SimpleEditorConnector(listenerSetup);
    let listenerCalled = false;
    const unsubscribe = connector.subscribe(() => { listenerCalled = true; });
    unsubscribe();
    notifier.triggerNotification();
    expect(listenerCalled).toBe(false);
  });
});
