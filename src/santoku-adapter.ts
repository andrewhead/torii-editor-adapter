import { actions, State } from "santoku-store";
import { SantokuConnector } from "./connector";
import { actionMessage, Message, STATE_UPDATED_MESSAGE } from "./message";

export type StateChangeListener = (state: State) => void;

/**
 * Adapter for sending and receiving messages with Santoku. Receives messages and packages them
 * into an updated state for an editor to render. Reports actions from the editor.
 *
 * The SantokuAdapter is just a waypoint for accessing the Santoku Redux store. The API for
 * the adapter, once initialized, is the same as the Redux store API (for example, with
 * 'dispatch', 'subscribe', and 'getState()).
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

  subscribe(listener: StateChangeListener) {
    this._stateChangeListeners.push(listener);
    return () => {
      const index = this._stateChangeListeners.indexOf(listener);
      if (index !== -1) {
        this._stateChangeListeners.splice(index, 1);
      }
    };
  }

  getState(): State | undefined {
    return this._state;
  }

  _onMessageReceived(message: Message) {
    if (message.type === STATE_UPDATED_MESSAGE) {
      this._state = message.data;
      for (const listener of this._stateChangeListeners) {
        listener(message.data);
      }
    }
  }

  private _state: State | undefined;
  private _stateChangeListeners: StateChangeListener[] = [];
  private _connector: SantokuConnector;
}
