
function pushAnimatedTile(tileInfo, x, y, animSpacingX)
{
	var coords = [];

	for (var i=0; i<4; i++)
	{
		coords.push({x: x + animSpacingX * i, y: y});
	}

	tileInfo.push(
	{
		type: "simple",
		coords: coords
	});
}

function pushAutotile(tinfo, tileSize, offsetX, offsetY)
{

	var tileIndex = tinfo.length;

	pushAnimatedTile(tinfo, (2+offsetX)*tileSize, (1+offsetY)*tileSize, 3*tileSize);
	pushAnimatedTile(tinfo, (2+offsetX)*tileSize, (2+offsetY)*tileSize, 3*tileSize);
	pushAnimatedTile(tinfo, (2+offsetX)*tileSize, (3+offsetY)*tileSize, 3*tileSize);
	pushAnimatedTile(tinfo, (1+offsetX)*tileSize, (3+offsetY)*tileSize, 3*tileSize);
	pushAnimatedTile(tinfo, (0+offsetX)*tileSize, (3+offsetY)*tileSize, 3*tileSize);
	pushAnimatedTile(tinfo, (0+offsetX)*tileSize, (2+offsetY)*tileSize, 3*tileSize);
	pushAnimatedTile(tinfo, (0+offsetX)*tileSize, (1+offsetY)*tileSize, 3*tileSize);
	pushAnimatedTile(tinfo, (1+offsetX)*tileSize, (1+offsetY)*tileSize, 3*tileSize);
	pushAnimatedTile(tinfo, (1+offsetX)*tileSize, (2+offsetY)*tileSize, 3*tileSize);
	pushAnimatedTile(tinfo, (2+offsetX)*tileSize, (0+offsetY)*tileSize, 3*tileSize);
	pushAnimatedTile(tinfo, (0+offsetX)*tileSize, (0+offsetY)*tileSize, 3*tileSize);

	var indexes =[]
	for (var i=0;i<12;i++)
	{
		indexes.push(i+tileIndex);
	}

	tileInfo.push(
	{
		type: "autotile12",
		passable: Passable.Air,
		indexes: indexes
	});
}

var tileInfo = [];

tileInfo.push(
{
	type: "simple",
	passable: Passable.Air | Passable.Ground,
	coords:[ {x:48, y:0} ]
});

pushAutotile(tileInfo, 48, 0, 0);



function Map(w,h)
{
	var tiles = {};
	this.width = w;
	this.height = h;
	
	function makeTileKey(x,y) {
		return x + "," + y;
	}
	
	this.map = function(x,y)
	{
		if (tiles[makeTileKey(x,y)])
		{
			return tiles[makeTileKey(x,y)];
		}
		return 0;
	}
	
	this.setTile = function (x,y,tile)
	{
		tiles[makeTileKey(x,y)] = tile;
	}
	return this;
}

// TODO: make proper loader


function loadImages(imageArray, onComplete)
{
	var loadedImages = [];

	function loadNextImage()
	{
		if (loadedImages.length == imageArray.length)
		{
			onComplete(loadedImages);
		}
		else
		{
			var theImage = new Image();
			theImage.src = imageArray[loadedImages.length];
			theImage.onload = function()
			{
				loadNextImage();
			}
			loadedImages.push(theImage);
		}
	}

	loadNextImage();
}


loadImages([
	"/images/game/output.png", 
	"/images/game/transparent.png", 
	"/images/game/backgroundpng.png", 
	"/images/game/wings_anim.png",
	"/images/game/explode_anim.png",
	"/images/game/onetilechars.png"
	], 
	function(loadedImages)
	{
		charImg = loadedImages[0];
		tilesetImg = loadedImages[1];
		backgroundImg = loadedImages[2];
		wingsAnim = loadedImages[3];
		explodeAnim = loadedImages[4];
		oneTileCharImg = loadedImages[5];
		startGame();
	});


