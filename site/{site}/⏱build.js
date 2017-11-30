/**
 * Commit is allowed in the initial setup of an SSE,
 * however we wait until we're done instead --
 * see final returned callback.
 */

import {RepoUrl} from "📤";
import {PlaySite} from "🔌";
import * as Params from "&";

let buffered = [];
let bufferedIndex = 0;
let finished = null;

/**
 * Initiate the (potentially long running) builder and callbacks.
 */

new PlaySite(RepoUrl)
.branch(Params.branch)
.at({site: $site, branch: Params.branch})
.build()
.status((log)=>{
    buffered.push({
        level: log.level,
        value: log.value
    });
})
.then((site)=>{
    finished = site;
})
.catch((error)=>{
    /**
     * Error details should have already been emitted in status callback.
     */
    buffered.push({
        $event: {last: true},
        level: "error",
        value: 'Build failed'
    });
});


/**
 * Return a callback that will emit Server Sent Events.
 * This will be periodically called until a "last event" is sent,
 * either explicitly, or by throwing the event(s).
 * The following code explicitly sets the last event explicitly.
 */

(lastEventId)=>{

    /**
     * We do not modify the buffer since it may be written to
     * as we are reading more available events from it.
     */
    let lastIndex = buffered.length;
    let next = buffered.slice(bufferedIndex, lastIndex);
    bufferedIndex = lastIndex;

    if (finished) {

        /**
         * SSE can optionally return a callback.
         * This is only necessarily when persistence / commit is needed
         * during SSE execution (which it is not in this case).
         */
        return () => {
            next.push({
                $event: {type: "completed", last: true},
                level: "info",
                value: "Completed",
                url: finished.url
            });

            return next;
        }

    } else {

        /**
         * No persistence needed, so return as-is.
         */
        return next;

    }

};