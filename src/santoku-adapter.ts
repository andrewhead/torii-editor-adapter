import { actions, State } from "santoku-store";
import { SantokuConnector } from "./connector";
import { ACTION_MESSAGE, Message, STATE_UPDATED_MESSAGE, actionMessage } from "./message";

export type StateChangeListener = (state: State) => void;

/**
 * Adapter for sending and receiving messages with Santoku. Receives messages and packages them
 * into an updated state for an editor to render. Reports actions from the editor.
 */
export class SantokuAdapter {
  /**
   * @param connector Connector that sends messages to and receives messages from Santoku.
   */
  constructor(connector: SantokuConnector) {
    this._connector = connector;
    this._connector.subscribe(this._onMessageReceived.bind(this));
  }

  dispatch(action: actions.Type.Any, cb?: () => {}) {
    this._connector.sendMessage(actionMessage(action), cb);
  }

  addStateChangeListener(listener: StateChangeListener) {
    this._stateChangeListeners.push(listener);
  }

  removeStateChangeListener(listener: StateChangeListener) {
    const index = this._stateChangeListeners.indexOf(listener);
    if (index !== -1) {
      this._stateChangeListeners.splice(index, 1);
    }
  }

  _onMessageReceived(message: Message) {
    if (message.type === STATE_UPDATED_MESSAGE) {
      for (const listener of this._stateChangeListeners) {
        listener(message.data);
      }
    }
  }

  private _stateChangeListeners: StateChangeListener[] = [];
  private _connector: SantokuConnector;
}
