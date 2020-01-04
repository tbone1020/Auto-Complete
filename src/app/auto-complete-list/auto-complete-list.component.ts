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
  @Output() selectedWordFromList = new EventEmitter<Object>();
  private cycleCountStartingPoint: number = -1;
  private cycleListCount: number = this.cycleCountStartingPoint;

  constructor() { }

  @HostListener('document:keyup', ['$event'])
  handleArrowAndTabKeyPress(keyPressEvent: KeyboardEvent): void {
    if (this.listOfResults.length > 0 && keyPressEvent.key === "Tab") {
      this.sendIfResultsIsHighlighted();
    } else if (this.listOfResults.length > 0) {
      this.cycleThroughResults(keyPressEvent.key)
    }
  }

  cycleThroughResults(keyPressed: string): void {
    if (keyPressed === "ArrowUp") {
      this.decremenetCycleCount();
    } else if (keyPressed === "ArrowDown") {
      this.incremenetCycleCount();
    }
  }

  decremenetCycleCount(): void {
    this.cycleListCount -= 1;
    if (this.cycleListCount < 0) {
      this.cycleListCount = this.listOfResults.length - 1;
    }
    this.hightlightListIndex();
  }

  incremenetCycleCount(): void {
    this.cycleListCount += 1;
    if (this.cycleListCount > this.listOfResults.length - 1) {
      this.cycleListCount = 0;
    }
    this.hightlightListIndex();
  }

  hightlightListIndex(): void {
    let resultText = this.listOfResults[this.cycleListCount];
    this.listOfResults[this.cycleListCount] = `<div class="current-highlighted-word">${resultText}</div>`;
  }

  sendIfResultsIsHighlighted(): void {
    if (this.cycleListCount !== this.cycleCountStartingPoint) {
      let currentHighlightedTarget = this.listOfResults[this.cycleListCount];
      this.sendCleanSearchResultToInput(currentHighlightedTarget);
    }
  }

  GetClickedResultsValue(inputElement: HTMLElement): void {
    this.sendCleanSearchResultToInput(inputElement.innerHTML);
  }

  sendCleanSearchResultToInput(selectedListElement: string): void {
    let textStrippedOfHTMLTags = this.removeHTMLTagsFromListElement(selectedListElement);
    this.displaySearchResultAndResetCycleCount(textStrippedOfHTMLTags);
  }

  removeHTMLTagsFromListElement(listInnerText: string): string {
    return listInnerText
      .replace('<div class="current-highlighted-word">', '')
      .replace('<strong>', '')
      .replace('</strong>', '')
      .replace('</div>', '');
  }

  displaySearchResultAndResetCycleCount(selectedSearchResult: string): void {
    this.selectedWordFromList.emit({selectedWord: selectedSearchResult});
    this.closeAutoCompleteList();
  }

  closeAutoCompleteList(): void {
    this.cycleListCount = this.cycleCountStartingPoint;
  }
}
