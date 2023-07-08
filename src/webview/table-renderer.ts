import type { ActivationFunction } from 'vscode-notebook-renderer';

import {DataTable} from "simple-datatables";


// import React from 'react';
// import ReactDOM from 'react-dom';
// //import { h, render, FunctionComponent } from 'preact';

// const TableRenderer: FunctionComponent<{ data }> = ({data}) => {
//   return h('div', null, JSON.stringify(data.json()));
// };

// function renderTable(container: HTMLElement, value: any) {
//   const table = document.createElement('table');
// 	table.className = 'issues-list';
// 	const headerRow = document.createElement('tr');
// 	const tableHeaders = ['Issue', 'Description'];

// 	tableHeaders.forEach(label => {
// 		const header = document.createElement('th');
// 		header.textContent = label;
// 		headerRow.appendChild(header);
// 	});

// 	table.appendChild(headerRow);

// 	value.forEach(item => {
// 		const row = document.createElement('tr');

// 		const title = document.createElement('td');
// 		const link = document.createElement('a');
// 		link.href = item.url;
// 		link.textContent = item.title;
// 		title.appendChild(link);
// 		row.appendChild(title);

// 		const body = document.createElement('td');
// 		body.textContent = item.body;
// 		row.appendChild(body);

// 		table.appendChild(row);
// 	});

// 	container.appendChild(table);
// }

function addTable(container: HTMLElement, value: any) {
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
  container.innerHTML = `<table class="table table-striped table-bordered" id="myTable"></table>`;
}

export const activate: ActivationFunction = context => ({
  renderOutputItem(data, element) {
    //render(<TableRenderer data={data} />, element);
    //element.innerText = JSON.stringify(data.json());
    addTable(element, data);
    console.log("data.json()", data.json());
    new DataTable('#myTable', {
      data: {
        "headings": ["Name", "Ext.", "City", "Start Date", "Completion"],
        "data": [
            [
                "Unity Pugh",
                9958, "Curicó", "2005/02/11", "37%"
            ],
            [
                "Theodore Duran",
                8971, "Dhanbad", "1999/04/07", "97%"
            ],
          ]
        }
    });
  }
});