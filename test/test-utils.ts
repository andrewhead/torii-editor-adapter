import { Store } from "redux";
import configureStore from 'redux-mock-store';
import { EditorAdapter } from "../src/editor-adapter";
import { Message } from "../src/message";

export class SimpleEditorAdapter extends EditorAdapter {

  constructor(store?: Store) {
    store = store || configureStore([])({});
    super(store, (message: Message) => {
      this._lastSentMessage = message;
    });
  }

  notify(message: Message) {
    super.notify(message);
    this._lastReceivedMessage = message;
  }

  get lastReceivedMessage(): Message {
    return this._lastReceivedMessage;
  }

  get lastSentMessage(): Message {
    return this._lastSentMessage;
  }

  private _lastSentMessage: Message;
  private _lastReceivedMessage: Message;
}
