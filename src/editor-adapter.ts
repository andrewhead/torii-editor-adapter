import { Line, State, Step } from "santoku-store";
import { Message } from "./editor-connector";

type SendMessageHandler = (message: Message) => void;

/**
 * Adapter for sending and receiving messages with a code editor.
 */
export class EditorAdapter {
  constructor(
    state: State,
    sendMessageHandler: SendMessageHandler
  ) {
    this._sendMessageHandler = sendMessageHandler;
  }

  private _sendEvent(message: Message) {
    this._sendMessageHandler(message);
  }

  sendStepAddedEvent(index: number, step: Step, lines: Line[]) {
    this._sendEvent({
      type: "step-added",
      data: {
        index,
        step,
        lines
      }
    });
  }

  notify(message: Message) {
    
  }

  private _sendMessageHandler: SendMessageHandler;
}
