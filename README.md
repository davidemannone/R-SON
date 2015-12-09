# R-SON
JSON cyclic JavaScript object fast serializer/deserializer with user defined, Date and Regular Expression object re-type

Davide Mannone
davidemannone@hotmail.com

2015-12-04


JSON is a light-weight, language independent, data interchange format.
See http://www.JSON.org/


* Feature *

The files in this collection implement JSON encoders/decoders in JavaScript 
with this features:
1. serializes any kind of JavaScript cyclic object, including arrays
2. deseriliazes any standard JSON and any Reflection decycled object by 
   retrocycling, including arrays 
3. serializes/deserializes JavaScript standard Date and RegExp
4. Retypes/Reprototypes any user defined JavaScript object
5. possible to define user callbacks for change/extend the implemented
   way of serialization/deserialization
6. support to serialize undefined values
7. use of standard JSON.stringify and JSON.parse
8. written in strong typed TypeScript
9. NO USE OF EVAL!
10. Performance and resource use kept in mind.

* Description *

1. By including the Reflection.js file in your code you will be be able to:
1.1 serialize any cyclic (or not) object with any property type with: 
    var serializedString = System.Reflection.serialize(any);
2.1 deserialize any standard JSON or any decycled object to turn back to
    your original object with: 
    var deserialiazedObject = System.Reflection.deserialize(anyJSONstring);

2. If you want also retype your objects:
2.1 serialize by specify any TypeScript module name of your classes or
    any JavaScript function where search for your object functions:
    var typedSerializedString = System.Reflection.serialize(anyTypedOrNotTypedObject, ...modulenamepath)
2.2 deserialize by specify any TypeScript module name of your classes or
    any JavaScript function where search for your object functions:
    var retypedDeserializedObject = System.Reflection.deserialize(anyJSONTypedString, ...modulenamepath)
    If using TypeScript use the cast operator <yourClass>:
    var myObj = <myObjClass>System.Reflection.deserialize(anyJSONTypedString)
    
3. Modules and classes/functions are cached, thus if you are working on 
   a same session you do not need to specify twice a time the same module 
   names or functions. So you need to use the >2 argument method/function
   either for serialize or deserialize, just once.

4. By default at least class/function definition is searched in window

5. User defined classes/functions not specified/found at least one time 
   either during serialization or deserialiazation process are treated as 
   Objects, preserving cycling/decycling. 

6. User callback can be inserted both during serialization process to return
   any other value should be return in the final JSON:
6.1    var typedSerializedString = System.Reflection.serialize(anyTypedOrNotTypedObject, function callback(key, value) { 
                                     ...
                                     return undefined | anyvalue
                                   }, ...modulenamepath)
   or user callback can be inserted during deserialization process to return
   any other value should be return in the final object:
6.2    var typedSerializedString = System.Reflection.deserialize(anyTypedOrNotTypedObject, function callback(key, value) { 
                                     ...
                                     return undefined | anyvalue
                                   }, ...modulenamepath)
   User code will executes first of all other code and only cyclic/retrocyclic
   feature is preserved. Do not returning a value or returning undefined will 
   continue with standard process of the original value read.

7. Caching can be done when desidered by:
7.1.  Cache of modules/functions:
      System.Reflection.cacheNameSpaces(...moduleNameOrStringName)
7.2   Cache of classes/objectFunctions
      System.Reflection.cacheTypes(...classesOrFunctionName)

8. You can get the class/protoype name by calling:
   System.Reflection.getClassName(anyObject);

9. To avoid serialization of object properties start their name with a
   '$' character. Example: $NotSerialized = "anyValueyouWant"

10. By default undefined values do not seriualze as for standard JSON
    behaviour thus default is Syste.Reflection.IncludeUndefined = false
    If you want to serialize even undefined values set it to true and
    undefined properties or array values are serialized and
    deserialized too

11. Cyclic objects are mapped by use of incremental unique id inside
    the resulting JSON by assigning them sequentially when parsing objects.
    Elements in arrays are tracked by use of a XPath-dot-style like 
    expression (formulation wit use of regular expression 
    syntax):
    (ObjectUIniqueID)*.((ObjectPropertyName)*.(InArrayPositionIndex)*)*
    ObjectUniqueID: the object unique numeric identifier or nothing 
                    if it is a top level array 
    ObjectPropertyName: is the name of the object property if the
                        array variable is part of an object
    InArrayPositionIndex: is the position of the array element
    By use of serialization callback the key will be returned according
    to this syntax.
    By use of deserialization callback the returned key holds only
    "" blank values for objects, object property names o array index position
    without any other path style information.
    Both returns an empty string "" for the top level object or array 

