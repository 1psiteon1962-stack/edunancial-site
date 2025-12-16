import {
  herosection,
  storysection,
  coursesselection,
  appssection,
  rotatingvideosection,
  booksection,
  footersection
} from '@/components/sections';

export default function page() {
  return (
    <>
      {herosection()}
      {storysection()}
      {coursesselection()}
      {appssection()}
      {rotatingvideosection()}
      {booksection()}
      {footersection()}
    </>
  );
}
