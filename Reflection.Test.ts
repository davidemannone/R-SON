// your reference paths to *.ts


QUnit.module('Reflection');


module NameSpace {
  export class Class {
    public Name: string;
    public Date: Date;
    public RegEx: RegExp;
    public Class: Class = null;
    public Array: Class[] = [];
    constructor(s: string, d: Date, r: RegExp) { this.Name = s; this.Date = d; this.RegEx = r; }
  }
}

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
  var myDeserializedNil = <RegExp>System.Reflection.deserialize(mySerialized);
  equal(myDeserializedNil, nil, "my deserialized regula null");

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

  var mySerialized = System.Reflection.serialize(c1, "NameSpace");
  notEqual(mySerialized.length, 0, "my serialized");
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
  xxx.cachedTypes = { };


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