13. All symbols and token used can be changed if necessary by setting
    property values.

14. Qunit Test code is provided. Consult the .Test. files to see
    extended use examples.




* API *

The full TypeScript API is:
Reflection.js
  System.
    Reflection.
      serialize(obj: any, ...namespaces: string[]): string  // returns JSON
      serialize(obj: any, callback: (key: string, value: any) => any | void, ...namespaces: string[]): string  // returns JSON
      deserialize(s: string, ...namespaces: string[]): any  // returns a retyped object
      deserialize(s: string, callback: (key: string, value: any) => any | void, ...namespaces: string[]): string  // returns a retyped object
      chacheNameSpace(...namespaces: string[])
      chacheType(...prototype: any): string  // returns class name
      getClassName(obj: any): string  // returns class name
      // behaviour settings
      IncludeUndefined: boolean = false  // set to true if undefined values should be serialized too
      // symbols and tokens used if changed they are used instead
      NOTSERIALIZESTARTDELIMITER = '$';
      OBJECTIDTOKEN = "$id";
      OBJECTREFERENCETOKEN = "$ref";
      OBJECTTYPETOKEN = "$type";
      DATETOKEN = "$date";
      REGEXPTOKEN = "$regex";
      UNDEFINEDTOKEN = "$undef";
      ARRAYPATHDELIMITER = '.';

The full JavaScript API is:
Reflection.js
  System.
    Reflection.
      serialize(obj, ...firstCallbackORANDdotStringPathsToFunctions)  // returns JSON
      deserialize(s, ...firstCallbackORANDdotStringPathsToFunctions)  // returns Object with prototype set
      chacheNameSpace(...dotStringPathsToFunctions)
      chacheType(...prototype)  // returns class name
      getClassName(obj)  // returns class name
      IncludeUndefined = false  // set to true if undefined values should be serialized too
      // symbols and tokens used if changed they are used instead
      NOTSERIALIZESTARTDELIMITER = '$';
      OBJECTIDTOKEN = "$id";
      OBJECTTYPETOKEN = "$type";
      DATETOKEN = "$date";
      REGEXPTOKEN = "$regex";
      UNDEFINEDTOKEN = "$undef";
      ARRAYPATHDELIMITER = '.';
 

* Examples *

** TypeScript use example **
// define any your object
module A.B.C {
   public class MyClass {
      public a: number = 0;
      public b: string = "hello R-SON";
      public c: RegExp = /R-SON/g;
      public d: MyClass = null;
      public e: Date[] = [new Date(), new Date()];
      public f: MyClass[] = [new MyClass()];
      public g: {
         a: string = "any object";
      }
      private $DoNotSerialize: string = "NotSerialized";
   }
}

// BEGIN EXAMPLE1: anywhere in your code...
var MyObj = new A.B.C.MyClass();
MyObj.d = MyObj;
MyObj.f.push(MyObj);
var s = System.Reflection.serialize(MyObj, "A.B.C");
var myobj = System.Reflection.deserialize(s);
// END EXAMPLE1

// BEGIN EXAMPLE2: ...or also anywhere in your code...
var MyObj = new A.B.C.MyClass();
MyObj.d = MyObj;
MyObj.f.push(MyObj);
System.Reflection.cacheNameSpace("A.B.C");
.... any other code
var s = System.Reflection.serialize(MyObj);
var myobj = System.Reflection.deserialize(s);
// END EXAMPLE2


** JavaScript use example **
// define any your object
function A {
   function B {
      function C {
         function MyClass = {
            this.a = 0;
            this.b = "hello R-SON";
            this.c = /R-SON/g;
            this.d = null;
            this.e = [new Date(), new Date()];
            this.f: = [new MyClass()];
            this.g: {
               a: = "any object";
            }
            this.$DoNotSerialize = "NotSerialized";
         }
      }
   }
}

// BEGIN EXAMPLE1: anywhere in your code...
var MyObj = new A.B.C.MyClass();
MyObj.d = MyObj;
MyObj.f.push(MyObj);
var s = System.Reflection.serialize(MyObj, "A.B.C");
var myobj = System.Reflection.deserialize(s);
// END EXAMPLE1



// BEGIN EXAMPLE2: or also anywhere in your code...
var MyObj = new A.B.C.MyClass();
MyObj.d = MyObj;
MyObj.f.push(MyObj);
System.Reflection.cacheNameSpaces("a.b.c");
//....any other code
var s = System.Reflection.serialize(MyObj);
var myobj = System.Reflection.deserialize(s);
// END EXAMPLE2
