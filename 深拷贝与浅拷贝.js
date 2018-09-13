// 简单的赋值并不是浅拷贝，浅拷贝需要遍历每个属性然后赋值

/*
*  数组深拷贝
*  注意：Array的slice和concat方法都会返回一个新的数组实例，但是这两个方法对于数组中的对象元素却没有执行深复制，而只是复制了引用了，因此这两个方法并不是真正的深复制。例：[1,2,{a:1}]
*  slice() 方法可从已有的数组中返回选定的元素。
*/

var arr = ["One","Two","Three"];
var arrtoo = arr.slice(0);
arrtoo[1] = "set Map";

//  arr:["One","Two","Three"];
//  arrtoo:["One","set Map","Three"];


/*
*  concat() 方法用于连接两个或多个数组。该方法不会改变现有的数组，而仅仅会返回被连接数组的一个副本。
*/

var arr = ["One","Two","Three"];
var arrtooo = arr.concat();
arrtooo[1] = "set Map To";

//  arr:["One","Two","Three"];
//  arrtoo:["One","set Map","Three"];

/*
*  对象浅拷贝
*  如果我们要复制对象的所有属性都不是引用类型时，就可以使用浅拷贝，实现方式就是遍历并复制，最后返回新的对象。
*  Object的hasOwnProperty()方法返回一个布尔值，判断对象是否包含特定的自身（非继承）属性。
*/

function shallowCopy(obj) {
    var copy = {};
    // 只复制可遍历的属性
    for (key in obj) {
        // 只复制本身拥有的属性
        if (obj.hasOwnProperty(key)) {
            copy[key] = obj[key];
        }
    }
    return copy;
}

/*
*  JS内部实现了浅拷贝，如Object.assign()，其中第一个参数是我们最终复制的目标对象，后面的所有参数是我们的即将复制的源对象，支持对象或数组，一般调用的方式为
*/

var newObj = Object.assign({}, originObj);


/*
*  深拷贝
*  JSON对象是ES5中引入的新的类型（支持的浏览器为IE8+），JSON对象parse方法可以将JSON字符串反序列化成JS对象，stringify方法可以将JS对象序列化成JSON字符串，借助这两个方法，也可以实现对象的深复制。
*  这个方法使用较为简单，可以满足基本的深复制需求，而且能够处理JSON格式能表示的所有数据类型，但是对于正则表达式类型、函数类型等无法进行深复制(而且会直接丢失相应的值)，同时如果对象中存在循环引用的情况也无法正确处理。
*/

var source = {
    name:"source",
    child:{
        name:"child"
    }
}
var target = JSON.parse(JSON.stringify(source));
target.name = "target";
console.log(source.name);   //source
console.log(target.name);   //target
//改变target的child
target.child.name = "target child";
console.log(source.child.name);  //child
console.log(target.child.name);  //target child

/*
*  jQuery中的extend复制方法
*  jQuery的extend方法使用基本的递归思路实现了深度复制，但是这个方法也无法处理source对象内部循环引用的问题，同时对于Date、Function等类型的值也没有实现真正的深度复制，但是这些类型的值在重新定义时一般都是直接覆盖，所以也不会对源对象造成影响，因此一定程度上也符合深复制的条件
*/

//  实现深拷贝

//util作为判断变量具体类型的辅助模块
var util = (function(){
   var class2type = {};
   ["Null","Undefined","Number","Boolean","String","Object","Function","Array","RegExp","Date"].forEach(function(item){
	   class2type["[object "+ item + "]"] = item.toLowerCase();
   })

   function isType(obj, type){
	   return getType(obj) === type;
   }
   function getType(obj){
	   return class2type[Object.prototype.toString.call(obj)] || "object";
   }
   return {
	   isType:isType,
	   getType:getType
   }
})();

function copy(obj,deep){
	//如果obj不是对象，那么直接返回值就可以了
   if(obj === null || typeof obj !== "object"){
	   return obj;
   }
　　　　//定义需要的局部变脸，根据obj的类型来调整target的类型
   var i, target = util.isType(obj,"array") ? [] : {},value,valueType;
   for(i in obj){
	   value = obj[i];
	   valueType = util.getType(value);
　　　　　　　//只有在明确执行深复制，并且当前的value是数组或对象的情况下才执行递归复制
	   if(deep && (valueType === "array" || valueType === "object")){
		   target[i] = copy(value);
	   }else{
		   target[i] = value;
	   }
   }
   return target;
}














