/// <reference path="../_references.ts" />


QUnit.module('Reflection');


module NameSpace {
  export class Class {
    public Name: string;
    public Date: Date;
    public RegEx: RegExp;
    public Class: Class = null;
    public Array: Class[] = [];
    public $NotSerialized: string = "NotSerialized";
    constructor(s: string, d: Date, r: RegExp) { this.Name = s; this.Date = d; this.RegEx = r; this.$NotSerialized = s; }
  }
}

test('standard JSON', () => {
  var json = { str: "ciao", num: 1, array: [1, "ciao", { str: "ciao" }, [1, "ciao"], null ],  obj: {str: "ciao", num: 1}, null: null };
  var myDeserializedJSON = <any>System.Reflection.deserialize(JSON.stringify(json));
  equal(myDeserializedJSON.str, json.str, "my deserialized JSON string");
  equal(myDeserializedJSON.num, json.num, "my deserialized JSON number");
  equal(myDeserializedJSON.array.length, json.array.length, "my deserialized JSON array");
  equal(myDeserializedJSON.array[0], json.array[0], "my deserialized JSON array number");
  equal(myDeserializedJSON.array[1], json.array[1], "my deserialized JSON array string");
  equal(myDeserializedJSON.array[2].str, (<any>json.array[2]).str, "my deserialized JSON array object string");
  equal(myDeserializedJSON.array[3][0], json.array[3][0], "my deserialized JSON array array number");
  equal(myDeserializedJSON.array[3][1], json.array[3][1], "my deserialized JSON array array string");
  equal(myDeserializedJSON.array[4], json.array[4], "my deserialized JSON array null");
  equal(myDeserializedJSON.obj.str, json.obj.str, "my deserialized JSON object string");
  equal(myDeserializedJSON.obj.num, json.obj.num, "my deserialized JSON object number");
  equal(myDeserializedJSON.null, json.null, "my deserialized JSON null");
});

test('not objects', () => {
  var s = "ciao";
  var mySerialized = System.Reflection.serialize(s);
  notEqual(mySerialized.length, 0, "my serialized string");
  var myDeserializedString = <string>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedString, s, "my deserialized string");

  var n = 10;
  mySerialized = System.Reflection.serialize(n);
  notEqual(mySerialized.length, 0, "my serialized number");
  var myDeserializedNumber = <number>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedNumber, n, "my deserialized number");

  var d = new Date();
  mySerialized = System.Reflection.serialize(d);
  notEqual(mySerialized.length, 0, "my serialized number");
  var myDeserializedDate = <Date>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedDate.toString(), d.toString(), "my deserialized date");

  var r = /ciao/;

  mySerialized = System.Reflection.serialize(r);
  notEqual(mySerialized.length, 0, "my serialized regular expression");
  var myDeserializedRegExp = <RegExp>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedRegExp.toString(), r.toString(), "my deserialized regula expression");


  r = /ciao/g;

  mySerialized = System.Reflection.serialize(r);
  notEqual(mySerialized.length, 0, "my serialized regular expression");
  var myDeserializedRegExp = <RegExp>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedRegExp.toString(), r.toString(), "my deserialized regula expression");


  var nil = null;
  mySerialized = System.Reflection.serialize(nil);
  notEqual(mySerialized.length, 0, "my serialized null");
  var myDeserializedNil = <any>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedNil, nil, "my deserialized regula null");

  var undef = undefined;
  mySerialized = System.Reflection.serialize(undef);
  equal(mySerialized, undefined, "my serialized undefined not included");

  System.Reflection.IncludeUndefined = true;
  mySerialized = System.Reflection.serialize(undef);
  notEqual(mySerialized.length, 0, "my serialized undefined");
  var myDeserializedUndefined = <any>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedUndefined, undef, "my deserialized regula undefined");
  System.Reflection.IncludeUndefined = false;

});

