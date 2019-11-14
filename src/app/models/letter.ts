export class Letter {
  public letter: string;
  public isEndOfWord: Boolean;
  public nextLetters: Letter[];

  constructor(letter: string) {
    this.letter = letter;
    this.isEndOfWord = false;
    this.nextLetters = [];
  }
}
