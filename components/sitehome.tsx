import {
  herosection,
  storysection,
  appssection,
  bookssection,
  coursessection,
  rotatingvideosection,
  footersection,
} from './sections';

import siteConfig from '../data/site-config';

export default function sitehome() {
  return (
    <main>
      <herosection />
      <storysection />
      <appssection />
      <bookssection />
      <coursessection />
      <rotatingvideosection />
      <footersection />
    </main>
  );
}
