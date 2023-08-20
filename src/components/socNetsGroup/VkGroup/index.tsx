/*
  import VkGroup from 'components/socNetsGroup/VkGroup'
 */

import React, { useEffect, useState } from "react";
import "react-tabs/style/react-tabs.css";
import { isMobile } from "react-device-detect";

type TProps = {
  height?: string;
  width?: string;
};
const VkGroup = ({ height = "auto", width = "auto" }: TProps) => {
  const [isMobileState, setIsMobileState] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMobileState(isMobile);
  }, [isMobile]);
  useEffect(() => {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    isMobileState === false && setTimeout(() => VK.Widgets.Group("vk_groups", { mode: 0, width, height }, 190912136), 0);
  }, [isMobileState]);
  return isMobileState === false ? (
    <div style={{ width: "100%" }}>
      <div id="vk_groups" />
    </div>
  ) : null;
};

export default VkGroup;
