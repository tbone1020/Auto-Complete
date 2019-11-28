import { AppComponent } from './app.component';

describe('AppComponent', () => {

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



});
