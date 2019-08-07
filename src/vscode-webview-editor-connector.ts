import { WebSocketsEditorConnector } from "./websockets-editor-connector";
import { Message } from "./message";

/**
 * Type declaration of VS Code API embedded in a webview's HTML. See
 * https://code.visualstudio.com/api/extension-guides/webview#passing-messages-from-a-webview-to-an-extension
 */
interface VsCodeApi {
  postMessage: (data: any) => {}
}

export class VsCodeWebviewEditorConnector extends WebSocketsEditorConnector {

  constructor(vsCodeApi: VsCodeApi) {
    /**
     * The target origin doesn't matter, as this connector won't be sending messages through web
     * sockets. It will only be receiving messages over web sockets.
     */
    super("");
    this._vsCodeApi = vsCodeApi;
  }

  _sendMessage(message: Message) {
    this._vsCodeApi.postMessage(message);
  }

  private _vsCodeApi: VsCodeApi;
}