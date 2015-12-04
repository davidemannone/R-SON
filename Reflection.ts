module System {

  // a string key hastable
  interface IHashTable<T> {
    [key: string]: T;
  }


  export class Reflection {
    // cached module names and types
    private static cachedNameSpaces: IHashTable<Function> = {}; 
    private static cachedTypes: IHashTable<any> = {};

    // does caching of module names
    public static cacheNameSpaces(...namespaces: string[]): void {
      for (var i = 0, len_i = namespaces.length; i < len_i; i++) {
        var elem = namespaces[i];
        if (elem in Reflection.cachedNameSpaces)
          continue;
        var objtype = Reflection.checkCallPath(window, elem.split('.'));
        if (objtype)
          Reflection.cachedNameSpaces[elem] = objtype;
      }
    }

    // does caching of types
    public static cacheType(proto: any): string {
      if (!proto)
        return;
      if (typeof proto == "string") {

        // if allready cached
        if (Reflection.cachedTypes[proto])
          return proto;

        var classname = <string>proto.substr(proto.lastIndexOf('.') + 1, proto.length);
        if (!classname)
          return null;

        // not yet cached     
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
        var path: string = null;

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
    }

    // removes cached type
    private static decacheType(classpath: string): { classproto: any, typeproto: any } {
      if (!classpath)
        return null;
      if (Reflection.cachedTypes[classpath] != undefined
        || Reflection.cacheType(classpath) == classpath)
        return Reflection.cachedTypes[classpath];
      return null;
    }

    // retruns class name
    public static getClassName(obj: any): string {
      if (!obj)
        return "undefined";
      var str = (obj.prototype ? obj.prototype.constructor : obj.constructor).toString();
      var cname = str.match(/function\s(\w*)/)[1];
      return ["", "anonymous", "Anonymous"].indexOf(cname) > -1 ? "Function" : cname;
    }

    // serializes an object by using JSON
    public static serialize(obj: any, ...namespaces: string[]): string {
      Reflection.cacheNameSpaces.apply(this, namespaces);
      return JSON.stringify(Reflection.decycle(obj));
    }
    // does decycling
    private static seq: number = 0;
    private static decycle(value: any, ret: any = null, map: any[] = [], keys: string[] = [], lastname: string = ".", seq: number = 0): any {
      if (value)
        if (value instanceof Date)
          return { $date: value.toJSON() };
        else if (value instanceof RegExp)
          return { $regex: value.toString() };
        else if (typeof value == 'object') {
          if (ret == null) {
            Reflection.seq = -1;
            if (value instanceof Array)
              ret = [];
            else
              ret = {};
          }

          var i = 0, len_i = map.length;
          for (; i < len_i && map[i] !== value; i++);
          if (i < len_i)
            return { $ref: keys[i] }; 

          if (value instanceof Array) {
            if (value.length > 0) {

              map.push(value);
              keys.push(seq + '.' + lastname);

              for (var i = 0, len_i = <number>value.length; i < len_i; i++) {
                var value_i = value[i];
                if (value_i)
                  if (value_i instanceof Date)
                    ret[i] = { $date: value_i.toJSON() };
                  else if (value instanceof RegExp)
                    ret[i] = { $regex: value_i.toString() };
                  else if (typeof value_i == "object")
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

            for (var name in value) {
              var property = value[name];
              if (property)
                if (property instanceof Date)
                  ret[name] = { $date: property.toJSON() };
                else if (property instanceof RegExp)
                  ret[name] = { $regex: property.toString() };
                else if (typeof property == "object")
                  ret[name] = Reflection.decycle(property, (property instanceof Array) ? [] : {}, map, keys, name, Reflection.seq);
                else
                  ret[name] = property;
            }
          }
          return ret;
        }
      return value;
    }


    // does deserializing by using JSON
    public static deserialize(s: string, ...namespaces: string[]): any {
      Reflection.cacheNameSpaces.apply(this, namespaces);
      return Reflection.retrocycle(JSON.parse(s, (k, v) => {
        if (v && typeof v == "object")
          if (v.$type) {  // && !(v instanceof Array)
            var dt = Reflection.decacheType(v.$type);
            if (dt) {
              v.__proto__ = dt; 
              //var obj = Object.create(dt);  // could&should be used instead of __proto__ substitution. Has same time performance.
              //for (var p in v)
              //  if (v.hasOwnProperty(p))
              //    obj[p] = v[p];
              //return obj
            }
            delete v.$type;
          }
          else if (v.$date)
            return new Date(v.$date);
          else if (v.$regex) {
            var regexp = v.$regex.match(/\/(.*)\/(.*)?/);
            regexp.shift()
            return RegExp.apply(null, regexp);
          }
        return v;
      }));
    }

    // does retrocycling
    private static retrocycle(value: any, map: IHashTable<any> = {}, lastname: string = ".", lastseq: string = "0"): any {
      if (value && typeof value == 'object') {

        if (value instanceof Array) {
          map[lastseq + '.' + lastname] = value;
          for (var i = 0, len_i = <number>value.length; i < len_i; i++) {
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
    }

    // scans for class path
    private static checkCallPath(scope: any, path: string[]): any {
      for (var i = 0, len_i = path.length; i < len_i; i++) {
        scope = scope[path[i]];
        if (typeof scope != "object")
          return undefined;
      }
      return scope;
    }
  }
}
