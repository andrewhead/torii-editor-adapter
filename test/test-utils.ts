import { Store } from "redux";
import configureStore from 'redux-mock-store';
import { EditorAdapter } from "../src/editor-adapter";
import { Message } from "../src/message";
import { EditorConnector } from "../src/editor-connector";
import { MessageListenerSetup } from "../src/editor-connector";

export class SimpleEditorConnector extends EditorConnector {
  constructor(listenerSetup?: MessageListenerSetup) {
    super(listenerSetup || (() => {}));
    this.triggerIncomingMessage = (message) => {
      this._handleMessage(message);
    }
  }

  get lastSentMessage(): Message {
    return this._lastSentMessage;
  }

  sendMessage(message: Message) {
    this._lastSentMessage = message;
  }

  triggerIncomingMessage: (message: Message) => void;
  private _lastSentMessage: Message;
}

export class SimpleEditorAdapter extends EditorAdapter {

  constructor(store?: Store, connector?: EditorConnector) {
    store = store || configureStore([])({});
    super(store, connector || new SimpleEditorConnector());
  }

  _onMessageReceived(message: Message) {
    super._onMessageReceived(message);
    this._lastReceivedMessage = message;
  }

  get lastReceivedMessage(): Message {
    return this._lastReceivedMessage;
  }

  private _lastReceivedMessage: Message;
}
