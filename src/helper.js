export default {
    cleanURL(url) {
        if (url && url.charAt(0).toString() === '/') {
            let len = url.length;
            url = url.slice(1, len)
        }
        if (url && url.charAt(url.length).toString() === '/') {
            let len = url.length;
            url = url.slice(0, len)
        }

        return url;
    },
    hideBody() {
        document.body.style.display = 'none';
    },
    showBody() {
        setTimeout(() => document.body.style.display = "unset", 1000);
    },
    clearAuthCookies() {
        let cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; ++i) {
            var myCookie = cookies[i];
            var pos = myCookie.indexOf("=");
            var name = pos > -1 ? myCookie.substr(0, pos) : myCookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
}