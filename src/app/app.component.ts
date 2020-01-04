import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public autoCompleteResults: string[] = [];
  public selectedWordFromList: Object = { selectedWord: '' };

  sendWordListToDisplay(stringForList: string[]): void {
    this.autoCompleteResults = stringForList;
  }

  sendWordToDisplayInInput(stringForInput: Object): void {
    this.selectedWordFromList = stringForInput;
  }
}
