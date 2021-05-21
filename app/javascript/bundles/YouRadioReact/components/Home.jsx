import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import HomeList from "./HomeList";

const Home = ({ currentUserName, welcomeText, serverList }) => {
  return (
    <section className="home__section">
      <h1 className="home__heading">Hello {currentUserName}</h1>
      <p className="home__paragraph">{welcomeText}</p>

      <HomeList serverList={serverList} />
    </section>
  );
};

Home.propTypes = {
  currentUserName: PropTypes.string,
};

export default Home;
