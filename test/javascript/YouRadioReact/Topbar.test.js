import React from "react";
import {
  render,
  cleanup,
  queryByText,
  fireEvent,
  shallow,
} from "@testing-library/react";
import Topbar from "../../../app/javascript/bundles/YouRadioReact/components/Topbar";

afterEach(cleanup);
describe("Topbar", () => {
  it("given username is rendered", () => {
    const userName = "userName";
    const { container } = render(
      <Topbar userName={userName} ppImgUrl="url/to/img" />
    );

    expect(queryByText(container, userName)).toBeTruthy();
  });

  it("an image tag for the profile picture is rendered", () => {
    const userName = "clapperfool";
    const ppUrl = "clapperfool/ppurl";
    const { container } = render(
      <Topbar userName={userName} ppImgUrl={ppUrl} />
    );

    expect(container.querySelector("img")).toBeTruthy();
  });

  it("do not show a button, isServerPresentAndPublic is false", () => {
    const userName = "clapperfool";
    const ppUrl = "clapperfool/ppurl";
    const { container } = render(
      <Topbar
        userName={userName}
        ppImgUrl={ppUrl}
        isServerPresentAndPublic={false}
      />
    );
    expect(container.querySelector("button")).toBeFalsy();
  });

  it("display a button when isServerPresentAndPublic is true", () => {
    global.fetch = jest.fn(() => new Promise((res, rej) => {}));
    global.document.getElementById = jest.fn(() =>
      document.createElement("div")
    );

    const userName = "clapperfool";
    const ppUrl = "clapperfool/ppurl";
    const { container } = render(
      <Topbar
        userName={userName}
        ppImgUrl={ppUrl}
        isServerPresentAndPublic={true}
      />
    );
    expect(container.querySelector("button")).toBeTruthy();
  });

  it("do not display a button, when isServerPresentAndPublic is not set", () => {
    const userName = "clapperfool";
    const ppUrl = "clapperfool/ppurl";
    const { container } = render(
      <Topbar userName={userName} ppImgUrl={ppUrl} />
    );
    expect(container.querySelector("button")).toBeFalsy();
  });

  it("component should contain follow or unfollow button when isServerPresentAndPublic is true", () => {
    global.fetch = jest.fn(() => new Promise((res, rej) => {}));
    global.document.getElementById = jest.fn(() =>
      document.createElement("div")
    );

    const userName = "clapperfool";
    const ppUrl = "clapperfool/ppurl";
    const { followText, unFollowText } = {
      followText: "Follow",
      unFollowText: "Unfollow",
    };
    const { container } = render(
      <Topbar
        userName={userName}
        ppImgUrl={ppUrl}
        isServerPresentAndPublic={true}
      />
    );
    expect(
      queryByText(container, followText) || queryByText(container, unFollowText)
    ).toBeTruthy();
  });
});
