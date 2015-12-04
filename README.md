# R-SON
JSON cyclic JavaScript object fast serializer/deserializer with user defined, Date and Regular Expression object re-type

Davide Mannone
davidemannone@hotmail.com

2015-12-04


JSON is a light-weight, language independent, data interchange format.
See http://www.JSON.org/


* Description *

The files in this collection implement JSON encoders/decoders in JavaScript 
with this features:
1. serializes any king of JavaScript cyclic object, including arrays
2. deseriliazes any standard JSON and any Reflection decycled object by 
   retrocycling, including arrays 
3. serializes/deserializes JavaScript standard Date and RegExp
4. Retypes/Reprototypes any user defined JavaScript object
5. use of standard JSON.stringify and JSON.parse and works with any
6. written in strong typed TypeScript

1. By including the Reflection.js file in your code you will be be able to:
1.1 serialize any cyclic object with any property type with: 
    var serializedString = System.Reflection.serialize(any);
2.1 deserialize to turn back to your original object with: 
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

4. User defined classes/functions not specified/found at least one time 
   either during serialization or deserialiazation process are treated as 
   Objects, preserving cycling/decycling. 

5. Caching can be done when desidered by:
5.1.  Cache of modules/functions:
      System.Reflection.cacheNameSpaces(...moduleNameOrStringName)
5.2   Cache of classes/objectFunctions
      System.Reflection.cacheTypes(...classesOrFunctionName)

6. You can get the class/protoype name by calling:
   Reflection.getClassName(anyObject);

7. NO USE OF EVAL!

8. The code is written with performance and reducing resource use in mind. 

9. Qunit Test code is provided.




* API *

The full TypeScript API is:
Reflection.js
  System.
    Reflection.
      serialize(obj: any, ...namespaces: string[]): string  // returns JSON
      deserialize(s: string, ...namespaces: string[]): any  // returns Object
      chacheNameSpace(...namespaces: string[])
      chacheTypes(...prototype: any): string  // returns class name
      getClassName(obj: any): string  // returns class name
    
    
The full JavaScript API is:
Reflection.js
  System.
    Reflection.
      serialize(obj, ...dotStringPathsToFunctions)  // returns JSON
      deserialize(s, ...dotStringPathsToFunctions)  // returns Object with prototype set
      chacheNameSpace(...dotStringPathsToFunctions)
      chacheTypes(...prototype)  // returns class name
      getClassName(obj)  // returns class name


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
   }
}

...anywhere in your code...
var MyObj = new A.B.C.MyClass();
MyObj.d = MyObj;
MyObj.f.push(MyObj);
var s = System.Reflection.serialize(MyObj, "A.B.C");
var myobj = System.Reflection.deserialize(s);

...or also anywhere in your code...
var MyObj = new A.B.C.MyClass();
MyObj.d = MyObj;
MyObj.f.push(MyObj);
System.Reflection.cacheNameSpaces("a.b.c");
....

var s = System.Reflection.serialize(MyObj);
var myobj = System.Reflection.deserialize(s);

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
         }
      }
   }
}

...anywhere in your code...
var MyObj = new A.B.C.MyClass();
MyObj.d = MyObj;
MyObj.f.push(MyObj);
var s = System.Reflection.serialize(MyObj, "A.B.C");
var myobj = System.Reflection.deserialize(s);

...or also anywhere in your code...
var MyObj = new A.B.C.MyClass();
MyObj.d = MyObj;
MyObj.f.push(MyObj);
System.Reflection.cacheNameSpaces("a.b.c");
....

var s = System.Reflection.serialize(MyObj);
var myobj = System.Reflection.deserialize(s);

