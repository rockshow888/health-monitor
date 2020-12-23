Hooks.once('init', async function () {
	game.settings.register('health-monitor', 'npc_name', {
		name: 'Hide name of npc/monster',
		default: false,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: 'Hide name of npc/monster'
	});
});


//spam in chat if token (NPC) is updated
Hooks.on("preUpdateToken", async (scene, tokenData, update, options) => {
	let hp = getProperty(update, "actorData.data.attributes.hp.value");
	let recipient = game.users.find((u) => u.isGM && u.active).id
	let chatData = {
		type: 4,
		user: recipient,
		speaker: { alias: "Health Monitor" },
		content: "",
		whisper: [recipient]
	}
	if (hp !== undefined) {
		let actor = game.actors.get(tokenData.actorId)
		let data = {
			actorData: canvas.tokens.get(tokenData._id).actor.data,
			updateData: update,
			actorHP: getProperty(tokenData, "actorData.data.attributes.hp.value"),
			updateHP: update.actorData.data.attributes.hp.value,
		}
		if (data.updateHP > data.actorHP) {
			if (game.settings.get('health-monitor', 'npc_name') && actor.data.displayName == 0) {
				chatData =
				{
					content: ('<span class="hm_messageheal">' + ' Unknown entity' + ' heals ' + (data.updateHP - data.actorHP) + ' damage </span>')
				};
			}
			else {
				chatData =
				{
					content: ('<span class="hm_messageheal">' + actor.data.name + ' heals ' + (data.updateHP - data.actorHP) + ' damage </span>')
				};
			}
		}
		if (data.updateHP < data.actorHP) {
			if (game.settings.get('health-monitor', 'npc_name') && actor.data.displayName == 0) {
				chatData =
				{
					content: ('<span class="hm_messagetaken">' + ' Unknown entity' + ' takes ' + (data.updateHP - data.actorHP) + ' damage </span>')
				};
			}
			else {
				chatData =
				{
					content: ('<span class="hm_messagetaken">' + actor.data.name + ' takes ' + (data.updateHP - data.actorHP) + ' damage </span>')
				};
			}
		}
	}
	ChatMessage.create(chatData, {});
});
//spam in chat if the actor is updated
Hooks.on('preUpdateActor', async (actor, update, options, userId) => {
	let recipient = game.users.find((u) => u.isGM && u.active).id
	let hp = getProperty(update, "data.attributes.hp.value");
	let chatData = {
		type: 4,
		user: recipient,
		speaker: { alias: "Health Monitor" },
		content: "",
		whisper: [recipient]
	}
	if (hp !== undefined) {
		let data = {
			actor: actor,
			actorHP: actor.data.data.attributes.hp.value,
			updateHP: update.data.attributes.hp.value,
		};
		if (data.updateHP > data.actorHP) {
			if (game.settings.get('health-monitor', 'npc_name') && actor.data.displayName == 0) {
				chatData =
				{
					content: ('<span class="hm_messageheal">' + ' Unknown entity' + ' heals ' + (data.updateHP - data.actorHP) + ' damage </span>')
				};
			}
			else {
				chatData =
				{
					content: ('<span class="hm_messageheal">' + data.actor.data.name + ' heals ' + (data.updateHP - data.actorHP) + ' damage </span>')
				};
			}
		}
		if (data.updateHP < data.actorHP) {
			if (game.settings.get('health-monitor', 'npc_name') && actor.data.displayName == 0) {
				chatData =
				{
					content: ('<span class="hm_messagetaken">' + ' Unknown entity' + ' takes ' + (data.updateHP - data.actorHP) + ' damage </span>')
				};
			}
			else {
				chatData =
				{
					content: ('<span class="hm_messagetaken">' + data.actor.data.name + ' takes ' + (data.updateHP - data.actorHP) + ' damage </span>')
				};
			}
		}
		ChatMessage.create(chatData, {});
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


