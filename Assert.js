window.Import(window._ROOTUTILS+"ArrayUtils.js");

window.Import(window._ROOTUTILS+"ReflectionUtils.js");


class Assert{

static get Methods(){

if(!Assert._methods||Assert._methods===null)
Assert._methods=[];

return Assert._methods;


}

static set Methods(methods){


if(methods!== null)
{

/*Miro que haya [[campos]]*/

Assert._methods=methods;

}else Assert._methods=null;


}
static get OnObsolete(){
if(!Assert._obsolete)
{
Assert._obsolete=(clase,func)=>{
console.error("function to test not found\""+clase+"."+func+"\"");
};
}
return Assert._obsolete;

}
static set OnObsolete (onObsolete){

Assert._obsolete=onObsolete;

}

static get OnError(){
if(!Assert._error)
{
Assert._error=(clase,func,error,posTest)=>{
console.error("function to test error \""+clase+"."+func+"\" posTest="+posTest);
console.error(error);
};
}
return Assert._error;

}
static set OnError (onError){

Assert._error=onError;

}

static get OnSuccess(){
if(!Assert._success)
{
Assert._success=(clase,func,posTest)=>{
console.log("function to test success \""+clase+"."+func+"\" testPos="+posTest);
};
}
return Assert._success;

}
static set OnSuccess (onSuccess){

Assert._success=onSuccess;

}


static Init(){
return new Promise((okey,error)=>{

const CLASS=0;
const METHOD=1;
const METHODTOTEST=2;

var testingMethods=[];
var testActual;

for(var i=0; i<Assert.Methods.length;i++)
{
testActual=Assert.Methods[i];

/*Class,MethodToTest,TesterMethod*/
if(ReflectionUtils.ExistFunction(testActual[CLASS], testActual[METHOD])){
ArrayUtils.Add(testingMethods, Assert._ExecuteMethod(testActual[CLASS],testActual[METHOD], testActual [TESTMETHOD],i));

}else{
/*No existe el metodo a testear*/
Assert.OnObsolete(testActual[CLASS], testActual[METHOD]);
}


}

Promise.all(testingMethods).then(()=>{okey();});



});



}


static _ExecuteMethod(clase,function, testMethod,position){

return new Promise((okey,error)=>{
var aux=testMethod ();
if( aux instanceof Promise)
aux.then(okey);
else okey();

}).then(()=>{
Assert.OnSuccess(clase,function, position);

}).catch((error)=>{
/*Trato error de ejecución*/
Assert.OnError(clase, function,error,position);
});



}






}
