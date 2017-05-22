// Actions menu
function oyCrosswordMenu(puzz){
	this.puzz = puzz;
	
	this.hlist = puzz.hlist;
	this.vlist = puzz.vlist;
	this.footer = puzz.footer;
	
	this.canReveal = puzz.canReveal;
	this.canCheck = puzz.canCheck;		
	
	this.clues = puzz.clues;

	this.currentMenu = null;
	this.over = null;
	// cell states
	this.cache = new Array();
	for (var i=0; i < this.puzz.h; i++){	
		for (var j=0; j < this.puzz.w; j++){	  
			var key = j + "_" + i; 
			this.cache[key] = -1; 	// -1 - empty, 0 - full, 1 - guessed, 2 - revealed
		}  
	}
	
	// init scores	
	this.checks = 0;
	this.reveals = 0;
	this.deducts = 0;	
	this.matches = 0;
	this.score = 0;
	
	this.rank = -1;
	
	this.xpos = puzz.xpos; 
	this.ypos = puzz.ypos;	
	
	this.name = oyGetCookie("OYG_NICK_NAME"); 
	if (this.name == null || this.name == ""){
		this.name = "Anonimo";
	}
	
	this.server = new oyServer(this.puzz.appHome, this.puzz.ns, this.puzz.canTalkToServer);
	this.scoreSubmittedMatches = 0;	// number of matches for which core was submitted sucesfully
} 

oyCrosswordMenu.prototype.setCellState = function(x, y, value){
	this.cache[x + "_" + y] = value;
}  
 
oyCrosswordMenu.prototype.getCellState = function(x, y){
	return this.cache[x + "_" + y];
}


oyCrosswordMenu.prototype.bind = function(){
	this.inputCache = this.puzz.inputCache;
	 
	this.startOn = new Date();	
}

oyCrosswordMenu.prototype.unbind = function(){
	this.inputCache = null;
}

oyCrosswordMenu.prototype.focusNewCell = function(x, y){
	this.xpos = x; 
	this.ypos = y;
}

oyCrosswordMenu.prototype.invalidateMenu = function(){
	if (this.currentMenu != null){ 
		this.currentMenu();
	}
}

oyCrosswordMenu.prototype.installWelcomeMenu = function(){
	this.currentMenu = this.installWelcomeMenu;

	var target = document.getElementById("oygPuzzleFooter");
	target.innerHTML = "";

	var oThis = this;	
	
	var dispName = escape(this.name);
	dispName = dispName.replace(/%20/g, " ");
	/*
	this.addNoneWordAction( 
		target, 
		"Bienvenido, <a class='oysTextLink' href='' id='oygWelcomeLink'>" + dispName + "</a>! "
	);		
	var link = document.getElementById("oygWelcomeLink");
	link.onclick = function(){
		oThis.askNickName();
		oThis.invalidateMenu();
		return false; 
	} 
	*/
	 
	this.addNewLine(target);
	
	this.addAction( 
		target, "Inicio", "Iniciando...", " ",
		function(){				 
			oThis.puzz.bind();	
			oThis.puzz.hlist.clickItem(0);			
			oThis.installContextMenu();
			
			document.getElementById("oygStatic").innerHTML = "";
			
			oThis.footer.stateOk("<span style='display:none;'> Disfruta el juego! </span>");
		}
	);	

	this.footer.stateOk("<span style='display: none'> Haz clic en el botón para comenzar</span>");
	 
	this.server.trackAction(this.puzz.uid, "wlm");
}

