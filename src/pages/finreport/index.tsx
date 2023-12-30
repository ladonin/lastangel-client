import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet";
import BreadCrumbs from "components/BreadCrumbs";
import List from "./_components/List";
import "./style.scss";

const Finreport: React.FC = () => {
  const { getMetatags } = useOutletContext<any>();

  const metatags = useMemo(() => {
    const data = getMetatags();
    return {
      title: data.finreport_title || "",
      description: data.finreport_description || "",
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{metatags.title}</title>
        <meta name="description" content={metatags.description} />
      </Helmet>
      <div className="page-finreport">
        <BreadCrumbs title="Финансовая отчетность" />
        <List />
      </div>
    </>
  );
};

export default Finreport;
