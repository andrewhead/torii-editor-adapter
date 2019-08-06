import { Message } from "./message";

export type MessageListener = (message: Message) => void;
export type MessageListenerSetup = (handleMessage: (message: Message) => void) => void;
export type Subscription = () => void;

/**
 * Connector that enables communication between editor and Santoku.
 * @param messageListenerSetup custom logic to set up listener for receiving messages from a sender
 * (e.g., listen to WebSockets, or to a callback from a webview). Should decode the message into
 * a 'Message' type, and then call 'handleMessage' with it.
 */
export abstract class Connector {
  constructor(messageListener: MessageListenerSetup) {
    messageListener(this._handleMessage.bind(this));
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

  protected _handleMessage(message: Message) {
    for (const listener of this._listeners) {
      listener(message);
    }
  }

  /**
   * Custom logic for sending data to a receiver (e.g., sending to an editor over WebSockets, or
   * sending to Santoku through webview functions).
   */
  abstract sendMessage(message: Message): void;

  abstract type: string;
  private _listeners: ((message: Message) => void)[] = [];
}

export const EDITOR_CONNECTOR = "EDITOR_CONNECTOR";
export const SANTOKU_CONNECTOR = "SANTOKU_CONNECTOR";

/**
 * A connector that communicates with an editor from Santoku.
 */
export abstract class EditorConnector extends Connector {
  type: typeof EDITOR_CONNECTOR;
}

/**
 * A connector that communicates with Santoku from an editor.
 */
export abstract class SantokuConnector extends Connector {
  type: typeof SANTOKU_CONNECTOR;
}