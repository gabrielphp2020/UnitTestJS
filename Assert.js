window.Import(window._ROOTUTILS + "Utils/ArrayUtils.js");
window.Import(window._ROOTUTILS + "Utils/ReflectionUtils.js");


class Assert {

    static get Methods() {

        if (!Assert._methods || Assert._methods === null)
            Assert._methods = [];

        return Assert._methods;


    }

    static set Methods(methods) {


        if (methods !== null) {

            /*Miro que haya [[campos]]*/

            Assert._methods = methods;

        } else Assert._methods = null;


    }
    static get Obsolete() {
        if (!Assert._successStyle) {
            Assert._successStyle = "success";
        }
        return Assert._successStyle;

    }
    static set Success(success) {

        Assert._successStyle = success;

    }
    static get Error() {
        if (!Assert._errorStyle) {
            Assert._errorStyle = "error";
        }
        return Assert._errorStyle;

    }
    static set Error(error) {

        Assert._errorStyle = error;

    }
    static get Obsolete() {
        if (!Assert._obsoleteStyle) {
            Assert._obsoleteStyle = "obsolete";
        }
        return Assert._obsoleteStyle;

    }
    static set Obsolete(obsolete) {

        Assert._obsoleteStyle = obsolete;

    }
    static get OnObsolete() {
        if (!Assert._obsolete) {
            Assert._obsolete = (clase, func) => {

                console.error("function to test not found \"" + new clase().constructor.name + "." + func + "\"");
            };
        }
        return Assert._obsolete;

    }
    static set OnObsolete(onObsolete) {

        Assert._obsolete = onObsolete;

    }

    static get OnError() {
        if (!Assert._error) {
            Assert._error = (clase, func, testMethod, error, posTest) => {
                var final;
                var name = ReflectionUtils.GetFunctionName(testMethod);
                if (name !== '') {
                    final = "\"  TestMethod=" + name;
                } else {
                    final = "\" posTest=" + posTest;
                    name = "nameLess";
                }
                console.error("function to test error \"" + new clase().constructor.name + "." + func + final);
                console.error(error);
            };
        }
        return Assert._error;

    }
    static set OnError(onError) {

        Assert._error = onError;

    }

    static get OnSuccess() {
        if (!Assert._success) {
            Assert._success = (clase, func, testMethod, posTest) => {
                var name = ReflectionUtils.GetFunctionName(testMethod);
                var final;
                if (name !== '') {
                    final = "\"  TestMethod=" + name;
                } else {
                    final = "\" posTest=" + posTest;
                    name = "nameLess";
                }
                console.log("function to test success \"" + new clase().constructor.name + "." + func + final);
            };
        }
        return Assert._success;

    }
    static set OnSuccess(onSuccess) {

        Assert._success = onSuccess;

    }


    static Init(lstOutPut = undefined) {
        return new Promise((okey, error) => {

            const CLASS = 0;
            const METHOD = 1;
            const TESTMETHOD = 2;

            var testingMethods = [];
            var testActual;

            for (var i = 0; i < Assert.Methods.length; i++) {
                testActual = Assert.Methods[i];

                /*Class,MethodToTest,TesterMethod*/
                if (ReflectionUtils.ExistFunction(testActual[CLASS], testActual[METHOD])) {
                    ArrayUtils.Add(testingMethods, Assert._ExecuteMethod(lstOutPut, testActual[CLASS], testActual[METHOD], testActual[TESTMETHOD], i));

                } else {
                    if (lstOutPut === undefined) {
                        /*No existe el metodo a testear*/
                        Assert.OnObsolete(testActual[CLASS], testActual[METHOD]);
                    } else {
                        var method = new clase().constructor.name + "." + func;
                        if (!Assert._dicObosolete)
                            Assert._dicObosolete = new Map();
                        if (!Assert._dicObosolete.has(method)) {
                            winAssertdow._dicObosolete.set(method, method);
                            lstOutPut.appendChild(Assert._GetAssertChildList(method, Assert.Obsolete));
                        }
                    }
                }


            }

            Promise.all(testingMethods).then(() => { okey(); });



        });



    }


    static _ExecuteMethod(lstOutPut, clase, func, testMethod, position) {
        var method = new clase().constructor.name + "." + func;
        return new Promise((okey, error) => {
            try {
                var aux = testMethod();
                if (aux instanceof Promise)
                    aux.then(okey).catch(error);
                else okey();
            } catch (ex) { error(ex); }

        }).then(() => {
            if (lstOutPut === undefined) {
                Assert.OnSuccess(clase, func, testMethod, position);
            } else {

                lstOutPut.appendChild(Assert._GetAssertChildList(method, Assert.Success, testMethod));
            }
        }).catch((error) => {
            if (lstOutPut === undefined) {
                /*Trato error de ejecución*/
                Assert.OnError(clase, func, testMethod, error, position);
            } else {

                lstOutPut.appendChild(Assert._GetAssertChildList(method, Assert.Error, testMethod, error));
            }

        });



    }
    static _GetAssertChildList(nameMethod, classType, testMethod = "", error = "") {

        var lstElement = document.createElement("li");
        lstElement.setAttribute("class", classType);
        lstElement.innerText = nameMethod + " " + ReflectionUtils.GetFunctionName(testMethod) + " " + error;
        return lstElement;
    }





}