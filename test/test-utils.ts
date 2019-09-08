import { Store } from "redux";
import configureStore from "redux-mock-store";
import { actions, SourcedRange, SourceType } from "santoku-store";
import {
  Connector,
  EditorConnector,
  EDITOR_CONNECTOR,
  MessageListenerSetup,
  SANTOKU_CONNECTOR
} from "../src/connector";
import { EditorAdapter } from "../src/editor-adapter";
import { EMPTY_MESSAGE, Message, MessageId } from "../src/message";

export function simpleAction() {
  const range = {
    start: { line: 1, character: 0 },
    end: { line: 1, character: 1 },
    path: "file-path",
    relativeTo: { source: SourceType.REFERENCE_IMPLEMENTATION }
  } as SourcedRange;
  return actions.code.edit(range, "Updated text");
}

export function simpleMessage(messageId: MessageId): Message {
  return { id: messageId, type: EMPTY_MESSAGE, data: {} };
}

abstract class TestConnector extends Connector {
  constructor(listenerSetup?: MessageListenerSetup) {
    super(listenerSetup || (() => {}));
    this.triggerIncomingMessage = message => {
      this._handleMessage(message);
    };
  }

  get lastSentMessage(): Message {
    return this._lastSentMessage;
  }

  _sendMessage(message: Message) {
    this._lastSentMessage = message;
  }

  triggerIncomingMessage: (message: Message) => void;
  private _lastSentMessage: Message;
}

export class SimpleConnector extends TestConnector {
  type: "SIMPLE_CONNECTOR";
}

export class SimpleEditorConnector extends TestConnector {
  type: typeof EDITOR_CONNECTOR;
}

export class SimpleSantokuConnector extends TestConnector {
  type: typeof SANTOKU_CONNECTOR;
}

export class SimpleEditorAdapter extends EditorAdapter {
  constructor(store?: Store, connector?: EditorConnector) {
    store = store || configureStore([])({});
    super(store, connector || new SimpleEditorConnector());
  }

  _onMessageReceived(message: Message) {
    super._onMessageReceived(message);
    this._lastReceivedMessage = message;
  }

  get lastReceivedMessage(): Message {
    return this._lastReceivedMessage;
  }

  private _lastReceivedMessage: Message;
}
