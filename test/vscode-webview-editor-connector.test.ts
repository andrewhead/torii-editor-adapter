import { VsCodeWebviewEditorConnector } from "../src/vscode-webview-editor-connector";
import { simpleMessage } from "./test-utils";

describe("VsCodeWebviewEditorConnector", () => {
  it("sends a message to VS Code", () => {
    const vsCodeApi = {
      postMessage: jest.fn()
    }
    const connector = new VsCodeWebviewEditorConnector(vsCodeApi);
    const message = simpleMessage("message-id");
    connector.sendMessage(simpleMessage("message-id"));
    expect(vsCodeApi.postMessage).toBeCalledWith(message);
  });
});