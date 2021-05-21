import React from "react";
import {
  render,
  cleanup,
  queryByText,
  fireEvent,
  shallow,
} from "@testing-library/react";
import HomeListCard from "../../../app/javascript/bundles/YouRadioReact/components/HomeListCard";

afterEach(cleanup);
describe("HomeListCard", () => {
  it("given serverName is rendered", () => {
    global.fetch = jest.fn(() => new Promise((res, rej) => {}));
    const serverName = "fake server";
    const { container } = render(<HomeListCard serverName={serverName} />);

    expect(queryByText(container, serverName)).toBeTruthy();
  });

  it("given serverOwner is rendered", () => {
    global.fetch = jest.fn(() => new Promise((res, rej) => {}));
    const serverOwner = "fake owner";
    const { container } = render(<HomeListCard serverOwner={serverOwner} />);

    expect(queryByText(container, serverOwner)).toBeTruthy();
  });

  it("component can display an image", () => {
    global.fetch = jest.fn(() => new Promise((res, rej) => {}));
    const serverPic = "fake img";
    const { container } = render(<HomeListCard serverPic={serverPic} />);

    expect(container.querySelector("img")).toBeTruthy();
  });

  it("will throw an error, when serverName is no string", () => {
    console.error = jest.fn();
    const fakeServerName = 213123;
    render(<HomeListCard serverName={fakeServerName} />);

    expect(console.error).toBeCalled();
  });

  it("will throw an error, when serverId is no number", () => {
    console.error = jest.fn();
    const fakeServerId = "213123";
    render(<HomeListCard serverId={fakeServerId} />);

    expect(console.error).toBeCalled();
  });
});
