export class Letter {
  public letter: string;
  public isEndOfWord: Boolean = false;
  public nextLetters: Letter[] = [];

  constructor(letter: string) {
    this.letter = letter;
  }
}
