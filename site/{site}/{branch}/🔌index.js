
import {PlaySite} from "🔌";
import {Mapping} from "📦";

let url = Mapping.key($site).get().url;

new PlaySite(url)
    .branch($branch)
    .at({site: $site, branch: $branch});