import type { ActivationFunction } from 'vscode-notebook-renderer';

import {DataTable} from "simple-datatables";
import 'simple-datatables/dist/css/style.css';

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
    const jsonData = data.json();
    console.log("data.json()", jsonData);
    const fields: any[] = jsonData.fields;
    console.log("fields", fields);
    const rows: any[] = jsonData.rows;
    console.log("rows", rows);

    const fieldNames: string[] = fields.map(field => field.name);
    console.log("fieldNames", fieldNames);
    const dataAsArrays = rows.map(row => {
      return fieldNames.map(field => row[field]);
    });

    console.log("dataAsArrays", dataAsArrays);

    
//        "headings": fields,
//"data": dataAsArrays

    new DataTable('#myTable', {
      data: {
        "headings": fieldNames,
        "data": dataAsArrays
        }
    });
  }
});