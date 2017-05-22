if (!oygInit){ 
	oygError = 
		"Hubo un error al solicitar los datos del crucigrama al servidor.\n" + 
		"Por favor intenta de nuevo en breve o env\xEDanos una nota sobre el problema."
} else {						
	oygBind(oygCrosswordPuzzle);
}
if (oygError){
	alert(oygError);
}	