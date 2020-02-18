import { Message, MessageId, receiptMessage, RECEIPT_MESSAGE } from "./message";

export type MessageListener = (message: Message) => void;
export type MessageListenerSetup = (
  handleMessage: (message: Message) => void
) => void;
export type Subscription = () => void;

/**
 * Connector that enables communication between editor and Torii. Sends receipts whenever a
 * message that it receives has been handled.
 * @param messageListenerSetup custom logic to set up listener for receiving messages from a sender
 * (e.g., listen to WebSockets, or to a callback from a webview). Should decode the message into
 * a 'Message' type, and then call 'handleMessage' with it.
 */
export abstract class Connector {
  constructor(messageListener: MessageListenerSetup) {
    messageListener(this._handleMessage.bind(this));
  }

  /**
   * Public method for sending a message to a listening connector.
   * @param cb A callback to be called when the message is received. Assumes that the message has
   * been sent to another connector that replies to each message.
   */
  sendMessage(message: Message, cb?: () => {}) {
    if (cb !== undefined) {
      this._callbacks[message.id] = cb;
    }
    this._sendMessage(message);
  }

  /**
   * @returns subscription, which can be called as a function to unsubscribe the listener.
   */
  subscribe(listener: MessageListener): Subscription {
    this._listeners.push(listener);
    return () => {
      const index = this._listeners.indexOf(listener);
      if (index !== -1) {
        this._listeners.splice(index, 1);
      }
    };
  }

  /**
   * Custom logic for sending data to a receiver (e.g., sending to an editor over WebSockets, or
   * sending to Torii through webview functions).
   */
  abstract _sendMessage(message: Message): void;

  protected _handleMessage(message: Message) {
    for (const listener of this._listeners) {
      listener(message);
    }
    if (message.type === RECEIPT_MESSAGE) {
      const receivedMessageId = message.data.received;
      if (this._callbacks[receivedMessageId] !== undefined) {
        this._callbacks[receivedMessageId]();
        this._callbacks[receivedMessageId] = undefined;
      }
    } else {
      this._sendReceiptMessage(message.id);
    }
  }

  _sendReceiptMessage(receivedMessageId: MessageId) {
    this._sendMessage(receiptMessage(receivedMessageId));
  }

  abstract type: string;
  private _callbacks: { [messageId: string]: () => {} } = {};
  private _listeners: ((message: Message) => void)[] = [];
}

export const EDITOR_CONNECTOR = "EDITOR_CONNECTOR";
export const TORII_CONNECTOR = "TORII_CONNECTOR";

/**
 * A connector that communicates with an editor from Torii.
 */
export abstract class EditorConnector extends Connector {
  type: typeof EDITOR_CONNECTOR;
}

/**
 * A connector that communicates with Torii from an editor.
 */
export abstract class ToriiConnector extends Connector {
  type: typeof TORII_CONNECTOR;
}
