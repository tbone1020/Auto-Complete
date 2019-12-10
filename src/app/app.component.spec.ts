import { AppComponent } from './app.component';
import { HashingService } from './services/hashing.service';
import { UserInputComponent } from './user-input/user-input.component';

describe('AppComponent', () => {
  let userInputComponent: UserInputComponent = new UserInputComponent(new HashingService());
  let component: AppComponent = new AppComponent();
  beforeEach(() => {

  });
  it ('Should Exist', () => {
    expect(component).toBeDefined();
  });

  it('Has autoCompleteResults', () => {
    expect(component.autoCompleteResults).toBeDefined();
  });

  it('Checks if autoCompleteResults is an array', () => {
    expect(Array.isArray(component.autoCompleteResults)).toBe(true);
  });

  it('Checks if autoCompleteResults is populated after typing', () => {
    userInputComponent.SendListOfWordsToBeDisplayed(["t", "o"]);
    console.log(component.autoCompleteResults.length);
  });



});
