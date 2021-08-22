var u = function(t, e) {
    return this instanceof u ? t instanceof u ? t : ("string" == typeof t && (t = this.select(t, e)),
    t && t.nodeName && (t = [t]),
    void (this.nodes = this.slice(t))) : new u(t,e)
};
u.prototype = {
    get length() {
        return this.nodes.length
    }
},
u.prototype.nodes = [],
u.prototype.addClass = function() {
    return this.eacharg(arguments, function(t, e) {
        t.classList.add(e)
    })
}
,
u.prototype.adjacent = function(i, t, n) {
    return "number" == typeof t && (t = 0 === t ? [] : new Array(t).join().split(",").map(Number.call, Number)),
    this.each(function(r, o) {
        var e = document.createDocumentFragment();
        u(t || {}).map(function(t, e) {
            var n = "function" == typeof i ? i.call(this, t, e, r, o) : i;
            return "string" == typeof n ? this.generate(n) : u(n)
        }).each(function(t) {
            this.isInPage(t) ? e.appendChild(u(t).clone().first()) : e.appendChild(t)
        }),
        n.call(this, r, e)
    })
}
,
u.prototype.after = function(t, e) {
    return this.adjacent(t, e, function(t, e) {
        t.parentNode.insertBefore(e, t.nextSibling)
    })
}
,
u.prototype.append = function(t, e) {
    return this.adjacent(t, e, function(t, e) {
        t.appendChild(e)
    })
}
,
u.prototype.args = function(t, e, n) {
    return "function" == typeof t && (t = t(e, n)),
    "string" != typeof t && (t = this.slice(t).map(this.str(e, n))),
    t.toString().split(/[\s,]+/).filter(function(t) {
        return t.length
    })
}
,
u.prototype.array = function(o) {
    var i = this;
    return this.nodes.reduce(function(t, e, n) {
        var r;
        return o ? ("string" == typeof (r = (r = o.call(i, e, n)) || !1) && (r = u(r)),
        r instanceof u && (r = r.nodes)) : r = e.innerHTML,
        t.concat(!1 !== r ? r : [])
    }, [])
}
,
u.prototype.attr = function(t, e, r) {
    return r = r ? "data-" : "",
    this.pairs(t, e, function(t, e) {
        return t.getAttribute(r + e)
    }, function(t, e, n) {
        t.setAttribute(r + e, n)
    })
}
,
u.prototype.before = function(t, e) {
    return this.adjacent(t, e, function(t, e) {
        t.parentNode.insertBefore(e, t)
    })
}
,
u.prototype.children = function(t) {
    return this.map(function(t) {
        return this.slice(t.children)
    }).filter(t)
}
,
u.prototype.clone = function() {
    return this.map(function(t, e) {
        var n = t.cloneNode(!0)
          , r = this.getAll(n);
        return this.getAll(t).each(function(t, e) {
            for (var n in this.mirror)
                this.mirror[n] && this.mirror[n](t, r.nodes[e])
        }),
        n
    })
}
,
u.prototype.getAll = function(t) {
    return u([t].concat(u("*", t).nodes))
}
,
u.prototype.mirror = {},
u.prototype.mirror.events = function(t, e) {
    if (t._e)
        for (var n in t._e)
            t._e[n].forEach(function(t) {
                u(e).on(n, t.callback)
            })
}
,
u.prototype.mirror.select = function(t, e) {
    u(t).is("select") && (e.value = t.value)
}
,
u.prototype.mirror.textarea = function(t, e) {
    u(t).is("textarea") && (e.value = t.value)
}
,
u.prototype.closest = function(e) {
    return this.map(function(t) {
        do {
            if (u(t).is(e))
                return t
        } while ((t = t.parentNode) && t !== document)
    })
}
,
u.prototype.data = function(t, e) {
    return this.attr(t, e, !0)
}
,
u.prototype.each = function(t) {
    return this.nodes.forEach(t.bind(this)),
    this
}
,
u.prototype.eacharg = function(n, r) {
    return this.each(function(e, t) {
        this.args(n, e, t).forEach(function(t) {
            r.call(this, e, t)
        }, this)
    })
}
,
u.prototype.empty = function() {
    return this.each(function(t) {
        for (; t.firstChild; )
            t.removeChild(t.firstChild)
    })
}
,
u.prototype.filter = function(e) {
    var t = e instanceof u ? function(t) {
        return -1 !== e.nodes.indexOf(t)
    }
    : "function" == typeof e ? e : function(t) {
        return t.matches = t.matches || t.msMatchesSelector || t.webkitMatchesSelector,
        t.matches(e || "*")
    }
    ;
    return u(this.nodes.filter(t))
}
,
u.prototype.find = function(e) {
    return this.map(function(t) {
        return u(e || "*", t)
    })
}
,
u.prototype.first = function() {
    return this.nodes[0] || !1
}
,
u.prototype.generate = function(t) {
    return /^\s*<tr[> ]/.test(t) ? u(document.createElement("table")).html(t).children().children().nodes : /^\s*<t(h|d)[> ]/.test(t) ? u(document.createElement("table")).html(t).children().children().children().nodes : /^\s*</.test(t) ? u(document.createElement("div")).html(t).children().nodes : document.createTextNode(t)
}
,
u.prototype.handle = function() {
    var t = this.slice(arguments).map(function(e) {
        return "function" == typeof e ? function(t) {
            t.preventDefault(),
            e.apply(this, arguments)
        }
        : e
    }, this);
    return this.on.apply(this, t)
}
,
u.prototype.hasClass = function() {
    return this.is("." + this.args(arguments).join("."))
}
,
u.prototype.html = function(e) {
    return void 0 === e ? this.first().innerHTML || "" : this.each(function(t) {
        t.innerHTML = e
    })
}
,
u.prototype.is = function(t) {
    return 0 < this.filter(t).length
}
,
u.prototype.isInPage = function(t) {
    return t !== document.body && document.body.contains(t)
}
,
u.prototype.last = function() {
    return this.nodes[this.length - 1] || !1
}
,
u.prototype.map = function(t) {
    return t ? u(this.array(t)).unique() : this
}
,
u.prototype.not = function(e) {
    return this.filter(function(t) {
        return !u(t).is(e || !0)
    })
}
,
u.prototype.off = function(t, e, n) {
    var r = null == e && null == n
      , o = null
      , i = e;
    return "string" == typeof e && (o = e,
    i = n),
    this.eacharg(t, function(e, n) {
        u(e._e ? e._e[n] : []).each(function(t) {
            (r || t.orig_callback === i && t.selector === o) && e.removeEventListener(n, t.callback)
        })
    })
}
,
u.prototype.on = function(t, e, o) {
    var i = null
      , n = e;
    "string" == typeof e && (i = e,
    n = o,
    e = function(e) {
        var n = arguments
          , r = !1;
        u(e.currentTarget).find(i).each(function(t) {
            if (t === e.target || t.contains(e.target)) {
                r = !0;
                try {
                    Object.defineProperty(e, "currentTarget", {
                        get: function() {
                            return t
                        }
                    })
                } catch (t) {}
                o.apply(t, n)
            }
        }),
        r || e.currentTarget !== e.target || o.apply(e.target, n)
    }
    );
    function r(t) {
        return e.apply(this, [t].concat(t.detail || []))
    }
    return this.eacharg(t, function(t, e) {
        t.addEventListener(e, r),
        t._e = t._e || {},
        t._e[e] = t._e[e] || [],
        t._e[e].push({
            callback: r,
            orig_callback: n,
            selector: i
        })
    })
}
,
u.prototype.pairs = function(n, t, e, r) {
    var o;
    return void 0 !== t && (o = n,
    (n = {})[o] = t),
    "object" == typeof n ? this.each(function(t) {
        for (var e in n)
            r(t, e, n[e])
    }) : this.length ? e(this.first(), n) : ""
}
,
u.prototype.param = function(e) {
    return Object.keys(e).map(function(t) {
        return this.uri(t) + "=" + this.uri(e[t])
    }
    .bind(this)).join("&")
}
,
u.prototype.parent = function(t) {
    return this.map(function(t) {
        return t.parentNode
    }).filter(t)
}
,
u.prototype.prepend = function(t, e) {
    return this.adjacent(t, e, function(t, e) {
        t.insertBefore(e, t.firstChild)
    })
}
,
u.prototype.remove = function() {
    return this.each(function(t) {
        t.parentNode && t.parentNode.removeChild(t)
    })
}
,
u.prototype.removeClass = function() {
    return this.eacharg(arguments, function(t, e) {
        t.classList.remove(e)
    })
}
,
u.prototype.replace = function(t, e) {
    var n = [];
    return this.adjacent(t, e, function(t, e) {
        n = n.concat(this.slice(e.children)),
        t.parentNode.replaceChild(e, t)
    }),
    u(n)
}
,
u.prototype.scroll = function() {
    return this.first().scrollIntoView({
        behavior: "smooth"
    }),
    this
}
,
u.prototype.select = function(t, e) {
    return t = t.replace(/^\s*/, "").replace(/\s*$/, ""),
    /^</.test(t) ? u().generate(t) : (e || document).querySelectorAll(t)
}
,
u.prototype.serialize = function() {
    var r = this;
    return this.slice(this.first().elements).reduce(function(e, n) {
        return !n.name || n.disabled || "file" === n.type || /(checkbox|radio)/.test(n.type) && !n.checked ? e : "select-multiple" === n.type ? (u(n.options).each(function(t) {
            t.selected && (e += "&" + r.uri(n.name) + "=" + r.uri(t.value))
        }),
        e) : e + "&" + r.uri(n.name) + "=" + r.uri(n.value)
    }, "").slice(1)
}
,
u.prototype.siblings = function(t) {
    return this.parent().children(t).not(this)
}
,
u.prototype.size = function() {
    return this.first().getBoundingClientRect()
}
,
u.prototype.css = function(e, n) {
    if ("object" != typeof e)
        return void 0 === n ? this.first().style[e] : (this.each(function(t) {
            t.style[e] = n
        }),
        this);
    for (var t in e)
        e.hasOwnProperty(t) && this.css(t, e[t]);
    return this
}
,
u.prototype.slice = function(t) {
    return t && 0 !== t.length && "string" != typeof t && "[object Function]" !== t.toString() ? t.length ? [].slice.call(t.nodes || t) : [t] : []
}
,
u.prototype.str = function(e, n) {
    return function(t) {
        return "function" == typeof t ? t.call(this, e, n) : t.toString()
    }
}
,
u.prototype.text = function(e) {
    return void 0 === e ? this.first().textContent || "" : this.each(function(t) {
        t.textContent = e
    })
}
,
u.prototype.toggleClass = function(t, e) {
    return !!e === e ? this[e ? "addClass" : "removeClass"](t) : this.eacharg(t, function(t, e) {
        t.classList.toggle(e)
    })
}
,
u.prototype.trigger = function(t) {
    var o = this.slice(arguments).slice(1);
    return this.eacharg(t, function(t, e) {
        var n, r = {
            bubbles: !0,
            cancelable: !0,
            detail: o
        };
        try {
            n = new window.CustomEvent(e,r)
        } catch (t) {
            (n = document.createEvent("CustomEvent")).initCustomEvent(e, !0, !0, o)
        }
        t.dispatchEvent(n)
    })
}
,
u.prototype.unique = function() {
    return u(this.nodes.reduce(function(t, e) {
        return null != e && !1 !== e && -1 === t.indexOf(e) ? t.concat(e) : t
    }, []))
}
,
u.prototype.uri = function(t) {
    return encodeURIComponent(t).replace(/!/g, "%21").replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A").replace(/%20/g, "+")
}
,
u.prototype.wrap = function(t) {
    return this.map(function(e) {
        return u(t).each(function(t) {
            (function(t) {
                for (; t.firstElementChild; )
                    t = t.firstElementChild;
                return u(t)
            }
            )(t).append(e.cloneNode(!0)),
            e.parentNode.replaceChild(t, e)
        })
    })
}
,
"object" == typeof module && module.exports && (module.exports = u,
module.exports.u = u);
window.S = function(s) {
    return s[0] == "#" ? document.getElementById(s.slice(1)) : s[0] == "." ? document.getElementsByClassName(s.slice(1)) : document.querySelectorAll(s)
}
;
function ready(fn) {
    if (document.readyState != 'loading') {
        fn()
    } else {
        document.addEventListener('DOMContentLoaded', fn)
    }
}

