var current_hp_actor = {}; // Store HP of PC
var current_hp_npc = {}; // Store HP of NPC

Hooks.once('init', async function() {
  game.settings.register('health-monitor', 'npc_name', {
    name: 'Hide name of npc/monster',
    default: false,
    type: Boolean,
    scope: 'world',
    config: true,
    hint: 'Hide name of npc/monster'
  });
});

// HP storing code for canvas load or token created
Hooks.on('canvasReady', function() {
  // START collecting all PC HP information
  let actors = game.actors.entities.filter(e => e.data.type === 'character');
  for (actor of actors) {
    current_hp_actor[actor.data._id] = {
      'hpvalue': actor.data.data.attributes.hp.value,
      'hpmax': actor.data.data.attributes.hp.max,
      'name': actor.data.name
    };
  }
  // STOP collecting all PC HP information

  // START collecting all NPC HP information
  let npc = canvas.tokens.placeables.filter(e => e.actor.data.type === 'npc');
  for (actor of npc) {
    current_hp_npc[actor.data._id] = {
      'hpvalue': actor.actor.data.data.attributes.hp.value,
      'hpmax': actor.actor.data.data.attributes.hp.max,
      'name': actor.data.name,
      'display': actor.data.displayName
    };
  }
  // STOP collecting all NPC HP information
  console.log(current_hp_npc);
  console.log(current_hp_actor);
});
Hooks.on('createToken', function() {
  // START collecting all PC HP information
  let actors = game.actors.entities.filter(e => e.data.type === 'character');
  for (actor of actors) {
    current_hp_actor[actor.data._id] = {
      'hpvalue': actor.data.data.attributes.hp.value,
      'hpmax': actor.data.data.attributes.hp.max,
      'name': actor.data.name
    };
  }
  // STOP collecting all PC HP information

  // START collecting all NPC HP information
  let npc = canvas.tokens.placeables.filter(e => e.actor.data.type === 'npc');
  for (actor of npc) {
    current_hp_npc[actor.data._id] = {
      'hpvalue': actor.actor.data.data.attributes.hp.value,
      'hpmax': actor.actor.data.data.attributes.hp.max,
      'name': actor.data.name,
      'display': actor.data.displayName
    };
  }
  // STOP collecting all NPC HP information
});


// Spam in chat if token (NPC) is updated
Hooks.on("updateToken", (scene, token, updateData, options, userId) => {
  let chatData = "";
  if (game.user.isGM) { // Only the USER that promoted the change will spam the message
    const temp_hp = JSON.parse(JSON.stringify(current_hp_npc)); // Temporary HP for the math
    var math = {};

    // START collecting all NPC HP information
    let npc = canvas.tokens.placeables.filter(e => e.actor.data.type === 'npc');

    for (actor of npc) {
      current_hp_npc[actor.data._id] = {
        'hpvalue': actor.actor.data.data.attributes.hp.value,
        'hpmax': actor.actor.data.data.attributes.hp.max,
        'name': actor.data.name,
        'display': actor.data.displayName
      };
      math[actor.data._id] = {
        'hpdif': (parseInt(temp_hp[actor.data._id].hpvalue) - parseInt(current_hp_npc[actor.data._id].hpvalue)),
        'hpmaxdif': (parseInt(temp_hp[actor.data._id].hpmax) - parseInt(current_hp_npc[actor.data._id].hpmax))
      };

      if (math[actor.data._id].hpdif > 0 && math[actor.data._id].hpmaxdif == 0) {
        // Hide NPC name if it's not set to ALWAYS in its prototype token
        if (game.settings.get('health-monitor', 'npc_name') && actor.data.displayName != 50) {
          chatData = {
            content: ('<span class="hm_messagetaken">' + ' Unknown entity' + ' takes ' + (math[actor.data._id].hpdif) + ' damage </span>')
          };
        } else {
          chatData = {
            content: ('<span class="hm_messagetaken">' + current_hp_npc[actor.data._id].name + ' takes ' + (math[actor.data._id].hpdif) + ' damage </span>')
          };
        }
      }
      if (math[actor.data._id].hpdif < 0 && math[actor.data._id].hpmaxdif == 0) {
        // Hide NPC name if it's not set to ALWAYS in its prototype token
        if (game.settings.get('health-monitor', 'npc_name') && actor.data.displayName != 50) {
          chatData = {
            content: ('<span class="hm_messageheal">' + ' Unknown entity' + ' heals ' + (-math[actor.data._id].hpdif) + ' damage </span>')
          };
        } else {
          chatData = {
            content: ('<span class="hm_messageheal">' + current_hp_npc[actor.data._id].name + ' heals ' + (-math[actor.data._id].hpdif) + ' damage </span>')
          };
        }
      }
    }

    if ((chatData) !== '') {
      ChatMessage.create(chatData, {});
    }
    chatData = "";
  }
});

