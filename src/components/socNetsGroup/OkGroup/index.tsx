/*
  import OkGroup from 'components/socNetsGroup/OkGroup'
 */

import React, { useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import { isMobile } from "react-device-detect";

type TProps = {
  height?: string;
  width?: string;
};
const OkGroup = ({ height = "auto", width = "auto" }: TProps) => {
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);

  useEffect(() => {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    isMobileState === false &&
      setTimeout(() => {
        // @ts-ignore
        function go(d, id, did, st) {
          const js = d.createElement("script");
          js.src = "https://connect.ok.ru/connect.js";
          // eslint-disable-next-line no-multi-assign
          js.onload = js.onreadystatechange = function () {
            if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
              if (!this.executed) {
                this.executed = true;
                setTimeout(() => {
                  // @ts-ignore
                  // eslint-disable-next-line no-undef
                  OK.CONNECT.insertGroupWidget(id, did, st);
                }, 0);
              }
            }
          };
          d.documentElement.appendChild(js);
        }
        go(document, "ok_group_widget", "565776551254", `{"width":${width},"height":${height}}`);
      });
  }, [isMobileState]);
  return isMobileState === false ? <div id="ok_group_widget" /> : null;
};

export default OkGroup;
