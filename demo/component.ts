import {Component} from 'angular2/core';

@Component({
	selector: 'app',
	template: `<div>Hello from {{name}}</div>`
})
export class App {
	name: string;
	constructor(){
		this.name = 'Angular2 Electron!';
		
		setTimeout(() => {
			this.name = 'Angular2 Electron!!!';
		},1000);
	}
}
