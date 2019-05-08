<?php

class WP_Credits {
	
	function build(){
		$groups = $this->groups();
		$props = $this->props();
		foreach( $groups as $group ) {
			$peeps = array_keys( $group['data'] );
			$props = array_merge( $props, $peeps ); 
		}
		sort( $props );
		$data = array_unique( $props );
		return $data;
	}

}

$file = 'credits/wp-' . $argv[1] . '.php';
require $file;
$class = 'WP_' . $argv[1] . '_Credits'; 

$credits = new $class();

$new_file = './releaseday/' . $argv[1] . '.json';
$data = json_encode( array_values( $credits->build() ) );
file_put_contents( $new_file, $data );
