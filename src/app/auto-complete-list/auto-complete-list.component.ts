import { Component, Input, Output, EventEmitter, HostListener, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-auto-complete-list',
  templateUrl: './auto-complete-list.component.html',
  styleUrls: ['./auto-complete-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AutoCompleteListComponent {
  @Input() listOfResults: string[] = [];
  @Input() selectedWord: string;
  @Output() selectedWordChange = new EventEmitter<string>();
  cycleListCount: number = -1;

  constructor() { }

  @HostListener('document:keyup', ['$event'])
  HandleArrowAndTabKeyPress(keyPressEvent: KeyboardEvent): void {
    if (this.listOfResults.length > 0) {
      this.CycleThroughResults(keyPressEvent.key)
    }
  }

  CycleThroughResults(keyPressKey: string): void {
    if (keyPressKey === "ArrowUp") {
      this.DecremenetCycleCount();
    } else if (keyPressKey === "ArrowDown") {
      this.IncremenetCycleCount();
    } else if (keyPressKey === "Tab") {
      this.SendIfResultsIsHighlighted();
    }
  }

  DecremenetCycleCount(): void {
    this.cycleListCount -= 1;
    if (this.cycleListCount < 0) {
      this.cycleListCount = this.listOfResults.length - 1;
    }
    this.HightlightListIndex();
  }

  IncremenetCycleCount(): void {
    this.cycleListCount += 1;
    if (this.cycleListCount > this.listOfResults.length - 1) {
      this.cycleListCount = 0;
    }
    this.HightlightListIndex();
  }

  HightlightListIndex(): void {
    let resultText = this.listOfResults[this.cycleListCount];
    this.listOfResults[this.cycleListCount] = `<div class="current-highlighted-word">${resultText}</div>`;
  }

  SendIfResultsIsHighlighted(): void {
    let currentHighlightedTarget = this.listOfResults[this.cycleListCount];
    if (this.cycleListCount !== -1) {
      this.RemoveHTMLTagsAndSendToInput(currentHighlightedTarget);
    }
  }

  GetClickedResultsValue(inputElement: HTMLElement): void {
    this.RemoveHTMLTagsAndSendToInput(inputElement.innerHTML);
  }

  RemoveHTMLTagsAndSendToInput(selectedListElement: string): void {
    let textStrippedOfHTMLTags = this.RemoveHTMLTagsFromListElement(selectedListElement);
    this.SendWordToDisplayInInput(textStrippedOfHTMLTags);
  }

  RemoveHTMLTagsFromListElement(listInnerText: string): string {
    return listInnerText
      .replace('<div class="current-highlighted-word">', '')
      .replace('</div>', '')
      .replace('<strong>', '')
      .replace('</strong>', '');
  }

  SendWordToDisplayInInput(selectedWord: string): void {
    this.selectedWordChange.emit(selectedWord);
    this.CloseAutoCompleteList();
  }

  CloseAutoCompleteList(): void {
    this.listOfResults = [];
    this.cycleListCount = -1;
  }
}
