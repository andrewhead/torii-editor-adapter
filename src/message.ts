import { actions, State } from "torii-store";
import uuidv4 from "uuid/v4";

export const ACTION_MESSAGE = "ACTION";
export const RECEIPT_MESSAGE = "RECEIPT";
export const STATE_UPDATED_MESSAGE = "STATE_UPDATED";
export const EDITOR_REQUEST_MESSAGE = "EDITOR_REQUEST";
export const EMPTY_MESSAGE = "EMPTY";

/**
 * Message sent from Torii to the editor, or vice versa.
 */
export type Message =
  | ActionMessage
  | StateUpdateMessage
  | ReceiptMessage
  | EditorRequestMessage
  | EmptyMessage;

/**
 * Unique ID for a message. Automatically generated.
 */
export type MessageId = string;

/**
 * All messages must minimally have these fields, and should extend 'BaseMessage'.
 * It's assumed that any data placed in the 'data' filed is JSON-serializable.
 */
interface BaseMessage<T> {
  id: MessageId;
  data: T;
  type: string;
}

function messageId(): MessageId {
  return uuidv4();
}

/**
 * A message that indicates that a sent message was received.
 */
export interface ReceiptMessage extends BaseMessage<ReceiptData> {
  type: typeof RECEIPT_MESSAGE;
}

interface ReceiptData {
  received: MessageId;
}

export function receiptMessage(receivedMessageId: MessageId): ReceiptMessage {
  return {
    id: messageId(),
    type: RECEIPT_MESSAGE,
    data: { received: receivedMessageId }
  };
}

/**
 * A message that indicates that the state has changed.
 */
export interface StateUpdateMessage extends BaseMessage<State> {
  type: typeof STATE_UPDATED_MESSAGE;
}

export function stateUpdateMessage(state: State): StateUpdateMessage {
  const minimalState = {
    ...state,
    outputs: { all: [], byId: {} },
    undoable: {
      ...state.undoable,
      past: [],
      future: []
    }
  };
  return {
    id: messageId(),
    type: STATE_UPDATED_MESSAGE,
    data: minimalState
  };
}

/**
 * An editor can submit requests to perform actions on Torii's store. In this case, the data
 * for the message is an action, created using the action creators.
 */
export interface ActionMessage extends BaseMessage<actions.Type.Any> {
  type: typeof ACTION_MESSAGE;
}

export function actionMessage(action: actions.Type.Any): ActionMessage {
  return {
    id: messageId(),
    type: ACTION_MESSAGE,
    data: action
  };
}

/**
 * A message that requests that the editor take action. Used for forwarding UI events in Torii
 * to handlers that make actions or change presentation in the editor.
 */
export interface EditorRequestMessage extends BaseMessage<EditorRequest> {
  type: typeof EDITOR_REQUEST_MESSAGE;
  data: EditorRequest;
}

export function editorRequestMessage(
  request: EditorRequest
): EditorRequestMessage {
  return {
    id: messageId(),
    type: EDITOR_REQUEST_MESSAGE,
    data: request
  };
}

export type EditorRequest = InsertSnippetEditorRequest;

interface InsertSnippetEditorRequest extends BaseEditorRequest<undefined> {
  type: EditorRequestType.INSERT_SNIPPET;
}

export function insertSnippetRequest(): InsertSnippetEditorRequest {
  return {
    type: EditorRequestType.INSERT_SNIPPET,
    data: undefined
  };
}

interface BaseEditorRequest<T> {
  type: EditorRequestType;
  data: T;
}

export enum EditorRequestType {
  INSERT_SNIPPET
}

/**
 * Intended for test purposes only.
 */
export interface EmptyMessage extends BaseMessage<Object> {
  type: typeof EMPTY_MESSAGE;
}

export const requests = {
  insertSnippetRequest
};
