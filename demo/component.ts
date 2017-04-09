import {Component} from 'angular2/core';

@Component({
	selector: 'app',
	template: `<div>Hello from {{name}} {{id}}</div>`
})

export class App {
	name: string;
	id: string;

	constructor(){
		this.name = 'Angular2 Electron!';
    this.id = "Good to see you";
		setTimeout(() => {
			this.name = 'Angular2 Electron!!!';
		},1000);
	}
}
