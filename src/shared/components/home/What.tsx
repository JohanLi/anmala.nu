import React, { useEffect, useState } from 'react';

import { getContactUrl, whatUrlFragment } from '../../urls';
import { Link } from '../common/Link';

const h4Class = 'font-medium text-gray-900 mt-6 mb-2';
const ulClass = 'list-disc pl-6 space-y-2 text-gray-500 text-sm';

const images = [
  '/images/demo2-d0c28a95269b33cb82e7.jpg',
  '/images/demo3-e8fa016653c61649ec81.jpg',
  '/images/demo4-031f3460f12b559631f0.jpg',
];

const CAROUSEL_INTERVAL = 10000;

export const What = (): JSX.Element => {
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedImage + 1 >= images.length) {
        setSelectedImage(0);
      } else {
        setSelectedImage(selectedImage + 1);
      }
    }, CAROUSEL_INTERVAL);

    return () => clearTimeout(timer);
  }, [selectedImage]);

  return (
    <div id={whatUrlFragment}>
      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Vad går att göra?
          </h2>
          <div>
            <h4 className={h4Class}>
              Skapa en landningssida
            </h4>
            <ul className={ulClass}>
              <li>
                Egen text, rubriker, listor, länkar och bilder.
              </li>
            </ul>
            <h4 className={h4Class}>
              Biljettyper och bokningsformulär
            </h4>
            <ul className={ulClass}>
              <li>
                Ha olika biljettyper, där varje kan ha sin egen beskrivning, pris och platsbegränsning.
              </li>
              <li>
                Lägg till egna fält utöver namn och e-post.
              </li>
              <li>
                Säkra betalningar via kort eller Internetbank.
                {' '}
                <span className="opacity-40">Betalning via Swish är under utveckling.</span>
              </li>
            </ul>
            <h4 className={h4Class}>
              Hantera deltagare
            </h4>
            <ul className={ulClass}>
              <li>
                Filtrering och sökning.
              </li>
              <li>
                Skicka meddelanden via e-post.
                {' '}
                <span className="opacity-40">SMS-utskick är under utveckling.</span>
              </li>
            </ul>
            <h4 className={h4Class}>
              Har du fler behov?
            </h4>
            <ul className={ulClass}>
              <li>
                Tveka in att <Link href={getContactUrl()}>höra av dig</Link>!
              </li>
            </ul>
          </div>
        </div>
        <div className="lg:col-span-6 flex items-center">
          <div className="flex flex-col">
            <img
              src={images[selectedImage]}
              alt=""
              width={2400}
              height={1800}
              className="w-full shadow-sm"
            />
            <div className="flex justify-between mx-auto mt-6">
              {images.map((_, i) => (
                <div
                  className={`${i === selectedImage ? 'bg-indigo-600' : 'bg-indigo-200'} rounded-full w-6 h-6 cursor-pointer mx-2`}
                  onClick={() => setSelectedImage(i)}
                  key={i}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
