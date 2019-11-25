import { UserInputComponent } from './user-input.component';
import { HashingService } from '../services/hashing.service';
import { Letter } from '../models/letter';

xdescribe('UserInputComponent', () => {
  let component: UserInputComponent = new UserInputComponent(new HashingService());

  beforeAll(() => {
    expect(component).toBeDefined();
  })

  describe('Basic Functionality', () => {

    it ('Checks if "inputTypedWord" is defined', () => {
      expect(component.inputTypedWord).toBeDefined();
    });

    it ('Checks if "inputTypedWord" is an array', () => {
      expect(Array.isArray(component.inputTypedWord)).toBe(true);
    });

    xit ('Assigns lowercase input to "inputTypedWord" variable', () => {

      component.CheckKeyPressInput({
        target: {
          value: "TEST"
        }
      });

      expect(component.inputTypedWord[0] === "t").toBe(true);
      expect(component.inputTypedWord[2] === "s").toBe(true);
      expect(component.inputTypedWord[3] === "t").toBe(true);
    });

    it ('Checks valid key for true', () => {
      expect(component.CheckForInvalidKey('a')).toBe(true);
    });

    it ('Checks invalid keys for false', () => {
      expect(component.CheckForInvalidKey('Shift')).toBe(false);
    });
  });

  describe('Inserting words into letter tree', () => {

    beforeEach(() => {
      component.letter = new Letter(null);
      component.inputTypedWord = ['b', 'e'];
      component.InsertWordIntoTree();
      component.inputTypedWord = ['t', 'o'];
      component.InsertWordIntoTree();
    });

    it ('Has letter variable', () => {
      // expect(component.letter).toBeDefined();
    })

    it ('Checks if first word was inserted correctly into tree', () => {
      expect(component.letter.nextLetters[0].letter === "t").toBe(true);
      expect(component.letter.nextLetters[0].nextLetters[0].letter === "o").toBe(true);
    });

    it ('Checks if second word was inserted correctly into tree', () => {
      expect(component.letter.nextLetters[1].letter === "b").toBe(true);
      expect(component.letter.nextLetters[1].nextLetters[0].letter === "e").toBe(true);
    });

    it ('Checks if "isendofword" variable is assigned correctly', () => {
      expect(component.letter.nextLetters[0].nextLetters[0].isEndOfWord).toBe(true);
    });

    it ('Checks if "enter" adds word to tree', () => {
      component.inputTypedWord = ['a'];
      component.CheckKeyPressInput({key: 'Enter'});
      expect(component.letter.nextLetters[0].letter === "a").toBe(true);
    });

  })
});
