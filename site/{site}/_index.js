function clearStatus(){
    $get('status').innerHTML = '';
}

function addStatus(html, cls){
    var node = document.createElement("li");
    node.setAttribute("class", cls);
    node.innerHTML = html;
    $get('status').appendChild(node);
    if (html.contains("language-")){
        Prism.highlightAll(); // rerun
    }
    // TODO $("#status").scrollTop($("#status")[0].scrollHeight);
};

function logLevelToClass(level){
    if (level == null) level = 'debug';
    switch (level){
        case 'error': return 'danger';
        case 'warn': return 'warning';
        case 'info': return 'info';
        case 'debug': return 'light';
        default: return level;
    }
}

function langFromPath(path){
    if (path.endsWith(".css") || path.endsWith(".scss")) return "css";
    if (path.endsWith(".js")) return "javascript";
    return "html";
}

function createProblemHtml(value){
    if (typeof value === 'string') return $esc(value);

    var out = '';

    if (value === Object(value) && value.path) {
        out += $esc(value.path);
        out += '<br>';
        out += value.message;

        if (value.source){
            var lines = '';
            var offset = '';

            if (value.beginLine){
                if (value.beginLine == value.endLine)
                    lines = value.beginLine;
                    else
                    lines = value.beginLine + "-" + value.endLine;
                offset = value.offset;
            }

            out += '<pre ' + 'data-line="' + lines  + '" data-line-offset="' + offset  + '">';
            out += '<code class="language-' + langFromPath(value.path) + '">';
            out += $esc(value.source);
            out += '</code></pre>';
        }
    }

    return out;
}

function init(branch){
    addStatus('Initializing', 'list-group-item list-group-item-warning pt-1 pb-1');

    var init = new EventSource('build?branch=' + branch);

    init.onerror = function(e){
        // Unfortunately this appears to be called when server closes connection *even intentionally*.
        // In other words, there is no difference between intentional and unintentional server connection close.
        // addStatus('Connection failed: ' + e.message, "list-group-item pt-1 pb-1 list-group-item-danger");
    };

    init.onmessage = function(e){
        if (e.data.startsWith("{")){
            var obj = JSON.parse(e.data);
            addStatus(createProblemHtml(obj.value), "list-group-item pt-1 pb-1 list-group-item-" + logLevelToClass(obj.level));
        } else {
            addStatus(e.data, "list-group-item pt-1 pb-1 list-group-item-warning");
        }
    }

    init.addEventListener('completed', function(e) {
        addStatus("Done", "list-group-item pt-1 pb-1 list-group-item-success");
        var obj = JSON.parse(e.data);
        var siteId = $get('SiteId').value;
        $get("launch-link").setAttribute('href', "/site/" + siteId + '/' + branch + "/");
        $get("launch-link").classList.remove('d-none');
        init.close();
    });

    init.addEventListener('exception', function(e) {
        addStatus(e.data, "list-group-item pt-1 pb-1 list-group-item-danger");
        init.close();
    });
}

$on('repo-refresh-action', 'click', function(){
    clearStatus();
    init('master');
});

clearStatus();
init('master');