test('arrays', () => {
  var s = ["ciao", "miao"];
  var mySerialized = System.Reflection.serialize(s);
  notEqual(mySerialized.length, 0, "my serialized string");
  var myDeserializedString = <string[]>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedString[0], s[0], "my deserialized string 0");
  equal(myDeserializedString[1], s[1], "my deserialized string 1");

  var n = [10, 20];
  mySerialized = System.Reflection.serialize(n);
  notEqual(mySerialized.length, 0, "my serialized number");
  var myDeserializedNumber = <number[]>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedNumber[0], n[0], "my deserialized number 0");
  equal(myDeserializedNumber[1], n[1], "my deserialized number 1");

  var d = [new Date(), new Date()];
  mySerialized = System.Reflection.serialize(d);
  notEqual(mySerialized.length, 0, "my serialized date");
  var myDeserializedDate = <Date[]>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedDate[0].toString(), d[0].toString(), "my deserialized date 0");
  equal(myDeserializedDate[1].toString(), d[1].toString(), "my deserialized date 1");

  var r = [/ciao/g, /miao/i];
  mySerialized = System.Reflection.serialize(r);
  notEqual(mySerialized.length, 0, "my serialized regula expression");
  var myDeserializedRegExp = <RegExp[]>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedRegExp[0].toString(), r[0].toString(), "my deserialized regular expression 0");
  equal(myDeserializedRegExp[1].toString(), r[1].toString(), "my deserialized regular expression 1");

  var ss = [s, ["ciao2", "miao2"]];
  var mySerialized = System.Reflection.serialize(ss);
  notEqual(mySerialized.length, 0, "my serialized string");
  var myDeserializedString = <string[]>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedString[0][0], s[0], "my deserialized string 0");
  equal(myDeserializedString[0][1], s[1], "my deserialized string 0");
  equal(myDeserializedString[1][0], ss[1][0], "my deserialized string 1");
  equal(myDeserializedString[1][1], ss[1][1], "my deserialized string 1");
  
  var sss = [s, ["ciao2", "miao2"], s[0]];
  var mySerialized = System.Reflection.serialize(sss);
  notEqual(mySerialized.length, 0, "my serialized string");
  var myDeserializedString = <string[]>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedString[0][0], s[0], "my deserialized string 0");
  equal(myDeserializedString[0][1], s[1], "my deserialized string 0");
  equal(myDeserializedString[1][0], sss[1][0], "my deserialized string 1");
  equal(myDeserializedString[1][1], sss[1][1], "my deserialized string 1");
  equal(myDeserializedString[2], sss[0][0], "my deserialized string 1");
  
  ss = [s, [s[1], "miao2"]];
  var mySerialized = System.Reflection.serialize(ss);
  notEqual(mySerialized.length, 0, "my serialized string");
  var myDeserializedString = <string[]>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedString[0][0], s[0], "my deserialized string 0");
  equal(myDeserializedString[0][1], s[1], "my deserialized string 0");
  equal(myDeserializedString[1][0], ss[0][1], "my deserialized string 1");
  equal(myDeserializedString[1][1], ss[1][1], "my deserialized string 1");

  var ssss = [s, ["ciao2", s], s];
  var mySerialized = System.Reflection.serialize(ssss);
  notEqual(mySerialized.length, 0, "my serialized string");
  var myDeserializedString = <string[]>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedString[0][0], s[0], "my deserialized string 0");
  equal(myDeserializedString[0][1], s[1], "my deserialized string 0");
  equal(myDeserializedString[1][0], ssss[1][0], "my deserialized string 1");
  equal(myDeserializedString[1][1], myDeserializedString[0], "my deserialized string 1");
  equal(myDeserializedString[2], myDeserializedString[0], "my deserialized string 1");
  
  var sssss = [["1",["2",[[s, "4"],"3"]]], ["ciao2", s], s];
  var mySerialized = System.Reflection.serialize(sssss);
  notEqual(mySerialized.length, 0, "my serialized string");
  var myDeserializedString = <string[]>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedString[0][0], sssss[0][0], "my deserialized string 0");
  equal(myDeserializedString[0][1][0], sssss[0][1][0], "my deserialized string 0");
  equal(myDeserializedString[0][1][1][0][0][0], s[0], "my deserialized string 0");
  equal(myDeserializedString[0][1][1][0][0][1], s[1], "my deserialized string 0");
  equal(myDeserializedString[0][1][1][0][1], sssss[0][1][1][0][1], "my deserialized string 0");
  equal(myDeserializedString[0][1][1][1], sssss[0][1][1][1], "my deserialized string 0");
  equal(myDeserializedString[1][0], sssss[1][0], "my deserialized string 1");
  equal(myDeserializedString[1][1], myDeserializedString[0][1][1][0][0], "my deserialized string 1");
  equal(myDeserializedString[2], myDeserializedString[0][1][1][0][0], "my deserialized string 1");

  s = [undefined, "ciao", undefined];
  mySerialized = System.Reflection.serialize(s);
  notEqual(mySerialized.length, 0, "my serialized undefined array no undefined");
  var myDeserializedRegString = <string[]>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedRegString[0], s[1], "my deserialized regular expression 0");

  System.Reflection.IncludeUndefined = true;
  mySerialized = System.Reflection.serialize(s);
  notEqual(mySerialized.length, 0, "my serialized undefined undefined array");
  myDeserializedRegString = <string[]>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedRegString[0], s[0], "my deserialized regular expression 0");
  equal(myDeserializedRegString[1], s[1], "my deserialized regular expression 0");
  equal(myDeserializedRegString[2], s[2], "my deserialized regular expression 0");
  System.Reflection.IncludeUndefined = false;
});

