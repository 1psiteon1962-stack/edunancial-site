interface Props{

url:string;

title:string;

}

export default function YouTubePlayer({

url,

title

}:Props){

return(

<iframe

src={`https://www.youtube.com/embed/${url}`}

title={title}

className="aspect-video w-full rounded-xl"

allowFullScreen

/>

);

}
