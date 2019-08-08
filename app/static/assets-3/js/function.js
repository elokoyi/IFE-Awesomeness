// this is how big our shape will be
var shapeDim = 75;

// these are called booleans
// they act as "flags" to tell our game when
// certain functions can be called
var startPlaying = false;
var isNextable = true;

// these control how big our board is
// our game starts out with a square board
var cols = 2;
var rows = 2;

// when our page has loaded everything it needs, it becomes "ready"
// whenever it's ready, this function will be called and our game starts
$(document).ready(function(){
	next(cols ,rows);
});


// our first function
// it takes 2 parameters:
// - the first is the number of columns our board has
// - second is the number of rows it has
function next(c, r) {
  var i, animateOptions, totalShapes;
	
	// here is one of our "flags"
	// if our game isn't ready for the board to be drawn
	// we "return" or leave the function without doing anything
	if(!isNextable) {
		return;
	}
		
	isNextable = false;
	
	// 1. clear previous shapes
	$(".content").fadeOut(1000,
	
    // --> on fadeOut complete
		// 2. empty previous shapes
		function() {
			$(".content").empty();
						
			// 3. expand container
			// this object sets the height and width of our board in pixels
			animateOptions = {
        height : ((shapeDim + 8) * r) + "px",
        width  : ((shapeDim + 8) * c) + "px"
			};
			
			$(".container").animate(animateOptions, 1000,
			
        // --> on animate complete
				// 4. create new shapes, add them to content & fadein content
        function() {
          totalShapes = c * r;
          for (i = 0; i < totalShapes; i++) {
						$(".content").append(createShape("circle", shapeDim));	
          }
          
					$(".content").fadeIn(200);
					
					// here is a function call that will pick at random which shapes players
					// are supposed to remember
          pickRandomShapes();
				}
			);							
    }
  ); // end fadeOut
}

// this function creates our shapes
// it takes 2 parameters:
// - the first is the type of shape to create
// - the second is the size of the shape

// another import job of this function is
// is to handle click events
// anytime a shape is clicked, a click eventHandler is called

function createShape(type, r) {
  var shapeClass = "shape " + type;
  var totalSelected, totalRight, totalWrong;
  
  return $("<div>").addClass(shapeClass).width(r).height(r).click(function() {
    // another of our flags
		if (startPlaying) {

      // inside our eventHandler, shapes are referenced using $(this)

      // here is a conditional that checks to see if this shape is one that players should remember
      // if it is, add a class that highlights it to our color
      // if it isn't, highlight it with a "wrong" color
			if ($(this).attr("selected") === "selected") {
				$(this).addClass("selected");
			}
			else {
				$(this).addClass("wrong");
			}
			
			// this variable is the total number of shapes to be selected by players
			totalSelected = $(".shape[selected='selected']" ).length;
			
			// this variable is the number correctly selected
			totalRight = $(".selected").length;
			
			// this variable is the number incorrectly selected
			totalWrong = $(".wrong").length;
			
			if (totalRight + totalWrong >= totalSelected) {
        // this "pauses" our game while we redraw the board
				startPlaying = false;
				
				$(".shape[selected='selected']:not(.selected)").addClass("selected");
				
				if (totalWrong === 0) {
					// to do: let the player know they did a good job!
					
					if (cols === rows) {
						cols++;
					}
					else if (cols > rows) {
						rows++;
					}
								
					// biggest size our board can be is a square of 6 columns and 6 rows
					// change these numbers for an even bigger board!
					if (cols > 6) {
						cols = 6;
						rows = 6;
					} 
				}
				
				// redraw our board!
				next(cols, rows);
			}
		}
	});
}

// this function picks random shapes that players must remember
function pickRandomShapes() {
  // the number of shapes picked
	var count = 0;
	
	// total number of shapes on the board
	var totalShapes = $(".content > .shape").length;
	
	// number of shapes to pick
	var shapesToPick = Math.ceil(totalShapes / 3);
	
	// used to randomly pick a shape from the board
	var random;

	for (count = 0; count < shapesToPick;) {
		random = Math.ceil(Math.random() * totalShapes); 
		
		if (random < totalShapes) {
      // if this shape hasn't already been selected
			if (!$(".content > .shape").eq(random).hasClass("selected")) {
        // select it by adding a special selected attribute
				$(".content > .shape").eq(random).addClass("selected").attr("selected", "selected");
				
				// be sure to add one to our counter
				count++;
			}
		}
	} 
	
	// once all our shapes have been selected
	// show the player, for about a second, which shapes they need to remember
	window.setTimeout(hideRandomSelectedShapes,1200);
}

// this function hides the selected shapes from the player
function hideRandomSelectedShapes() {
	$(".content > .shape").removeClass("selected");
	
	// everything is ready to go!
	startPlaying = true;
	isNextable = true;
}