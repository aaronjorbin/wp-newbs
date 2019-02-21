var	_ = require( 'underscore' ),
	versions = [ '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '4.0', '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '5.0', '5.1' ],
	rp = require('request-promise'),
	Promise = require("bluebird"),
	AsciiTable = require('ascii-table')
	fs = require('fs');

const releaseDay = ( process.argv[2] == 'day' );

console.log( releaseDay );

var requests = versions.map( v => rp( 'http://api.wordpress.org/core/credits/1.1/?version=' + v ) );
function overlap ( v1, v2 ) {
	return Math.round( ( _.intersection( v1, v2 ).length / v1.length ) * 100 ) + '%';
}

Promise.all( requests ).then( function( responses ){
	console.log( 'props being processed' );
	return new Promise( function (resolve, reject) {
		var props = [];
		responses.forEach( r => {
			var data = JSON.parse( r );
			var groups = Object.keys( data.groups ); 
			var version = data.data.version;
			props[ version ] = [];
			groups.forEach( g => {
				if ( g !== 'libraries' ) {
				props[ version ] = props[ version ].concat( 
					Object.keys( data.groups[g].data ).map( s => s.toLowerCase() )
				);
				}
			});
		 	props[ version ] = _.uniq( props[ version ] );
			if ( releaseDay ) {
				const shortName = version.replace( '.', '');
				props[version] = require( './releaseday/' + shortName + '.json' );
				
			}
		});

		resolve( props );
	});
}).then( function( props ){
	console.log( 'building prop list' );
	return new Promise( function (resolve, reject) {
		var lastVersion = false,
			unions = [],
			newbs = [],
			forward = [],
			frequency = {};
		versions.forEach( v => {
			if ( lastVersion ){
				unions[ v ] = _.union( props[ v ] , unions[ lastVersion ] );
				newbs[ v ]  = _.difference( props[ v ], unions[ lastVersion ] );
			} else {
				unions[ v ] = props[v];
				newbs[ v ] = props[v];
			}
			props[v].forEach( ps => {
				if( typeof( frequency[ps.toLowerCase()] ) === 'undefined' ){
					frequency[ps.toLowerCase()] = [];
				}
				frequency[ps.toLowerCase()].push( v );
				frequency[ps.toLowerCase()] = _.uniq( frequency[ps.toLowerCase()] );
			});
			lastVersion = v;
		});
		lastVersion = false;
		versions.reverse();
		versions.forEach( v => {
			if ( lastVersion ){
				forward[ v ] = _.union( props[ lastVersion ] , forward[ lastVersion ] );
			} else {
				forward[ v ] = [];
			}
			lastVersion = v;
		});
		resolve( [ newbs, props, unions, frequency, forward ] );
	});
}).then( function( r ){
	var newbs = r[0], 
		props = r[1],
		unions = r[2],
		frequency = r[3],
		forward = r[4];
	return new Promise( function (resolve, reject) {
		console.log( 'Build Table' );
		var overlap_colums = [''].concat( versions );
		var howFrequent = {};
		table = new AsciiTable( 'Contributors' ).setHeading('Version', 'Total', 'New', 'Percent New' )
		overlapTable = new AsciiTable( 'Overlap' ).setHeading( overlap_colums );
		frequencyTable = new AsciiTable( 'Versions WP contributors' ).setHeading( 'Versions', 'Uniq Individuals' );
		forwardTable = new AsciiTable( 'Future Contributors' ).setHeading('Version', 'Total', 'return Percent'  )
		versions.forEach( v => {
			var overlaps = [v];
			versions.forEach( v2 => {
				overlaps.push( overlap( props[v], props[v2] ) );	
			});
			overlapTable.addRow( overlaps );
			table.addRow( v , props[v].length, newbs[v].length, 
				parseInt( 100 * ( newbs[v].length /  props[v].length ))  + '%' );
			forwardTable.addRow( v, props[v].length, overlap( props[v], forward[v] ) ); 
		});
		_.each( frequency, ( versions, person ) => {
			if ( typeof( howFrequent[ versions.length ] ) === 'undefined' ){
				howFrequent[ versions.length ] = [];
			}
			howFrequent[ versions.length ].push( person );
		});
		_.each(howFrequent, ( p, f ) => {
			frequencyTable.addRow( f, p.length );
		});
		resolve( table );
	});
}).then( function(){
	console.log(table.toString());
	console.log(overlapTable.toString());
	console.log(frequencyTable.toString());
	console.log(forwardTable.toString());
});;

