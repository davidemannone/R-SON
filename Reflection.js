var System;
(function (System) {
    var Reflection = (function () {
        function Reflection() {
        }
        // PUBLIC: caching of function paths
        Reflection.cacheNameSpace = function () {
            var namespaces = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                namespaces[_i - 0] = arguments[_i];
            }
            for (var i = 0, len_i = namespaces.length; i < len_i; i++) {
                var elem = namespaces[i];
                if (elem in Reflection.cachedNameSpaces)
                    continue;
                var objtype = Reflection.checkCallPath(window, elem.split('.'));
                if (objtype)
                    Reflection.cachedNameSpaces[elem] = objtype;
            }
        };
        // PUBLIC: caching of object prototypes
        Reflection.cacheType = function (proto) {
            if (!proto)
                return;
            if (typeof proto == "string") {
                // allready cached
                if (Reflection.cachedTypes[proto])
                    return proto;
                var classname = proto.substr(proto.lastIndexOf('.') + 1, proto.length);
                if (!classname)
                    return null;
                // not yet cahed    
                for (var ns in Reflection.cachedNameSpaces) {
                    var ref = Reflection.cachedNameSpaces[ns];
                    for (var cls in ref) {
                        var tempObj = ref[cls];
                        if (tempObj && Reflection.getClassName(tempObj) == classname) {
                            var path = ns + '.' + classname;
                            Reflection.cachedTypes[path] = tempObj.prototype;
                            return path;
                        }
                    }
                }
            }
            else {
                if (typeof proto != "object")
                    return null;
                var classname = Reflection.getClassName(proto);
                if (!classname || classname == "Object")
                    return null;
                var path = null;
                // allready cached
                for (path in Reflection.cachedTypes)
                    if (Reflection.cachedTypes[path] === proto.__proto__) {
                        return path;
                        break;
                    }
                // not yet cached      
                for (var ns in Reflection.cachedNameSpaces) {
                    var ref = Reflection.cachedNameSpaces[ns];
                    for (var cls in ref) {
                        var tempObj = ref[cls];
                        if (tempObj && tempObj.prototype == proto.__proto__) {
                            var path = ns + '.' + classname;
                            Reflection.cachedTypes[path] = proto.__proto__;
                            return path;
                        }
                    }
                }
            }
            return null;
        };
        // PRIVATE: decaching of function paths
        Reflection.decacheType = function (classpath) {
            if (!classpath)
                return null;
            if (Reflection.cachedTypes[classpath] != undefined
                || Reflection.cacheType(classpath) == classpath)
                return Reflection.cachedTypes[classpath];
            return null;
        };
        // PUBLIC: gets object protoype name
        Reflection.getClassName = function (obj) {
            if (!obj)
                return "undefined";
            var str = (obj.prototype ? obj.prototype.constructor : obj.constructor).toString();
            var cname = str.match(/function\s(\w*)/)[1];
            return ["", "anonymous", "Anonymous"].indexOf(cname) > -1 ? "Function" : cname;
        };
        // PUBLIC: serializes an object
        Reflection.serialize = function (obj) {
            var namespaces = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                namespaces[_i - 1] = arguments[_i];
            }
            Reflection.cacheNameSpace.apply(this, namespaces);
            return JSON.stringify(Reflection.decycle(obj));
        };
        // PRIVATE: decycles an object
        Reflection.decycle = function (value, ret, map, keys, lastname, seq) {
            if (ret === void 0) { ret = null; }
            if (map === void 0) { map = []; }
            if (keys === void 0) { keys = []; }
            if (lastname === void 0) { lastname = "."; }
            if (seq === void 0) { seq = 0; }
            if (value && typeof value == 'object')
                if (value instanceof Date)
                    return { $date: value.toJSON() };
                else if (value instanceof RegExp)
                    return { $regex: value.toString() };
                else {
                    if (ret == null) {
                        Reflection.seq = -1;
                        if (value instanceof Array)
                            ret = [];
                        else
                            ret = {};
                    }
                    var i = 0, len_i = map.length;
                    for (; i < len_i && map[i] !== value; i++)
                        ;
                    if (i < len_i)
                        return { $ref: keys[i] };
                    if (value instanceof Array) {
                        if (value.length > 0) {
                            map.push(value);
                            keys.push(seq + '.' + lastname);
                            for (var i = 0, len_i = value.length; i < len_i; i++) {
                                var value_i = value[i];
                                if (value_i && typeof value_i == "object")
                                    if (value_i instanceof Date)
                                        ret[i] = { $date: value_i.toJSON() };
                                    else if (value_i instanceof RegExp)
                                        ret[i] = { $regex: value_i.toString() };
                                    else
                                        ret[i] = Reflection.decycle(value_i, (value_i instanceof Array) ? [] : {}, map, keys, lastname + '.' + i, seq);
                                else
                                    ret.push(value_i);
                            }
                        }
                    }
                    else {
                        Reflection.seq++;
                        map.push(value);
                        keys.push(ret["$id"] = Reflection.seq.toString());
                        var vp = Reflection.cacheType(value);
                        if (vp)
                            ret["$type"] = vp;
                        for (var name in value) 
                            if (name[0] != '$') {
                                var property = value[name];
                                if (property && typeof property == "object")
                                    if (property instanceof Date)
                                        ret[name] = { $date: property.toJSON() };
                                    else if (property instanceof RegExp)
                                        ret[name] = { $regex: property.toString() };
                                    else
                                        ret[name] = Reflection.decycle(property, (property instanceof Array) ? [] : {}, map, keys, name, Reflection.seq);
                                else
                                    ret[name] = property;
                            }
                    }
                    return ret;
                }
            return value;
        };
        // PUBLIC: deseriale a JSON string
        Reflection.deserialize = function (s) {
            var namespaces = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                namespaces[_i - 1] = arguments[_i];
            }
            Reflection.cacheNameSpace.apply(this, namespaces);
            return Reflection.retrocycle(JSON.parse(s, function (k, v) {
                if (v && typeof v == "object")
                    if (v.$type) {
                        var dt = Reflection.decacheType(v.$type);
                        if (dt) {
                            v.__proto__ = dt;
                        }
                        delete v.$type;
                    }
                    else if (v.$date)
                        return new Date(v.$date);
                    else if (v.$regex) {
                        var regexp = v.$regex.match(/\/(.*)\/(.*)?/);
                        regexp.shift();
                        return RegExp.apply(null, regexp);
                    }
                return v;
            }));
        };
        // PRIVATE: retrocycles an object
        Reflection.retrocycle = function (value, map, lastname, lastseq) {
            if (map === void 0) { map = {}; }
            if (lastname === void 0) { lastname = "."; }
            if (lastseq === void 0) { lastseq = "0"; }
            if (value && typeof value == 'object') {
                if (value instanceof Array) {
                    map[lastseq + '.' + lastname] = value;
                    for (var i = 0, len_i = value.length; i < len_i; i++) {
                        var value_i = value[i];
                        if (value_i && typeof value_i == "object")
                            value[i] = Reflection.retrocycle(value_i, map, lastname + '.' + i, lastseq);
                    }
                }
                else if (value.$ref)
                    value = map[value.$ref];
                else
                    for (var name in value) {
                        var property = value[name];
                        if (property && typeof property == "object")
                            if (value.$id != undefined) {
                                map[value.$id] = value;
                                value[name] = Reflection.retrocycle(property, map, name, value.$id);
                                delete value.$id;
                            }
                            else
                                value[name] = Reflection.retrocycle(property, map, name);
                    }
            }
            return value;
        };
        // PRIVATE: search for paths
        Reflection.checkCallPath = function (scope, path) {
            for (var i = 0, len_i = path.length; i < len_i; i++) {
                scope = scope[path[i]];
                if (typeof scope != "object")
                    return undefined;
            }
            return scope;
        };
        Reflection.cachedNameSpaces = {}; 
        Reflection.cachedTypes = {};
        Reflection.seq = 0;
        return Reflection;
    })();
    System.Reflection = Reflection;
})(System || (System = {}));
