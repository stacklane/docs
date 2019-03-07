function init(){
    $get('github-url').value = '';
    $get('example-loading').classList.add('d-none');
    $get('form').classList.remove('d-none');
}

function updateAlert(msg){
    $get('form-alert').innerHTML = '<p>' + msg + '</p>';
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

    $get('form').classList.add('d-none');
    $get('example-loading').classList.remove('d-none');

    return true;
}

$on('.example-loader', 'click', function( event ) {
    event.preventDefault(); event.stopPropagation();

    $get('github-url').value = event.currentTarget.getAttribute('href');

    (validateForm()) ? $get('form').submit() : showAlert();
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