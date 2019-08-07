import { actions, State } from "santoku-store";
import uuidv4 from "uuid/v4";


export const ACTION_MESSAGE = "ACTION";
export const RECEIPT_MESSAGE = "RECEIPT"
export const STATE_UPDATED_MESSAGE = "STATE_UPDATED";

/**
 * Unique ID for a message. Automatically generated.
 */
export type MessageId = string;

/**
 * Message sent from Santoku to the editor, or vice versa.
 * It's assumed that any data placed in the 'data' filed is JSON-serializable.
 */
export interface Message {
  id: MessageId;
  data: any;
  type: string;
}

function messageId(): MessageId {
  return uuidv4();
}

/**
 * A message that indicates that a sent message was received.
 */
export interface ReceiptMessage extends Message {
  type: typeof RECEIPT_MESSAGE;
  data: { received: MessageId };
}

export function receiptMessage(receivedMessageId: MessageId): ReceiptMessage {
  return {
    id: messageId(),
    type: RECEIPT_MESSAGE,
    data: { received: receivedMessageId }
  }
}

export interface StateUpdateMessage extends Message {
  type: typeof STATE_UPDATED_MESSAGE;
  data: State;
}

export function stateUpdateMessage(state: State): StateUpdateMessage {
  return {
    id: messageId(),
    type: STATE_UPDATED_MESSAGE,
    data: state
  };
}

/**
 * An editor can submit requests to perform actions on Santoku's store. In this case, the data
 * for the message is an action, created using the action creators.
 */
export interface ActionMessage extends Message {
  type: typeof ACTION_MESSAGE;
  data: actions.Type.Any;
}

export function actionMessage(action: actions.Type.Any): ActionMessage {
  return {
    id: messageId(),
    type: ACTION_MESSAGE,
    data: action
  };
}
