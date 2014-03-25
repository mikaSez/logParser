
	Object = function(){
		/*working with multiple methods with same name, used basically for api */
	this.addMethod = function(object, name, fn){ 
	  var old = object[ name ]; 
	  object[ name ] = function(){ 
	    if ( fn.length == arguments.length )  
	      return fn.apply( this, arguments ); 
	    else if ( typeof old === "function" ) 
          /*apply usage everywhere else not suitable : 
            https://bugs.webkit.org/show_bug.cgi?id=80797
            */
	      return old.apply( this, arguments ); 
	    }; 
		 }, 
		 /*last prime*/
		 this.merge = function (root){ 

		  for ( var i = 1; i < arguments.length; i++ ) 
		    for ( var key in arguments[i] ) 
		      root[key] = arguments[i][key]; 
		  return root; 
		} 
	} 

	function perValue() {
		var values = new Array();
		/*unique per default*/
		this.append = function(value){
			if(values.indexOf(value) ==-1)
				values.push(value);
			return this;
		};
		this.get = function(){
			return values;
		}
	}

    function Logger(){
     var words = new Array(); 
     var lines = new Array();
     var actingOn;
     var currentElement;
     var curentLineId = 1;
     var defaultOptions = {
     	'feeder' : 'pre',
        //TODO :)
     	'asynch' : false,
        'token'  : /[, \[\]]/,
        'reciever': document.body,
        'fragment': document.createDocumentFragment(),
        /*randomly generated by my sick mind*/
        'textLineClass': '235F4Hee35CC3VVVT-1-TLC-LP',
        'spannedLineClass': '232FEbb34CsEEB4-1-SLC-LP'
     };

    var lineContainer = function(){
        lineText = '',
        lineSpanned = ''
    };

    var addWordToDictionnary = function(word){
       if(words[word]==undefined){
            words[word] = new PerValue();
        }
        words[word].append(curentLineId);
        return this;
    };
     var proceedActing = function(elements, func){
         var newActors, i;
        if (typeof elements.map != "undefined") {
                newActors = elements.map(func);
            } else {
                newActors = [];
                i = elements.length;
                while (i--) {
                    newActors[i] = func(elements[i]);
                }
            }
            return newActors;
     };
     var actOnEachToken = function(element){
            var words = element.split(defaultOptions.token);

            return proceedActing(words, function(elem){
                addWordToDictionnary(elem);
                return elem;
            });
           
     };

     var actOnEachLine = function(element){
        var tempLines = element.innerHTML.replace(/\r\n/g, "\n").split("\n");
        return proceedActing(tempLines, function(elem){
            var temp = new lineContainer();
            
            //FIXME bad syntax

            temp.lineText = createElement('div',elem, curentLineId);
            temp.lineText.setAttribute("class", defaultOptions.textLineClass);

            temp.setTextLine(createElement('div',elem, curentLineId));
            temp.getTextLine().setAttribute("class", defaultOptions.textLineClass);
            var spanned = createElement('div', '' ,curentLineId);
            spanned.setAttribute("class", defaultOptions.spannedLineClass);
            var tempArray = actOnEachToken(elem);

             var tempCont = "";

             var tempCont = "";
            for (var i = 0; i < tempArray.length; i++) {
                if(tempArray[i]){
                    tempCont += '<span>' + tempArray[i] + '</span>' + ' ';
                    tempCont += '<span>' + tempArray[i] + '</span>' + ' ';
                }
            };
             spanned.innerHTML += tempCont;
            temp.lineSpanned = spanned; 
            }
             spanned.innerHTML += tempCont;
            temp.setLineSpanned(spanned);
            lines[curentLineId++] = temp;

             
            return elem;
        });
     };
     /*
     trying to delete all function references to avoid memory leaks.
     to learn more about memory leaks : http://perfectionkills.com/understanding-delete/
        there are only handler references... I hope :)
    */ 
     var purge = function(node) {
        var attributes = node.attributes, i, l, n;
        if (attributes) {
            for (i = attributes.length - 1; i >= 0; i -= 1) {
                n = attributes[i].name;
                if (typeof node[n] === 'function') {
                    node[n] = null;
                }
            }
        }
        var child = node.childNodes;
        if (child) {
            l = child.length;
            for (i = 0; i < l; i += 1) {
                purge(node.childNodes[i]);
            }
        }
    };


      var createElement =  function(elementName, elementText, elementId){
            var elem = document.createElement(elementName);
            elem.innerHTML = elementText;
            elem.setAttribute("id", elementId+'');
            return elem;
     };


      var cleanElement = function(){
        if(currentElement === undefined)
            return;
         var element = currentElement;
         defaultOptions.reciever.replaceChild(lines[element.getAttribute('id')].getTextLine(), element);
         currentElement = undefined;

     };

    var registerElement = function(element){
         currentElement = element;
    };

    var hideElement = function(element){
        console.log(element);
    };
    var hideElements = function(elements){
        var array = Array().slice.call( elements ); 
        for (var i = lines.length-1; i >= 1; i--) {
            if(array.indexOf(i) != -1){
                continue;
            }
            //FIXME ugly hack
            document.getElementById(i+'').setAttribute("style", "display:none;");
            console.log(lines[i]);

        };
    };
     this.addMethod(this, "hoverHandler", function(event){
        event.preventDefault();
        if(event.target.getAttribute("class") == null || event.target.getAttribute("class") == undefined)
            return;
        if(event.target.getAttribute("class").indexOf(defaultOptions.textLineClass) != -1){
            var element = event.target;
            var newElement = lines[element.getAttribute('id')].getLineSpanned();
            element.parentNode.replaceChild(newElement, element);
            cleanElement();
            registerElement(newElement);
        } 
        
     }),
    this.addMethod(this, "clickHandler", function(event){
        event.preventDefault();
        var tempClass = event.target.parentNode.getAttribute("class");
        if(tempClass === null || tempClass === undefined)
            return;
        if(tempClass.indexOf(defaultOptions.spannedLineClass) != -1){
            hideElements(words[event.target.innerHTML].get());
        } 
        
     }),
    
     /*add words to dictionnairy*/
     this.addMethod(this, "add", function(key, value){
        if(words[key]==undefined){
            words[key] = new PerValue();
        }
        words[key].append(value);
        return this;
     }),

     //TODO all prepend/append stuff need serious refactor  
     this.addMethod(this, "append", function(){
        var tempConcat ='';
         
        for (var i = 1; i < lines.length; i++) {
            var elem = lines[i].getTextLine();
           defaultOptions.reciever.appendChild(elem);
        };

        defaultOptions.reciever.innerHTML = tempConcat + defaultOptions.reciever.innerHTML;
     }),


     this.addMethod(this, "prepend", function(){

        for (var i = lines.length - 1; i > 0; i--) {
            var elem = lines[i].getTextLine();
            defaultOptions.fragment.insertBefore(elem,defaultOptions.fragment.childNodes[0]);

          }; 
         defaultOptions.reciever.insertBefore(defaultOptions.fragment,defaultOptions.reciever.childNodes[0]);
     }),
     this.addMethod(this, "prepend", function(object){
        defaultOptions.reciever.innerHTML = object + defaultOptions.reciever.innerHTML;
     }),

     this.addMethod(this, "parseLines", function(){
        if(actingOn === undefined){
            this.feed();
        }
          timeLapse();
        /*si actingOn est un élément récupéré par getById*/
        if(actingOn.length === undefined){
           actOnEachLine(actingOn);
        }else {
            /**FIXME: l'ordre n'est pas assuré*/
           var elements = this.makeArray(actingOn);
           var i = elements.length;

           while(i--)
              actOnEachLine(elements[i]);
        }
         
        console.log("parsing time :" + timeLapse());
        timeLapse();
         
        this.prepend();
        /*addEventListener/atachEvent not needed here i think*/
        defaultOptions.reciever.onmousemove=  this.hoverHandler;
        defaultOptions.reciever.onclick=  this.clickHandler;
        if(!defaultOptions.asynch){
            this.removeSource();
        }
         console.log("appending time :" + timeLapse());
         console.log("totalLines : " + lines.length);
         console.log("appending time :" + timeLapse());
     }),
     /*remove an element from dom and kill all references to it*/
     this.addMethod(this, "removeSource", function(){
        console.log(actingOn.length !== undefined);
        if(actingOn.length !== undefined){
            for (var i = actingOn.length - 1; i >= 0; i--) {
                purge(actingOn[i]);
                actingOn[i].parentNode.removeChild(actingOn[i]);
            };
        } else{
               purge(actingOn);
               (function(x){
                    x.parentNode.removeChild(x);
                })
               (document.getElementById(actingOn.getAttribute('id')));
        }
     }),

     this.addMethod(this, "makeArray", function(element){
        return Array().slice.call( element ); 
     }),

     

     /*takes the default feeder*/
     this.addMethod(this, "feed", function(){
        return this.feed(defaultOptions.feeder);
     }),
     /* takes a costume feeder */
     this.addMethod(this, "feed", function(feeder){
        var firstChar  = String().slice.call(feeder, 0, 1);
        if(firstChar === "#"){
             actingOn = document.getElementById(String().slice.call(feeder, 1));
        } else if( firstChar === '.') {
            actingOn = document.getElementsByClassName(String().slice.call(feeder, 1));
        } else {
            actingOn = document.getElementsByTagName(feeder);
        }
        return this;
     }),
     /*initialisation des options*/
     this.addMethod(this, "init", function(options){
     	console.log(this.merge(defaultOptions,options));
         return this;
     }),

     /*'cause barking is fun */
     this.addMethod(this,"bark", function(){
     	console.log("woof ! ");
         return this;
     }),
     /*barking many times is even funnier*/
     this.addMethod(this,"bark", function(nb){
       while(nb--)
     	 console.log("woof ! ");
       return this;
     }),
     /*get values associated with words */
     this.addMethod(this, "get", function(key){
     	return words[key].get();
     })
    }


Logger.prototype = new Object();