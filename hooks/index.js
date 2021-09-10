import { addFilter } from '@wordpress/hooks';
import { filters } from './filters';

filters?.forEach?.( ( filter ) => {
	filter?.forEach?.( ( { hook, namespace, callback, priority = 10 } ) => {
		addFilter( hook, namespace, callback, priority );
	} );
} );
