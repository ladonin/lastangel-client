import React, { useMemo } from "react";
// const OtherComponent = React.lazy(() => import('components/header'));

import "./style.scss";
import { useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet";
import BreadCrumbs from "components/BreadCrumbs";
import Slider from "./_components/Slider";

const Documents: React.FC = () => {
  const { getMetatags } = useOutletContext<any>();
  const metatags = useMemo(() => {
    const data = getMetatags();
    return {
      title: data.documents_title || "",
      description: data.documents_description || "",
    };
  }, []);
  return (
    <>
      <Helmet>
        <title>{metatags.title}</title>
        <meta name="description" content={metatags.description} />
      </Helmet>
      <div className="page-documents">
        <BreadCrumbs title="Документы приюта" />

        <Slider />
      </div>
    </>
  );
};

export default Documents;
