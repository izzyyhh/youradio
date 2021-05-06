import React from "react";
import {  render, cleanup, queryByText, fireEvent, shallow, } from "@testing-library/react";
import Button from "../../../app/javascript/bundles/YouRadioReact/components/Button";

afterEach(cleanup);
describe("Button", () => {
  it("component renders given child", () => {
    const givenText = "my text";
    const { container } = render(<Button>{givenText}</Button>);

    expect(queryByText(container, givenText)).toBeTruthy();
  });

  it("component renders as button", () => {
    const { container } = render(<Button />);

    expect(container.querySelector("button")).toBeTruthy();
  });

  it("onClick function is called, when Button is clicked", () => {
    const fun = jest.fn();
    const { container } = render(<Button onClick={fun} />);
    fireEvent.click(container.querySelector("button"));

    expect(fun).toHaveBeenCalledTimes(1);
  });

  it("button element gets className provided", () => {
    const className = "my-class";
    const { container } = render(<Button className={className} />);

    expect(container.querySelector(`.${className}`)).toBeTruthy();
  });

  it("button element does not get rendered when onClick is no function", () => {
    console.error = jest.fn();
    const fakeFun = "fake fun";
    render(<Button onClick={fakeFun} />);

    expect(console.error).toBeCalled();
  });
});
