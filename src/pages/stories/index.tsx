/*
  import Stories from 'pages/stories'
  Страница списка историй
 */
import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { useOutletContext } from "react-router-dom";
import BreadCrumbs from "components/BreadCrumbs";
import List from "./_components/List";
import "./style.scss";

const Stories: React.FC = () => {
  const { getMetatags } = useOutletContext<any>();

  const metatags = useMemo(() => {
    const data = getMetatags();
    return {
      title: data.stories_title || "",
      description: data.stories_description || "",
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{metatags.title}</title>
        <meta name="description" content={metatags.description} />
      </Helmet>
      <div className="page-stories">
        <BreadCrumbs title="Истории" />
        <List />
      </div>
    </>
  );
};

export default Stories;
