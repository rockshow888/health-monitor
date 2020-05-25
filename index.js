var current_hp = {};  //array where hp of tokens are stored
let chatData="";
let polymorph_prevent= 0;
//HP storing code for canvas load or token created
Hooks.on('canvasReady', function(){
	const maptokens = canvas.tokens.placeables;
	for(i=0; i<canvas.tokens.placeables.length;i++)
	{	
		current_hp[maptokens[i].data._id]=maptokens[i].actor.data.data.attributes.hp.value;	
	}
});
Hooks.on('createToken', function(){
   const maptokens = canvas.tokens.placeables;
	for(i=0; i<canvas.tokens.placeables.length;i++)
	{	
		current_hp[maptokens[i].data._id]=maptokens[i].actor.data.data.attributes.hp.value;	
	}
});	
Hooks.on('preDeleteActor', x=> {
	if(x.data.flags.dnd5e.isPolymorphed)
	{
		polymorph_prevent=1;
	}
});

//spam in chat if token is updated
Hooks.on("updateToken", (scene, token, updateData, options, userId) => { 
	if(userId === game.user._id)
	{
	const temp_hp = JSON.parse(JSON.stringify(current_hp));
    const maptokens = canvas.tokens.placeables;
	var math = {};
	for(i=0; i<canvas.tokens.placeables.length;i++)
	{	
		current_hp[maptokens[i].data._id]=maptokens[i].actor.data.data.attributes.hp.value;	
	}
	for(i=0; i<canvas.tokens.placeables.length;i++)
	{
		if(typeof maptokens[i].actor.data.flags.dnd5e !== 'undefined') 
		{
			if(typeof maptokens[i].actor.data.flags.dnd5e.isPolymorphed !== 'undefined') 
			{
				if(maptokens[i].actor.data.flags.dnd5e.isPolymorphed == true)
				{
				return; //If the target is polymorphed will interrupt updateToken
				}
			}	
		}
		//console.log(maptokens[i].actor.data.flags.dnd5e.isPolymorphed);
		math[i]=-(parseInt(temp_hp[maptokens[i].data._id])-parseInt(current_hp[maptokens[i].data._id]));
		if(math[i]<0)
		{
			chatData = 
			{
				content: ('<span class="hm_messagetaken">'+maptokens[i].actor.data.name + ' takes '+(-math[i])+' damage </span>')
			};
		}
		if(math[i]>0)
		{
			chatData = 
			{
                content: '<span class="hm_messageheal">'+maptokens[i].actor.data.name + ' heals '+(math[i])+' damage </span>' 
				
			};
		}
	}
	//console.log(maptokens);
	if(polymorph_prevent==0)
	{
		if((chatData)!== '') {
		ChatMessage.create(chatData, {});	
		}
	}
	polymorph_prevent=0;
	chatData="";
	}
});
//spam in chat if the actor is updated
Hooks.on('updateActor', (data, options, apps, userId) => { 
	if(userId === game.user._id)
	{
	const temp_hp = JSON.parse(JSON.stringify(current_hp));
    const maptokens = canvas.tokens.placeables;
	var math = {};
	for(i=0; i<canvas.tokens.placeables.length;i++)
	{	
			current_hp[maptokens[i].data._id]=maptokens[i].actor.data.data.attributes.hp.value;
			
	}
	//console.log("current hp riassegnati");console.log(current_hp);
	for(i=0; i<canvas.tokens.placeables.length;i++)
	{

		math[i]=-(parseInt(temp_hp[maptokens[i].data._id])-parseInt(current_hp[maptokens[i].data._id]));
		if(math[i]<0)
		{
			chatData = 
			{
    			content: '<span class="hm_messagetaken">'+maptokens[i].actor.data.name + ' takes '+(-math[i])+' damage </span>',
			};
		}
		if(math[i]>0)
		{
			chatData = 
			{
				content: '<span class="hm_messageheal">'+maptokens[i].actor.data.name + ' heals '+(math[i])+' damage </span>' ,
			};
		}
			
	}
	if(polymorph_prevent==0)
	{
		if((chatData)!== '') {
		ChatMessage.create(chatData, {});	
		}
	}
	polymorph_prevent=0;
	chatData="";
	}
});	
// This is for chat styling

Hooks.on("renderChatMessage", (app, html, data) => { 
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
	
