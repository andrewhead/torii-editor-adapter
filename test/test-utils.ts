import { Store } from "redux";
import configureStore from 'redux-mock-store';
import { EditorAdapter } from "../src/editor-adapter";
import { EditorConnector, MessageListenerSetup, Connector, EDITOR_CONNECTOR } from "../src/connector";
import { Message } from "../src/message";

abstract class TestConnector extends Connector {
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

export class SimpleConnector extends TestConnector {
  type: "SIMPLE_CONNECTOR";
}

export class SimpleEditorConnector extends TestConnector {
  type: typeof EDITOR_CONNECTOR;
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
