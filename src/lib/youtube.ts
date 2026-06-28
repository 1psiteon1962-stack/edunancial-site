export function youtubeId(url:string){

const match=url.match(
/(?:v=|youtu\.be\/|embed\/)([^?&]+)/);

return match?match[1]:"";

}

export function embedUrl(url:string){

return `https://www.youtube.com/embed/${youtubeId(url)}`;

}

export function thumbnail(url:string){

return `https://img.youtube.com/vi/${youtubeId(url)}/hqdefault.jpg`;

}
