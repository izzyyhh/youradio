import ReactOnRails from "react-on-rails";

import ServerContent from "../bundles/YouRadioReact/components/ServerContent";
import Home from "../bundles/YouRadioReact/components/Home";
import Topbar from "../bundles/YouRadioReact/components/Topbar";

// this is how react_on_rails can see the React Components in the browser
ReactOnRails.register({
  ServerContent,
  Home,
  Topbar,
});
