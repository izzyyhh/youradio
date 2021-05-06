jest.mock("prop-types", () => {
  const RealPropTypes = jest.requireActual("prop-types");
  const mockPropTypes = jest.requireActual("mock-prop-types");

  return mockPropTypes(RealPropTypes);
});
