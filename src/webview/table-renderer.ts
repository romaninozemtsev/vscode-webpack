import type { ActivationFunction } from 'vscode-notebook-renderer';
// import React from 'react';
// import ReactDOM from 'react-dom';
// //import { h, render, FunctionComponent } from 'preact';

// const TableRenderer: FunctionComponent<{ data }> = ({data}) => {
//   return h('div', null, JSON.stringify(data.json()));
// };

export const activate: ActivationFunction = context => ({
  renderOutputItem(data, element) {
    //render(<TableRenderer data={data} />, element);
    element.innerText = JSON.stringify(data.json());
  }
});