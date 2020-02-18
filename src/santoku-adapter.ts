import _ from "lodash";
import { actions, isOutputAction, State } from "torii-store";
import { SantokuConnector } from "./connector";
import {
  actionMessage,
  EditorRequest,
  EDITOR_REQUEST_MESSAGE,
  Message,
  STATE_UPDATED_MESSAGE
} from "./message";

export type StateChangeListener = (state: State) => void;
export type RequestListener = (request: EditorRequest) => void;

/**
 * Adapter for sending and receiving messages with Santoku. Receives messages and packages them
 * into an updated state for an editor to render. Reports actions from the editor.
 *
 * The SantokuAdapter is primarily a waypoint for accessing the Santoku Redux store. The API for
 * the adapter, once initialized, is the same as the Redux store API (for example, with
 * 'dispatch', 'subscribe', and 'getState()).
 *
 * The adapter is also responsible for listening for requests that the editor takes action.
 * Santoku offers user interface affordances that can only be provided with help from the editor.
 * An editor that connects to Santoku should be ready to respond to all of the requests defined
 * as 'EditorRequest' types in 'message.ts'.
 */
export class SantokuAdapter {
  /**
   * @param connector Connector that sends messages to and receives messages from Santoku.
   */
  constructor(connector: SantokuConnector) {
    this._connector = connector;
    this._connector.subscribe(this._onMessageReceived.bind(this));
    this._dispatchOutputActions = _.throttle(function() {
      if (this._outputActions.length > 0) {
        const action = actions.outputs.applyUpdates(...this._outputActions);
        this._outputActions = [];
        this._connector.sendMessage(actionMessage(action));
      }
    }, 500);
  }

  dispatch(action: actions.Type.Any, cb?: () => {}) {
    if (isOutputAction(action)) {
      this._dispatchOutputAction(action);
    } else {
      this._connector.sendMessage(actionMessage(action), cb);
    }
  }

  private _dispatchOutputAction(action: actions.Type.Outputs) {
    this._outputActions.push(action);
    this._dispatchOutputActions();
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

  onRequestReceived(listener: RequestListener) {
    this._requestListeners.push(listener);
    return () => {
      const index = this._requestListeners.indexOf(listener);
      if (index !== -1) {
        this._requestListeners.splice(index, 1);
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
    } else if (message.type === EDITOR_REQUEST_MESSAGE) {
      const request = message.data;
      for (const listener of this._requestListeners) {
        listener(request);
      }
    }
  }

  private _state: State | undefined;
  private _stateChangeListeners: StateChangeListener[] = [];
  private _requestListeners: RequestListener[] = [];
  private _outputActions: actions.Type.Outputs[] = [];
  private _dispatchOutputActions;
  private _connector: SantokuConnector;
}
