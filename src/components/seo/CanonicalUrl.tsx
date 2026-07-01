type Props={

path:string;

};

export default function CanonicalUrl({

path

}:Props){

return(

<link

rel="canonical"

href={`https://www.edunancial.com${path}`}

/>

);

}
