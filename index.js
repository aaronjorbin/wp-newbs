var	_ = require( 'underscore' ),
	versions = [ '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '4.0', '4.1', '4.2', '4.3', '4.4', '4.5' ],
	rp = require('request-promise'),
	Promise = require("bluebird"),
	AsciiTable = require('ascii-table')
	fs = require('fs');

var requests = versions.map( v => rp( 'http://api.wordpress.org/core/credits/1.1/?version=' + v ) );

Promise.all( requests ).then( function( responses ){
	console.log( 'props being processed' );
	return new Promise( function (resolve, reject) {
		var props = [];
		responses.forEach( r => {
			var data = JSON.parse( r );
			props[ data.data.version ] = Object.keys( data.groups.props.data );
		});
		resolve( props );
	});
}).then( function( props ){
	console.log( 'building prop list' );
	return new Promise( function (resolve, reject) {
		var lastVersion = false,
			unions = [],
			newbs = [];
		versions.forEach( v => {
			if ( lastVersion ){
				unions[ v ] = _.union( props[ v ] , unions[ lastVersion ] );
				newbs[ v ]  = _.difference( props[ v ], unions[ lastVersion ] );
			} else {
				unions[ v ] = props[v];
				newbs[ v ] = props[v];
			}
			lastVersion = v;
		});
		resolve( [ newbs, props ] );
	});
}).then( function( r ){
	var newbs = r[0], 
		props = r[1];
	return new Promise( function (resolve, reject) {
		console.log( 'Build Table' );
		table = new AsciiTable( 'Contributors' ).setHeading('Version', 'Total', 'new')
		versions.forEach( v => {
			table.addRow( v , props[v].length, newbs[v].length );
		});
		resolve( table );
	});
}).then( function(){
	console.log(table.toString())
});;

