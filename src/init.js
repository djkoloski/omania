function Init() {
	var sheets = [
		'spritesheet_soldiers_png'
	];
	
	for (var i = 0; i < sheets.length; ++i)
		res[sheets[i] + '_anim'] = SpritesheetToAnimation(sheets[i], 34, 34, 0.05, 100);
}
