import { Message } from "../src/editor-connector";
import { SimpleEditorAdapter } from './test-utils';

describe("EditorAdaptor", () => {
  const saveLastSentMessage = function(message: Message) {
    this._lastSentMessage = message;
  };

  it("sends a message when a step has been added", () => {
    const editorAdapter = new SimpleEditorAdapter(saveLastSentMessage);
    editorAdapter.sendStepAddedEvent(0, { linesAdded: [], linesRemoved: [] }, []);
    expect(editorAdapter.lastSentMessage).toEqual({
      type: 'step-added',
      data: {
        index: 0,
        step: {
          linesAdded: [],
          linesRemoved: [],
        },
        lines: []
      }
    })
  });

  it("changes a line", () => {

  });
});