test('serializer simple classes', () => {

  var date = new Date();
  var regex = /ciao/g;

  var c1 = new NameSpace.Class("c1", date, regex);
  var c2 = new NameSpace.Class("c2", date, regex);
  var c3 = new NameSpace.Class("c3", date, regex);
  c1.Class = c2;
  c1.Array = [c3];
  equal(c1.Class, c2, "same class obj");
  equal(c1.Array[0], c3, "same class obj array");
  equal(c1.$NotSerialized, c1.Name, "same not to serialize property");

  var mySerialized = System.Reflection.serialize(c1, "NameSpace");
  notEqual(mySerialized.length, 0, "my serialized");
  var myDeserialized = <NameSpace.Class>System.Reflection.deserialize(mySerialized);
  equal(myDeserialized.Name, "c1", "my deserialized");
  equal(myDeserialized.Date.toString(), date.toString(), "my deserialized data");
  equal(myDeserialized.RegEx.toString(), regex.toString(), "my deserialized regular expression");
  notEqual(myDeserialized, myDeserialized.Class, "differnet class obj 1");
  notEqual(myDeserialized, myDeserialized.Array[0], "differnet class obj 2");
  notEqual(myDeserialized.Class, myDeserialized.Array[0], "differnet class obj 3");
  equal(myDeserialized.$NotSerialized, undefined, "not serialized");

  c1 = new NameSpace.Class("c1", date, regex);
  c2 = new NameSpace.Class("c2", date, regex);
  c3 = new NameSpace.Class("c3", date, regex);
  c1.Class = c2;
  c1.Array = [c2];
  equal(c1.Class, c2, "same class obj 1");
  equal(c1.Array[0], c2, "same class obj array 2");
  notEqual(c1.Array[0], c3, "different class obj array 2");

  mySerialized = System.Reflection.serialize(c1, "NameSpace");
  notEqual(mySerialized.length, 0, "my serialized");
  myDeserialized = <NameSpace.Class>System.Reflection.deserialize(mySerialized);
  equal(myDeserialized.Name, "c1", "my deserialized");
  equal(myDeserialized.Date.toString(), date.toString(), "my deserialized data");
  equal(myDeserialized.RegEx.toString(), regex.toString(), "my deserialized regular expression");
  notEqual(myDeserialized, myDeserialized.Class, "differnet class obj 1");
  notEqual(myDeserialized, myDeserialized.Array[0], "differnet class obj 2");
  equal(myDeserialized.Class, myDeserialized.Array[0], "same class obj 3");


  c1 = new NameSpace.Class("c1", date, regex);
  c2 = new NameSpace.Class("c2", date, regex);
  var c4 = new NameSpace.Class("c4", date, regex);
  c1.Class = c2;
  c1.Array = [c3];
  c2.Array = c1.Array;
  equal(c1.Class, c2, "c1 == c2");
  equal(c1.Array[0], c3, "same class obj array 3");
  equal(c1.Array, c2.Array, "same array");

  mySerialized = System.Reflection.serialize(c1, "NameSpace");
  notEqual(mySerialized.length, 0, "my serialized");
  myDeserialized = <NameSpace.Class>System.Reflection.deserialize(mySerialized);
  equal(myDeserialized.Name, "c1", "my deserialized");
  equal(myDeserialized.Date.toString(), date.toString(), "my deserialized data");
  equal(myDeserialized.RegEx.toString(), regex.toString(), "my deserialized regular expression");
  notEqual(myDeserialized, myDeserialized.Class, "differnet class obj 1");
  notEqual(myDeserialized, myDeserialized.Array[0], "differnet class obj 2");
  equal(myDeserialized.Array, myDeserialized.Class.Array, "same class obj 3");

  c2.Class = undefined;
  c3.Class = undefined;
  
  System.Reflection.IncludeUndefined = true;
  mySerialized = System.Reflection.serialize(c1, "NameSpace");
  notEqual(mySerialized.length, 0, "my serialized");
  myDeserialized = <NameSpace.Class>System.Reflection.deserialize(mySerialized);
  equal(myDeserialized.Name, "c1", "my deserialized");
  equal(myDeserialized.Date.toString(), date.toString(), "my deserialized data");
  equal(myDeserialized.RegEx.toString(), regex.toString(), "my deserialized regular expression");
  notEqual(myDeserialized, myDeserialized.Class, "differnet class obj 1");
  notEqual(myDeserialized, myDeserialized.Array[0], "differnet class obj 2");
  equal(myDeserialized.Array, myDeserialized.Class.Array, "same class obj 3");
  equal(myDeserialized.Class.Class, c2.Class, "undefined");
  equal(myDeserialized.Array[0].Class, c3.Class, "undefined");
  System.Reflection.IncludeUndefined = false;


  ok(true);
});

