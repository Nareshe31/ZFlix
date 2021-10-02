export const API_KEY="dfc43a605d906f9da6982495ad7bb34e"

export const IMAGE_PATH='https://image.tmdb.org/t/p/original'
export const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export const Torrent_Search="https://important-bow-prawn.glitch.me/api/v2/torrent/search/" 
export const URLs=[
    `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`,  //1 
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`,  //2
    `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`,  //3
    `https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}`,  //4
    `https://api.themoviedb.org/3/trending/person/week?api_key=${API_KEY}`,  //5
    `https://api.themoviedb.org/3/trending/person/day?api_key=${API_KEY}`,  //6
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`,  //7 
    `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`,  //8
    `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`,  //9
    `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`,  //10
    `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}`,  //11
    `https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}`,  //12
    'https://important-bow-prawn.glitch.me/api/v2/zflix/update',  //13
    `https://api.themoviedb.org/3/`,  //14
    'https://movie-r-series.herokuapp.com/watchonline/tv/',  //15
    'https://movie-r-series.herokuapp.com/watchonline/movie/',  //16,
    'https://important-bow-prawn.glitch.me/api/v2/torrent/search/hitman',  //17
    'https://www.youtube.com/watch?v=',  //18
    'https://img.youtube.com/vi/',   //19
    '/sddefault.jpg',  //20,
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`,   //21
    `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`, //22
    'https://api.themoviedb.org/3/search/multi?query=',  //23
    `https://api.themoviedb.org/3/discover/`,   //24
    'https://api.themoviedb.org/3/',  //25,
    '&append_to_response=images,videos,credits,similar,recommendations',  //26
    'https://important-bow-prawn.glitch.me/add-to-search',  //27
    'http://important-bow-prawn.glitch.me/add-to-watchlist',  //28
    'http://important-bow-prawn.glitch.me/remove-multiple-from-watchlist',  //29
    'http://important-bow-prawn.glitch.me/add-to-recent-movie', //30
]

export const getHour=(runtime)=>{
    return Math.floor(runtime/60).toString()
}
export const getMinute=(runtime)=>{
    return (runtime%60)
}
export function convertMoney (labelValue) {

    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

    ? Number((Math.abs(Number(labelValue) / 1.0e+9)).toFixed(2)) + " billion"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? Number((Math.abs(Number(labelValue) / 1.0e+6)).toFixed(2)) + " million"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? Number((Math.abs(Number(labelValue) / 1.0e+3)).toFixed(2)) + " thousand"

    : Math.abs(Number(labelValue));

}