oyCrosswordMenu.prototype.installContextMenu = function(){
	this.currentMenu = this.installContextMenu;

	var target = document.getElementById("oygPuzzleFooter");
	target.innerHTML = "";  
	 
	var hidx = this.hlist.getClueIndexForPoint(this.xpos, this.ypos);
	var vidx = this.vlist.getClueIndexForPoint(this.xpos, this.ypos);
	
	// reveals
	/*
    if (!this.canReveal){
		this.addNoneWordAction(target, "Deshabilitado Revelar");
	} else {			
		if (hidx != -1){
			var caption = "Revelar <b>" + (hidx + 1) + "H</b>"
			if (!this.hlist.clues[hidx].completed()){
				this.addRevealWordAction(
					this.hlist.clues[hidx], target, caption
				);
			} else {
				this.addAction(target, caption, "", null, null);
			}
		}
		if (vidx != -1){
			var caption = "Revelar <b>" + (vidx + 1) + "V</b>";
			if (!this.vlist.clues[vidx].completed()){	
				this.addRevealWordAction( 
					this.vlist.clues[vidx], target, caption
				);		
			} else {
				this.addAction(target, caption, "", null, null);
			}	 
		}
	} 
	*/
	// checks
	if (!this.canCheck){
		this.addNoneWordAction(target, "Deshabilitado Comprobar");
	} else {
        //Comprueba una únicamente
		/*
        var caption = "Comprobar <b>" + (hidx + 1) + "H</b>";
		if (hidx != -1){
			if (!this.hlist.clues[hidx].completed()){
				this.addCheckWordAction(
					this.hlist.clues[hidx], target, caption
				);
			} else {
				this.addAction(target, caption, "", null, null);
			}
		}
		
		var caption = "Comprobar <b>" + (vidx + 1) + "V</b>";
		if (vidx != -1){
			if (!this.vlist.clues[vidx].completed()){	 
				this.addCheckWordAction(
					this.vlist.clues[vidx], target, caption
				);		
			} else {
				this.addAction(target, caption, "", null, null);
			}	
		}
		*/
		
		var oThis = this;
		this.addAction(target, "<b>Finalizar</b>", "Revisando todo...", "checando",
			function(){				
				oThis.checkAll(); 
				oThis.invalidateMenu();		
				return false; 
			}
		);
		 
		this.addNewLine(target); 
		
		var oThis = this;
		this.addSubmitLeaveMenuItems(target);
	} 

	// footer
	this.footer.update(); 
	
	// check game over
	var hasNext = false;	
	for (var i=0; i< this.clues.length; i++){
		if (!this.clues[i].completed()){
			hasNext = true; 
			break;
		} 
	}
	if (!hasNext){
		this.over = true;
	}
		 
	if (this.over){ 
		this.over = true;
		this.puzz.unbind();		
		this.installDoneMenu();
	} 
} 
 
oyCrosswordMenu.prototype.installDoneMenu = function(){	
	this.currentMenu = this.installDoneMenu;

	var target = document.getElementById("oygPuzzleFooter");
	target.innerHTML = "";

    /*//Aquí es para la puntuación
	this.addNoneWordAction(target, "Juego Terminado!");	 
	this.addNewLine(target);
	var msg = "Tienes <b>" + this.score + "</b> puntos";
	if (this.rank != -1){
		msg += " (rank <b>" +  this.rank + "</b>)";
	}  
	msg += ".";
	
	this.addNoneWordAction(target, msg);	  
	this.addNewLine(target); 
	*/
	var oThis = this;
	this.addSubmitLeaveMenuItems(target);
	    
	this.footer.stateOk("<span style='display: none;'>Juego Terminado!</span>");
	 
	this.server.trackAction(this.puzz.uid, "fin");
	
	this.footer.update();
    /*
    var mensaje = "Int&eacute;ntalo de nuevo. ";
    if(this.matches == this.clues.length){
        mensaje = "Muy bien! ";
    }
    retroalimentar("<b>"+mensaje + "</b>Encontraste "+this.matches+" de "+this.clues.length+" palabras en el crucigrama.");
    */

    this.addNoneWordAction(target, this.obtenerRetroalimentacion() + "Encontraste "+this.matches+" de "+this.clues.length+" palabras en el crucigrama.");
}
 
oyCrosswordMenu.prototype.addSubmitLeaveMenuItems = function(target){
	if (this.puzz.canTalkToServer){
		var caption = "Enviar <b>puntuaci\xF3n</b>";  
		if (this.matches > 0 && this.scoreSubmittedMatches < this.matches){		
			var oThis = this;
			this.addAction(target, caption, "Enviando puntuaci\xF3n...", "suministrar",
				function(){	 	 		 
					oThis.submitScore();
					oThis.invalidateMenu();
					return false; 
				}  
			);
		} else {
			this.addAction(target, caption, "", null, null);
		}
	}
	
	var oThis = this;

	this.addAction(target, "Reiniciar", "Reiniciando...", "--",
		function(){			
			oThis.leaveGameEarly(oThis.puzz.leaveGameURL);
			oThis.footer.stateOk("<span style='display:none;'>Hecho</span>");
			return false; 
		} 
	);

}

oyCrosswordMenu.prototype.leaveGameEarly = function(url){
	this.footer.stateBusy("Abandonando...");

	var canLeave = true;
	if (this.puzz.started && !this.over){
		canLeave = confirm("¿En verdad quieres reiniciar?");
	}	  
	if (canLeave){ 
		window.location.reload();
	}
	
	this.footer.stateOk("<span style='display:none;'>Hecho</span>");
}

