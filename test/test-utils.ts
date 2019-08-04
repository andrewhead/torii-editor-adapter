import { State } from "santoku-store";
import { EditorAdapter } from "../src/editor-adapter";
import { Message } from "../src/editor-connector";

export class SimpleEditorAdapter extends EditorAdapter {

  constructor(sendMessageHandler?: (message: Message) => void) {
    super(emptyStore, sendMessageHandler);
  }

  notify(message: Message) {
    this._lastReceivedMessage = message;
  }

  get lastReceivedMessage(): Message {
    return this._lastReceivedMessage;
  }

  get lastSentMessage(): Message {
    return this._lastSentMessage;
  }

  private _lastSentMessage: Message;
  private _lastReceivedMessage: Message;
}

const emptyStore: State = {
  lineVersions: {
    allLineVersions: [],
    byId: {}
  },
  lines: {
    allLines: [],
    byId: {}
  },
  steps: {
    allSteps: [],
    byId: {}
  }
};