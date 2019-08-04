import { EditorConnector, Message, MessageListenerSetup } from "../src/editor-connector";
import { SimpleEditorAdapter } from "./test-utils";
import { EditorAdapter } from "../src/editor-adapter";

class SimpleNotifier {
  onNotification(handler: () => void) {
    this._handler = handler;
  }

  triggerNotification() {
    this._handler();
  }

  private _handler: () => void;
}

class SimpleListeningEditorConnector extends EditorConnector {
  constructor(editorAdapter: EditorAdapter, listenerSetup: MessageListenerSetup) {
    super(editorAdapter, listenerSetup);
  }

  sendMessage(_: Message) {}
}

describe("EditorConnector", () => {
  it("it forwards messages from the listener to the handler", () => {
    const adapter = new SimpleEditorAdapter();
    const notifier = new SimpleNotifier();
    const listenerSetup: MessageListenerSetup = function (handleMessage) {
      notifier.onNotification(() => { handleMessage({ type: "type", data: {} }) })
    }
    new SimpleListeningEditorConnector(adapter, listenerSetup);
    notifier.triggerNotification();
    expect(adapter.lastReceivedMessage).toEqual({ type: "type", data: {} });
  });
});
