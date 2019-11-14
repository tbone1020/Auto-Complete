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
    const INPUTWORDCOPY = [...this.inputTypedWord];
    let currentBranch = this.letter;

    const traverseWordTree = (word, branch) => {
      if (word.length < 1) {
        branch.isEndOfWord = true;
      }
      if (branch.nextLetters.length < 1) {
        this.AddRestOfWordToTree(word, branch);
      } else {
        const QUEUE = [...branch.nextLetters];
        while (QUEUE.length) {
            let nextBranch = QUEUE.shift();
            if (nextBranch.letter === word[0]) {
              let nextLetter = word.shift();
              return traverseWordTree(word, nextBranch);
            }
        }
        this.AddRestOfWordToTree(word, branch);
      }
    }
    traverseWordTree(INPUTWORDCOPY, currentBranch);
  }

  AddRestOfWordToTree(word: string[], currentLevel: Letter): void {
    while(word.length) {
      let nextLetterForInsertion = word.shift();
      currentLevel.nextLetters.unshift(new Letter(nextLetterForInsertion));
      currentLevel = currentLevel.nextLetters[0];
    }
    currentLevel.isEndOfWord = true;
    return;
  }

  SearchAndDisplayWordList(): void {
    // TODO: Fix the NULL at the beginning of each word when you press backspace and there is no other text inside the input.
    const wordCopyForTraversal = [...this.inputTypedWord];
    const treeLevelToStartAt = this.GetStartingPointForWordList(wordCopyForTraversal, this.letter);
    const listOfWordsToDisplay = this.GrabRestOfWordList(this.inputTypedWord, treeLevelToStartAt);
    if (listOfWordsToDisplay.length > 0) {
      console.clear();
      console.log(listOfWordsToDisplay); // Send for list display
    }
  }

  GetStartingPointForWordList(word, letterTreeLevel): Letter {
    if (word.length > 0) {
      let queue = [...letterTreeLevel.nextLetters];
      while (queue.length) {
        let frontBranch = queue.shift();
        if (word[0] === frontBranch.letter) {
          word.shift();
          return this.GetStartingPointForWordList(word, frontBranch);
        }
      }
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
        return;
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
