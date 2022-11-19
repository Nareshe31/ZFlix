export const API_KEY="dfc43a605d906f9da6982495ad7bb34e"
export const BASE_URL="https://zflix-backend.cyclic.app"
export const TMDB_BASE_URL="https://api.themoviedb.org/3"
export const IMAGE_PATH='https://image.tmdb.org/t/p/w342'
export const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export const Torrent_Search=`${BASE_URL}/api/v2/torrent/search/` 
export const Torrent_Search_New=`${BASE_URL}/api/v2/torrent`
export const URLs=[
    `${TMDB_BASE_URL}/trending/movie/week?api_key=${API_KEY}`,  //1 
    `${TMDB_BASE_URL}/trending/movie/day?api_key=${API_KEY}`,  //2
    `${TMDB_BASE_URL}/trending/tv/week?api_key=${API_KEY}`,  //3
    `${TMDB_BASE_URL}/trending/tv/day?api_key=${API_KEY}`,  //4
    `${TMDB_BASE_URL}/trending/person/week?api_key=${API_KEY}`,  //5
    `${TMDB_BASE_URL}/trending/person/day?api_key=${API_KEY}`,  //6
    `${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}`,  //7 
    `${TMDB_BASE_URL}/movie/top_rated?api_key=${API_KEY}`,  //8
    `${TMDB_BASE_URL}/movie/upcoming?api_key=${API_KEY}`,  //9
    `${TMDB_BASE_URL}/tv/popular?api_key=${API_KEY}`,  //10
    `${TMDB_BASE_URL}/tv/top_rated?api_key=${API_KEY}`,  //11
    `${TMDB_BASE_URL}/tv/on_the_air?api_key=${API_KEY}`,  //12
    `${BASE_URL}/api/v2/zflix/update`,  //13
    `${TMDB_BASE_URL}/`,  //14
    `${BASE_URL}/watch/tv/`,  //15
    `${BASE_URL}/watch/movie/`,  //16,
    `${BASE_URL}/api/v2/torrent/search/hitman`,  //17
    'https://www.youtube.com/watch?v=',  //18
    'https://img.youtube.com/vi/',   //19
    '/sddefault.jpg',  //20,
    `${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`,   //21
    `${TMDB_BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`, //22
    `${TMDB_BASE_URL}/search/multi?query=`,  //23
    `${TMDB_BASE_URL}/discover/`,   //24
    `${TMDB_BASE_URL}/`,  //25,
    '&append_to_response=images,videos,credits,similar,recommendations',  //26
    `${BASE_URL}/api/v2/add-to-search`,  //27
    `${BASE_URL}/api/v2/add-to-watchlist`,  //28
    `${BASE_URL}/api/v2/remove-multiple-from-watchlist`,  //29
    `${BASE_URL}/api/v2/add-to-recent-movie`, //30
    `${TMDB_BASE_URL}/configuration/languages?api_key=${API_KEY}`,  //31
    `${BASE_URL}/api/v2/login`, //32
    `${BASE_URL}/api/v2/signup`, //33
    `${BASE_URL}/api/v2/user-details/`, //34
    `${BASE_URL}/api/v2/remove-from-watchlist`, //35
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
