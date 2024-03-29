/*
  import Newses from 'pages/newses'
  Страница списка новостей
 */
import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet";
import BreadCrumbs from "components/BreadCrumbs";
import List from "./_components/List";
import "./style.scss";

const Newses: React.FC = () => {
  const { getMetatags } = useOutletContext<any>();

  const metatags = useMemo(() => {
    const data = getMetatags();
    return {
      title: data.newses_title || "",
      description: data.newses_description || "",
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{metatags.title}</title>
        <meta name="description" content={metatags.description} />
      </Helmet>
      <div className="page-newses">
        <BreadCrumbs title="Новости" />
        <List />
      </div>
    </>
  );
};

export default Newses;
