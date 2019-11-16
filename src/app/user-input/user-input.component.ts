import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HashingService } from '../services/hashing.service';
import { Letter } from '../models/letter';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})

export class UserInputComponent {
  public letter: Letter = new Letter(null);
  public inputTypedWord: string[] = [];
  @Input() listOfResults: string[];
  @Output() listOfResultsChange = new EventEmitter<string[]>();

  constructor(private hash: HashingService) { }

  CheckKeyPressInput(keyValue: any): void {
    let isValidKey = this.CheckForInvalidKey(keyValue.key);
    if(keyValue.key === "Enter") {
      this.InsertWordIntoTree();
    } else if (isValidKey) {
      this.inputTypedWord = keyValue.target.value.toLowerCase().split('');
      this.SearchAndDisplayWordList();
    }
  }

  CheckForInvalidKey(keyInput: string): boolean {
    return ["Shift", "CapsLock", "Control", "Alt", "Meta"].indexOf(keyInput) === -1;
  }

  InsertWordIntoTree(): void {
    const inputWordCopy = [...this.inputTypedWord];
    let currentBranch = this.letter;
    while (inputWordCopy.length) {
      currentBranch = this.InsertLetterOrGetNextBranch(inputWordCopy, currentBranch);
    }
    currentBranch.isEndOfWord = true;
  }

  InsertLetterOrGetNextBranch(inputWordCopy, currentBranch) {
    let nextLetter = inputWordCopy.shift();
    let lettersHashPosition = this.hash.getLettersHashCode(nextLetter);
    if (!currentBranch.nextLetters[lettersHashPosition]) {
      currentBranch.nextLetters[lettersHashPosition] = new Letter(nextLetter);
    }
    return currentBranch.nextLetters[lettersHashPosition];
  }

  SearchAndDisplayWordList(): void {
    const copyOfInputWOrd = [...this.inputTypedWord];
    const treeLevelToStartAt = this.GetStartingPointForWordList(copyOfInputWOrd, this.letter);
    const listOfWordsToDisplay = this.GrabRestOfWordList(this.inputTypedWord, treeLevelToStartAt);
    if (listOfWordsToDisplay.length > 0) {
      console.clear();
      console.log(listOfWordsToDisplay); // Send for list display
    }
  }

  GetStartingPointForWordList(word, letterTreeLevel): Letter {
    let nextLetter = word.shift();
    let lettersHashPosition = this.hash.getLettersHashCode(nextLetter);
    if (letterTreeLevel.nextLetters[lettersHashPosition]) {
      return this.GetStartingPointForWordList(word, letterTreeLevel.nextLetters[lettersHashPosition]);
    }
    return letterTreeLevel;
  }

  GrabRestOfWordList(userTypedWord, treeLevel): string[] {
    const foundWordsList = [];
    let userTypedWordCombined = userTypedWord.join('').slice(0, -1);

    const traverseLTreeLevel = function(userTypedWord, currentTreeLevel) {
      userTypedWord += currentTreeLevel.letter;
      if (currentTreeLevel.isEndOfWord === true) {
        foundWordsList.push(userTypedWord);
      }
      if (currentTreeLevel.nextLetters.length > 0) {
        for (let i = 0; i < currentTreeLevel.nextLetters.length; i++) {
          traverseLTreeLevel(userTypedWord, currentTreeLevel.nextLetters[i]);
        }
      }
    }
    traverseLTreeLevel(userTypedWordCombined, treeLevel);
    return foundWordsList;
  }

  SendListOfWordsForDisplay(listOfWordsToDisplay: string[]): void {
    this.listOfResultsChange.emit(["Words", "For", "Display", "List"]);
  }

}
