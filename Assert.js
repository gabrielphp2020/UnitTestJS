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
                var name = Assert._GetFunctionName(testMethod);
                if (name !== null) {
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
                var name = Assert._GetFunctionName(testMethod);
                var final;
                if (name !== null) {
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


    static Init() {
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
                    ArrayUtils.Add(testingMethods, Assert._ExecuteMethod(testActual[CLASS], testActual[METHOD], testActual[TESTMETHOD], i));

                } else {
                    /*No existe el metodo a testear*/
                    Assert.OnObsolete(testActual[CLASS], testActual[METHOD]);
                }


            }

            Promise.all(testingMethods).then(() => { okey(); });



        });



    }


    static _ExecuteMethod(clase, func, testMethod, position) {

        return new Promise((okey, error) => {
            try {
                var aux = testMethod();
                if (aux instanceof Promise)
                    aux.then(okey).catch(error);
                else okey();
            } catch (ex) { error(ex); }

        }).then(() => {
            Assert.OnSuccess(clase, func, testMethod, position);

        }).catch((error) => {
            /*Trato error de ejecución*/
            Assert.OnError(clase, func, testMethod, error, position);


        });



    }


    static _GetFunctionName(func) {
        // Match:
        // - ^          the beginning of the string
        // - function   the word 'function'
        // - \s+        at least some white space
        // - ([\w\$]+)  capture one or more valid JavaScript identifier characters
        // - \s*        optionally followed by white space (in theory there won't be any here,
        //              so if performance is an issue this can be omitted[1]
        // - \(         followed by an opening brace
        //
        var result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString())

        return result ? result[1] : null; // for an anonymous function there won't be a match
    }



}