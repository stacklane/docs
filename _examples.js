function init(){
    $get('github-url').value = '';
    $get('loading').classList.add('d-none');
    $get('form').classList.remove('d-none');
}

function updateAlert(msg){
    $get('form-alert').innerHTML = msg;
}

function showAlert() {
    $get('form-alert').classList.remove('d-none');
}

function validateForm(){
    var url = $get('github-url').value;
    if (url == null || url.length == 0 || url.indexOf('github.com') < 0) {
        updateAlert('Enter a Github.com URL');
        return false;
    }
    if (!url.startsWith("https://") || !url.endsWith(".git")){
        updateAlert('This does not appear to be a valid Github.com repository URL.');
        return false;
    }
    var c = $get('form').getAttribute('action');
    $get('form').classList.add('d-none');
    $get('loading').classList.remove('d-none');
    return true;
}

$on('.playground-example-loader', 'click', function( event ) {
    event.preventDefault();
    $get('github-url').value=event.target.getAttribute('href');
    if (!validateForm()) {
        showAlert();
    } else {
        $get('form').submit();
    }
});

$on('github-url', 'keypress', function( event ) {
    $get('form-alert').classList.add('d-none');
});

$on('form', 'submit', function( event ) {
    if (!validateForm()) {
        showAlert();
        event.preventDefault();
    }
});

window.addEventListener('pageshow', function(event) {
    init(); // back button / load from cache.
});