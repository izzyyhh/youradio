import React from "react";
import {
  render,
  cleanup,
  queryByText,
  fireEvent,
  shallow,
} from "@testing-library/react";
import ActiveUser from "../../../app/javascript/bundles/YouRadioReact/components/ActiveUser";

const user = {
  id: 1,
  url: "testurl.png",
  name: "Testuser",
};

afterEach(cleanup);
describe("ActiveUser", () => {
  it("renders h1 tag when there is no user", () => {
    const { container } = render(<ActiveUser></ActiveUser>);
    expect(container.querySelector("h1")).toBeTruthy();
  });

  it("component renders as a list element, when user are given", () => {
    const { container } = render(<ActiveUser user={user}></ActiveUser>);
    expect(container.querySelector("li")).toBeTruthy();
  });

  it("list item id should be user id", () => {
    const { container } = render(<ActiveUser user={user}></ActiveUser>);
    const id = container.querySelector("li").getAttribute("id");
    expect(id).toBe(user.id.toString());
  });
});
