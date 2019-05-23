
import {url} from 'form';
import {Encoding} from 'util';
import {Source} from '🔌';
import {Mapping} from '📦';

if (url == null || url.length == 0 || !Source.isValidURLFormat(url))  throw url;

let idCreator = ()=>{
    let source = Source.of(url);
    return source.name;
};

/**
 * Create or use existing, then redirect.
 */
try {

    let existing = Mapping.url(url).get();

    Redirect.dir('site').dir(existing.key);

} catch ($ModelNotFound){

    let created = new Mapping().url(url).key(idCreator());

    Redirect.dir('site').dir(created.key);

}