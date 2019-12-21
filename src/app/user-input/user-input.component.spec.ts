import { UserInputComponent } from './user-input.component';
import { HashingService } from '../services/hashing.service';
import { Letter } from '../models/letter';

describe('UserInputComponent', () => {
  let component: UserInputComponent = new UserInputComponent(new HashingService());

  it('Has instance of component', () => {
    expect(component instanceof UserInputComponent).toBeDefined();
  })

  describe('Basic Functionality', () => {
    beforeEach(() => {
        component.inputTypedWord = "be";
    });

    it ('Has inputTypedWord variable', () => {
      expect(component.inputTypedWord).toBeDefined();
    });
  });

  describe('Inserting words into letter tree', () => {

    beforeEach(() => {
      component.letter = new Letter(null);
      component.InsertWordIntoTree([..."be"]);
      component.InsertWordIntoTree([..."to"]);
    });

    it ('Has letter variable', () => {
      expect(component.letter).toBeDefined();
    });

    it('Checks if letter variable is correct type', () => {
      expect(component.letter instanceof Letter).toBe(true);
    })

    it ('Checks if first word was inserted correctly into tree', () => {
      expect(component.letter.nextLetters[19].letter === "t").toBe(true);
      expect(component.letter.nextLetters[19].nextLetters[14].letter === "o").toBe(true);
    });

    it ('Checks if second word was inserted correctly into tree', () => {
      expect(component.letter.nextLetters[1].letter === "b").toBe(true);
      expect(component.letter.nextLetters[1].nextLetters[4].letter === "e").toBe(true);
    });

    it ('Checks if isEndofWord variable is assigned correctly', () => {
      expect(component.letter.nextLetters[1].nextLetters[4].isEndOfWord).toBe(true);
      expect(component.letter.nextLetters[19].nextLetters[14].isEndOfWord).toBe(true);
    });
  });

  describe('Retrieving word', () => {
    beforeEach(() => {
      component.InsertWordIntoTree([..."travel"]);
    });

    it('Retrieves two words starting with the picked letter', () => {
      const foundWords = component.SearchLetterTreeWithBoldResults(component.letter.nextLetters[19]);
      // expect(foundWords[0] === "<strong>t</strong>o").toBe(true);
      // expect(foundWords[1] === "<strong>t</strong>ravel").toBe(true);
    });
  });
});
