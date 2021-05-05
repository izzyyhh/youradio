import ReactOnRails from "react-on-rails";

import App from "../bundles/HelloWorld/startup/HelloWorldApp";
import ServerContent from "../bundles/HelloWorld/components/ServerContent";
import Home from "../bundles/HelloWorld/components/Home";
import Topbar from "../bundles/HelloWorld/components/Topbar";

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  App,
  ServerContent,
  Home,
  Topbar
});
