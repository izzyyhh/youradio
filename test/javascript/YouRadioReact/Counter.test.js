import React from "react";
import {  render, cleanup, queryByText, fireEvent, shallow, } from "@testing-library/react";
import Counter from "../../../app/javascript/bundles/YouRadioReact/components/Counter";

const className="class"
const id=1
const text = "text"

afterEach(cleanup);
describe("Counter", () => {
  it("renders given text", () => {
    const { container } = render(<Counter id={id} className={className}>{text}</Counter>);
    expect(queryByText(container, text)).toBeTruthy()
  });

  it("renders a div", () => {
    const { container } = render(<Counter id={id} className={className}></Counter>);
    expect(container.querySelector('div')).toBeTruthy()
  });

  it("renders component with given className", () => {
    const { container } = render(<Counter id={id} className={className}></Counter>);
    expect(container.querySelector(`.${className}`)).toBeTruthy();
  });

  it("div id should be id", () => {
    const { container } = render(<Counter id={1} className={className}></Counter>);
    const id = container.querySelector("div").getAttribute("id")
    expect(id).toBe(id.toString())
  });
});