
import {url} from '&';
import {Encoding} from "⚙️";
import {Mapping} from "📦";

/**
 * Reasonable counter for this purpose -- 1 per second.
 */
let idCreator = ()=>{
    var base = Math.round(new Date(2017, 10, 1) / 1000);
    var counter = Math.round(new Date() / 1000) - base;

    let finalId = Encoding.base64Url().encodeNum(counter);

    return finalId;
};

/**
 * Create or use existing, then redirect.
 */
try {

    var existing = Mapping.unique().url(url);

    '/site/' + existing.key  + '/'; // redirect

} catch ($ModelNotFound){

    var created = new Mapping().url(url).key(idCreator());

    '/site/' + created.key  + '/'; // redirect

}