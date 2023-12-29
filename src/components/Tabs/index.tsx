/*
  import Tabs from 'components/Tabs'

  Табсы
 */

import React, { ReactElement, ReactNode } from "react";

import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import "./style.scss";

export type TTabs = {
  position: string;
  render: ReactElement;
};

type TProps = {
  tabsList: TTabs[];
  panelsList: ReactNode[];
  onSelect?: (index: number, last: number, event: Event) => boolean | void;
  selectedTab?: number;
};

const TabsComponent = ({ tabsList, panelsList, onSelect, selectedTab = undefined }: TProps) => (
  <Tabs defaultIndex={selectedTab} onSelect={onSelect} className="component-tabs">
    <TabList>
      {tabsList
        .filter(({ position }) => position === "left")
        .map((item, index) => (
          <Tab key={`component_tablist_index${index}`} data-position={item.position}>
            {item.render}
          </Tab>
        ))}

      {tabsList
        .filter(({ position }) => position === "right")
        .map((item, index) => (
          <Tab key={`component_tablist_index${index}`} data-position={item.position}>
            {item.render}
          </Tab>
        ))}
    </TabList>
    <div className="clear" />
    {panelsList.map((item, index) => (
      <TabPanel key={`component_panelslist_index${index}`}>{item}</TabPanel>
    ))}
  </Tabs>
);

export default TabsComponent;
