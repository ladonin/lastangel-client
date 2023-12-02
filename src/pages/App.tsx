import React from "react";
import { Routes, Route } from "react-router-dom";
import PAGES from "routing/routes";
import Home from "pages/home";
import Pets from "pages/pets";
import Pet from "pages/pet";
import Contacts from "pages/contacts";

import Collections from "pages/collections";
import Collection from "pages/collection";

import Donators from "pages/donators";
import Donator from "pages/donator";

import Newses from "pages/newses";
import News from "pages/news";

import Stories from "pages/stories";
import Story from "pages/story";

import Documents from "pages/documents";

import Clinic from "pages/clinic";

import FinReport from "pages/finreport";

import Help from "pages/help";

import Acquaintanceship from "pages/acquaintanceship";

import Signin from "pages/signin";
import Page404 from "pages/404";
import Administration from "pages/administration";

import AdministrationPetCreate from "pages/administration/pets/create";
import AdministrationPetUpdate from "pages/administration/pets/update";

import AdministrationCollectionCreate from "pages/administration/collections/create";
import AdministrationCollectionUpdate from "pages/administration/collections/update";

import AdministrationDonationCreate from "pages/administration/donations/create";
import AdministrationDonationUpdate from "pages/administration/donations/update";

import AdministrationDonatorCreate from "pages/administration/donators/create";
import AdministrationDonatorUpdate from "pages/administration/donators/update";

import AdministrationNewsCreate from "pages/administration/news/create";
import AdministrationNewsUpdate from "pages/administration/news/update";

import AdministrationStoryCreate from "pages/administration/stories/create";
import AdministrationStoryUpdate from "pages/administration/stories/update";

import AdministrationMainPagePhotoalbumUpdate from "pages/administration/mainPagePhotoalbum/update";

import AdministrationDocumentsUpdate from "pages/administration/documents/update";

import AdministrationClinicPhotosUpdate from "pages/administration/clinicPhotos/update";
import AdministrationAcquaintanceshipUpdate from "pages/administration/acquaintanceship/update";

import AdministrationFeedbacks from "pages/administration/feedbacks";
import AdministrationMetatagsUpdate from "pages/administration/metatags/update";

import LayoutMain from "pages/_layoutMain";
import LayoutAdministration from "pages/_layoutAdministration";
import "styles/styles.scss";

// по реакт руту https://github.com/remix-run/react-router/tree/dev/examples
// https://reactrouter.com/en/main/start/tutorial
const App: React.FC = () => (
  <Routes>
    <Route path={PAGES.ADMINISTRATION} element={<LayoutAdministration />}>
      <Route index element={<Administration />} />
      <Route path={PAGES.ADMINISTRATION_PET_CREATE} element={<AdministrationPetCreate />} />
      <Route path={`${PAGES.ADMINISTRATION_PET_UPDATE}/:id`} element={<AdministrationPetUpdate />} />

      <Route path={PAGES.ADMINISTRATION_COLLECTION_CREATE} element={<AdministrationCollectionCreate />} />
      <Route path={`${PAGES.ADMINISTRATION_COLLECTION_UPDATE}/:id`} element={<AdministrationCollectionUpdate />} />

      <Route path={`${PAGES.ADMINISTRATION_DONATION_CREATE}`} element={<AdministrationDonationCreate />} />
      <Route path={`${PAGES.ADMINISTRATION_DONATION_UPDATE}/:id`} element={<AdministrationDonationUpdate />} />

      <Route path={`${PAGES.ADMINISTRATION_DONATOR_CREATE}`} element={<AdministrationDonatorCreate />} />
      <Route path={`${PAGES.ADMINISTRATION_DONATOR_UPDATE}/:id`} element={<AdministrationDonatorUpdate />} />

      <Route path={`${PAGES.ADMINISTRATION_NEWS_CREATE}`} element={<AdministrationNewsCreate />} />
      <Route path={`${PAGES.ADMINISTRATION_NEWS_UPDATE}/:id`} element={<AdministrationNewsUpdate />} />

      <Route path={`${PAGES.ADMINISTRATION_STORY_CREATE}`} element={<AdministrationStoryCreate />} />
      <Route path={`${PAGES.ADMINISTRATION_STORY_UPDATE}/:id`} element={<AdministrationStoryUpdate />} />

      <Route path={`${PAGES.ADMINISTRATION_MAIN_PAGE_PHOTOALBUM_UPDATE}`} element={<AdministrationMainPagePhotoalbumUpdate />} />

      <Route path={`${PAGES.ADMINISTRATION_DOCUMENTS_UPDATE}`} element={<AdministrationDocumentsUpdate />} />
      <Route path={`${PAGES.ADMINISTRATION_CLINIC_PHOTOS_UPDATE}`} element={<AdministrationClinicPhotosUpdate />} />
      <Route path={`${PAGES.ADMINISTRATION_ACQUAINTANCESHIP_UPDATE}`} element={<AdministrationAcquaintanceshipUpdate />} />

      <Route path={`${PAGES.ADMINISTRATION_FEEDBACKS}`} element={<AdministrationFeedbacks />} />
      <Route path={`${PAGES.ADMINISTRATION_METATAGS_UPDATE}`} element={<AdministrationMetatagsUpdate />} />
    </Route>

    <Route path="/" element={<LayoutMain />}>
      <Route index element={<Home />} />
      <Route path={PAGES.SIGNIN} element={<Signin />} />
      <Route path={PAGES.PETS} element={<Pets />} />
      <Route path={`${PAGES.PET}/:id`} element={<Pet />} />

      <Route path={PAGES.COLLECTIONS} element={<Collections />} />
      <Route path={`${PAGES.COLLECTION}/:id`} element={<Collection />} />

      <Route path={PAGES.NEWS} element={<Newses />} />
      <Route path={`${PAGES.NEWS}/:id`} element={<News />} />

      <Route path={PAGES.STORIES} element={<Stories />} />
      <Route path={`${PAGES.STORY}/:id`} element={<Story />} />

      <Route path={PAGES.DONATORS} element={<Donators />} />
      <Route path={`${PAGES.DONATOR}/:id`} element={<Donator />} />
      <Route path={PAGES.CONTACTS} element={<Contacts />} />
      <Route path={PAGES.DOCUMENTS} element={<Documents />} />
      <Route path={PAGES.CLINIC} element={<Clinic />} />
      <Route path={PAGES.HELP} element={<Help />} />
      <Route path={PAGES.FINREPORT} element={<FinReport />} />
      <Route path={PAGES.ACQUAINTANCESHIP} element={<Acquaintanceship />} />
      <Route path={PAGES.PAGE_404} element={<Page404 />} />
      <Route path="*" element={<Page404 />} />
    </Route>
  </Routes>
);

export default App;
