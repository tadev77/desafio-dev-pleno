import 'reflect-metadata';

beforeAll(() => {
  // Clear all mocks before tests
  jest.clearAllMocks();
});

afterEach(() => {
  // Reset all mocks after each test
  jest.resetAllMocks();
});

afterAll(() => {
  // Restore all mocks after all tests
  jest.restoreAllMocks();
});