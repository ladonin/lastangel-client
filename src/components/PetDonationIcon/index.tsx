/*
  import PetDonationIcon from 'components/PetDonationIcon'
 */

import React, { useState, useEffect } from "react";

import "./style.scss";
import { ANIMALS_KIND } from "constants/animals";
import { TItem } from "api/types/animals";
import { loadItem, saveItem } from "utils/localStorage";

import c1_1Icon from "./icons/cats/1/1.png";
import c1_2Icon from "./icons/cats/1/2.png";
import c1_3Icon from "./icons/cats/1/3.png";
import c1_4Icon from "./icons/cats/1/4.png";
import c1_5Icon from "./icons/cats/1/5.png";
import c1_6Icon from "./icons/cats/1/6.png";

import c2_1Icon from "./icons/cats/2/1.png";
import c2_2Icon from "./icons/cats/2/2.png";
import c2_3Icon from "./icons/cats/2/3.png";
import c2_4Icon from "./icons/cats/2/4.png";

import c3_1Icon from "./icons/cats/3/1.png";

import c4_1Icon from "./icons/cats/4/1.png";

import c5_1Icon from "./icons/cats/5/1.png";
import c5_2Icon from "./icons/cats/5/2.png";
import c5_3Icon from "./icons/cats/5/3.png";
import c5_4Icon from "./icons/cats/5/4.png";
import c5_5Icon from "./icons/cats/5/5.png";

import c6_1Icon from "./icons/cats/6/1.png";
import c6_2Icon from "./icons/cats/6/2.png";
import c6_3Icon from "./icons/cats/6/3.png";

import c7_1Icon from "./icons/cats/7/1.png";
import c7_2Icon from "./icons/cats/7/2.png";
import c7_3Icon from "./icons/cats/7/3.png";

import c8_1Icon from "./icons/cats/8/1.png";
import c8_2Icon from "./icons/cats/8/2.png";
import c8_3Icon from "./icons/cats/8/3.png";
import c8_4Icon from "./icons/cats/8/4.png";
import c8_5Icon from "./icons/cats/8/5.png";

import c9_1Icon from "./icons/cats/9/1.png";
import c9_2Icon from "./icons/cats/9/2.png";
import c9_3Icon from "./icons/cats/9/3.png";
import c9_4Icon from "./icons/cats/9/4.png";
import c9_5Icon from "./icons/cats/9/5.png";
import c9_6Icon from "./icons/cats/9/6.png";

import d1_1Icon from "./icons/dogs/1/1.png";
import d1_2Icon from "./icons/dogs/1/2.png";
import d1_3Icon from "./icons/dogs/1/3.png";
import d1_4Icon from "./icons/dogs/1/4.png";
import d1_5Icon from "./icons/dogs/1/5.png";
import d1_6Icon from "./icons/dogs/1/6.png";
import d1_7Icon from "./icons/dogs/1/7.png";

import d2_1Icon from "./icons/dogs/2/1.png";
import d2_2Icon from "./icons/dogs/2/2.png";
import d2_3Icon from "./icons/dogs/2/3.png";
import d2_4Icon from "./icons/dogs/2/4.png";

import d3_1Icon from "./icons/dogs/3/1.png";
import d3_2Icon from "./icons/dogs/3/2.png";
import d3_3Icon from "./icons/dogs/3/3.png";
import d3_4Icon from "./icons/dogs/3/4.png";

import d4_1Icon from "./icons/dogs/4/1.png";
import d4_2Icon from "./icons/dogs/4/2.png";
import d4_3Icon from "./icons/dogs/4/3.png";
import d4_4Icon from "./icons/dogs/4/4.png";

import d5_1Icon from "./icons/dogs/5/1.png";
import d5_2Icon from "./icons/dogs/5/2.png";
import d5_3Icon from "./icons/dogs/5/3.png";
import d5_4Icon from "./icons/dogs/5/4.png";

import d6_1Icon from "./icons/dogs/6/1.png";
import d6_2Icon from "./icons/dogs/6/2.png";
import d6_3Icon from "./icons/dogs/6/3.png";
import d6_4Icon from "./icons/dogs/6/4.png";

import d7_1Icon from "./icons/dogs/7/1.png";
import d7_2Icon from "./icons/dogs/7/2.png";
import d7_3Icon from "./icons/dogs/7/3.png";
import d7_4Icon from "./icons/dogs/7/4.png";
import d7_5Icon from "./icons/dogs/7/5.png";
import d7_6Icon from "./icons/dogs/7/6.png";
import d7_7Icon from "./icons/dogs/7/7.png";
import d7_8Icon from "./icons/dogs/7/8.png";
import d7_9Icon from "./icons/dogs/7/9.png";

