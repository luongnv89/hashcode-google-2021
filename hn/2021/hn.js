const args = process.argv.slice(2);

//console.log('myArgs: ', args);
const defaultFilename = 'a.txt';
//const defaultFilename = 'b_little_bit_of_everything.in';
const filename = (args.length != 0) ? args[0] : defaultFilename;
//const filename = "a_example";
console.log(`analysing ${filename} ...`);

const fs = require('fs');

function toInt( str ){
    return parseInt( str );
}

const uniqStreets = {_length: 0 };
function mapStreetName( e ){
    if( uniqStreets[e] == undefined ){
        uniqStreets[e] = uniqStreets._length;
        uniqStreets._length ++;
    }
	return uniqStreets[e];
}

function ranInt(max) {
   return Math.floor(Math.random() * max); 
}

function ranTime( max ){
    let v = Math.floor(Math.random() * max);
    if( v == 0 )
        return 1;
    return v;
}

fs.readFile(filename, 'ascii', (err, data) => {
    const input = [];
	let i, arr;
	if (err) {
		console.error(err);
		return;
	}

	//console.log(data);
	data.split("\n").forEach( e => {
        if (e.length > 0) 
            input.push( e );
    });
    arr = input[0].split(" ").map( toInt );
    const 
    D = arr[0] , //simulation duration
    I = arr[1] ,
    S = arr[2] ,
    V = arr[3] ,
    F = arr[4] ;
    //console.log( D, I, S, V, F );

    const streetSet = {}, streetArr = [];
    
    let delta = 1;
    for( i=0; i<S; i++ ){
        arr = input[i+delta].split(" ");
        let name = arr[2];
        let nameID = mapStreetName( arr[2] );
        let street = {
            B: parseInt( arr[0] ), //start intersection ID
            E: parseInt( arr[1] ), //end intersection ID
            name: name,
            nameID: nameID,
            L: parseInt( arr[3] ) //length of street
        };
        streetSet[nameID] = street;
        streetArr.push( street );
    }

    //console.log( streets );
    function calTravelTime( sArr ){
        let ret = 0;
        for( let i=1; i<sArr.length; i++ )
            ret += streetSet[ sArr[i] ].L;
        return ret;
    }

    const cars = [];
    delta += S;
    let noUsedCars = 0;
    for( i=0; i<V; i++ ){
        arr = input[i+delta].split(" ");
        arr.shift();
        const streetArr = arr.map( mapStreetName );
        const car = {
            streetNameIDArr: streetArr,
            streetObjArr   : streetArr.map( e => streetSet[e] ),
            travelTime     : calTravelTime( streetArr ) 
        };
        if( car.travelTime > D ){
            noUsedCars ++;
            continue;
        }

        cars.push( car );
    }

    console.log( `${filename} no used cars: ${noUsedCars} ` );

    cars.sort( (a,b) => {
        return a.travelTime - b.travelTime;
    });



    //console.log( cars );
    //remove streets that have no cars
    streetArr.forEach( s => {
        s.cars = []; //set of cars will go through this street
        for( i=0; i<cars.length; i++ )
            if( cars[i].streetNameIDArr.includes(  s.nameID ) )
                s.cars.push( cars[i] );
    });

    const intersectionSet = [];
    let numberOfStreetsNoCars = 0;
    streetArr.forEach( e => {
        //no car uses this street
        if( e.cars.length == 0 ){
            numberOfStreetsNoCars ++;
            return;
        }
        
        if( intersectionSet[e.B] == undefined )
            intersectionSet[e.B] = {
                incomming: [],
                outgoing : [],
                travelTime: 0
            };
        intersectionSet[e.B].outgoing.push( e );

        if( intersectionSet[e.E] == undefined )
            intersectionSet[e.E] = {
                incomming: [],
                outgoing : [],
                travelTime: 0
            };
        //set of routes going
        intersectionSet[e.E].incomming.push( e );
        
    });

    console.log(`${filename}: nocarStreets: ${numberOfStreetsNoCars}, totalStreets: ${streetArr.length}`);

    const intersectionArr = [];
    for( let i in intersectionSet ){
        let x = intersectionSet[i];
        if( ! x )
            continue;
        if( x.incomming.length == 0 )
            continue;

        x.ID = i;
        intersectionArr.push( x );
    }

    function totalTravelTime( cars ){
        let ret = 0;
        cars.forEach( e => ret += e.travelTime );
        return ret;
    }

    const output = [];
    output.push( intersectionArr.length );
    intersectionArr.forEach( (e, i) => {
        let out = [];
        //out.push( e.ID );

        //sort by number of cars
        e.incomming.sort( (a,b) =>{
            //return a.cars.length - b.cars.length;
            return totalTravelTime( a.cars ) - totalTravelTime( b.cars );
        });

        //green for 2 streets
        for( i=0; i<e.incomming.length; i++ ){
            f = e.incomming[i];
            t = D - i;
            if( t <= 0 )
                //continue;
                t = 1;
            out.push( `${f.name} ${t}` );
        }
        
        //out.push( e.incomming.length );
        //green for only one street that has max cars
        /*
        let s = e.incomming[0];
        e.incomming.forEach( (f) => {
            if( f.cars.length > s.cars.length )
                s = f;
        });
        out.push( `${s.name} 1`); 
        */

        //each street 1 second
        /*
        e.incomming.forEach( (f,j) => {
            if( f.cars.length == 0 )
                return;            
            out.push( `${f.name} 2`);
        });
        */

        /*
        e.incomming.forEach( (f,j) => {
            //let t = ranInt(D > f.L? f.L : D);
            //out.push( `${f.name} ${ ranTime(t) }`);
            //no car passes through this street
            if( f.cars.length == 0 )
                return;

            t = f.cars.length;
            if( t > D )
                t = D;
                
            out.push( `${f.name} ${t}`);
        });
        */

        out.unshift( e.ID , out.length );
        
        output.push( out.join("\n") );
    });

    console.log(`finish to ${filename}`);
    fs.writeFile( `${filename}.out`, output.join("\n"), console.log );
});