/*
  import OkGroup from 'components/socNetsGroup/OkGroup'

  Компонент группы в ОК
 */

import React, { useEffect, useMemo } from "react";

import { loadItem } from "utils/localStorage";

import "react-tabs/style/react-tabs.css";

type TProps = {
  height?: string;
  width?: string;
};

const OkGroup = ({ height = "auto", width = "auto" }: TProps) => {
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  useEffect(() => {
    isMobile === false &&
      setTimeout(() => {
        // @ts-ignore
        function go(d, id, did, st) {
          const js = d.createElement("script");
          js.src = "https://connect.ok.ru/connect.js";
          // eslint-disable-next-line no-multi-assign
          js.onload = js.onreadystatechange = function () {
            if (
              !this.readyState ||
              this.readyState === "loaded" ||
              this.readyState === "complete"
            ) {
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
  }, []);
  return isMobile === false ? <div id="ok_group_widget" /> : null;
};

export default OkGroup;
