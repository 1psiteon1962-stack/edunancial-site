import "./globals.css";

import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

export const metadata = {

title:"Edunancial",

description:

"Edunancial is a Financial Literacy Platform dedicated to helping individuals understand money, business, real estate, paper assets, and entrepreneurship.",

};

export default function RootLayout({

children,

}:{

children:React.ReactNode;

}){

return(

<html lang="en">

<body>

<Navbar />

{children}

<Footer />

</body>

</html>

);

}
