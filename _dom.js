/* DOM utils suitable for inline */
$get = function(id, cb){ return id.startsWith('.') ? Array.prototype.forEach.call(document.getElementsByClassName(id.substring(1)), cb) : document.getElementById(id); }
$on = function(id, name, cb) { id.startsWith('.') ?  $get(id, function(e){ e.addEventListener(name, cb) }) : $get(id).addEventListener(name, cb) }
$up = function(start, cls) { if (cls.startsWith(".")) { cls = cls.substring(1); } else { return null; } if (start.classList.contains(cls)) return start; while ((start = start.parentElement) && !start.classList.contains(cls)); return start; }