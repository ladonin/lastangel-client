/*
  import VkGroup from 'components/socNetsGroup/VkGroup'
 */

import React, { useEffect, useMemo } from "react";
import "react-tabs/style/react-tabs.css";
import { loadItem } from "utils/localStorage";

type TProps = {
  height?: string;
  width?: string;
};
const VkGroup = ({ height = "auto", width = "auto" }: TProps) => {
  const isMobile = useMemo(() => loadItem("isMobile"), []);

  useEffect(() => {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    isMobile === false && setTimeout(() => VK.Widgets.Group("vk_groups", { mode: 0, width, height }, 190912136), 0);
  }, []);
  return isMobile === false ? (
    <div style={{ width: "100%" }}>
      <div id="vk_groups" />
    </div>
  ) : null;
};

export default VkGroup;
