class Assert{

static get Methods(){

if(!Assert._methods)
Assert._methods=[];

return Assert._methods;


}

static set Methods(methods){


if(methods!== null)
{

/*Miro que haya [[campos]]*/

Assert._methods=methods;

}else Assert._methods=[];


}


static Init(){
return new Promise((okey,error)=>{

var testingMethods=[];
var testActual;

for(var i=0; i<Assert.Methods.length;i++)
{
testActual=Assert.Methods[i];

/*Class,MethodToTest,TesterMethod*/
if(ReflectionUtils.ExistMethod(testActual[CLASS], testActual[METHOD])){
ArrayUtils.Add(testingMethods, ReflectionUtils.ExecuteMethod(testActual[CLASS], testActual [TESTMETHOD], testActual[METHOD]));
ArrayUtils.Last(testingMethods).catch((error)=>{
/*Trato error de ejecución*/

});
}else{
/*No existe el metodo a testear*/

}


}

Promise.all(testingMethods).then(()=>{okey();});



});



}






}
