import React from "react";
import {
  render,
  cleanup,
  queryByText,
  fireEvent,
  shallow,
} from "@testing-library/react";
import HomeList from "../../../app/javascript/bundles/YouRadioReact/components/HomeList";

afterEach(cleanup);
describe("HomeList", () => {
  console.error = jest.fn();
  it("for each server given in the list, a list item is rendered", () => {
    global.fetch = jest.fn(() => new Promise((res, rej) => {}));
    const serverList = [
      { id: 1, name: "server1", owner: "owner1", imageUrl: "image1" },
      { id: 2, name: "server2", owner: "owner2", imageUrl: "image2" },
    ];

    const { container } = render(<HomeList serverList={serverList} />);

    expect(container.querySelectorAll("li").length).toBe(2);
  });

  it("component displays an unordered list", () => {
    console.error = jest.fn();
    global.fetch = jest.fn(() => new Promise((res, rej) => {}));
    const { container } = render(<HomeList serverList={[]} />);

    expect(container.querySelector("ul")).toBeTruthy();
  });
});
