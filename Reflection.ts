
/*
    Reflection.js
    2015-12-08

    The MIT License (MIT)
  
    Copyright (c) 2015 Davide Mannone

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/


module System {

  // a hastable
  interface IHashTable<T> {
    [key: string]: T;
  }

  export class Reflection {
    // PUBLIC REGION:
    // used tokens: by change it you can choose custom symbols/coding
    public static NOTSERIALIZESTARTDELIMITER = '$';
    public static OBJECTIDTOKEN = "$id";
    public static OBJECTREFERENCETOKEN = "$ref";
    public static OBJECTTYPETOKEN = "$type";
    public static DATETOKEN = "$date";
    public static REGEXPTOKEN = "$regex";
    public static UNDEFINEDTOKEN = "$undef";
    public static ARRAYPATHDELIMITER = '.';

    public static IncludeUndefined: boolean = false;      // true for preserve undefined values from be dropped by serialization

    // serializes an object
    public static serialize(obj: any, ...namespaces: (string | Object)[]): string;
    public static serialize(obj: any, callback: (key: string, value: any) => any | void, ...namespaces: (string | Object)[]): string;
    public static serialize(obj: any, ...callbackandnamespace: any[]): string {
      var callback: (key: string, value: any) => any | void;
      if (callbackandnamespace && callbackandnamespace.length > 0) {
        if (typeof callbackandnamespace[0] == "function")
          callback = callbackandnamespace.shift();
        Reflection.cacheModule.apply(this, callbackandnamespace);
      }
      return JSON.stringify(Reflection.decycle(obj, callback));
    }

    // deserializes any standard JSON 
    public static deserialize(s: string, ...namespaces: string[]): any;
    public static deserialize(s: string, callback: (key: string, value: any) => any | void, ...namespaces: string[]): any;
    public static deserialize(s: string, ...callbackandnamespace: any[]): any {
      var callback: (key: string, value: any) => any | void;
      if (callbackandnamespace && callbackandnamespace.length > 0) {
        if (typeof callbackandnamespace[0] == "function")
          callback = callbackandnamespace.shift();
        Reflection.cacheModule.apply(this, callbackandnamespace);
      }
      //return Reflection._deserialize(Reflection.retype(JSON.parse(s)));
      return Reflection.retrocycle(JSON.parse(s, (k, v) => {
        if (callback) {
          var uservalue = callback(k, v);
          if (uservalue != undefined)
            return uservalue;
        }
        if (v && typeof v == "object")
          if (v[Reflection.OBJECTTYPETOKEN]) {  // && !(v instanceof Array)
            var dt = Reflection.decacheType(v[Reflection.OBJECTTYPETOKEN]);
            if (dt) {
              v.__proto__ = dt; 
              //var obj = Object.create(dt);  // metodo più "corretto"
              //for (var p in v)
              //  if (v.hasOwnProperty(p))
              //    obj[p] = v[p];
              //return obj
            }
            delete v[Reflection.OBJECTTYPETOKEN];
          }
          else if (v[Reflection.DATETOKEN])
            return new Date(v[Reflection.DATETOKEN]);
          else if (v[Reflection.REGEXPTOKEN]) {
            var regexp = v[Reflection.REGEXPTOKEN].match(/\/(.*)\/(.*)?/);
            regexp.shift()
            return RegExp.apply(null, regexp);
          }
        return v;
      }));
    }

    // returns class/function name
    public static getClassName(obj: any): string {
      var objtype = typeof obj;
      if (objtype != "object" && objtype != "function")
        return undefined;
      var cname = (obj.prototype ? obj.prototype.constructor : obj.constructor).toString().match(/function\s(\w*)/);
      return (cname && cname.length > 1) ? cname[1] : undefined;
//      return ["", "anonymous", "Anonymous"].indexOf(cname) > -1 ? undefined : cname;
    }
    //public static getClassName(str: string = ""): string {  // alternative use this§: is slightly faster
    //  return str.substring(str.indexOf("n ") + 2, str.indexOf("("));
    //}

    // caches namespace/module
    public static cacheModule(...moduleNames: (string | Object)[]): void {
      for (var i = 0, len_i = moduleNames.length; i < len_i; i++) {
        var elem = moduleNames[i];
        var elemtype = typeof elem;
        if (elemtype == 'string') {
          if (typeof Reflection.cachedModules[<string>elem] != 'undefined')
            continue;
          var objtype = Reflection.checkCallPath(window, (<string>elem).split('.'));
          if (objtype)
            Reflection.cachedModules[<string>elem] = objtype;
        }
        else if (elemtype == 'object')
          Reflection.cachedModules['.'] = <Object>elem;
      }
    }
    // caches classes
    public static cacheType(proto: any): string {
      if (!proto)
        return;
      if (typeof proto == "string") {

        // already cached
        if (Reflection.cachedTypes[proto])
          return proto;

        var classname = <string>proto.substr(proto.lastIndexOf('.') + 1, proto.length);
        if (!classname)
          return null;

        // not already cached      
        for (var ns in Reflection.cachedModules) {
          var ref = Reflection.cachedModules[ns];
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

        // already cached
        for (path in Reflection.cachedTypes)
          if (Reflection.cachedTypes[path] === proto.__proto__) 
            return path;

        for (var ns in Reflection.cachedModules) {
          var ref = Reflection.cachedModules[ns];
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

    //private static searchProto(obj: any, proto: any, path: string): string {
    //  for (var cls in obj) {
    //    var tempObj = <any>obj[cls];
    //    if (tempObj && tempObj.prototype == proto) {
    //      Reflection.cachedTypes[path] = proto;
    //      return path;
    //    }
    //  }
    //  return undefined;
    //} 

    // PRIVATE REGION:
    // cached namespaces/modules and types
    private static cachedModules: IHashTable<Object> = {};
    private static cachedTypes: IHashTable<any> = {};

    // does decycling
    private static seq: number = 0;
    private static decycle(
      value: any,
      callback: (key: string, value: any) => any | void,
      ret: any = null,
      map: any[] = [],
      keys: string[] = [],
      lastname: string = ""): any {

      if (ret == null && callback) {
        var uservalue = callback("", value);
        if (uservalue != undefined)
          return uservalue;
      }
      if (value && typeof value == 'object')
        if (value instanceof Date)
          return Reflection.createSimpleToken(Reflection.DATETOKEN, value.toJSON());
        else if (value instanceof RegExp)
          return Reflection.createSimpleToken(Reflection.REGEXPTOKEN, value.toString());
        else {
          if (ret == null) {
            Reflection.seq = -1;
            ret = (value instanceof Array) ? [] : {};
          }

          var i = 0, len_i = map.length;
          for (; i < len_i && map[i] !== value; i++);
          if (i < len_i)
            return Reflection.createSimpleToken(Reflection.OBJECTREFERENCETOKEN, keys[i]); 
          //var index = map.indexOf(value);  // could be used instead of before but do not use it: to 3 times slower!!!!!!
          //if (index >= 0)
          //  return Reflection.createSimpleToken(Reflection.OBJECTREFERENCETOKEN, keys[index]); 

          if (value instanceof Array) {
            if (value.length > 0) {

              map.push(value);
              keys.push((lastname) ? lastname : Reflection.ARRAYPATHDELIMITER);
              lastname += Reflection.ARRAYPATHDELIMITER;

              for (var i = 0, len_i = <number>value.length; i < len_i; i++) {
                var value_i = value[i];
                if (callback) {
                  var uservalue = callback(lastname + i, value_i);
                  if (uservalue != undefined) {
                    ret[i] = uservalue;
                    continue;
                  }
                }
                if (value_i === undefined) {
                  if (Reflection.IncludeUndefined)
                    ret.push(Reflection.createSimpleToken(Reflection.UNDEFINEDTOKEN, 1));
                  continue;
                }
                if (typeof value_i == "object")
                  if (value_i instanceof Date)
                    ret[i] = Reflection.createSimpleToken(Reflection.DATETOKEN, value_i.toJSON());
                  else if (value_i instanceof RegExp)
                    ret[i] = Reflection.createSimpleToken(Reflection.REGEXPTOKEN, value_i.toString());
                  else
                    ret[i] = Reflection.decycle(value_i, callback, (value_i instanceof Array) ? [] : {}, map, keys, lastname + i);
                else
                  ret.push(value_i);
              }
            }
          }
          else {
            Reflection.seq++;
            map.push(value);
            keys.push(ret[Reflection.OBJECTIDTOKEN] = Reflection.seq.toString());
            var vp = Reflection.cacheType(value);
            if (vp)
              ret[Reflection.OBJECTTYPETOKEN] = vp;

            for (var name in value) {
              if (callback) {
                var uservalue = callback(name, value);
                if (uservalue != undefined) {
                  ret[name] = uservalue;
                  continue;
                }
              }
              if (name[0] != Reflection.NOTSERIALIZESTARTDELIMITER) {
                var property = value[name];
                if (property === undefined) {
                  if (Reflection.IncludeUndefined)
                    ret[name] = Reflection.createSimpleToken(Reflection.UNDEFINEDTOKEN, 1);
                  continue;
                }
                if (typeof property == "object")
                  if (property instanceof Date)
                    ret[name] = Reflection.createSimpleToken(Reflection.DATETOKEN, property.toJSON());
                  else if (property instanceof RegExp)
                    ret[name] = Reflection.createSimpleToken(Reflection.REGEXPTOKEN, property.toString());
                  else if (property instanceof Array)
                    ret[name] = Reflection.decycle(property, callback, [], map, keys, Reflection.seq + Reflection.ARRAYPATHDELIMITER + name)
                  else
                    ret[name] = Reflection.decycle(property, callback, {}, map, keys, name);
                else
                  ret[name] = property;
              }
            }
          }
          return ret;
        }
      else if (value === undefined && Reflection.IncludeUndefined)
        return Reflection.createSimpleToken(Reflection.UNDEFINEDTOKEN, 1);
      else
        return value;
    }

    // does retrocycling of reflection cycled objects
    private static retrocycle(value: any,
      map: IHashTable<any> = {},
      lastname: string = ""): any {
      if (value && typeof value == 'object')
        if (value instanceof Array) {
          map[(lastname) ? lastname : Reflection.ARRAYPATHDELIMITER] = value;
          for (var i = 0, len_i = <number>value.length; i < len_i; i++) {
            var value_i = value[i];
            if (value_i && typeof value_i == "object")
              value[i] = Reflection.retrocycle(value_i, map, lastname + Reflection.ARRAYPATHDELIMITER + i); 
          }
        }
        else if (value[Reflection.OBJECTREFERENCETOKEN])
          return map[value[Reflection.OBJECTREFERENCETOKEN]];
        else if (value[Reflection.UNDEFINEDTOKEN])
          return undefined;
        else if (value[Reflection.OBJECTIDTOKEN] != undefined) {
          map[value[Reflection.OBJECTIDTOKEN]] = value;
          for (var name in value) {
            var property = value[name];
            if (property && typeof property == "object")
              value[name] = Reflection.retrocycle(property, map, value[Reflection.OBJECTIDTOKEN] + Reflection.ARRAYPATHDELIMITER + name);
            else
              value[name] = Reflection.retrocycle(property, map, name);
          }
          delete value[Reflection.OBJECTIDTOKEN];
        }
      return value;
    }

    // does retyping of object: NOT USED ANYMORE 
    // instead used standard JSON.stringify that seems to have same performance
    private static retype(obj: any): any {
      if (obj && typeof obj == "object")
        for (var propr in obj) {
          var elem = obj[propr];
          if (elem) {
            if (elem instanceof Array)
              for (var i = 0, len_i = elem.length; i < len_i; i++)
                Reflection.retype(elem[i]);
            else
              Reflection.retype(elem);
          }
          else if (propr == Reflection.OBJECTTYPETOKEN) {
            var dt = Reflection.decacheType(elem[Reflection.OBJECTTYPETOKEN]);
            if (dt)
              obj.__proto__ = dt;
            delete obj[Reflection.OBJECTTYPETOKEN];
          }
        }
      return obj;
    }

    // uncaches a class
    private static decacheType(classpath: string): { classproto: any, typeproto: any } {
      if (!classpath)
        return null;
      if (Reflection.cachedTypes[classpath] != undefined
        || Reflection.cacheType(classpath) == classpath)
        return Reflection.cachedTypes[classpath];
      return null;
    }

    // finds type path
    private static checkCallPath(scope: any, path: string[]): any {
      for (var i = 0, len_i = path.length; i < len_i; i++) {
        scope = scope[path[i]];
        if (typeof scope != "object")
          return undefined;
      }
      return scope;
    }

    // creates serialization token
    private static createSimpleToken(symbol: string, value: any): any {
      var ret = {};
      ret[symbol] = value;
      return ret;
    }
  }
}
