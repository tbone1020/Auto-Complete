import { Letter } from './letter';

describe('Letter Data Structure', () => {
  let letter: Letter;

  beforeEach(() => {
    letter = new Letter("a");
  });

  it ('Assigns Letter Correctly', () => {
    expect(letter.letter === 'a').toBe(true);
  });

  it ('Checks for "isEndOfWOrd" Variable', () => {
    expect(letter.isEndOfWord).toBe(false);
  });

  it ('Checks if "nextLetters" Is An Array', () => {
    expect(Array.isArray(letter.nextLetters)).toBe(true)
  });

});
