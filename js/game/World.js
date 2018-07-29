

function World(tileset, charset, onetileCharset, background, tileinfo, mapinfo)
{
    var w = mapinfo.width;
    var h = mapinfo.height;
    var tileSize = 48;
    var d = tileSize/2;
    var posAndMaskToTile =
    [
        [10, 0, 1, 2, 6, 7, 9, 8],
        [10, 2, 3, 4, 0, 1, 9, 8],
        [10, 4, 5, 6, 2, 3, 9, 8],
        [10, 6, 7, 0, 4, 5, 9, 8]
    ];
    
    var corner =
    [
        {x:d, y:0},
        {x:d, y:d},
        {x:0, y:d},
        {x:0, y:0},
    ];
    
    var carried_characters = {}; /* index: carrier_index */
    var carrying_characters = {}; /* index: carried_index */
    var prerenderedMap = {};
    var animations = {};
    
    function isTileSame(tileid, mapinfo, x, y)
    {
        if (x >= mapinfo.width || x < 0)
        {
            return 1;
        }
        if (y >= mapinfo.height || y < 0)
        {
            return 1;
        }
        return tileid == mapinfo.map(x,y) ? 1 : 0;
    }

    function surroundings(mapinfo, x, y)
    {
        var tileid = mapinfo.map(x,y);
        return (
            (isTileSame(tileid, mapinfo, x+1, y-1) << 0) |
            (isTileSame(tileid, mapinfo, x+1, y+1) << 1) |
            (isTileSame(tileid, mapinfo, x-1, y+1) << 2) |
            (isTileSame(tileid, mapinfo, x-1, y-1) << 3) |
            (isTileSame(tileid, mapinfo, x, y-1) << 4) |
            (isTileSame(tileid, mapinfo, x+1, y) << 5) |
            (isTileSame(tileid, mapinfo, x, y+1) << 6) |
            (isTileSame(tileid, mapinfo, x-1, y) << 7)
            );
    }
    
    function getCornerMask(corner, surrounding)
    {
        switch (corner)
        {
            case 0:
                return (((surrounding >> 3) & 6) | (surrounding & 1));
            case 1:
                return (((surrounding >> 4) & 6) | ((surrounding >> 1) & 1));
            case 2:
                return (((surrounding >> 5) & 6) | ((surrounding >> 2) & 1));
            case 3:
                return (((surrounding >> 3) & 1) | ((surrounding >> 2) & 4) | ((surrounding >> 6) & 2));
        }
        return 0;
    }
    
    function prerender()
    {
        prerenderedMap["background"] = background;
        for (var x = 0; x < w; x++)
        {
            for (var y = 0; y < h; y++)
            {

                var tileid = mapinfo.map(x,y);
                var tile = tileinfo[tileid];
                var surrounding = surroundings(mapinfo, x, y);
                if (tile.type === "simple")
                {
                    prerenderedMap[":" + x + "," + y] = {
                        tileSet: tileset,
                        parts: [ { coords: tile.coords, dx: 0, dy: 0, size: tileSize} ]
                    };
                }
                else if (tile.type === "autotile12")
                {
                    var parts = [];

                    for (var i=0; i<4; i++)
                    {
                        var dx = corner[i].x;
                        var dy = corner[i].y;
                        var cornerMask = getCornerMask(i, surrounding);

                        parts.push({
                            coords: tileinfo[tile.indexes[posAndMaskToTile[i][cornerMask]]].coords,
                            dx: dx,
                            dy: dy,
                            size: tileSize/2
                        });

                        /*context.drawImage(
                                  tileset,
                                  tileinfo[tile.indexes[posAndMaskToTile[i][cornerMask]]].coords[0].x+dx,
                                  tileinfo[tile.indexes[posAndMaskToTile[i][cornerMask]]].coords[0].y+dy,
                                  d, d,
                                  x*tileSize+dx,
                                  y*tileSize+dy,
                                  d, d);*/
                    }

                    prerenderedMap[":" + x + "," + y] = {
                        tileSet: tileset,
                        parts: parts
                    };

                }
                
            }
        }   
    }
    
    prerender();
    
    var positions = {};
    var tiles = {};
    var model = new MapModel(prerenderedMap, animations, charset, onetileCharset, tileSize, function(x,y)
    {
        x = Math.floor(x);
        y = Math.floor(y);
        if (x >= 0 && x < w && y >= 0 && y < h)
        {
            return {x:x*tileSize, y:y*tileSize};
        }
        return undefined;
    });

    function setOccupant(c, x, y)
    {
        positions[x + "," + y] = c;
    }

    function getOccupant(x, y)
    {
        return positions[x + "," + y]
    }
    
    function canMoveTo(c, x, y)
    {
        if (x < 0 || x >= w || y < 0 || y >= h)
        {
            return false;
        }
            
        //console.log(positions[2 + "," + 2])
        var theChar = model.getCharacter(c);
            
        var tileid = mapinfo.map(x,y);
        var tile = tileinfo[tileid];

        if ( (tile.passable & theChar.mobility) === 0 )
        {
            return false;
        }
    
        if (getOccupant(x, y) === undefined)
        {
            return true;
        }
        
        if (getOccupant(x, y) !== c && getOccupant(x, y))
        {
            return false;
        }
        
        return true;
    }
    
    function moveTo(c, x, y)
    {
        //console.log(x + "," + y)
        var theChar = model.getCharacter(c);

        setOccupant(undefined,theChar.tilex,theChar.tiley)
        setOccupant(c, x, y);
    }
    
    model.setCanMoveToFunc(canMoveTo);
    model.setMoveToFunc(moveTo);
    model.setGetOccupant(getOccupant);
    
    this.canMoveTo = canMoveTo;
    this.getOccupant = getOccupant;

    this.getModel = function()
    {
        return model;
    }

    this.isACarrier = function(char)
    {
        return carrying_characters[char] !== undefined;
    }

    this.isBeingCarried = function(char)
    {
        return carried_characters[char] !== undefined;
    }

    this.getCharacterCarriedBy = function(char)
    {
        return carrying_characters[char];
    }

    this.addCharacter = function(type,x,y,shift)
    {
        var char = model.addCharacter(type,x,y,shift);
        var c = model.getCharacter(char);
        c.mobility = Passable.Ground;
        setOccupant(char, c.tilex, c.tiley); 
        return char;
    }

    this.removeCharacter = function(char) {
        var c = model.getCharacter(char);
        if (!c)
        {
            console.log("World.removeCharacter: No such char " + char);
            return;
        }
        model.removeCharacter(char);
        setOccupant(undefined, c.tilex, c.tiley);
    }
    
    this.setMobility = function(char, mob)
    {
        var c = model.getCharacter(char);
        c.mobility = mob;
    }
    
    this.getMobility = function(char, mob)
    {
        var c = model.getCharacter(char);
        return c.mobility;
    }
    
    this.moveCharacter = function(number, direction, autoRotate, onCompleteMovement, onCollide)
    {

        model.moveCharacter(number, direction, autoRotate, onCompleteMovement, onCollide);

        if (carrying_characters[number] !== undefined)
        {
            var theChar = model.getCharacter(number);
            var carriedChar = model.getCharacter(carrying_characters[number]);

            carriedChar.tilex = theChar.tilex;
            carriedChar.tiley = theChar.tiley + 1;
            carriedChar.dx = theChar.dx;
            carriedChar.dy = theChar.dy;
            carriedChar.x = theChar.x;
            carriedChar.y = theChar.y + 1;

            model.rotateCharacter(carrying_characters[number], (carriedChar.dirDiff + theChar.direction + 4) % 4 );
        }

    }

    this.rotateCharacter = model.rotateCharacter;

    this.getCharacterRotation = model.getCharacterRotation;
    
    this.teleportCharacter = model.teleportCharacter;

    this.setCarryingFront = function(carrierCharacterIdx)
    {
        var carriedCharacterIdx = this.getCharacterInFrontOf(carrierCharacterIdx, 1);
        var frontTile = model.getFrontTile(carrierCharacterIdx, 1);

        if (!model.getCharacter(carrierCharacterIdx) || !model.getCharacter(carriedCharacterIdx))
        {
            // no such char
            return false;
        }

        if (carriedCharacterIdx === null)
        {
            return this.setUncarry(carrierCharacterIdx);
        }

        if (carried_characters[carriedCharacterIdx] !== undefined)
        {
            // character already being carried
            return false;
        }

        if (carrying_characters[carrierCharacterIdx] !== undefined)
        {
            // the carrying character is already carrying something
            return false;
        }

        if (carried_characters[carrierCharacterIdx] !== undefined)
        {
            // the carrying character is being carried by someone else
            return false;
        }

        carried_characters[carriedCharacterIdx] = carrierCharacterIdx;
        carrying_characters[carrierCharacterIdx] = carriedCharacterIdx;

        var carrierChar = model.getCharacter(carrierCharacterIdx);
        var carriedChar = model.getCharacter(carriedCharacterIdx);
        setOccupant(undefined,frontTile.x,frontTile.y);

        carriedChar.tilex = carrierChar.tilex;
        carriedChar.tiley = carrierChar.tiley;
        carriedChar.x = carrierChar.x;
        carriedChar.y = carrierChar.y + 1;
        carriedChar.dx = carrierChar.dx;
        carriedChar.dy = carrierChar.dy;
        carriedChar.pixeloffsety = -100;

        carriedChar.dirDiff = carriedChar.direction - carrierChar.direction;

        return true;
    }

    this.setUncarry = function(carrierCharacterIdx)
    {
        var carriedCharacterIdx = carrying_characters[carrierCharacterIdx];
        if (carriedCharacterIdx === false)
        {
            // not carrying anything
            return false;
        }

        if (!model.getCharacter(carrierCharacterIdx) || !model.getCharacter(carriedCharacterIdx))
        {
            // no such char
            return false;
        }


        var carrierChar = model.getCharacter(carrierCharacterIdx);
        var carriedChar = model.getCharacter(carriedCharacterIdx);

        var frontTile = model.getFrontTile(carrierCharacterIdx, 1);

        carriedChar.tilex = frontTile.x;
        carriedChar.tiley = frontTile.y;
        carriedChar.x = frontTile.x;
        carriedChar.y = frontTile.y;
        carriedChar.dx = 0;
        carriedChar.dy = 0;
        carriedChar.pixeloffsety = 0;
        carriedChar.charShift = 0;

        setOccupant(carriedCharacterIdx,frontTile.x,frontTile.y);

        carried_characters[carriedCharacterIdx] = undefined;
        carrying_characters[carrierCharacterIdx] = undefined;

        return true;
    }

    this.getUncarriedCharacters = function()
    {
        return model.getCharacters().filter(function(elem, index, array)
        {
            if (carried_characters[index] !== undefined)
            {
                return false;
            }
            return true;
        });
    }

    this.getCarriedCharacters = function()
    {
        return model.getCharacters().filter(function(elem, index, array)
        {
            if (carried_characters[index] !== undefined)
            {
                return true;
            }
            return false;
        });
    }

    this.getCharacterPosition = function(number)
    {
        var char = model.getCharacter(number);

        return { x: char.tilex, y: char.tiley, shift: char.charShift };
    }
    
    this.rerenderWorld = function()
    {
        prerender();
    }
    
    this.setCharacterSlowness = function(number, slowness)
    {
        var char = model.getCharacter(number);
        char.slowness = slowness;
    }
    
    this.getCharacterSlowness = function(number, slowness)
    {
        var char = model.getCharacter(number);
        return char.slowness;
    }
    
    this.getFrontOf = model.getFrontTile;
    this.getPositionOf = model.getPositionOf;
    
    this.getCharacterInFrontOf = function(number, distance)
    {
        var tile = model.getFrontTile(number, distance);
        return getOccupant(tile.x, tile.y);
    }
    
    this.getClosestCharacterInFrontOf = function(number, distance)
    {
        var tile
        while (!tile) {
            tile = model.getFrontTile(number, distance);
        }
        return getOccupant(tile.x, tile.y);
    }

    this.getAnimation = function(name)
    {
        return animations[name];
    }

    this.addAnimation = function(name, image, tilewidth, tileheight)
    {
        var rows = Math.floor(image.width / tilewidth);
        var cols = Math.floor(image.height / tileheight);
        var i = 0, j = 0;
        var animcoords = [];

        for (i=0; i<rows; i++)
        {
            for (j=0; j<cols; j++)
            {
                animcoords.push({x: j, y: i});
            }
        }

        animations[name] = {
            image: image,
            tilewidth: tilewidth,
            tileheight: tileheight,
            animcoords: animcoords,
            frameDelay: 50
        }
    }
    
    return this;
}
