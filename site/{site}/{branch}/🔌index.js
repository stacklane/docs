
import {PlaySite} from "🔌";
import {Mapping} from "📦";

let url = Mapping.unique().key($site).url;

new PlaySite(url)
    .branch($branch)
    .at({site: $site, branch: $branch});