test('serializer simple classes from serialized', () => {
  var regex = /ciao/g;
  var date = new Date();
  var c1 = new NameSpace.Class("c1", date, regex);
  var c2 = new NameSpace.Class("c2", date, regex);
  var c3 = new NameSpace.Class("c3", date, regex);
  c1.Class = c2;
  c1.Array = [c3];
  equal(c1.Class, c2, "same class obj");
  equal(c1.Array[0], c3, "same class obj array");

  var mySerialized = System.Reflection.serialize(c1, "NameSpace");
  notEqual(mySerialized.length, 0, "my serialized");

  var xxx: any = System.Reflection;
  xxx.cachedTypes = {};


  var myDeserialized = <NameSpace.Class>System.Reflection.deserialize(mySerialized);
  equal(myDeserialized.Name, "c1", "my deserialized");
  equal(myDeserialized.Date.toString(), date.toString(), "my deserialized data");
  equal(myDeserialized.RegEx.toString(), regex.toString(), "my deserialized regular expression");
  notEqual(myDeserialized, myDeserialized.Class, "differnet class obj 1");
  notEqual(myDeserialized, myDeserialized.Array[0], "differnet class obj 2");
  notEqual(myDeserialized.Class, myDeserialized.Array[0], "differnet class obj 3");

  c1 = new NameSpace.Class("c1", date, regex);
  c2 = new NameSpace.Class("c2", date, regex);
  c3 = new NameSpace.Class("c3", date, regex);
  c1.Class = c2;
  c1.Array = [c2];
  equal(c1.Class, c2, "same class obj 1");
  equal(c1.Array[0], c2, "same class obj array 2");
  notEqual(c1.Array[0], c3, "different class obj array 2");

  mySerialized = System.Reflection.serialize(c1, "NameSpace");
  notEqual(mySerialized.length, 0, "my serialized");

  xxx.cachedTypes = {};

  myDeserialized = <NameSpace.Class>System.Reflection.deserialize(mySerialized);
  equal(myDeserialized.Name, "c1", "my deserialized");
  notEqual(myDeserialized, myDeserialized.Class, "differnet class obj 1");
  notEqual(myDeserialized, myDeserialized.Array[0], "differnet class obj 2");
  equal(myDeserialized.Class, myDeserialized.Array[0], "same class obj 3");


  c1 = new NameSpace.Class("c1", date, regex);
  c2 = new NameSpace.Class("c2", date, regex);
  var c4 = new NameSpace.Class("c4", date, regex);
  c1.Class = c2;
  c1.Array = [c3];
  c2.Array = c1.Array;
  equal(c1.Class, c2, "c1 == c2");
  equal(c1.Array[0], c3, "same class obj array 3");
  equal(c1.Array, c2.Array, "same array");

  mySerialized = System.Reflection.serialize(c1, "NameSpace");
  notEqual(mySerialized.length, 0, "my serialized");

  xxx.cachedTypes = {};

  myDeserialized = <NameSpace.Class>System.Reflection.deserialize(mySerialized);
  equal(myDeserialized.Name, "c1", "my deserialized");
  equal(myDeserialized.Date.toString(), date.toString(), "my deserialized data");
  equal(myDeserialized.RegEx.toString(), regex.toString(), "my deserialized regular expression");
  notEqual(myDeserialized, myDeserialized.Class, "differnet class obj 1");
  notEqual(myDeserialized, myDeserialized.Array[0], "differnet class obj 2");
  equal(myDeserialized.Array, myDeserialized.Class.Array, "same class obj 3");

  ok(true);
});