// Spam in chat if the actor is updated
Hooks.on('updateActor', (data, options, apps, userId) => {
  let chatData = "";
  if (game.user.isGM) {
    const temp_hp = JSON.parse(JSON.stringify(current_hp_actor)); // Temporary HP for the math
    console.log(temp_hp);
    var math = {};
    let npc = game.actors.entities.filter(e => e.data.type === 'character');

    for (actor of npc) {
      current_hp_actor[actor.data._id] = {
        'hpvalue': actor.data.data.attributes.hp.value,
        'hpmax': actor.data.data.attributes.hp.max,
        'name': actor.data.name
      };
      math[actor.data._id] = {
        'hpdif': (parseInt(temp_hp[actor.data._id].hpvalue) - parseInt(current_hp_actor[actor.data._id].hpvalue)),
        'hpmaxdif': (parseInt(temp_hp[actor.data._id].hpmax) - parseInt(current_hp_actor[actor.data._id].hpmax))
      };

      if (math[actor.data._id].hpdif > 0 && math[actor.data._id].hpmaxdif == 0) {
        chatData = {
          content: ('<span class="hm_messagetaken">' + current_hp_actor[actor.data._id].name + ' takes ' + (math[actor.data._id].hpdif) + ' damage </span>')
        };
      }

      if (math[actor.data._id].hpdif < 0 && math[actor.data._id].hpmaxdif == 0) {
        chatData = {
          content: ('<span class="hm_messageheal">' + current_hp_actor[actor.data._id].name + ' heals ' + (-math[actor.data._id].hpdif) + ' damage </span>')
        };
      }
    }

    if ((chatData) !== '') {
      ChatMessage.create(chatData, {});
    }

    chatData = "";
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
// STOP collecting all NPC HP information
});


// Spam in chat if token (NPC) is updated
Hooks.on("updateToken", (scene, token, updateData, options, userId) => {
  let chatData = "";
  if (game.user.isGM) { // Only the USER that promoted the change will spam the message
    const temp_hp = JSON.parse(JSON.stringify(current_hp_npc)); // Temporary HP for the math
    var math = {};

    // START collecting all NPC HP information
    let npc = canvas.tokens.placeables.filter(e => e.actor.data.type === 'npc');
    for (actor of npc) {
      current_hp_npc[actor.data._id] = {
        'hpvalue': actor.actor.data.data.attributes.hp.value,
        'hpmax': actor.actor.data.data.attributes.hp.max,
        'name': actor.data.name
      };
      math[actor.data._id] = {
        'hpdif': (parseInt(temp_hp[actor.data._id].hpvalue) - parseInt(current_hp_npc[actor.data._id].hpvalue)),
        'hpmaxdif': (parseInt(temp_hp[actor.data._id].hpmax) - parseInt(current_hp_npc[actor.data._id].hpmax))
      };
      if (math[actor.data._id].hpdif > 0 && math[actor.data._id].hpmaxdif == 0) {
        chatData = {
          content: ('<span class="hm_messagetaken">' + current_hp_npc[actor.data._id].name + ' takes ' + (math[actor.data._id].hpdif) + ' damage </span>')
        };
      }
      if (math[actor.data._id].hpdif < 0 && math[actor.data._id].hpmaxdif == 0) {
        chatData = {
          content: ('<span class="hm_messageheal">' + current_hp_npc[actor.data._id].name + ' heals ' + (-math[actor.data._id].hpdif) + ' damage </span>')
        };
      }
    }
    if ((chatData) !== '') {
      ChatMessage.create(chatData, {});
    }
    chatData = "";
  }
});

// Spam in chat if the actor is updated
Hooks.on('updateActor', (data, options, apps, userId) => {
  let chatData = "";
  if (game.user.isGM) {
    const temp_hp = JSON.parse(JSON.stringify(current_hp_actor)); // Temporary HP for the math
    console.log(temp_hp);
    var math = {};
    let npc = game.actors.entities.filter(e => e.data.type === 'character');
    for (actor of npc) {
      current_hp_actor[actor.data._id] = {
        'hpvalue': actor.data.data.attributes.hp.value,
        'hpmax': actor.data.data.attributes.hp.max,
        'name': actor.data.name
      };
      math[actor.data._id] = {
        'hpdif': (parseInt(temp_hp[actor.data._id].hpvalue) - parseInt(current_hp_actor[actor.data._id].hpvalue)),
        'hpmaxdif': (parseInt(temp_hp[actor.data._id].hpmax) - parseInt(current_hp_actor[actor.data._id].hpmax))
      };
      if (math[actor.data._id].hpdif > 0 && math[actor.data._id].hpmaxdif == 0) {
        chatData = {
          content: ('<span class="hm_messagetaken">' + current_hp_actor[actor.data._id].name + ' takes ' + (math[actor.data._id].hpdif) + ' damage </span>')
        };
      }
      if (math[actor.data._id].hpdif < 0 && math[actor.data._id].hpmaxdif == 0) {
        chatData = {
          content: ('<span class="hm_messageheal">' + current_hp_actor[actor.data._id].name + ' heals ' + (-math[actor.data._id].hpdif) + ' damage </span>')
        };
      }
    }
    if ((chatData) !== '') {
      ChatMessage.create(chatData, {});
    }
    chatData = "";
  }
});

//  This is for chat styling
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