u('.sidebar-trigger').handle('click', function() {
    u("body").toggleClass('sidebar');
});

// Dropdown in search page
if (u(".w3-dropdown-click").length) {
    u(".w3-dropdown-click").on("click", function() {
        u(this).children(".w3-dropdown-content").toggleClass("w3-show");
    });
}
// Close dropdown on outside click
window.onclick = function(event) {
    // console.log(event.target.matches('.w3-dropdown-click > .w3-dropdown-content > .w3-bar-item'))
    if (event.target.matches('.w3-dropdown-click > .w3-dropdown-content > .w3-bar-item, .w3-dropdown-click > div:first-child') !== true) {
        u('.w3-dropdown-content.w3-show').removeClass('w3-show');
    }
}
// Tabs in torrent details
if (u(".w3-tabs").length) {
    u(".w3-tabs>.w3-bar>[data-tab-target]").on("click", function() {
        var target = u(this).attr("data-tab-target");
        u(this).addClass("bold");
        u(this).siblings().removeClass("bold");
        var tabset = u(this).parent().parent();
        var tab = tabset.children('[data-tab="' + target + '"]');
        if (tab.length) {
            if (tab.hasClass("show")) {
                return;
            } else {
                tab.addClass("show").parent().children().not(tab).removeClass("show");
            }
        }
    });
}
// Movie search filter selects
if (u('.movie-search select').length) {
    u('.movie-search select').on("change", function() {
        document.querySelector('.movie-search form').submit();
    });
}
if (document.getElementById('autocomplete').length) {
    new Autocomplete('#autocomplete',{
        search: input=>{
            // const url = `${wikiUrl}/w/api.php?${params}&srsearch=${encodeURI(input)}`;
            const url = '/search/suggest?q=' + encodeURI(input);
            return new Promise(resolve=>{
                if (input.length < 3) {
                    return resolve([])
                }
                fetch(url).then(response=>response.json()).then(data=>{
                    resolve(data);
                }
                );
            }
            );
        }
        ,
        getResultValue: result=>result.query,
        onSubmit: result=>{
            // window.open(`${wikiUrl}/wiki/${
            // 	encodeURI(result.title)
            // }`);
            window.location.href = "/search?q=" + encodeURI(result.query);
        }
    });
}

