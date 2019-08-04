import { EditorConnector, Message } from "./editor-connector";
import { EditorAdapter } from "./editor-adapter";

const setupWebSocketsListener = (handleMessage: (message: Message) => void) => {
  window.addEventListener("message", (event) => {
    const message = event.data as Message;
    handleMessage(message);
  });
};

export class WebSocketsEditorConnector extends EditorConnector {
  /**
   * @param targetOrigin origin of the site to which a message will be dispatched. Only specify
   * '*' (all targets) if you have control over the environment in which Santoku is getting run
   * (i.e. it's getting run in an IDE, not a browser. See the targetOrigin parameter description on
   * MDN https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
   */
  constructor(editorAdapter: EditorAdapter, targetOrigin: string) {
    super(editorAdapter, setupWebSocketsListener);
    this._targetOrigin = targetOrigin;
  }

  sendMessage(message: Message) {
    if (window !== undefined) {
      window.postMessage(message, this._targetOrigin);
    } else {
      throw new ReferenceError(
        "'window' not defined. This connector is designed to be run in a web application that has access to the 'window' variable."
      );
    }
  }

  private _targetOrigin: string;
}
