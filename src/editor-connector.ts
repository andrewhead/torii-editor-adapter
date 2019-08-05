import { Message } from "./message";

export type MessageListener = (message: Message) => void;
export type MessageListenerSetup = (handleMessage: (message: Message) => void) => void;
export type Subscription = () => void;

/**
 * Connector that handles communication with a code editor.
 * @param messageListenerSetup custom logic to set up listener for receiving messages from the editor
 * (e.g., listen to WebSockets). Should decode the message into a 'Message' type, and then
 * call 'handleMessage' with it.
 */
export abstract class EditorConnector {
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
   * Custom logic for sending data to the editor (e.g., over WebSockets).
   */
  abstract sendMessage(message: Message): void;

  private _listeners: ((message: Message) => void)[] = [];
}
