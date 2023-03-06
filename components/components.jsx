import React from "react";
import Feature from "./static/FeatureSection";
import HeroSection from "./static/HeroSection_1";
import Carousel from "./static/Carousel";
import GeneralContent from "./static/GeneralContent";
import FAQSection from "./static/FAQSection";

const Components = {
    "features": Feature,
    "heroSection": HeroSection,
    "carousel": Carousel,
    "generalContent": GeneralContent,
    "faqSection": FAQSection
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
  