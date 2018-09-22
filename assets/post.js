//document.ready
if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', function () {
        console.log('document was not ready, place code here');
        init();
    });
}

function saveUserInfo(form) {
    var name = form.getElementsByClassName('name-input')[0].value;
    var emailAddress = form.getElementsByClassName('email-address-input')[0].value;
    document.cookie = "name=" + name + "; expires=Thu, 18 Dec 2030 12:00:00 UTC; path=/";
    document.cookie = "emailAddress=" + emailAddress + "; expires=Thu, 18 Dec 2030 12:00:00 UTC; path=/";
}

function loadUserInfo(form) {
    var cookies = document.cookie;
    var name = getCookie('name');
    if (name) {
        form.getElementsByClassName('name-input')[0].value = name;
    }
    var emailAddress = getCookie('emailAddress');
    if (emailAddress) {
        form.getElementsByClassName('email-address-input')[0].value = emailAddress;
    }

}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function showReplyForm(commentReplyAnchorElement) {
    //hide all nested reply forms
    resetVisibility();

    //remove all comment nesting when adding a comment 
    document.body.classList.add('nested-reply-active');

    //hide the "reply" anchor
    commentReplyAnchorElement.classList.add('hide');

    //show the form
    var form = commentReplyAnchorElement.nextElementSibling;
    loadUserInfo(form);
    form.classList.remove('hide');

    //hide the root comment form
    document.querySelector('.root-comment-form').classList.add('hide');

    //make all comments greyed out
    var commentElements = document.querySelectorAll('.comment');
    for (var i = 0; i < commentElements.length; i++) {
        //exclude the current comment
        commentElements[i].classList.add('blur');
    }
    closestParent(commentReplyAnchorElement, '.comment').classList.remove('blur');
}

function cancelReply(formCancelButtonElement) {

    //show the reply anchor
    closestParent(formCancelButtonElement, '.comment').querySelectorAll('.comment-reply-anchor')[0].classList.remove('hide');

    //hide the form
    var form = closestParent(formCancelButtonElement, 'form');
    form.classList.add('hide');

    //remove all comment nesting when adding a comment 
    document.body.classList.remove('nested-reply-active');

    //hide all nested reply forms
    resetVisibility();

    var commentElements = document.querySelectorAll('.comment');
    for (var i = 0; i < commentElements.length; i++) {
        //exclude the current comment
        commentElements[i].classList.remove('blur');
    }
}


//progressive enhancement
function init() {
    resetVisibility();
}

function resetVisibility() {
    //hide all of the reply forms
    var elements = document.getElementsByClassName('add-comment-form');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        //skip the root comment form
        if (element.classList.contains('root-comment-form')) {
            element.classList.remove('hide');
            loadUserInfo(element);
            continue;
        }
        element.classList.add('hide');
    }

    //show all of the reply anchors
    var elements = document.getElementsByClassName('comment-reply-anchor');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        element.nextElementSibling
        element.classList.remove('hide');
    }
}
var converter;
function showMarkdownPreview(tab) {
    loadScripts(['https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js', '/assets/showdown.min.js'], function () {
        tab.classList.add('active');
        tab.previousElementSibling.classList.remove('active');
        var textarea = tab.parentElement.parentElement.querySelector('.comment-message-textarea');
        var previewDiv = tab.parentElement.parentElement.querySelector('.comment-message-preview');

        //hide the textarea
        textarea.classList.add('hide');
        //show the preview
        previewDiv.classList.remove('hide');

        //create the markdown converter if it doesn't already exist
        converter = converter ? converter : new showdown.Converter();
        previewDiv.innerHTML = converter.makeHtml(textarea.value);

        var preTags = previewDiv.getElementsByTagName('pre');
        for (var i in preTags) {
            preTags[i].classList.add('highlight');
        }
    });
}

function hideMarkdownPreview(tab) {
    tab.classList.add('active');
    tab.nextElementSibling.classList.remove('active');
    var textarea = tab.parentElement.parentElement.querySelector('.comment-message-textarea');
    var previewDiv = tab.parentElement.parentElement.querySelector('.comment-message-preview');

    //hide the textarea
    textarea.classList.remove('hide');
    //show the preview
    previewDiv.classList.add('hide');
}

function loadScript(scriptUrl, callback) {
    //if the script is already loaded, call the callback right away
    if (document.getElementById(scriptUrl)) {
        return callback();

    }

    var script = document.createElement('script');
    script.id = scriptUrl;
    script.src = scriptUrl;
    script.onload = function () {
        callback();
    }
    document.body.appendChild(script);
}

function loadScripts(scriptUrls, callback) {
    var callbackCount = 0;
    for (var i = 0; i < scriptUrls.length; i++) {
        loadScript(scriptUrls[i], function () {
            callbackCount++;
            if (callbackCount === scriptUrls.length) {
                callback();
            }
        });
    }
}

function closestParent(el, selector) {
    var matchesFn;

    // find vendor prefix
    ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (fn) {
        if (typeof document.body[fn] == 'function') {
            matchesFn = fn;
            return true;
        }
        return false;
    })

    var parent;

    // traverse parents
    while (el) {
        parent = el.parentElement;
        if (parent && parent[matchesFn](selector)) {
            return parent;
        }
        el = parent;
    }

    return null;
}