import { Store } from "redux";
import { EditorConnector } from "./connector";
import { ACTION_MESSAGE, Message, stateUpdateMessage } from "./message";

/**
 * Adapter for sending and receiving messages with a code editor. Receives messages and converts
 * them into changes in Santoku's state. Reports changes to Santoku's state.
 */
export class EditorAdapter {
  /**
   * @param connector Connector that sends messages to and receives messages from the editor.
   */
  constructor(
    store: Store,
    connector: EditorConnector
  ) {
    this._store = store;
    this._store.subscribe(this._reportStateUpdate.bind(this));
    this._connector = connector;
    this._connector.subscribe(this._onMessageReceived.bind(this));
  }

  private _reportStateUpdate() {
    this._sendEvent(stateUpdateMessage(this._store.getState()));
  }

  private _sendEvent(message: Message) {
    this._connector.sendMessage(message);
  }

  /**
   * Called when a message has been received from the editor.
   */
  _onMessageReceived(message: Message) {
    if (message.type === ACTION_MESSAGE) {
      this._store.dispatch(message.data);
    }
  }

  private _store: Store;
  private _connector: EditorConnector;
}
