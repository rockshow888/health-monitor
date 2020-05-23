var current_hp = {};  //array where hp of tokens are stored

//HP storing code for canvas load or token created
Hooks.on('canvasReady', function(){
	const maptokens = canvas.tokens.placeables;
	
	/*console.log(maptokens[0]);
	console.log(canvas.tokens.placeables);*/
	
	for(i=0; i<canvas.tokens.placeables.length;i++)
	{	
		current_hp[maptokens[i].data._id]=maptokens[i].actor.data.data.attributes.hp.value;	
		//token_id[i]= maptokens[i].data._id;
		/*console.log(current_hp[i]);
		console.log(token_id[i]);*/
		//console.log(current_hp);
	}
});
Hooks.on('createToken', function(){
   const maptokens = canvas.tokens.placeables;
	for(i=0; i<canvas.tokens.placeables.length;i++)
	{	
		current_hp[maptokens[i].data._id]=maptokens[i].actor.data.data.attributes.hp.value;	
		//console.log(current_hp);
	}
});	
//spam in chat if token is updated
Hooks.on('updateToken', function(){ 
	const temp_hp = JSON.parse(JSON.stringify(current_hp));
    const maptokens = canvas.tokens.placeables;
	var math = {};
	for(i=0; i<canvas.tokens.placeables.length;i++)
	{	
			current_hp[maptokens[i].data._id]=maptokens[i].actor.data.data.attributes.hp.value;	
	}
	for(i=0; i<canvas.tokens.placeables.length;i++)
	{
		math[i]=-(temp_hp[maptokens[i].data._id]-current_hp[maptokens[i].data._id]);
		if(math[i]<0)
		{
			let chatData = 
			{
				content: ('<span class="hm_messagetaken">'+maptokens[i].actor.data.name + ' takes '+(-math[i])+' damage </span>')
			};
			ChatMessage.create(chatData, {});
		}
		if(math[i]>0)
		{
			let chatData = 
			{
                content: '<span class="hm_messageheal">'+maptokens[i].actor.data.name + ' heals '+(math[i])+' damage </span>' 
			};
				ChatMessage.create(chatData);
		}
	}
});	
//spam in chat if the actor is updated
/*Hooks.on('updateActor', function(){ 
	const temp_hp = JSON.parse(JSON.stringify(current_hp));
    const maptokens = canvas.tokens.placeables;
	var math = {};
	for(i=0; i<canvas.tokens.placeables.length;i++)
	{	
			current_hp[maptokens[i].data._id]=maptokens[i].actor.data.data.attributes.hp.value;	
	}
	for(i=0; i<canvas.tokens.placeables.length;i++)
	{
		math[i]=-(temp_hp[maptokens[i].data._id]-current_hp[maptokens[i].data._id]);
		if(math[i]<0)
		{
			let chatData = 
			{
				content: ('<span class="hm_messagetaken">'+maptokens[i].actor.data.name + ' takes '+(-math[i])+' damage </span>')
			};
			ChatMessage.create(chatData, {});
		}
		if(math[i]>0)
		{
			let chatData = 
			{
                content: '<span class="hm_messageheal">'+maptokens[i].actor.data.name + ' heals '+(math[i])+' damage </span>' 
			};
				ChatMessage.create(chatData);
		}
	}
});	*/
// This is for chat styling
Hooks.on("renderChatMessage", (app, html, data) => { 
	    var x = document.getElementsByClassName("message flexcol")
		//console.log(x);
       
	    if (html.find(".hm_messageheal").length) {
   		html.css("background", "#06a406");
		html.css("text-shadow", "-1px -1px 0 #000 , 1px -1px 0 #000 , -1px 1px 0 #000 , 1px 1px 0 #000");
		html.css("color", "white");
		html.css("text-align", "center");
		html.css("font-size", "12px");
		html.css("margin", "2px");
		html.css("padding", "2px");
		html.css("border", "2px solid #191813d6");
		html.find(".message-sender").text("");	
		console.log(html.find(".message-metadata"));
		html.find(".message-metadata")[0].style.display = "none";
		}
	    if (html.find(".hm_messagetaken").length) {
   		html.css("background", "#c50d19");
		html.css("text-shadow", "-1px -1px 0 #000 , 1px -1px 0 #000 , -1px 1px 0 #000 , 1px 1px 0 #000");
		html.css("color", "white");
		html.css("text-align", "center");
		html.css("font-size", "12px");
		html.css("margin", "2px");
		html.css("padding", "2px");
		html.css("border", "2px solid #191813d6");
		html.find(".message-sender").text("");	
		html.find(".message-metadata")[0].style.display = "none";
		
		}
});
	
