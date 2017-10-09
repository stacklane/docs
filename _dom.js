$each = function(cls, cb) { if (!cls.startsWith('.')) return; Array.prototype.forEach.call(document.getElementsByClassName(cls.substring(1)), cb); }
$get = function(id){ return document.getElementById(id); }
$on = function(id, name, cb) { id.startsWith('.') ? $each(id, function(e){ e.addEventListener(name, cb) }) : $get(id).addEventListener(name, cb) }
$up = function(start, cls) { if (cls.startsWith(".")) { cls = cls.substring(1); } else { return null; } if (start.classList.contains(cls)) return start; while ((start = start.parentElement) && !start.classList.contains(cls)); return start; }
$esc = function(s) { return s.replace(/[^0-9A-Za-z ]/g, function(c) {return "&#" + c.charCodeAt(0) + ";"; } ); }