Hooks.once('init', async function () {
	game.settings.register('health-monitor', 'npc_name', {
		name: 'Hide name of npc/monster',
		default: false,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: 'Hide name of npc/monster'
	});
	game.settings.register('health-monitor', 'GM_Vision', {
		name: 'GM Vision',
		default: true,
		type: Boolean,
		scope: 'world',
		config: true,
		hint: 'Display notification only to GM'
	});
});

//spam in chat if token (NPC) is updated
Hooks.on("preUpdateToken", async (scene, tokenData, update, options) => {
		let gm = game.user === game.users.find((u) => u.isGM && u.active)
    if (!gm) return;
	let hp = getProperty(update, "actorData.data.attributes.hp");
	if (hp !== undefined) {
		let actor = game.actors.get(tokenData.actorId)
		let data = {
			actorHP: getProperty(tokenData, "actorData.data.attributes.hp.value"),
			actorTemp: getProperty(tokenData, "actorData.data.attributes.hp.temp"),
			updateHP: update.actorData.data.attributes.hp.value,
			updateTemp: getProperty(update, "actorData.data.attributes.hp.temp")
		}
		if(isNaN(data.actorTemp)) data.actorTemp = 0
		if (isNaN(data.updateTemp)) data.updateTemp = data.actorTemp
		if(isNaN(data.updateHP)) data.updateHP = data.actorHP
		let change = (data.updateHP + data.updateTemp)- (data.actorHP + data.actorTemp)
		MessageCreate(change, actor.data.name)
	}
});
//spam in chat if the actor is updated
Hooks.on('preUpdateActor', async (actor, update, options, userId) => {

	let hp = getProperty(update, "data.attributes.hp");
	if (hp !== undefined) {
		let data = {
			actor: actor,
			actorHP: actor.data.data.attributes.hp.value,
			actorTemp: actor.data.data.attributes.hp.temp,
			updateHP: update.data.attributes.hp.value,
			updateTemp: getProperty(update, "data.attributes.hp.temp"),
		};
		if (isNaN(data.updateTemp)) data.updateTemp = data.actorTemp
		if(isNaN(data.updateHP)) data.updateHP = data.actorHP
		let change = (data.updateHP + data.updateTemp)- (data.actorHP + data.actorTemp)
		MessageCreate(change, data.actor.data.name)
	}
});
// This is for chat styling

function MessageCreate(hpChange, name) {
	if (hpChange > 0) {
		if (game.settings.get('health-monitor', 'npc_name')) {
			content = '<span class="hm_messageheal">' + ' Unknown entity' + ' heals ' + hpChange + ' damage </span>'
		}
		else {
			content = '<span class="hm_messageheal">' + name + ' heals ' + hpChange + ' damage </span>'
		}
	}
	if (hpChange < 0) {
		hpChange = -hpChange
		if (game.settings.get('health-monitor', 'npc_name')) {
			content = '<span class="hm_messagetaken">' + ' Unknown entity' + ' takes ' + hpChange + ' damage </span>'
		}
		else {
			content = '<span class="hm_messagetaken">' + name + ' takes ' + hpChange + ' damage </span>'
		}
	}
	let recipient;
	if (game.settings.get('health-monitor', 'GM_Vision')) recipient = game.users.find((u) => u.isGM && u.active).id;
	let chatData = {
		type: 4,
		user: recipient,
		speaker: { alias: "Health Monitor" },
		content: content,
		whisper: [recipient]

	};

	ChatMessage.create(chatData, {});
}

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