// Related Movies Slider
const slider = document.querySelector('.related-movies');
if (slider) {
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e)=>{
        isDown = true;
        slider.classList.add('clicked');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        // console.log("erreerre", scrollLeft)
    }
    );

    slider.addEventListener('mouseleave', ()=>{
        isDown = false;
        slider.classList.remove('clicked');
    }
    );

    slider.addEventListener('mouseup', ()=>{
        isDown = false;
        slider.classList.remove('clicked');
    }
    );

    slider.addEventListener('mousemove', (e)=>{
        if (!isDown)
            return;
        // stop the fn from running
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    }
    );

    // touchEvents
    slider.addEventListener('touchstart', (e)=>{
        isDown = true;
        slider.classList.add('clicked');
        startX = e.touches[0].pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    }
    );

    slider.addEventListener('touchend', ()=>{
        isDown = false;
        slider.classList.remove('clicked');
    }
    );

    slider.addEventListener('touchcancel', ()=>{
        isDown = false;
        slider.classList.remove('clicked');
    }
    );

    slider.addEventListener('touchmove', (e)=>{
        if (!isDown)
            return;
        // stop the fn from running
        e.preventDefault();
        const x = e.touches[0].pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    }
    );
}

// Torrent ranking by clicks and downloads.
// '.dl-links > a, .search-result > .title > a, .search-result > .info+.links > a, .search-result > .info > div > .show-on-small.right'
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
u('a[data-token]').each((item,index)=>{
    if (u(item).attr('data-token').length) {
        u(item).handle("click", function() {
            function dsholijehgakrhgiaerhgligurasblugikews(self) {
                // if(window.event.ctrlKey) {
                // 	window.open(u(self).attr('href'), "_blank")
                // 	return;
                // }
                window.open(u(self).attr('href'), "_self")
            }
            if (isChrome)
                dsholijehgakrhgiaerhgligurasblugikews(this);
            fetch("/ping", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: u(this).attr('data-token')
                })
            }).then((resp)=>{
                dsholijehgakrhgiaerhgligurasblugikews(this);
            }
            ).catch((resp)=>{
                dsholijehgakrhgiaerhgligurasblugikews(this)
            }
            )

            setTimeout(()=>{
                dsholijehgakrhgiaerhgligurasblugikews(this)
            }
            , 200)
        })
    }
}
)
// dom on ready, run this
ready(function() {
    if (u('input[name=pingtoken]').length) {
        fetch("/ping", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: u('input[name=pingtoken]').attr('value')
            })
        }).then((resp)=>{
        }
        ).catch((resp)=>{
        }
        )
    }
})
function postToken(token) {
    fetch("{{ urlPath }}/rate", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token,
            rating: action
        })
    }).then((resp)=>{
        location.reload()
    }
    )
}
var loadDeferredStyles = function() {
    var addStylesNode = document.getElementById("deferred-styles");
    var replacement = document.createElement("div");
    replacement.innerHTML = addStylesNode.textContent;
    document.body.appendChild(replacement)
    addStylesNode.parentElement.removeChild(addStylesNode);
};
var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
if (raf)
    raf(function() {
        window.setTimeout(loadDeferredStyles, 0);
    });
else
    window.addEventListener('load', loadDeferredStyles);

function getCookie(cookiename) {
    // Get name followed by anything except a semicolon
    var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
try {
    let message = getCookie("message");
    let parsed = JSON.parse(message);
    document.querySelector("#alart-message").textContent = parsed.message + " Type:" + parsed.type
    document.querySelector("#alart-box").style.display = "block"
    deleteCookie("message")
    // Uncomment after testing is over.
} catch (e) {
}
