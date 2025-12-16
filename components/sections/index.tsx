import herosection from './herosection';
import appssection from './appssection';
import bookssection from './bookssection';
import coursessection from './coursessection';
import rotatingvideosection from './rotatingvideosection';
import storysection from './storysection';
import footersection from './footersection';

export {
  herosection,
  appssection,
  bookssection,
  coursessection,
  rotatingvideosection,
  storysection,
  footersection,
};

export default function sections() {
  return (
    <>
      <herosection />
      <appssection />
      <bookssection />
      <coursessection />
      <rotatingvideosection />
      <storysection />
      <footersection />
    </>
  );
}
