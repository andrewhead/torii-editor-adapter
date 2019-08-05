import { Store } from "redux";
import { ACTION_MESSAGE, Message, stateUpdateMessage } from "./message";

type SendMessageHandler = (message: Message) => void;

/**
 * Adapter for sending and receiving messages with a code editor. Receives messages and converts
 * them into changes in Santoku's state. Reports changes to Santoku's state.
 */
export class EditorAdapter {
  constructor(
    store: Store,
    sendMessageHandler: SendMessageHandler
  ) {
    this._store = store;
    this._store.subscribe(this._reportStateUpdate.bind(this))
    this._sendMessageHandler = sendMessageHandler;
  }

  private _reportStateUpdate() {
    this._sendEvent(stateUpdateMessage(this._store.getState()));
  }

  private _sendEvent(message: Message) {
    this._sendMessageHandler(message);
  }

  /**
   * Called when a message has been received from the editor.
   */
  notify(message: Message) {
    if (message.type === ACTION_MESSAGE) {
      this._store.dispatch(message.data);
    }
  }

  private _store: Store;
  private _sendMessageHandler: SendMessageHandler;
}
