function MapModel(prerenderedMap, animations, charset, onetileCharset, tileSize, mapfunc)
{
	// constants
	var self = this;
	
	var animSlowness = 16;

	// func
	this.getTileSize = function()
	{
		return tileSize;
	}
	
	this.getPrerenderedMap = function()
	{
		return prerenderedMap;
	}
	
	this.getTileOffset = mapfunc;
	
	this.getCharacterImage = function()
	{
		return charset;
	}

	this.getOneTileCharacterImage = function()
	{
		return onetileCharset;
	}
	
	var animOffset = 0;
	var characters = [];
	var runningAnimations = {};
	var canMoveTo = function (c,x,y) { return true; }
	var moveTo = function (c,x,y) { return true; }
	var getOccupant = function (x,y) { return undefined; }
	
	function getDirection(direction) {
		var dir = {dx:0, dy:0};
		if(direction == Directions.Up)
		{
			dir.dy = -1;
		}
		if(direction == Directions.Right)
		{
			dir.dx = 1;
		}
		if(direction == Directions.Down)
		{
			dir.dy = 1;
		}
		if(direction == Directions.Left)
		{
			dir.dx = -1;
		}
		return dir;
	}
	
	function setCharMovement(char, direction)
	{
		var movementStep = 1 / char.slowness;
		var dir = getDirection(direction);
		if(dir.dy)
		{
			char.dy = dir.dy * movementStep;
		}
		if(dir.dx)
		{
			char.dx = dir.dx * movementStep;
		}
	}
	
	function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; }
	
	this.setCanMoveToFunc = function(func)
	{
		canMoveTo = func;
	}
	
	this.setMoveToFunc = function(func)
	{
		moveTo = func;
	}
	
	this.setGetOccupant = function (func)
	{
		getOccupant = func;
	}
	
	this.advanceTime = function(milSecAdvanced)
	{
		var framesAdvanced = Math.round(milSecAdvanced / 8);
		animOffset += framesAdvanced;
		animOffset %= animSlowness * 4;
		
		for (var idx in characters)
		{
			var char = characters[idx];
			if (char && !(char.dx || char.dy))
			{
				char.offsetx = char.baseoffsetx;
			}
			if (char && (char.dx || char.dy))
			{
				char.offsetx = char.baseoffsetx + Math.floor(animOffset / animSlowness) * char.width;
				
				// move forward number of frames
				for (var i = 0; i < framesAdvanced; i++) {
					
					var resultingx = char.x + char.dx;
					var resultingy = char.y + char.dy;
					if (resultingx === Math.floor(resultingx))
					{
						char.x = resultingx;
						char.dx = 0;
						
						if (char.completeMovementX)
						{
							char.completeMovementX();
							char.completeMovementX = undefined;
						}
					}
					else
					{
						char.x = resultingx;
					}
					if (Math.abs(char.x - char.tilex) >= 1)
					{
						char.x = char.tilex;
						char.dx = 0;
					}
						
					char.y = resultingy;
					if (resultingy === Math.floor(resultingy))
					{
						char.y = resultingy;
						char.dy = 0;
						
						if (char.completeMovementY)
						{
							char.completeMovementY();
							char.completeMovementY = undefined;
						}
					}
					else
					{
						char.y = resultingy;
					}
					
					if (Math.abs(char.y - char.tiley) >= 1)
					{
						char.y = char.tiley;
						char.dy = 0;
					}
				}
			}
		}
	}

	this.getCharacters = function()
	{
		return characters;
	}



	this.getRunningAnimations = function()
	{
		return runningAnimations;
	}

	this.addAnimation = function(name,x,y,shift)
	{
		shift = shift || 0;

		var key = ":" + x + "," + y;
		if (!runningAnimations[key])
		{
			runningAnimations[key] = [];
		}

		runningAnimations[key].push({
			anim: animations[name],
			start: new Date(),
			shift: shift
		});
	}
	
	this.addCharacter = function(typeid,x,y,charShift)
	{
		charShift = charShift || 0;

		var baseoffsetx = typeid * 192;
		var multitile = true;
		if (typeid >= 10000)
		{
			baseoffsetx = 48 * (typeid - 10000);
			multitile = false;
		}

		characters.push(
			{
				id: characters.length,
				typeid: typeid,
				width: 48,
				height: 64,
				tilex: x,
				tiley: y,
				x: x,
				y: y,
				offsetx: 0,
				offsety: 0,
				baseoffsetx: baseoffsetx,
				multitile: multitile,
				dx: 0,
				dy: 0,
				direction: Directions.Up,
				slowness: 16,
				charShift: charShift,
				pixeloffsetx: 0,
				pixeloffsety: 0,
			}
		);
		return characters.length - 1;
	}
	
	this.removeCharacter = function(char)
	{
		characters[char] = undefined;
	}
	
	this.rotateCharacter = function(number, direction)
	{
		var char = characters[number];
		char.offsety = direction * 64;
		char.direction = direction;
	}
	
	this.getCharacterRotation = function(number)
	{
		var char = characters[number];
		return char.direction;
	}
	
	this.moveCharacter = function(number, direction, autoRotate, onCompleteMovement, onCollide)
	{
		onCollide = onCollide || function() { };
		var char = characters[number];
		
		//console.log(direction)
		
		var dir = getDirection(direction);
		var dx = dir.dx;
		var dy = dir.dy;
		
		if (char)
		{
			if (!char.dx && dx && char.tilex == char.x)
			{
				if (autoRotate)
				{
					self.rotateCharacter(number, direction);
				}
				//console.log("moveright")
				if (canMoveTo(number, char.tilex+dx, char.tiley))
				{
					moveTo(number, char.tilex+dx, char.tiley);
					char.completeMovementX = onCompleteMovement;
					char.tilex += dx;
					setCharMovement(char, direction);
				}
				else
				{
					var a = getOccupant(char.tilex+dx, char.tiley);
					onCollide(a);
					console.log("collide", a);
					return;
				}
			}
			
			if (!char.dy && dy && char.tiley == char.y)
			{
				if (autoRotate)
				{
					self.rotateCharacter(number, direction);
				}
				//console.log("movedown")
				if (canMoveTo(number, char.tilex, char.tiley+dy))
				{
					moveTo(number, char.tilex, char.tiley+dy);
					char.completeMovementY = onCompleteMovement;
					char.tiley += dy;
					setCharMovement(char, direction);
				}
				else
				{
					var a = getOccupant(char.tilex, char.tiley+dy);
					onCollide(a);
					console.log("collide", a);
					return;
				}
			}
			
		}
	}
	
	this.teleportCharacter = function(number, tilex, tiley)
	{
		if (canMoveTo(number, tilex, tiley))
		{
			moveTo(number, tilex, tiley);
			characters[number].tilex = tilex;
			characters[number].tiley = tiley;
			characters[number].x = tilex;
			characters[number].y = tiley;
			return 0;
		}
		return 1;
	}
	
	this.getPositionOf = function(number)
	{
		return {x: characters[number].tilex, y: characters[number].tiley};
	}
	
	this.getFrontTile = function (number, distance)
	{
		var dist = distance || 1;
		var char = characters[number];
		var dir = getDirection(char.direction);
		return {x: dir.dx * dist + char.tilex,
			y: dir.dy * dist + char.tiley}
	}
	
	this.getCharacter = function(number)
	{
		return characters[number];
	}
	
	return this;
}