oyCrosswordMenu.prototype.addAction = function(target, caption, hint, track, lambda){
	caption = caption.replace(" ", "&nbsp;");

	var elem = document.createElement("A");
	elem.innerHTML = caption;	
	elem.href = "";				 	
	if (!lambda){
		elem.className = "oyMenuActionDis";
		elem.onclick = function(){
			return false;
		}		
	} else {
		elem.className = "oyMenuAction"; 		
		var oThis = this;
		elem.onclick = function(){
			oThis.footer.stateBusy(hint);
			setTimeout(
				function(){				
					lambda(); 
					oThis.server.trackAction(oThis.puzz.uid, track);
				}, 100
			); 
			return false;
		}		
	}
	
	target.appendChild(elem);	
}

oyCrosswordMenu.prototype.addNewLine = function(target){
	//var elem = document.createElement("br");
	//target.appendChild(elem);
}

oyCrosswordMenu.prototype.addNoneWordAction = function(target, caption){
	var elem = document.createElement("SPAN");
	elem.className = "oyMenuActionNone";
	elem.innerHTML = caption;	
	target.appendChild(elem);
}

oyCrosswordMenu.prototype.addCheckWordAction = function(clue, target, caption){
	var oThis = this;
	this.addAction(target, caption, "Checando...", "chk",
		function(){				
			oThis.checkWord(clue);						
			oThis.invalidateMenu();		
			return false; 
		}
	);  
}

oyCrosswordMenu.prototype.addRevealWordAction = function(clue, target, caption){
	var oThis = this;
	this.addAction(target, caption, "Revelando...", "rvl",
		function(){				
			oThis.revealWord(clue);			
			oThis.invalidateMenu();		
			return false; 
		}
	); 
} 
 
oyCrosswordMenu.prototype.getCurrentValueFor = function(x, y){
	var value = this.inputCache.getElement(x, y).value;
	if (value == ""){//Aquí se revisaba si estaba llena o con espacio, el espacio se admite en esta versión
		value = null;
	}
	
	return value;
}

oyCrosswordMenu.prototype.getCellPosListFor = function(clue, left, top){
	var all = new Array();
	  
	for (var i=0; i < clue.len; i++){
		all.push(this.charToPos(clue, i));
	}
	
	return all;
}

oyCrosswordMenu.prototype.charToPos = function(clue, offset){
	var pos = new function (){}
	
	if (clue.dir == 0){	
		pos.x = clue.xpos + offset;
		pos.y = clue.ypos;
	} else {
		pos.x = clue.xpos; 
		pos.y = clue.ypos + offset;
	} 
	
	return pos;
}

oyCrosswordMenu.prototype.showAnswer = function(clue, stateCode){
	for (var i=0; i < clue.len; i++){
		var pos = this.charToPos(clue, i);	
		var input = this.inputCache.getElement(pos.x, pos.y);		
		if (!input.readOnly){			
			input.readOnly = true;			
			input.value = clue.answer.charAt(i).toUpperCase();
			
			this.setCellState(pos.x, pos.y, stateCode); 
 		  	
 		 	var cell = document.getElementById("oyCell" + pos.x + "_" + pos.y);		
 		 	switch(stateCode){
 		 		case 1: 
					cell.className = "oyCellGuessed"; 		 		
 		 			break;
				case 2:
	 		 		cell.className = "oyCellRevealed"; 		 	
 		 			break; 		 			 
	 		 	default: 
	 		 		alert("C\xF3digo en mal estado!");		
 		 	} 		 	
		}  
	} 	  
	
	this.puzz.invalidate();
}

oyCrosswordMenu.prototype.checkWordStatus = function(clue){
	var status = new function (){};
	
	status.wrong = 0;
	status.isComplete = true; 
	status.buf = "";
	
	for (var i=0; i < clue.len; i++){			
		var value;
		if (clue.dir == 0){
			value = this.getCurrentValueFor(clue.xpos + i, clue.ypos);
		} else {
			value = this.getCurrentValueFor(clue.xpos, clue.ypos + i);
		}
 
		if (value == null){
			status.isComplete = false;
			status.buf += ".";
		} else {		
			status.buf += value;
		}
		
		if (value != clue.answer.charAt(i).toUpperCase()){
			status.wrong++; 
		}
	} 
    
	return status;
}

oyCrosswordMenu.prototype.askNickName = function(score){
	if (score){
		score = "Marcador: " + score + ". ";
	} else { 
		score = "";
	}
  
	if (this.name == null){
		this.name = "";
	}

	var oldName = this.name;
	this.name = window.prompt(  
		score + "Escribe tu NICK NAME o E-MAIL.\n" +  
		"Sin correo, la puntuaci\xF3n es guardada, pero no seras elegible para los premios.",
		this.name 
	);
	 
	var result = true; 
	if (this.name == null || this.name == ""){
		this.name = oldName;     
		result = false; 
	} 
	
	if (this.name != null && this.name != ""){  
		oySetCookieForPeriod("OYG_NICK_NAME", this.name, 1000*60*60*24*360, "/");
		return result;
	} else {  
		this.name = "Anonimo";
		return false; 
	}
}

