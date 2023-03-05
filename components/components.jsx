import React from "react";
import Feature from "./static/Features";
import HeroSection from "./static/HeroSection";

const Components = {
    "features": Feature,
    "heroSection": HeroSection,
    "esee": "3333"
  };
  
  export default block => {

    console.log("2334 Compnents  block::::"+JSON.stringify(block)+"***Components[]::"+JSON.stringify(Components))
    if (typeof Components[block] !== "undefined") {
      return React.createElement(Components[block], {
        key: block._uid,
        block: block
      });
    }
    return React.createElement(
      () => <div>The component {block} has not been created yet.</div>,
      { key: block._uid }
    );
  };
  