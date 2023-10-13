/*
  import InfiniteScroll from 'components/InfiniteScroll'
 */

import React, { useRef, useEffect, useState, useMemo } from "react";
import pageUpImage from "icons/pageUp.png";
import { loadItem } from "utils/localStorage";
import "./style.scss";
type TProps = {
  amendment?: number;
  onReachBottom: () => void;
};
const InfiniteScroll: React.FC<TProps> = (props) => {
  const { amendment = 0, onReachBottom } = props;
  const ref = useRef(null);
  const [showUpState, setShowUpState] = useState<boolean>(false);
  const onScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const { body } = document;
    const html = document.documentElement;

    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowHeight = window.innerHeight;
    const footerHeight = document.getElementsByClassName("component-footer")[0].clientHeight;
    if (showUpState === false && scrollTop > 500) {
      setShowUpState(true);
    } else {
      setShowUpState(false);
    }
    if (scrollTop + windowHeight + footerHeight + amendment >= docHeight) {
      onReachBottom();
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="component-infiniteScroll">
      <div ref={ref} />

      {showUpState && (
        <img
          alt="."
          onClick={() => {
            window.scrollTo({ top: 0 });
          }}
          src={pageUpImage}
          className="loc_up"
        />
      )}
    </div>
  );
};

export default InfiniteScroll;