function startScene(parent,map,script)
{
	var input = new SimpleInput();
	var world = new World(tilesetImg, charImg, oneTileCharImg, backgroundImg, tileInfo, map);

	world.addAnimation("wings", wingsAnim, 192, 192);
	world.addAnimation("explode", explodeAnim, 64, 64);
	
	var map = new CanvasMapView(10, 10, 0, 640,480, world.getModel());
	map.setHasBorder(true);

	var dialog = new DialogView(10,10,1,640,480,"/images/game/midJQ.png");
	var controlleft = new DialogView(10,10,1,640,480,"/images/game/midJQ.png");
	var controlright = new DialogView(10,10,1,640,480,"/images/game/midJQ.png");
	var statusDialog = new DialogView(10,10,1,640,480,"/images/game/midJQ.png");

	controlleft.modeLeftDialog();
	controlright.modeRightDialog();
	statusDialog.modeStatusDialog();

	mapDisplay = parent

	mapDisplay.appendChild(controlleft.getDiv());
	mapDisplay.appendChild(controlright.getDiv());
	mapDisplay.appendChild(statusDialog.getDiv());
	mapDisplay.appendChild(dialog.getDiv());
	mapDisplay.appendChild(map.getDiv());


	var gameState = new GameState(input, world, map);
	
	var lastUpdateTime = new Date();

	var interval = setInterval(function()
	{
	    var timeBetween = new Date() - lastUpdateTime;
	    if (timeBetween > 200)
	    {
	    	// 200ms updates
			lastUpdateTime = new Date();
	    }

		input.checkInputs();

		dialog.update();
		controlleft.update();
		controlright.update();
		statusDialog.update();
		map.update();

	}, 16)

	gameState.dialogs["BOTTOM"] = dialog;
	gameState.dialogs["LEFT"] = controlleft;
	gameState.dialogs["RIGHT"] = controlright;
	gameState.dialogs["STATUS"] = statusDialog;

	map.setMaskOpacity(1);

	gameState.runScript(script);

	return {
		interval: interval,
		gameState: gameState,
		mapDisplay: mapDisplay,
		map: map,
		parent: parent
	};
}

function stopScene(scene)
{
	clearInterval(scene.interval);
	scene.gameState.stop();
	scene.parent.removeChild(scene.mapDisplay);
}



function startGame()
{
	firstmap();
}

function secondmap()
{
}


