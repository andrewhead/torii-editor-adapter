import { EditorAdapter } from "./editor-adapter";
import { Message } from "./message";

export type MessageListenerSetup = (handleMessage: (message: Message) => void) => void;

/**
 * Connector that handles communication with a code editor.
 * @param messageListenerSetup custom logic to set up listener for messages from the editor (e.g.,
 * listen to WebSockets). Should decode the message into a 'Message' type, and then
 * call 'handleMessage' with it.
 */
export abstract class EditorConnector {
  constructor(adapter: EditorAdapter, messageListener: MessageListenerSetup) {
    this._editorAdapter = adapter;
    messageListener(this.handleMessage.bind(this));
  }

  handleMessage(message: Message) {
    this._editorAdapter.notify(message);
  }

  /**
   * Custom logic for sending data to the editor (e.g., over WebSockets).
   */
  abstract sendMessage(message: Message): void;

  private _editorAdapter: EditorAdapter;
}
