import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HashingService } from '../services/hashing.service';
import { Letter } from '../models/letter';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})

export class UserInputComponent {
  public letter: Letter = new Letter(null);
  public inputTypedWord: string = "";
  @Input() listOfResults: string[];
  @Output() listOfResultsChange = new EventEmitter<string[]>();

  constructor(private hash: HashingService) { }

  SearchTreeIfInputValueIsValid(keyValue: any): void {
    this.inputTypedWord = keyValue.value.toLowerCase();
    if (this.inputTypedWord !== "") {
      this.SearchAndDisplayWordList();
    } else {
      this.SendListOfWordsToBeDisplayed([]);
    }
  }

  HandleUserSubmittingWord(keyValue: any): void {
    if (this.inputTypedWord !== "") {
      keyValue.value = "";
      this.InsertWordIntoTree();
    }
  }

  InsertWordIntoTree(): void {
    const inputWordCopy = [...this.inputTypedWord];
    let currentBranch = this.letter;
    while (inputWordCopy.length) {
      currentBranch = this.InsertLetterAndGetNextBranch(inputWordCopy, currentBranch);
    }
    currentBranch.isEndOfWord = true;
  }

  InsertLetterAndGetNextBranch(inputWordCopy, currentBranch) {
    let nextLetter = inputWordCopy.shift();
    let lettersHashPosition = this.hash.getLettersHashCode(nextLetter);
    if (!currentBranch.nextLetters[lettersHashPosition]) {
      currentBranch.nextLetters[lettersHashPosition] = new Letter(nextLetter);
    }
    return currentBranch.nextLetters[lettersHashPosition];
  }

  SearchAndDisplayWordList(): void {
    const inputWordToList = [...this.inputTypedWord];
    const treeLevelToStartAt = this.GetStartingPointForWordList(inputWordToList);
    if (treeLevelToStartAt) {
      const listOfRetrievedWords = this.RetrieveListOfMatchingWords(this.inputTypedWord, treeLevelToStartAt);
      this.SendListOfWordsToBeDisplayed(listOfRetrievedWords);
    } else {
      this.SendListOfWordsToBeDisplayed([]);
    }
  }

  GetStartingPointForWordList(inputWordToList): Letter {
    let letterTreeLevel = this.letter;
    while (letterTreeLevel && inputWordToList.length) {
      let nextLetter = inputWordToList.shift();
      letterTreeLevel = this.GetNextBranch(nextLetter, letterTreeLevel);
    }
    return letterTreeLevel;
  }

  GetNextBranch(nextLetter: string, treeLevel: Letter): Letter {
    let lettersHashPosition = this.hash.getLettersHashCode(nextLetter);
    if (treeLevel.nextLetters[lettersHashPosition]) {
      return treeLevel.nextLetters[lettersHashPosition];
    }

  }

  RetrieveListOfMatchingWords(userTypedWord, treeLevel): string[] {
    const foundWordsList = [];
    let userTypedWordClipped = userTypedWord.slice(0, -1);
    const traverseTreeLevels = function(currentWordBuild, currentTreeLevel) {
      currentWordBuild += currentTreeLevel.letter;
      if (currentTreeLevel.isEndOfWord === true) {
        foundWordsList.push(currentWordBuild);
      }
      for (let i = 0; i < currentTreeLevel.nextLetters.length; i++) {
        if (currentTreeLevel.nextLetters[i]){
          traverseTreeLevels(currentWordBuild, currentTreeLevel.nextLetters[i]);
        }
      }
    }
    traverseTreeLevels(userTypedWordClipped, treeLevel);
    return foundWordsList;
  }

  SendListOfWordsToBeDisplayed(listOfWordsToDisplay: string[]): void {
    this.listOfResultsChange.emit(listOfWordsToDisplay);
  }

}
