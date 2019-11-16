import { HashingService } from './hashing.service';

describe('HashingService', () => {
  let hashing: HashingService = new HashingService();

  it ("Should exist", () => {
    expect(hashing).toBeDefined();
  })

  it ("Should return valid char code", () => {
    let letterCode = hashing.getLettersHashCode("a");
    expect(letterCode).toEqual(0);
  });
});
