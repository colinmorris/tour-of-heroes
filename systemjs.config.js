/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function(global) {
  // map tells the System loader where to look for things
  var map = {
    'app':                        'app', // 'dist',
    '@angular':                   'node_modules/@angular',
    'angular2-in-memory-web-api': 'node_modules/angular2-in-memory-web-api',
    'rxjs':                       'node_modules/rxjs'

  };
  // packages tells the System loader how to load when no filename and/or no extension
  var packages = {
    'app':                        { main: 'main.js',  defaultExtension: 'js' },
    'rxjs':                       { defaultExtension: 'js' },
    'angular2-in-memory-web-api': { main: 'index.js', defaultExtension: 'js' },
  };
  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'forms',
    'http',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'router-deprecated',
    'upgrade',
  ];

  var myBarrels = [
    // FUCK YOU SYSTEMJS, FUCK YOU ANGULAR DOCS FOR GETTING ME INTO THIS SITUATION GRRR
    // TODO: Maybe you should just write a fucking script to do this. fuuck.
    'app/shared',
    'app/player',
        'app/player/player',
        'app/player/shared',
    'app/stats',
    'app/items',
        'app/items/inventory',
        'app/items/shared',
    'app/klasses',
    'app/perks',
    'app/skills',
    'app/ticker',
    'app/zones',
        'app/zones/activezone',
        'app/zones/shared',
        'app/zones/zone',
        'app/zones/zones',
    ];
  for (let barrel of myBarrels) {
    packages[barrel] = {main: 'index'};
}



  // Individual files (~300 requests):
  function packIndex(pkgName) {
    packages['@angular/'+pkgName] = { main: 'index.js', defaultExtension: 'js' };
  }
  // Bundled (~40 requests):
  function packUmd(pkgName) {
    packages['@angular/'+pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  }
  // Most environments should use UMD; some (Karma) need the individual index files
  var setPackageConfig = System.packageWithIndex ? packIndex : packUmd;
  // Add package entries for angular packages
  ngPackageNames.forEach(setPackageConfig);
  var config = {
    map: map,
    packages: packages
  };
  System.config(config);
})(this);

