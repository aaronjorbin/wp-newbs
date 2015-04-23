var releases = {},
	props = {},
	unions = {},
	newbs = {},
	_ = require( 'underscore' ),
	fs = require('fs');


releases["32"] = JSON.parse(fs.readFileSync( './index.html?version=3.2' ));
releases["33"] = JSON.parse(fs.readFileSync( './index.html?version=3.3' ));
releases["34"] = JSON.parse(fs.readFileSync( './index.html?version=3.4' ));
releases["35"] = JSON.parse(fs.readFileSync( './index.html?version=3.5' ));
releases["36"] = JSON.parse(fs.readFileSync( './index.html?version=3.6' ));
releases["37"] = JSON.parse(fs.readFileSync( './index.html?version=3.7' ));
releases["38"] = JSON.parse(fs.readFileSync( './index.html?version=3.8' ));
releases["39"] = JSON.parse(fs.readFileSync( './index.html?version=3.9' ));
releases["40"] = JSON.parse(fs.readFileSync( './index.html?version=4.0' ));
releases["41"] = JSON.parse(fs.readFileSync( './index.html?version=4.1' ));
releases["42"] = JSON.parse(fs.readFileSync( './index.html?version=4.2' ));



props["32"] = Object.keys( releases["32"].groups.props.data );
props["33"] = Object.keys( releases["33"].groups.props.data );
props["34"] = Object.keys( releases["34"].groups.props.data );
props["35"] = Object.keys( releases["35"].groups.props.data );
props["36"] = Object.keys( releases["36"].groups.props.data );
props["37"] = Object.keys( releases["37"].groups.props.data );
props["38"] = Object.keys( releases["38"].groups.props.data );
props["39"] = Object.keys( releases["39"].groups.props.data );
props["40"] = Object.keys( releases["40"].groups.props.data );
props["41"] = Object.keys( releases["41"].groups.props.data );
props["42"] = Object.keys( releases["42"].groups.props.data );

unions["33"] = _.union( props["32"] , props["33"] );
unions["34"] = _.union( props["34"] , unions["33"] );
unions["35"] = _.union( props["35"] , unions["34"] );
unions["36"] = _.union( props["36"] , unions["35"] );
unions["37"] = _.union( props["37"] , unions["36"] );
unions["38"] = _.union( props["38"] , unions["37"] );
unions["39"] = _.union( props["39"] , unions["38"] );
unions["40"] = _.union( props["40"] , unions["39"] );
unions["41"] = _.union( props["41"] , unions["40"] );
unions["42"] = _.union( props["42"] , unions["41"] );

newbs["32"] = props["32"];
newbs["33"] = _.difference( props["33"], props["32"] );
newbs["34"] = _.difference( props["34"], unions["33"] );
newbs["35"] = _.difference( props["35"], unions["34"] );
newbs["36"] = _.difference( props["36"], unions["35"] );
newbs["37"] = _.difference( props["37"], unions["36"] );
newbs["38"] = _.difference( props["38"], unions["37"] );
newbs["39"] = _.difference( props["39"], unions["38"] );
newbs["40"] = _.difference( props["40"], unions["39"] );
newbs["41"] = _.difference( props["41"], unions["40"] );
newbs["42"] = _.difference( props["42"], unions["41"] );

_.each( newbs, function( peeps, version) {
	console.log( '-------' );
	console.log( version  );
	console.log( peeps.length );
});

