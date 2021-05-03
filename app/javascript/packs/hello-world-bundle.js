import ReactOnRails from "react-on-rails";

import App from "../bundles/HelloWorld/startup/HelloWorldApp";
import ServerContent from "../bundles/HelloWorld/components/ServerContent";

// This is how react_on_rails can see the HelloWorld in the browser.
ReactOnRails.register({
  App,
  ServerContent,
});
