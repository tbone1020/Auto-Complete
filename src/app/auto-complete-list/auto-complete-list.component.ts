import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-auto-complete-list',
  templateUrl: './auto-complete-list.component.html',
  styleUrls: ['./auto-complete-list.component.css']
})
export class AutoCompleteListComponent {
  @Input() listOfResults: string[];

  constructor() {
    this.listOfResults = [];
  }
}
