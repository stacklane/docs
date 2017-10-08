
import {url} from 'form';
import {Encoding} from "⚙️";
import {Mapping} from "📦";

if (url == null || url.length == 0 || !url.startsWith('https://github.com'))  throw url;

/**
 * Reasonable counter for this purpose -- 1 per second.
 */
let idCreator = ()=>{
    let base = Math.round(new Date(2017, 10, 1) / 1000);
    let counter = Math.round(new Date() / 1000) - base;

    let finalId = Encoding.base64Url().encodeNum(counter);

    return finalId;
};

/**
 * Create or use existing, then redirect.
 */
try {

    let existing = Mapping.unique().url(url);

    `/site/${existing.key}/`; // redirect

} catch ($ModelNotFound){

    let created = new Mapping().url(url).key(idCreator());

    `/site/${created.key}/`; // redirect

}