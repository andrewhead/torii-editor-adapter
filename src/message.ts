import { actions, State } from "santoku-store";

export const ACTION_MESSAGE = "ACTION";
export const STATE_UPDATED_MESSAGE = "STATE_UPDATED";

/**
 * Message sent from Santoku to the editor, or vice versa.
 * It's assumed that any data placed in the 'data' filed is JSON-serializable.
 */
export interface Message {
  type: string;
  data: any;
}

export interface StateUpdateMessage {
  type: typeof STATE_UPDATED_MESSAGE;
  data: State;
}

export function stateUpdateMessage(state: State) {
  return {
    type: STATE_UPDATED_MESSAGE,
    data: state
  }
}

/**
 * An editor can submit requests to perform actions on Santoku's store. In this case, the data
 * for the message is an action, created using the action creators.
 */
export interface ActionMessage extends Message {
  type: typeof ACTION_MESSAGE;
  data: actions.Type.All;
}