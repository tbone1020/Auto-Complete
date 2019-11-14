import { AutoCompleteListComponent } from './auto-complete-list.component';

describe('AutoCompleteListComponent', () => {
  let component: AutoCompleteListComponent;

  beforeEach(() => {
    component = new AutoCompleteListComponent();
  });

  it ('Checks If "listOfResults" Is An Array', () => {
    expect(Array.isArray(component.listOfResults)).toBe(true);
  });
});