test('array of arrays', () => {
  var date = new Date();
  var regex = /ciao/g;

  var c0 = new NameSpace.Class("0", date, regex);
  var c1 = new NameSpace.Class("1", date, regex);
  var c2 = new NameSpace.Class("2", date, regex);
  var c3 = new NameSpace.Class("3", date, regex);
  var p = [c2, c3];
  c0.Array = <any>[c2, p, c3];
  c1.Array = <any>[c2, c3, p];
  c1.Class = c0;
  ok(true, "ready");
  var mySerialized = System.Reflection.serialize(c1);
  notEqual(mySerialized.length, 0, "my serialized 1");
  var myDeserialized = <NameSpace.Class>System.Reflection.deserialize(mySerialized);
  equal(myDeserialized.Name, "1", "my deserialized 1");
  equal(myDeserialized.Date.toString(), date.toString(), "my deserialized data");
  equal(myDeserialized.RegEx.toString(), regex.toString(), "my deserialized regular expression");

  notEqual(myDeserialized.Class, null, "null");
  equal(myDeserialized.Array[0], myDeserialized.Class.Array[0], "1");
  equal(myDeserialized.Array[1], myDeserialized.Class.Array[2], "2");
  equal(myDeserialized.Array[2], myDeserialized.Class.Array[1], "3");
  equal(myDeserialized.Array[2][0], myDeserialized.Class.Array[0], "4");
  equal(myDeserialized.Array[2][1], myDeserialized.Class.Array[2], "5");

  ok(true);
});


