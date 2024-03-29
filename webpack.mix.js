let mix = require('laravel-mix');

// mix.webpackConfig({
//     stats: {
//         children: true
//     }
// });

mix.js('resources/js/app.js', 'public/js')
	.js('resources/js/ministering.js', 'public/js')
	.js('resources/js/approval.js', 'public/js')
	.js('resources/js/households.js', 'public/js')
	.js('resources/js/assignment.js', 'public/js')
	.js('resources/js/companionship.js', 'public/js')
	.sass('resources/sass/app.scss', 'public/css',  {
		sassOptions: {
			includePaths: ['node_modules'],
		},
   })
   .sass('resources/sass/ministering.scss', 'public/css')
   .sass('resources/sass/approval.scss', 'public/css')
   .sass('resources/sass/manageAssignments.scss', 'public/css')
   .sass('resources/sass/households.scss', 'public/css');

// mix.browserSync({
//    proxy: 'localhost',
//    notify: true
// });

if (mix.inProduction()) {
   mix.version();
   mix.sourceMaps();
}