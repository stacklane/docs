/**
 * If it fails to find the Mapping by 'key',
 * it will throw a exception that is automatically translated to a 404,
 * and picked up by ⚡NotFound.mustache.
 *
 * This supplier file is marked with ∞ -- exported values will be cached.
 */

import {Mapping} from "📦";

let site = $site;
let url = Mapping.unique().key($site).url;

export {url as RepoUrl, site as SiteId};