import d8_1Icon from "./icons/dogs/8/1.png";
import d8_2Icon from "./icons/dogs/8/2.png";
import d8_3Icon from "./icons/dogs/8/3.png";
import d8_4Icon from "./icons/dogs/8/4.png";
import d8_5Icon from "./icons/dogs/8/5.png";
import d8_6Icon from "./icons/dogs/8/6.png";
import d8_7Icon from "./icons/dogs/8/7.png";
import d8_8Icon from "./icons/dogs/8/8.png";
import d8_9Icon from "./icons/dogs/8/9.png";
import d8_10Icon from "./icons/dogs/8/10.png";
import d8_11Icon from "./icons/dogs/8/11.png";

import d9_1Icon from "./icons/dogs/9/1.png";
import d9_2Icon from "./icons/dogs/9/2.png";
import d9_3Icon from "./icons/dogs/9/3.png";
import d9_4Icon from "./icons/dogs/9/4.png";
import d9_5Icon from "./icons/dogs/9/5.png";
import d9_6Icon from "./icons/dogs/9/6.png";
import d9_7Icon from "./icons/dogs/9/7.png";
import d9_8Icon from "./icons/dogs/9/8.png";

type TProps = {
  pet: TItem;
};

const ICONS = {
  cats: {
    1: [c1_1Icon, c1_2Icon, c1_3Icon, c1_4Icon, c1_5Icon, c1_6Icon],
    2: [c2_1Icon, c2_2Icon, c2_3Icon, c2_4Icon],
    3: [c3_1Icon],
    4: [c4_1Icon],
    5: [c5_1Icon, c5_2Icon, c5_3Icon, c5_4Icon, c5_5Icon],
    6: [c6_1Icon, c6_2Icon, c6_3Icon],
    7: [c7_1Icon, c7_2Icon, c7_3Icon],
    8: [c8_1Icon, c8_2Icon, c8_3Icon, c8_4Icon, c8_5Icon],
    9: [c9_1Icon, c9_2Icon, c9_3Icon, c9_4Icon, c9_5Icon, c9_6Icon],
  },
  dogs: {
    1: [d1_1Icon, d1_2Icon, d1_3Icon, d1_4Icon, d1_5Icon, d1_6Icon, d1_7Icon],
    2: [d2_1Icon, d2_2Icon, d2_3Icon, d2_4Icon],
    3: [d3_1Icon, d3_2Icon, d3_3Icon, d3_4Icon],
    4: [d4_1Icon, d4_2Icon, d4_3Icon, d4_4Icon],
    5: [d5_1Icon, d5_2Icon, d5_3Icon, d5_4Icon],
    6: [d6_1Icon, d6_2Icon, d6_3Icon, d6_4Icon],
    7: [d7_1Icon, d7_2Icon, d7_3Icon, d7_4Icon, d7_5Icon, d7_6Icon, d7_7Icon, d7_8Icon, d7_9Icon],
    8: [
      d8_1Icon,
      d8_2Icon,
      d8_3Icon,
      d8_4Icon,
      d8_5Icon,
      d8_6Icon,
      d8_7Icon,
      d8_8Icon,
      d8_9Icon,
      d8_10Icon,
      d8_11Icon,
    ],
    9: [d9_1Icon, d9_2Icon, d9_3Icon, d9_4Icon, d9_5Icon, d9_6Icon, d9_7Icon, d9_8Icon],
  },
};

const calcDonationRate = (collected: number) => {
  if (collected === 0) return 1;
  if (collected < 500) return 2;
  if (collected < 1000) return 3;
  if (collected < 1500) return 4;
  if (collected < 2000) return 5;
  if (collected < 2500) return 6;
  if (collected < 3000) return 7;
  if (collected < 3500) return 8;
  return 9;
};

const PetDonationIcon: React.FC<TProps> = (props) => {
  const { pet } = props;
  const [iconState, setIconState] = useState<string | undefined>(undefined);
  const petDonationIcons: {
    [key: number]: { collected: number; icon: number };
  } = loadItem("pet_donation_icons");

  useEffect(() => {
    if (pet) {
      const collected = pet.collected || 0;
      const kind = pet.kind === ANIMALS_KIND.CAT ? "cats" : "dogs";
      const icons = ICONS[kind][calcDonationRate(collected || 0)];

      if (
        petDonationIcons[pet.id] &&
        petDonationIcons[pet.id].icon &&
        petDonationIcons[pet.id].collected === collected
      ) {
        setIconState(icons[petDonationIcons[pet.id].icon]);
      } else {
        const count: number = icons.length;
        const number = Math.floor(Math.random() * (count - 1) + 1);

        saveItem("pet_donation_icons", {
          ...petDonationIcons,
          [pet.id]: {
            collected,
            icon: number || null,
          },
        });

        setIconState(icons[number] || null);
      }
    }
  }, [pet]);

  return iconState ? (
    <div className="component-petDonationIcon">
      <img alt="nophoto" src={iconState} />
    </div>
  ) : null;
};

export default PetDonationIcon;
