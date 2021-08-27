let mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
	.sass('resources/sass/app.scss', 'public/css',  {
		sassOptions: {
			includePaths: ['node_modules'],
		},
   })
   .sass('resources/sass/ministering.scss', 'public/css');

// mix.browserSync({
//    proxy: 'localhost',
//    notify: true
// });

if (mix.inProduction()) {
   mix.version();
   mix.sourceMaps();
}