test('callbacks', () => {
  //ok(true); return;
  var s = "ciao";
  var mySerialized = System.Reflection.serialize(s, (key, value) => {
    equal(key, "", "top layer");
    equal(value, s, "top value");
  });
  notEqual(mySerialized.length, 0, "my serialized callaback in serialize  with same value");
  var myDeserializedString = <string>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedString, s, "my deserialized callback in serialize  with same");
  
  mySerialized = System.Reflection.serialize(s, (key, value) => {
    equal(key, "", "top layer");
    equal(value, s, "top value");
    return s + s;
  });
  notEqual(mySerialized.length, 0, "my serialized callaback in deserialize with changed value");
  myDeserializedString = <string>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedString, s + s, "my deserialized callback in deserialize changed value");
  
  mySerialized = System.Reflection.serialize(s);
  notEqual(mySerialized.length, 0, "my serialized callaback in deserialize with changed value");
  myDeserializedString = <string>System.Reflection.deserialize(mySerialized, (key, value) => {
    equal(key, "", "top layer");
    equal(value, s, "top value");
  });
  equal(myDeserializedString, s, "my deserialized callback in deserialize changed value");
  mySerialized = System.Reflection.serialize(s);
  notEqual(mySerialized.length, 0, "my serialized callaback in deserialize with changed value");
  myDeserializedString = <string>System.Reflection.deserialize(mySerialized, (key, value) => {
    equal(key, "", "top layer");
    equal(value, s, "top value");
    return s + s
  });
  equal(myDeserializedString, s + s, "my deserialized callback in deserialize changed value");
  

  mySerialized = System.Reflection.serialize(s, (key, value) => {
    equal(key, "", "top layer");
    equal(value, s, "top value");
    return 10;
  });
  notEqual(mySerialized.length, 0, "my serialized callaback in serlialize and deserialize with changed value");
  myDeserializedString = <string>System.Reflection.deserialize(mySerialized, (key, value) => {
    equal(key, "", "top layer");
    equal(value, 10, "top value");
    return s
  });
  equal(myDeserializedString, s, "my deserialized callback in serlialize and deserialize changed value");
  
  var a = ["ciao1", "miao1"];
  mySerialized = System.Reflection.serialize(a, (key, value) => {
    equal(key, "", "top layer");
    equal(value, a, "top value");
    return s;
  });
  notEqual(mySerialized.length, 0, "my array serialized callaback in serlialize with changed value");
  myDeserializedString = <string>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedString, s, "my array deserialized callback in serlialize changed value");
  
  var i = 0;
  mySerialized = System.Reflection.serialize(a, (key, value) => {
    if (!key) {
      equal(key, "", "top layer a");
      equal(value, a, "top value");
    }
    else {
      equal(key, "." + i, "top layer b");
      equal(value, a[i++], "top value");
      return s;
    }
  });
  
  var i = 0;
  notEqual(mySerialized.length, 0, "my serialized callaback in serlialize and deserialize with changed value");
  var myDeserializedArray = <string>System.Reflection.deserialize(mySerialized, (key, value) => {
    if (!key) {
      equal(key, "", "top layer c");
      equal(value.length, 2, "top value");
      equal(value[0], a[0], "top value");
      equal(value[1], a[1], "top value");
    }
    else {
      equal(key, i, "top layer d");
      equal(value, s, "top value");
      return a[i++];
    }
  });
  equal(myDeserializedArray.length, 2, "my deserialized callback in serlialize and deserialize changed value");
  equal(myDeserializedArray[0], a[0], "my deserialized callback in serlialize and deserialize changed value");
  equal(myDeserializedArray[1], a[1], "my deserialized callback in serlialize and deserialize changed value");
  
  function arrayaccess(array: any, path: string): any {
    if (!(array && path && path.length))
      return array;
    var calls = path.match(/\.\d+/g)
    for (var i = 0; i < calls.length; i++)
      array = array[calls[i].substr(1)];
    return array;
  }

  var aa = [["ciao1", "miao1"], ["ciao2", "miao2"]];
  mySerialized = System.Reflection.serialize(aa, (key, value) => {
    if (!key) {
      equal(key, "", "top layer a");
      equal(value, aa, "top value");
    }
    else 
      equal(value, arrayaccess(aa, key), "top value");
  });
  notEqual(mySerialized.length, 0, "my serialized callaback in serlialize and deserialize with changed value");
  var myDeserializedArray = <string>System.Reflection.deserialize(mySerialized, (key, value) => {
    if (key="") {
      equal(key, "", "top layer c");
      equal(value, myDeserializedArray, "top value");
    }
  });
  equal(myDeserializedArray.length, 2, "my deserialized callback in serlialize and deserialize changed value");
  equal(myDeserializedArray[0][0], aa[0][0], "my deserialized callback in serlialize and deserialize changed value");
  equal(myDeserializedArray[0][1], aa[0][1], "my deserialized callback in serlialize and deserialize changed value");
  equal(myDeserializedArray[1][0], aa[1][0], "my deserialized callback in serlialize and deserialize changed value");
  equal(myDeserializedArray[1][1], aa[1][1], "my deserialized callback in serlialize and deserialize changed value");

  ok(true);


});


function createobjs(max: number = 1, c: NameSpace.Class = new NameSpace.Class("start", new Date(), /ciao/g)): NameSpace.Class {
  var t = c;
  var date = new Date();
  var regex = /ciao/g;
  for (var i = 0; i < max; i++) {
    t.Class = new NameSpace.Class("c" + i, date, regex);
    var temp = new NameSpace.Class("a" + i, date, regex);
    temp.Class = t.Class;
    temp.Array = [t];
    t.Array = [t.Class, temp];
    t = t.Class;
  }
  return c;
}

