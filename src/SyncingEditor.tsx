import React, { useState, useRef, useEffect } from 'react'
import { Editor } from 'slate-react'
import Mitt from 'mitt';
import { initialValue } from './slateInitialValue';

interface Props {

}

const emitter = new Mitt();

export const SyncingEditor: React.FC<Props> = () => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    emitter.on('*', () => {
      console.log("change happened")
    });
  }, [])

  return <Editor value={value} onChange={(opts: any) => {
    setValue(opts.value)

    const ops = opts.operations
      .filter((o: any) => {
        if (o) {
          return (
            o.type !== 'set_selection' &&
            o.type !== 'set_value' &&
            (!o.data || !o.data.has('source'))
          )
        }

        return false;
      }
      )
      .toJS()
      .map((o: any) => ({ ...o, data: { source: "one" } }))

    if (ops.length) {
      emitter.emit('something', ops)
    }
  }}
  />
}