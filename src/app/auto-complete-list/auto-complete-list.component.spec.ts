import { AutoCompleteListComponent } from './auto-complete-list.component';

describe('AutoCompleteListComponent', () => {
  let component: AutoCompleteListComponent;

  beforeEach(() => {
    component = new AutoCompleteListComponent();
  });

  it ('Checks if listOfResults is an array', () => {
    expect(Array.isArray(component.listOfResults)).toBe(true);
  });

  it ('Increments cycleListCount', () => {
    component.IncremenetCycleCount();
    expect(component.cycleListCount === 0).toBe(true);
  });
});