function firstmap()
{
	var mapInfo = new Map(100,100);

	var gameState;
	
	var setTile =
	[
		Character.customAction(function(char)
		{
			var front = world.getPositionOf(char, 1);
			mapInfo.setTile(front.x, front.y, 12);
			world.rerenderWorld();
		})
	];
	
	var clearTile =
	[
		Character.customAction(function(char)
		{
			var front = world.getFrontOf(char, 1);
			mapInfo.setTile(front.x, front.y, 0);
			world.rerenderWorld();
		})
	];
	
	var killPersonScript =
	[
		Interaction.addAnimationOnInteractee("explode"),
		Interaction.killInteractee,
		Character.die
	];

	var fireballScript =
	[
		Character.assignCollide(killPersonScript),
		Character.setSlow(8),
		Character.setIsFlying,
		Character.walkForward,
		Character.walkForward,
		Character.walkForward,
		Character.walkForward,
		Character.walkForward,
		Character.walkForward,
		Character.walkForward,
		Character.walkForward,
		Character.die
	];

	var controlMenu = [
		{name: "Bag", desc: "Check your inventory"},
		{name: "Equip", desc: "Check your equipment"},
		{name: "Status", desc: "Check your status"},
		{name: "Skills", desc: "Check your skills"},
		{name: "Magic", desc: "Check your magic"},
		{name: "Config", desc: "Change game configuration"},
		{name: "Save", desc: "Save game"},
	];

	var showControls =
	[
		Script.showDialog("RIGHT"),
		Script.showDialog("LEFT"),
		Script.showDialog("STATUS"),
		Script.simpleSelectDialog("LEFT", controlMenu.map(function(x){ return x.name; }), 
			function(sel)
			{

			}, 
			function(cursel)
			{
				gameState.runScript([Script.setDialogText("STATUS", [controlMenu[cursel].desc])])
			},
			true
		),

		Script.hideDialog("STATUS"),
		Script.hideDialog("LEFT"),
		Script.hideDialog("RIGHT"),
	];
	
	var heroScript =
	[
		Character.centerCamera,
		Character.assignDirectionalControl,
		Character.assignCollide([]),
		Character.assignZ([
			Script.gotoif("end", function(gameState)
			{
				var thingId = gameState.world.getCharacterInFrontOf(gameState.currChar);
				if (thingId !== undefined)
				{
					var thing = gameState.world.getModel().getCharacter(thingId);
					return !Carriables[thing.typeid];
				}
				return !gameState.world.isACarrier(gameState.currChar);
			}),
			Character.carryFront,
			Script.label("end")
		]),
		Character.assignX([Character.addAnimation("wings")]),
		Character.assignA([Character.interact]),
		//Character.assignS([Character.spawnCharacterAtFront(2,-16,fireballScript)])
	];
	
	var boyTalkedToScript =
	[
		Interaction.pauseInteractee,
		Interaction.faceInteractor,
		Script.showDialog("BOTTOM"),
		Script.speechDialog("BOTTOM", ["宇宙からの愛のエネルギーを", "胸が痛いほどに感じています"]),
		Script.simpleSelectDialog("BOTTOM", ["Kagami", "Tsukasa", "Konata", "Miyuki", "Kusakabe", "Hiyori"], 
			function(sel){}),
		Script.hideDialog("BOTTOM"),
		Interaction.resumeInteractee
	];
	
	var boyScript =
	[
		Character.assignInteract(boyTalkedToScript),
		Character.setSlow(64),
		Character.walkUp,
		Character.walkUp,
		Character.walkDown,
		Character.walkDown,
		Script.repeat,
	];
	
	var girlScript =
	[
		Character.setSlow(64),
		Character.walkLeft,
		Character.walkLeft,
		Character.walkLeft,
		Character.walkLeft,
		Character.walkRight,
		Character.walkRight,
		Character.walkRight,
		Character.walkRight,
		Script.repeat,
	];

	var collidedThing = 0;
	var showOuch = 
	[
		Interaction.getInteracteeId(function(id) { 
			console.log("id = " + id); 
			collidedThing = id; 
		}),
		Script.gotoif("end", function() { return collidedThing !== 0; }),
		Script.showDialog("BOTTOM"),
		Script.speechDialog("BOTTOM", ["Ouch"]),
		Script.hideDialog("BOTTOM"),
		Script.label("end"),
	];

	var p = 100;

	var walkUpDown =
	[
		Character.setSlow(64),

		Character.assignCollide(showOuch),

		Script.label("start"),

		Script.do(function() { /*console.log("nyan");*/ }),

		Script.run(4,
		[
			Character.walkDown,
			Character.getCharPos(function(x,y) { /*console.log("pos: " + x + " " + y)*/ })
		]),
		Script.run(4,
		[
			Character.walkUp,
			Character.getCharPos(function(x,y) { /*console.log("pos: " + x + " " + y)*/ })
		]),

		Script.gotoif("start", function() { return p == 100; }),
	];

	var boxCollide =
	[
		Character.turnBackOnInteractor,
		Character.walkForward,
		Script.customAction(function(theGameState) { 
			console.log("boxDidMove", theGameState.currChar);
		}),

	];
	
	var boxScript =
	[
		Character.setSlow(64),
		Character.assignHitBySomething(boxCollide)
	];



	var dekomoriTalk =
	[
		Interaction.pauseInteractee,
		Script.showDialog("BOTTOM"),
		Script.speechDialog("BOTTOM", ["Dekomori", "I'm stuck here","I'm stuck here","I'm stuck here"]),
		Script.speechDialog("BOTTOM", ["Dekomori", "Help me...", "Help me... ", "Please help me get out of here!"]),
		Script.hideDialog("BOTTOM"),
		Interaction.resumeInteractee
	];
	
	var dekomoriScript =
	[
		Character.faceDown,
		Character.assignInteract(dekomoriTalk),
	];
	

	var morisamaTalk =
	[
		Interaction.pauseInteractee,
		Script.showDialog("BOTTOM"),
		Script.speechDialog("BOTTOM", ["Shinka", "Well, looks like you broke out.", "How did you do it?"]),
		Script.simpleSelectDialog("BOTTOM", ["Kagami", "Tsukasa", "Konata", "Miyuki", "Kusakabe", "Hiyori"], 
			function(sel){}),
		Script.hideDialog("BOTTOM"),
		Interaction.resumeInteractee
	];
	
	var morisamaScript =
	[
		Character.faceDown,
		Character.assignInteract(morisamaTalk),
	];


	var girl3Talk =
	[
		Interaction.pauseInteractee,
		Script.showDialog("BOTTOM"),
		Script.speechDialog("BOTTOM", ["Dekomori", "胸が痛いほどに感じています"]),
		Script.simpleSelectDialog("BOTTOM", ["Kagami", "Tsukasa", "Konata", "Miyuki", "Kusakabe", "Hiyori"], 
			function(sel){}),
		Script.hideDialog("BOTTOM"),
		Interaction.resumeInteractee
	];
	
	var girl3 =
	[
		Character.faceDown,
		Character.assignInteract(girl3Talk),
	];


	var davidTalk =
	[
		Interaction.pauseInteractee,
		Script.showDialog("BOTTOM"),
		Script.speechDialog("BOTTOM", ["David", "胸が痛いほどに感じています"]),
		Script.simpleSelectDialog("BOTTOM", ["Kagami", "Tsukasa", "Konata", "Miyuki", "Kusakabe", "Hiyori"], 
			function(sel){}),
		Script.hideDialog("BOTTOM"),
		Interaction.resumeInteractee
	];

	var david =
	[
		Character.faceDown,
		Character.assignInteract(davidTalk),
	];

	var opacity = 1;
	var map;

	var map_data = [
		"###########################################################################",
		"#                            #                                            #",
		"#   1          ### ### ###   #                                      ###   #",
		"#   S          # # # # # #   #                                      # #   #",
		"#                            #                                  t         #",
		"#                            #                                            #",
		"#                            #                                            #",
		"#           r                #                     p                      #",
		"#                    b       #                                            #",
		"#              g             #                                            #",
		"#                            #                                            #",
		"#                            #                                            #",
		"########################### ##                                            #",
		"#                                                                         #",
		"#      2                                        o                         #",
		"#                                                                         #",
		"#                                                                         #",
		"#                                                                         #",
		"#                                                        y                #",
		"#                                                                         #",
		"#                                                                         #",
		"#                                         m                               #",
		"#                                                                         #",
		"#                                                                         #",
		"#                                                                         #",
		"###########################################################################",
	]

	var map_script = [
		Script.hideDialog("STATUS"),
		Script.hideDialog("LEFT"),
		Script.hideDialog("RIGHT")
	]

	for (var my = 0; my < map_data.length; my++)
	{
		for (var mx = 0; mx < map_data[0].length; mx++)
		{
			if(map_data[my][mx] === "#")
			{
				map_script.push(Script.addCharacter(Characters.GrayBox, mx, my, 0, []))
			}

			if(map_data[my][mx] === "S")
			{
				map_script.push(Script.addCharacter(Characters.Rikka, mx, my,-16, heroScript))
			}

			if(map_data[my][mx] === "r") { map_script.push(Script.addCharacter(Characters.RedBox, mx, my,0, boxScript)) }
			if(map_data[my][mx] === "g") { map_script.push(Script.addCharacter(Characters.GreenBox, mx, my,0, boxScript)) }
			if(map_data[my][mx] === "b") { map_script.push(Script.addCharacter(Characters.BlueBox, mx, my,0, boxScript)) }

			if(map_data[my][mx] === "t") { map_script.push(Script.addCharacter(Characters.TealBox, mx, my,0, boxScript)) }
			if(map_data[my][mx] === "p") { map_script.push(Script.addCharacter(Characters.PurpleBox, mx, my,0, boxScript)) }
			if(map_data[my][mx] === "o") { map_script.push(Script.addCharacter(Characters.OrangeBox, mx, my,0, boxScript)) }
			if(map_data[my][mx] === "y") { map_script.push(Script.addCharacter(Characters.YellowBox, mx, my,0, boxScript)) }
			if(map_data[my][mx] === "m") { map_script.push(Script.addCharacter(Characters.PinkBox, mx, my,0, boxScript)) }

			if(map_data[my][mx] === "1")
			{
				map_script.push(Script.addCharacter(Characters.Dekomori, mx, my,-16, dekomoriScript))
			}

			if(map_data[my][mx] === "2")
			{
				map_script.push(Script.addCharacter(Characters.Morisama, mx, my,-16, morisamaScript))
			}
		}		
	}

	var mainScript =
	[
		Script.speechDialog("BOTTOM", ["..."]),
		Script.speechDialog("BOTTOM", ["Where am I...?"]),
		Script.speechDialog("BOTTOM", ["What's going on...?"]),

		Script.customAction(function(theGameState) { gameState = theGameState; }),

		Script.hideDialog("BOTTOM"),


		
		//Script.addCharacter(Characters.Dekomori,6, 5,-16,girl1),
		//Script.addCharacter(Characters.Morisama,7, 5,-16,girl2),
		//Script.addCharacter(Characters.Boy,     8, 5,-16,david),
		//Script.addCharacter(Characters.Kumin,   9, 5,-16,girl3),


		//Script.addCharacter(1,5,5,-16,girlScript),
		//Script.addCharacter(3,13,13,-16,boyScript),
		//Script.addCharacter(5,1,1,-16,walkUpDown),
		//Script.addCharacter(4,8,5,-16,[Character.walkDown]),
		//Script.addCharacter(9,11,10,0,boxScript),
		//Script.addCharacter(9,12,10,0,boxScript),
		//Script.addCharacter(9,13,10,0,boxScript),
		//Script.addCharacter(9,14,10,0,boxScript),
		//Script.addCharacter(10,15,10,0,boxScript),
		//Script.addCharacter(10,16,10,0,boxScript),
		//Script.addCharacter(10,17,10,0,boxScript),
		//Script.addCharacter(0,18,10,-16,boxScript),
		//Script.showDialog(dialog),
		//Script.speechDialog(dialog, ["Sie sind das Essen und we sind die Jager", "", "This is the world"]),
		//Script.speechDialog(dialog, ["She was very nervous"]),

		Script.run(19,
		[
			Script.customAction(function()
			{
				opacity -= 0.05;
				map.setMaskOpacity(opacity);
			}),
		], 50),

		Script.customAction(function(theGameState) { map.setMaskOpacity(0); }),


	];

	var x = startScene(document.getElementById("game"), mapInfo, map_script.concat(mainScript));
	map = x.map;

}

