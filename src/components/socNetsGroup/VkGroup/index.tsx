/*
  import VkGroup from 'components/socNetsGroup/VkGroup'
  Компонент группы VK
 */
import React, { useEffect } from "react";
import { loadItem } from "utils/localStorage";

type TProps = {
  height?: string;
  width?: string;
};

const VkGroup = ({ height = "auto", width = "auto" }: TProps) => {
  const isMobile = loadItem("isMobile");

  useEffect(() => {
    isMobile === false &&
      // @ts-ignore
      // eslint-disable-next-line no-undef
      setTimeout(() => VK.Widgets.Group("vk_groups", { mode: 0, width, height }, 190912136), 0);
  }, []);

  return isMobile === false ? (
    <div style={{ width: "100%" }}>
      <div id="vk_groups" />
    </div>
  ) : null;
};

export default VkGroup;
