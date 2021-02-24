const args = process.argv.slice(2);

//console.log('myArgs: ', args);
const defaultFilename = 'a_example';
//const defaultFilename = 'b_little_bit_of_everything.in';
const filename = (args.length != 0) ? args[0] : defaultFilename;
//const filename = "a_example";
console.log(`analysing ${filename} ...`);

const fs = require('fs');
const input = [];

function calculScore(team, pizzas ){
	//incorrect: more ore less pizzas
	if( team.size != pizzas.length )
		return 0;
	var val = 0;
	const unique = [];
	//get number of different ingredients
	pizzas.forEach( p => p.ingredients.forEach( i => {
		if( ! unique.includes(i)  )
			unique.push(i);
	}));
	//final score: square of #ingredients
	return unique.length * unique.length;
}

function resetArray( arr ){
	arr.forEach( e => delete(e.isUsed) );
}

function firstUnused( arr ){
	for( var i=0; i<arr.length; i++ )
		if( arr[i].isUsed == undefined )
			return arr[i];
}

function combine(input, len, callback) {
	const result = [];
	result.length = len;

	function each(input, len, start) {
		if (len === 0) {
			//console.log( result.join(" ") ); //process here the result
			return callback(result);
		}

		for (var i = start; i <= input.length - len; i++) {
			result[result.length - len] = input[i];
			ret = each(input, len - 1, i + 1);
			if (ret)
				return ret;
		}
	};
	each( input, len, 0 );
}

const uniqIngredients = {_length: 0 };
function mapIngredients( a ){
	const ret = [];
	a.forEach( e => {
		if( uniqIngredients[e] == undefined ){
			uniqIngredients[e] = uniqIngredients._length;
			uniqIngredients._length ++;
		}
		ret.push( uniqIngredients[e] );
	});
	return ret;
}


function calcul(team, pizzas){
	let i;

	team.isUsed = true;
	
	let maxIngredientsInAPizza = 0;
	const availPizzas = [];
	pizzas.forEach( e => {
		if( !e.isUsed ) 
			availPizzas.push( e);
		if( e.ingredients.length > maxIngredientsInAPizza )
		maxIngredientsInAPizza = e.ingredients.length;
	});

	const maxAvailScore = (team.size * maxIngredientsInAPizza) * (team.size * maxIngredientsInAPizza);

	let maxScore = 0;
	combine( availPizzas, team.size, function( res ){
		const score = calculScore(team, res );
		if( score > maxScore ){
			maxScore = score;
			distributedPizzas = res;
		}

		//console.log( "--", res, score );
		//console.log(`score: ${score}/${maxAvailScore}`);
		//stop when we found the maximum
		//return( score == maxAvailScore );
		return true;
	});

	distributedPizzas.forEach( e => e.isUsed = true );
	return {score: maxScore, pizzas: distributedPizzas};
}

fs.readFile(filename, 'ascii', (err, data) => {
	var i;
	if (err) {
		console.error(err);
		return;
	}

	//console.log(data);
	data.split("\n").forEach( e => {if (e.length > 0) input.push( e )});
	//console.log( input );
	var arr = input[0].split(" ").map( e => parseInt(e));
	const M = arr[0], T2 = arr[1], T3 = arr[2], T4 = arr[3], T = T2+T3+T4;
	
	//console.log( M, T2, T3, T4, T );
	console.log(`nb pizza: ${M}, nb team: ${T} (T2: ${T2}, T3: ${T3}, T4: ${T4})`);

	const teams = [];
	for( i=0; i<T4; i++ )
		teams.push( {size: 4} );
	for( i=0; i<T3; i++ )
		teams.push( {size: 3} );
	for( i=0; i<T2; i++ )
		teams.push( {size: 2} );
	
	

	//teams.sort( (a,b) => { return b.size - a.size });
	teams.sort( (b,a) => { return b.size - a.size });
	//console.log( teams );

	const pizzas = [];
	for( i=1; i<input.length; i++ ){
		a = input[i].split(" ");
		a.shift(); //remove the first element: nb of ingredients
		
		pizzas.push( {id: i-1, isUsed: false, ingredients: mapIngredients(a) } );
	}

	pizzas.sort( (b,a) => {return b.ingredients.length - a.ingredients.length; });

	//console.log( pizzas );
	let score = 0;
	let totalDeliverdPizzas = 0;
	let output = [];
	for( i=0; i<teams.length; i++){
		let team = teams[i];
		var ret = calcul( team, pizzas );
		if( ret.score == 0 || ret.pizzas.length == 0 )
			break;

		score += ret.score;
		totalDeliverdPizzas += ret.pizzas.length;
		//console.log( ret );
		var out = [team.size];
		ret.pizzas.forEach( e => out.push( e.id ));
		//console.log( out );
		output.push( out.join(" ") );
		console.log(`${new Date().getTime()} ${i} - score: ${ret.score}, team: ${team.size}, total: ${score}; deliveredPizzas: ${totalDeliverdPizzas}/${M} ${totalDeliverdPizzas*100/M}% `);
	}

	console.log(`score: ${score}`);
	console.log(`deliveredPizzas: ${totalDeliverdPizzas}/${M} ${totalDeliverdPizzas*100/M}%`);
	output.unshift( output.length );
	fs.writeFile( `${filename}.out`, output.join("\n"), console.log );
});