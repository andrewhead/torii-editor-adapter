import _ from "lodash";
import { Store } from "redux";
import { EditorConnector } from "./connector";
import {
  ACTION_MESSAGE,
  EditorRequest,
  editorRequestMessage,
  Message,
  stateUpdateMessage
} from "./message";

/**
 * Adapter for sending and receiving messages with a code editor. Receives messages and converts
 * them into changes in Santoku's state. Reports changes to Santoku's state.
 */
export class EditorAdapter {
  /**
   * @param connector Connector that sends messages to and receives messages from the editor.
   */
  constructor(store: Store, connector: EditorConnector) {
    this._store = store;
    this._store.subscribe(this._reportStateUpdate.bind(this));
    this._connector = connector;
    this._connector.subscribe(this._onMessageReceived.bind(this));
    this._throttledSendMessage = _.throttle(
      this._connector._sendMessage.bind(this._connector),
      100
    );
  }

  /**
   * Request that the editor takes an action.
   */
  request(request: EditorRequest) {
    this._connector.sendMessage(editorRequestMessage(request));
  }

  private _reportStateUpdate() {
    this._throttledSendMessage(stateUpdateMessage(this._store.getState()));
  }

  /**
   * Called when a message has been received from the editor.
   */
  _onMessageReceived(message: Message) {
    if (message.type === ACTION_MESSAGE) {
      this._store.dispatch(message.data);
    }
  }

  private _throttledSendMessage: (message: Message) => void;
  private _store: Store;
  private _connector: EditorConnector;
}
