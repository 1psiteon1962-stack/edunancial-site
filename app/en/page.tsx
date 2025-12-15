import {
  herosection,
  appssection,
  coursessection,
  footersection,
  rotatingvideosection,
  storysection,
} from "@/components/sections";

export default function Page() {
  return (
    <>
      {herosection()}
      {appssection()}
      {rotatingvideosection()}
      {coursessection()}
      {storysection()}
      {footersection()}
    </>
  );
}