oyCrosswordMenu.prototype.getScoreForMatch = function(clue){
	return clue.len; 
}

oyCrosswordMenu.prototype.getDeductsForReveal = function(clue){
	return clue.len * 2;  
} 

oyCrosswordMenu.prototype.getDeductionForCheck = function(clue){
	var CHECK_FRAQ = 3;
	
	var deduction = (clue.len - clue.len % CHECK_FRAQ) / CHECK_FRAQ;
	if (deduction < 1){
		deduction = 1;
	}
	
	return deduction;
}

oyCrosswordMenu.prototype.revealWord = function(clue){
	this.deducts += this.getDeductsForReveal(clue);	
	this.reveals++; 
	this.showAnswer(clue, 2);	  	 
	
	clue.revealed = true; 	
	clue.matched = false; 	
 
	var status = this.checkWordStatus(clue);	  	
	this.footer.stateOk("Revelado [" + status.buf + "]!");
}  

oyCrosswordMenu.prototype.checkAll = function(){
	var checked = 0;
	var correct = 0;
    for (var i=0; i < this.clues.length; i++){
        //console.log(this.clues.length+" - "+i+" - "+this.clues[i].completed());
        try{
            if (this.clues[i].completed()){
                continue;
            }
        } catch (e){
            console.log(e.message);
        }

		var status = this.checkWordStatus(this.clues[i]);
		if (status.isComplete){
			checked++;
			this.checks++; 
			this.deducts += this.getDeductionForCheck(this.clues[i]);
			//Colocar <span data-palabra='texto'>___________</span> en codigoCrucigrama.js en cada pista, para poner las palabras
            //var pistaCorrespondiente = document.body.querySelector(".oyPanelDiv span[data-palabra='" + this.clues[i].answer + "']");
            if (status.wrong == 0){
				this.showAnswer(this.clues[i], 1);	 	
				this.score += this.getScoreForMatch(this.clues[i]);
				
				this.clues[i].matched = true;
				this.clues[i].revealed = false;
				
				correct++; 
				this.matches++;
                //console.log("encontrada: ", this.clues[i].answer);
                //pistaCorrespondiente.innerHTML = this.clues[i].answer;
                //pistaCorrespondiente.className = "bien";
			} else {
                //console.log("NO encontrada: ", this.clues[i].answer);
                //pistaCorrespondiente.className = "mal";
            }
		} 
	}
		
	if  (checked == 0){
		this.footer.stateError("Por favor escribe todas las palabras para calificar");
	} else {
		//this.footer.stateOk("<span style='display: none'>Revisadas " + checked + ", " + correct + " Correctas!</span>");
        //Retroalimentación dependiendo el número de aciertos
        this.footer.stateOk(this.obtenerRetroalimentacion() + "Hasta el momento has encontrado "+this.matches+" de "+this.clues.length+" palabras en el crucigrama.");
	}
};
oyCrosswordMenu.prototype.obtenerRetroalimentacion = function(){
    var mensaje = "";
    if(this.matches === this.clues.length){
        mensaje = "¡Excelente! ";
    } else if(this.matches === this.clues.length-1){
        mensaje = "¡Bien! ";
    } else {
        mensaje = "Te recomendamos repasar para obtener un mejor resultado. ";
    }
    //Aquí podría enviar SCORM
    return mensaje;
};
oyCrosswordMenu.prototype.checkWord = function(clue){
	var status = this.checkWordStatus(clue);	  
	if (!status.isComplete){
		this.footer.stateError("La palabra [" + status.buf + "] esta incompleta!");
	} else { 
		this.checks++; 
		this.deducts += this.getDeductionForCheck(clue);			
		if (status.wrong != 0){		  
			this.footer.stateError("[" + status.buf + "] no coincide!");
		} else { 
			this.matches++; 
			this.showAnswer(clue, 1);	 	
			this.score += this.getScoreForMatch(clue);
			 
			clue.revealed = false; 	
			clue.matched = true; 	 
			
			this.footer.stateOk("[" + status.buf + "] coincide!");
		}
	}
}

oyCrosswordMenu.prototype.submitScore = function(){
	if (this.matches == 0){   
		this.footer.stateError("Nada que enviar a\xFAn!");
		alert("Nada que mostrar a\xFAn!\nDescubre algunas palabras primero.");
	} else {		  
		var ms = new Date().getTime() - this.puzz.menu.startOn.getTime();
		this.server.submitScore(
			this, this.puzz.uid, 
			this.score, this.deducts, this.checks, this.reveals, this.matches,
			ms, this.name,
			this.puzz.clues
		);
		this.footer.stateBusy("Enviando puntuaci\xF3n...");
	}
}  