Array.prototype.exclude = function (list) {
    return this.filter(function (el) { return list.indexOf(el) < 0; })
}

Array.prototype.remove = function (v) {
    this.splice(this.indexOf(v) === -1 ? this.length : this.indexOf(v), 1);
}