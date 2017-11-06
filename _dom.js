$each = function(cls, cb) { cls.startsWith('.') ? Array.prototype.forEach.call(document.getElementsByClassName(cls.substring(1)), cb) : Array.prototype.forEach.call(document.getElementsByName(cls), cb); }
$get = function(id){ return document.getElementById(id); }
$on = function(id, name, cb) { id.startsWith('.') ? $each(id, function(e){ e.addEventListener(name, cb) }) : $get(id).addEventListener(name, cb) }
$up = function(start, cls) { if (cls.startsWith(".")) { cls = cls.substring(1); } else { return null; } if (start.classList.contains(cls)) return start; while ((start = start.parentElement) && !start.classList.contains(cls)); return start; }
$esc = function(s) { var div = document.createElement('div'); div.appendChild(document.createTextNode(s)); return div.innerHTML }