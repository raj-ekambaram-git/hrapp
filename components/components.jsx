import React from "react";
import Feature from "./static/FeatureSection";
import HeroSection from "./static/HeroSection_1";
import Carousel from "./static/Carousel";

const Components = {
    "features": Feature,
    "heroSection": HeroSection,
    "carousel": Carousel
  };
  
  export default block => {
    if (typeof Components[block.name] !== "undefined") {
      return React.createElement(Components[block.name], {
        key: block._uid,
        block: block,        
      });
    }
    return React.createElement(
      () => <div>The component {block.name} has not been created yet.</div>,
      { key: block._uid }
    );
  };
  