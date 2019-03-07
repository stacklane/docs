function clearStatus(){
    $get('build-status').innerHTML = '';
}

function addStatus(html, cls){
    var node = document.createElement("div");
    node.setAttribute("class", 'alert ' + cls);
    node.innerHTML = '<p>' + html + '</p>';
    $get('build-status').prepend(node);


    // TODO  needs to be the code element for highlighElement to work
    //if (html.indexOf("language-") > -1) Prism.highlightElement(node); // rerun
    if (html.indexOf("language-") > -1) Prism.highlightAll();
};

function logLevelToClass(level){
    if (level == null) level = 'debug';
    switch (level){
        case 'error': return 'is-danger';
        case 'warn': return 'is-warning';
        case 'info': return 'is-info';
        case 'debug': return 'is-light';
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
            var lang = langFromPath(value.path);

            // yes, put lang on both. long story.
            out += '<pre ' + 'data-line="' + lines  + '" data-line-offset="' + offset  + '" class="language-' + lang + '">';
            out += '<code class="language-' + lang + '">';
            out += $esc(value.source); // fails: Prism.highlight(value.source, lang); // does this HTML escape?
            out += '</code></pre>';
        }
    }

    return out;
}

function getBranch(){
    return $get('branch').value;
}

function init(branch){
    addStatus('Initializing', 'is-warning');

    var init = new EventSource('build?branch=' + branch);
    var graceful = false;

    init.onerror = function(e){
        if (!graceful) {
            addStatus('Connection failed: ' + e.message, "is-danger");
        }
    };

    init.onmessage = function(e){
        if (e.data.startsWith("{")){
            var obj = JSON.parse(e.data);
            addStatus(createProblemHtml(obj.value), "" + logLevelToClass(obj.level));
        } else {
            addStatus(e.data, "is-warning");
        }
    }

    init.addEventListener('completed', function(e) {
        addStatus("Done", "is-success");
        var obj = JSON.parse(e.data);
        //var siteId = $get('SiteId').value;
        $get("launch-link").setAttribute('href', obj.url);
        $get("launch-link").setAttribute('target', obj.frame);
        $get("launch-link").classList.remove('is-disabled', 'is-secondary');
        $get("launch-link").classList.add('is-success');
        init.close();
    });

    init.addEventListener('exception', function(e) {
        addStatus(e.data, "is-danger");
        init.close();
    });

    init.addEventListener('close', function(e) {
        graceful = true;
        init.close();
    });

    init.addEventListener('timeout', function(e) {
        addStatus('Timeout', "is-danger");
    });
}

$on('branch', 'change', function(){
    $get("launch-link").classList.add('is-disabled', 'is-light');
    $get("launch-link").classList.remove('is-success');
});

$on('repo-refresh-action', 'click', function(){
    clearStatus();
    init(getBranch());
});

clearStatus();
init(getBranch());