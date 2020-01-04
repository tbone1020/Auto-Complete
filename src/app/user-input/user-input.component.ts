import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { HashingService } from '../services/hashing.service';
import { Letter } from '../models/letter';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})

export class UserInputComponent implements OnInit {
  public letter: Letter = new Letter(null);
  public inputTypedWord: string = "";
  @Output() displayWordList = new EventEmitter<string[]>();
  @ViewChild('treeInput', {static: true}) inputValue: ElementRef;

  constructor(private hash: HashingService) {}

  ngOnInit() {
    this.insertWordIntoTree([..."flights from laguardia to chicago"]);
    this.insertWordIntoTree([..."travel from la to tokyo"]);
  }

  @Input("selectedWordFromList")
  set setInputWord(selectedSearchResult: any) {
    this.inputValue.nativeElement.value = selectedSearchResult.selectedWord;
  }

  searchTreeIfTypedValueIsValid(typedWord: any): void {
    this.inputTypedWord = typedWord.value.toLowerCase();
    if (this.inputTypedWord !== "") {
      this.searchAndDisplayWordList();
    } else {
      this.sendListOfWordsToBeDisplayed([]);
    }
  }

  waitForActionsThenClearResults(): void {
    setTimeout(() => {
      this.sendListOfWordsToBeDisplayed([]);
    }, 150);
  }

  clearInputAndSubmitInput(typedValue: any): void {
    if (typedValue.value !== "") {
      let copyOfWord = typedValue.value.toLowerCase();
      typedValue.value = "";
      this.insertWordIntoTree([...copyOfWord]);
    }
  }

  insertWordIntoTree(inputWordToList: string[]): void {
    let currentBranch = this.letter;
    while (inputWordToList.length) {
      currentBranch = this.insertLetterAndGetNextBranch(inputWordToList, currentBranch);
    }
    currentBranch.isEndOfWord = true;
  }

  insertLetterAndGetNextBranch(inputWordToList, currentBranch): Letter {
    let nextLetter = inputWordToList.shift();
    let lettersHashPosition = this.hash.getLettersHashCode(nextLetter);
    if (!currentBranch.nextLetters[lettersHashPosition]) {
      currentBranch.nextLetters[lettersHashPosition] = new Letter(nextLetter);
    }
    return currentBranch.nextLetters[lettersHashPosition];
  }

  searchAndDisplayWordList(): void {
    const wordConvertedToList = [...this.inputTypedWord];
    const treeLevelToStartAt = this.getStartingPointForWordList(wordConvertedToList);
    if (treeLevelToStartAt) {
      this.getWordListToSend(treeLevelToStartAt);
    } else {
      this.sendListOfWordsToBeDisplayed([]);
    }
  }

  getStartingPointForWordList(wordConvertedToList): Letter {
    let letterTreeLevel = this.letter;
    while (letterTreeLevel && wordConvertedToList.length) {
      let nextLetter = wordConvertedToList.shift();
      letterTreeLevel = this.getNextBranch(nextLetter, letterTreeLevel);
    }
    return letterTreeLevel;
  }

  getNextBranch(nextLetter: string, treeLevel: Letter): Letter {
    let lettersHashPosition = this.hash.getLettersHashCode(nextLetter);
    if (treeLevel.nextLetters[lettersHashPosition]) {
      return treeLevel.nextLetters[lettersHashPosition];
    }
    return null;
  }

  getWordListToSend(treeLevelToStartAt: Letter): void {
    const listOfRetrievedWords = this.searchLetterTreeWithBoldResults(treeLevelToStartAt);
    this.sendListOfWordsToBeDisplayed(listOfRetrievedWords);
  }

  searchLetterTreeWithBoldResults(treeLevel: Letter): string[] {
    const wordsFound = [];
    let typedWordBolded = this.getTypedWordWithStartingBoldTag();
    const traverseTreeLevels = function(currentWordBuild, currentTreeLevel) {
      let wordBeforeNewLetter = currentWordBuild;
      if (currentTreeLevel.isEndOfWord === true) {
        wordsFound.push(`${currentWordBuild}</strong>`);
      }
      for (let i = 0; i < currentTreeLevel.nextLetters.length; i++) {
        currentWordBuild = wordBeforeNewLetter;
        if (currentTreeLevel.nextLetters[i]){
          currentWordBuild += currentTreeLevel.nextLetters[i].letter;
          traverseTreeLevels(currentWordBuild, currentTreeLevel.nextLetters[i]);
        }
      }
    }

    traverseTreeLevels(typedWordBolded, treeLevel);
    return wordsFound;
  }

  getTypedWordWithStartingBoldTag(): string {
    return `${this.inputTypedWord}<strong>`;
  }

  sendListOfWordsToBeDisplayed(listOfWordsToDisplay: string[]): void {
    this.displayWordList.emit(listOfWordsToDisplay)
  }

}
