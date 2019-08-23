import { MessageListenerSetup } from "../src/connector";
import { receiptMessage, RECEIPT_MESSAGE } from "../src/message";
import { SimpleConnector, simpleMessage } from "./test-utils";

class SimpleNotifier {
  onNotification(handler: () => void) {
    this._handler = handler;
  }

  triggerNotification() {
    this._handler();
  }

  private _handler: () => void;
}

describe("Connector", () => {
  const notifier = new SimpleNotifier();
  const listenerSetup: MessageListenerSetup = function(handleMessage) {
    notifier.onNotification(() => {
      handleMessage(simpleMessage("message-id"));
    });
  };

  it("it forwards messages from listener setup function to subscribers", done => {
    const connector = new SimpleConnector(listenerSetup);
    connector.subscribe(message => {
      expect(message).toMatchObject({ id: "message-id" });
      done();
    });
    notifier.triggerNotification();
  });

  it("unsubscribes listener", () => {
    const connector = new SimpleConnector(listenerSetup);
    let listenerCalled = false;
    const unsubscribe = connector.subscribe(() => {
      listenerCalled = true;
    });
    unsubscribe();
    notifier.triggerNotification();
    expect(listenerCalled).toBe(false);
  });

  it("sends a receipt", () => {
    const connector = new SimpleConnector();
    connector.triggerIncomingMessage(simpleMessage("sent-message-id"));
    expect(connector.lastSentMessage).toMatchObject({
      type: RECEIPT_MESSAGE,
      data: { received: "sent-message-id" }
    });
  });

  it("calls a callback when a message is received", () => {
    const connector = new SimpleConnector();
    const cb = jest.fn();
    connector.sendMessage(simpleMessage("sent-message-id"), cb);
    expect(cb).not.toHaveBeenCalled();
    connector.triggerIncomingMessage(receiptMessage("sent-message-id"));
    expect(cb).toHaveBeenCalled();
  });
});
