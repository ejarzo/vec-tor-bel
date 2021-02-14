import React, { Component } from 'react';

import DatGui, {
  DatBoolean,
  DatColor,
  DatNumber,
  DatString,
} from 'react-dat-gui';

import 'react-dat-gui/build/react-dat-gui.css';

class Controls extends Component {
  render() {
    const { data, handleUpdate } = this.props;

    return (
      <div>
        <DatGui data={data} onUpdate={handleUpdate}>
          <DatBoolean path="runIndefinitely" label="runIndefinitely" />
          <DatBoolean path="showGraph" label="showGraph" />
          <DatBoolean path="showVideo" label="showVideo" />
          <DatBoolean path="showTreemap" label="showTreemap" />
        </DatGui>
      </div>
    );
  }
}

export default Controls;
