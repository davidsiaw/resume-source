var Passable = {
    Ground: 0x1,
    Air: 0x2,
}

// Set up specially so +1 is clockwise and -1 is counterclockwise
var Directions = {
	Up:   0,
	Right:1,
	Down: 2,
	Left: 3,
}

LEFT_ARROW_KEY = 37
UP_ARROW_KEY = 38
RIGHT_ARROW_KEY = 39
DOWN_ARROW_KEY = 40

A_KEY = 65
S_KEY = 83
Z_KEY = 90
X_KEY = 88

var Characters = {
	Boy: 0,
	Dekomori: 1,
	Fireball: 2,
	Morisama: 3,
	Boy2: 4,
	Rikka: 5,
	Rikka_shoot: 6,
	Kumin: 7,
	BoyUniform: 8,
	BlueBox:   10000,
	RedBox:    10001,
	PurpleBox: 10002,
	GreenBox:  10003,
	BrownBox:  10004,
	YellowBox: 10005,
	PinkBox:   10006,
	TealBox:   10007,
	GrayBox:   10008,
}

var Carriables = {}
Carriables[Characters.BlueBox] = true;