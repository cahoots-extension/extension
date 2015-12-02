module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mozilla-addon-sdk');
    grunt.loadNpmTasks('grunt-crx');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    var out_dir = 'target';
    var mozillaConfig = {
        stable_sdk_version: '1.17'
    }

    var userConfig = {
        pkg: grunt.file.readJSON('package.json'),

        src: 'src/main/js',
        src_ff: 'src/main/plugin/firefox',
        src_chrome: 'src/main/plugin/chrome',
        lib_dir: 'cahoots-deps/libs',

        build_dir_firefox: out_dir+'/exploded-firefox',
        build_dir_chrome: out_dir+'/exploded-chrome',
        export_dir: out_dir+'/packaged-out',

        private_key: "development-test.key"
    };
    var taskConfig = {
        clean: [
            out_dir
        ],
        copy: {
            firefox: {
                files: [
                    // firefox addon assets: icons
                    {
                        expand: true,
                        cwd: 'src/main/resources/images/icon',
                        src: ['icon.png', 'icon64.png'],
                        dest: '<%= build_dir_firefox %>'
                    },
                    {
                        expand: true,
                        cwd: 'src/main/resources/images/icon',
                        src: ['cdot_14px.png', 'cdot_14px_grau.png'],
                        dest: '<%= build_dir_firefox %>/data'
                    },
                    // firefox addon business assets: stylesheets
                    {
                        expand: true,
                        cwd: 'src/main/resources/css',
                        src: '*.css',
                        dest: '<%= build_dir_firefox %>/data'},
                    {
                        expand: true,
                        cwd: 'src/main/resources/html',
                        src: '*.html',
                        dest: '<%= build_dir_firefox %>/data'},
                    // firefox libs
                    {expand: true,
                        cwd: 'bower_components/tooltipster/js/',
                        src: 'jquery.tooltipster.js',
                        dest: '<%= build_dir_firefox %>/data'},
                    {expand: true,
                        cwd: 'node_modules/jquery/dist',
                        src: ['jquery.js'],
                        dest: '<%= build_dir_firefox %>/data'},
                    // firefox jquery highlight
                    {expand: true,
                        cwd: 'src/main/js/jquery',
                        src: '*.js',
                        dest: '<%= build_dir_firefox %>/data'},
                    {expand: true,
                        cwd: 'src/main/js/firefox',
                        src: '**/*',
                        dest: '<%= build_dir_firefox %>'},
                    {expand: true,
                        cwd: 'target/js',
                        src: 'CahootsContentBundle.js',
                        dest: '<%= build_dir_firefox %>/data'},
                    {expand: true,
                        cwd: 'target/js',
                        src: 'FirefoxContentScriptBundle.js',
                        dest: '<%= build_dir_firefox %>/data'},
                    {expand: true,
                        cwd: 'target/js',
                        src: 'CahootsExtensionBundle.js',
                        dest: '<%= build_dir_firefox %>/lib'},
                    {expand: true,
                        cwd: 'src/main/js/firefox/lib',
                        src: 'CahootsExtensionBundle.js',
                        dest: '<%= build_dir_firefox %>/lib'}

                ]
            },
            chrome: {
                files: [
                    // chrome plugin skeleton
                    {expand: true,
                        cwd: 'src/main/js/chrome',
                        src: ['ChromeContentScriptLoader.js', 'ChromeExtensionLoader.js', 'manifest.json'],
                        dest: '<%= build_dir_chrome %>'},
                    // chrome addon assets: icons
                    {
                        expand: true,
                        cwd: 'src/main/resources/images/icon',
                        src: ['icon14.png','icon16.png','icon19.png','icon48.png','icon128.png','verified.png'],
                        dest: '<%= build_dir_chrome %>/img'},

                    //
                    {expand: true,
                        cwd: 'bower_components/tooltipster/js/',
                        src: 'jquery.tooltipster.js',
                        dest: '<%= build_dir_chrome %>'},
                    {expand: true,
                        cwd: 'node_modules/jquery/dist',
                        src: 'jquery.js',
                        dest: '<%= build_dir_chrome %>'},
                    // chrome addon business assets: stylesheets
                    {
                        expand: true,
                        cwd: 'src/main/resources/css',
                        src: ['*.css'],
                        dest: '<%= build_dir_chrome %>'},
                    {
                        expand: true,
                        cwd: 'src/main/resources/html',
                        src: ['*.html'],
                        dest: '<%= build_dir_chrome %>'},
                    // chrome libs
//                    {expand: true,
//                        cwd: 'cahoots-deps/libs',
//                        src: ['*.min.js'],
//                        dest: '<%= build_dir_chrome %>'},
                    // chrome jquery highlight
                    {expand: true,
                        cwd: 'src/main/js/jquery',
                        src: 'jquery_highlight.js',
                        dest: '<%= build_dir_chrome %>'},
                    {expand: true,
                        cwd: 'target/js',
                        src: ['Cahoots*.js','Chrome*.js'],
                        dest: '<%= build_dir_chrome %>/'}
                ]
            }
        },
        "mozilla-addon-sdk": {
            'stable': {
                options: {
                    revision: mozillaConfig.stable_sdk_version
                }
            },
            'master': {
                options: {
                    revision: "master",
                    github: true
                    // github_user: "mozilla" // default value
                }
            }
        },
        /**
         * https://www.npmjs.org/package/grunt-mozilla-addon-sdk
         */
        "mozilla-cfx-xpi": {
            'stable': {
                options: {
                    "mozilla-addon-sdk": "stable",
                    extension_dir: "<%= build_dir_firefox %>",
                    dist_dir: "<%= export_dir %>"
                }
            },
            'experimental': {
                options: {
                    "mozilla-addon-sdk": "master",
                    extension_dir: "<%= build_dir_firefox %>",
                    dist_dir: "<%= export_dir %>/firedox-addon-experimental"

                }
            }
        },
        'mozilla-cfx': {
            'run_stable': {
                options: {
                    "mozilla-addon-sdk": "stable",
                    extension_dir: "<%= build_dir_firefox %>",
                    command: "run",

                    arguments: "-p ../../firefox_profile --binary-args '-jsconsole'",
                    pipe_output: true

                    //arguments: "--binary-args '-url \"www.mozilla.org\" -jsconsole'"
                }
            },
            'run_experimental': {
                options: {
                    "mozilla-addon-sdk": "master",
                    extension_dir: "<%= build_dir_firefox %>",
                    command: "run",

                    arguments: "-p ../../firefox_profile --binary-args '-jsconsole'",

                    pipe_output: true
                }
            }
        },

        /**
         * see https://github.com/oncletom/grunt-crx
         */
        /*
        */
        crxPkg: grunt.file.readJSON('package.json'),
        crx: {
            cahootsExtension: {
                "src": ["<%= build_dir_chrome %>/**/*"],
                "dest": "<%= export_dir %>",
                "zipDest": "<%= export_dir %>",

                "options": {
                    "privateKey": userConfig.private_key
                }
            }
        },

        karma: {
            app: {
                configFile: 'karma.conf.js',
                runnerPort: 9999,
                singleRun: true,
                browsers: ['PhantomJS', 'Firefox'],
                logLevel: 'ERROR'
            },
            chrome_ui_tests: {
                configFile: 'karma-chrome.conf.js',
                runnerPort: 9999,
                singleRun: true,
                browsers: ['Chrome'],
                logLevel: 'ERROR'
            },
            firefox_ui_tests: {
                configFile: 'karma-firefox.conf.js',
                runnerPort: 9999,
                singleRun: true,
                browsers: ['Chrome'],
                logLevel: 'ERROR'
            }
        },

        browserify: {
            content_bundle: {
                src: 'src/main/js/app/content/*.js',
                dest: out_dir + "/js/" + 'CahootsContentBundle.js',
                options: {
                    browserifyOptions: {
                        debug: false,
                        standalone: "cahoots.content"
                    }
                }
            },

            extension_bundle: {
                src: 'src/main/js/app/extension/index.js',
                dest: out_dir + "/js/" + 'CahootsExtensionBundle.js',
                options: {
                    browserifyOptions: {
                        debug: false,
                        standalone: "cahoots.extension"
                    }
                }
            },

            chrome_content_script: {
                src: 'src/main/js/chrome/ChromeContentScript.js',
                dest: out_dir + "/js/" + 'ChromeContentScriptBundle.js',
                options: {
                    browserifyOptions: {
                        debug: false,
                        standalone: "cahoots.chrome.content"
                    }
                }
            },

            firefox_content_script: {
                src: 'src/main/js/firefox/data/FirefoxContentScript.js',
                dest: out_dir + "/js/" + 'FirefoxContentScriptBundle.js',
                options: {
                    browserifyOptions: {
                        debug: false,
                        standalone: "cahoots.firefox.content"
                    }
                }
            },

            chrome_extension_application: {
                src: [/*'src/main/js/app/extension/index.js', */'src/main/js/chrome/ChromeExtension.js'],
                dest: out_dir + "/js/" + 'ChromeExtensionBundle.js',
                options: {
                    browserifyOptions: {
                        debug: false,
                        standalone: 'cahoots.chrome.extension'
                    }
                }
            }

        },

        watch: {
            files: ['src/**/*'],
            tasks: ['tests']
        }
    };

    grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

    /**
     * The default task is to build both extensions
     */
    grunt.registerTask('default', [ 'build_all' ]);

    grunt.registerTask('build_all', [ 'clean', 'karma:app', 'build_firefox', 'build_chrome' ]);
    grunt.registerTask('tests', ['build_all', 'karma:chrome_ui_tests', 'karma:firefox_ui_tests']);

    grunt.registerTask('browserify_app', [ 'browserify:content_bundle', 'browserify:extension_bundle' ]);
    grunt.registerTask('browserify_chrome', [ 'browserify:chrome_content_script', 'browserify:chrome_extension_application']);
    grunt.registerTask('browserify_firefox', [ 'browserify_app', 'browserify:firefox_content_script'/*, 'browserify:firefox_extension_application'*/]);

    //grunt.registerTask('build_firefox', "builds the cahoots firefox addon (stable sdk version)", [ 'browserify_app','browserify_firefox','copy:firefox','mozilla-cfx-xpi:stable' ]);
    grunt.registerTask('build_firefox', "builds the cahoots firefox addon (stable sdk version)", [ 'browserify_firefox', 'copy:firefox', 'mozilla-cfx-xpi:stable' ]);

    //grunt.registerTask('build_firefox_experimental', "builds the cahoots firefox addon (unstable sdk version)", [ 'browserify_app','copy:firefox','mozilla-cfx-xpi:experimental' ]);

    grunt.registerTask('build_chrome', "builds the cahoots chrome extension",[ 'browserify_app','browserify_chrome','copy:chrome','crx' ]);

    grunt.registerTask('run_firefox', "runs the cahoots firefox addon (stable sdk version)",[ 'clean','karma:app','build_firefox','mozilla-cfx:run_stable' ]);
    grunt.registerTask('run_firefox_experimental', "runs the cahoots firefox addon (unstable sdk version)",[ 'clean','karma','build_firefox_experimental','mozilla-cfx:run_experimental' ]);


};
