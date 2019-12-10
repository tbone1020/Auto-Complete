import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() selectedWordFromList: string;
  @Input() listOfResults: string[];
  @Output() listOfResultsChange = new EventEmitter<string[]>();

  constructor(private hash: HashingService) {}

  ngOnInit() {
    this.InsertWordIntoTree([..."flights from la to hong kong"])
        .InsertWordIntoTree([..."flights from la to fort lauderdale"])
        .InsertWordIntoTree([..."flights from la to boston"])
        .InsertWordIntoTree([..."flights from la to tokyo"]);
  }

  SearchTreeIfTypedValueIsValid(typedWord: any): void {
    this.inputTypedWord = typedWord.value.toLowerCase();
    if (this.inputTypedWord !== "") {
      this.SearchAndDisplayWordList();
    } else {
      this.SendListOfWordsToBeDisplayed([]);
    }
  }

  ClearInputAndSubmitInput(typedValue: any): void {
    if (typedValue.value !== "") {
      let copyOfWord = typedValue.value.toLowerCase();
      typedValue.value = "";
      this.InsertWordIntoTree([...copyOfWord]);
    }
  }

  InsertWordIntoTree(inputWordToList: string[]): this {
    let currentBranch = this.letter;
    while (inputWordToList.length) {
      currentBranch = this.InsertLetterAndGetNextBranch(inputWordToList, currentBranch);
    }
    currentBranch.isEndOfWord = true;
    return this;
  }

  InsertLetterAndGetNextBranch(inputWordToList, currentBranch) {
    let nextLetter = inputWordToList.shift();
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
      this.GetWordListToSend(treeLevelToStartAt);
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

  GetWordListToSend(treeLevelToStartAt: Letter): void {
    const listOfRetrievedWords = this.SearchLetterTreeWithBoldResults(treeLevelToStartAt);
    this.SendListOfWordsToBeDisplayed(listOfRetrievedWords);
  }

  SearchLetterTreeWithBoldResults(treeLevel): string[] {
    const foundWordsList = [];
    let typedWordBolded = this.GetTypedWordWithBoldTag();
    const traverseTreeLevels = function(currentWordBuild, currentTreeLevel) {
      let wordBeforeNewLetter = currentWordBuild;
      if (currentTreeLevel.isEndOfWord === true) {
        foundWordsList.push(`${currentWordBuild}</strong>`);
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

  GetTypedWordWithBoldTag(): string {
    return `${this.inputTypedWord}<strong>`;
  }

  SendListOfWordsToBeDisplayed(listOfWordsToDisplay: string[]): void {
    this.listOfResultsChange.emit(listOfWordsToDisplay);
  }

}
