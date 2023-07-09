import type { ActivationFunction } from 'vscode-notebook-renderer';

import {DataTable} from "simple-datatables";
import 'simple-datatables/dist/css/style.css';

// import React from 'react';
// import ReactDOM from 'react-dom';
// //import { h, render, FunctionComponent } from 'preact';

// const TableRenderer: FunctionComponent<{ data }> = ({data}) => {
//   return h('div', null, JSON.stringify(data.json()));
// };

function renderTable(container: HTMLElement, fieldNames: string[], rows: string[][]): HTMLTableElement{
  container.innerHTML = '';
  const table: HTMLTableElement = document.createElement('table');
  table.setAttribute('id', 'myTable');
	const headerRow = document.createElement('tr');

	fieldNames.forEach(label => {
		const header = document.createElement('th');
		header.textContent = label;
		headerRow.appendChild(header);
	});

  table.appendChild(headerRow);

  rows.forEach(item => {
    const row = document.createElement('tr');
    item.forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });
    table.appendChild(row);
  });

  container.appendChild(table);
  return table;
}

function addTable(container: HTMLElement) {
  // container.innerHTML = `<table class="table table-striped table-bordered" id="myTable">
  //   <thead>
  //     <tr>
  //       <th>Issue</th>
  //       <th>Description</th>
  //     </tr>
  //   </thead>
  //   <tbody>
  //     <tr>
  //       <td>Issue 1</td>
  //       <td>Description 1</td>
  //     </tr>
  //     </tbody>
  // </table>`;
  container.innerHTML = `<table class="table table-striped table-bordered" id="myTable">
    <thead>
      <tr>
        <th>Issue</th>
        <th>Description</th>
      </tr>
    </thead>
  </table>`;
}

export const activate: ActivationFunction = context => ({
  renderOutputItem(data, element) {
    //render(<TableRenderer data={data} />, element);
    //element.innerText = JSON.stringify(data.json());
    
    const jsonData = data.json();
    const fields: any[] = jsonData.fields;
    const rows: any[] = jsonData.rows;

    const fieldNames: string[] = fields.map(field => field.name);
    const dataAsArrays = rows.map(row => {
      return fieldNames.map(field => row[field]);
    });
    // const tableElem: HTMLTableElement = renderTable(element, fieldNames, dataAsArrays);
    element.innerHTML = '';
    const tableElem: HTMLTableElement = document.createElement('table');
    element.appendChild(tableElem);


    
//        "headings": fields,
//"data": dataAsArrays

    const simpleTable = new DataTable(tableElem, {
       data: {
         "headings": fieldNames,
         "data": dataAsArrays
         }
     });
  }
});