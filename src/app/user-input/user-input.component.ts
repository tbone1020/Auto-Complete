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
    const wordConvertedToList = [...this.inputTypedWord];
    const treeLevelToStartAt = this.GetStartingPointForWordList(wordConvertedToList);
    if (treeLevelToStartAt) {
      this.GrabAndSendListWithBoldenText(treeLevelToStartAt);
    } else {
      this.SendListOfWordsToBeDisplayed([]);
    }
  }

  GetStartingPointForWordList(wordConvertedToList): Letter {
    let letterTreeLevel = this.letter;
    while (letterTreeLevel && wordConvertedToList.length) {
      let nextLetter = wordConvertedToList.shift();
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

  GrabAndSendListWithBoldenText(treeLevelToStartAt: Letter): void {
    const listOfRetrievedWords = this.SearchForWordsInTree(treeLevelToStartAt);
    this.SendListOfWordsToBeDisplayed(listOfRetrievedWords);
  }

  SearchForWordsInTree(treeLevel): string[] {
    const foundWordsList = [];
    let typedWordBolded = this.GetTypedWordWithStrongTags();
    const traverseTreeLevels = function(currentWordBuild, currentTreeLevel) {
      let wordBeforeNewLetter = currentWordBuild;
      if (currentTreeLevel.isEndOfWord === true) {
        foundWordsList.push(currentWordBuild);
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
    return foundWordsList;
  }

  GetTypedWordWithStrongTags(): string {
    return `<strong>${this.inputTypedWord}</strong>`;
  }

  SendListOfWordsToBeDisplayed(listOfWordsToDisplay: string[]): void {
    this.listOfResultsChange.emit(listOfWordsToDisplay);
  }

}
