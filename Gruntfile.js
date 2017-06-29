module.exports = function(grunt) {
    require('load-grunt-tasks', 'grunt-contrib-cssmin', 'grunt-contrib-uglify', 'grunt-contrib-htmlmin')(grunt);
    var config = grunt.file.readYAML('Gruntconfig.yml');
    grunt.initConfig({
        jshint: {
            all: ['src/js/*', 'src/views/js/*']
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: config.cssSrcDir,
                    src: ['*.css', '!*min.css'],
                    dest: config.cssDistDir,
                    ext: '.css'
                }]
            },
        },
        uglify: {
            build: {
                files: {
                    'dist/js/perfmatters.js': 'src/js/perfmatters.js',
                    'dist/js/main.js': 'src/js/main.js'
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'src/index.html', // 'destination': 'source'
                    'dist/project-2048.html': 'src/project-2048.html', // 'destination': 'source'
                    'dist/project-mobile.html': 'src/project-mobile.html', // 'destination': 'source'
                    'dist/project-webperf.html': 'src/project-webperf.html', // 'destination': 'source'
                    'dist/pizza.html': 'src/pizza.html', // 'destination': 'source'
                }
            }
        },
        responsive_images: {
            compress_pictures: {
                options: {

                    sizes: [{
                        width: 100,
                        height: 75,
                        quality: 50
                    }]
                },
                files: [{
                    expand: true,
                    src: [config.imgSrcDir + '**.{jpg,png}'],
                    cwd: '',
                    custom_dest: config.imgDistDir
                }]
            },
            compress_pictures_Pizzeria: {
                options: {

                    sizes: [{
                        width: 100,
                        height: 75,
                        quality: 60
                    }, {
                        name: 'medium',
                        width: 380,
                        height: 285,
                        quality: 30
                    }, {
                        name: 'large',
                        width: 720,
                        height: 540,
                        quality: 30
                    }]
                },
                files: [{
                    expand: true,
                    src: [config.imgSrcDir + 'pizzeria.{jpg,gif}'],
                    cwd: '',
                    custom_dest: config.imgDistDir + '{%=width %}/'
                }, ]
            },
            compress_pictures_Pizza: {
                options: {

                    sizes: [{
                        quality: 50,
                        width: 205,
                        height: 325
                    }, {
                        name: 'pizza_small',
                        quality: 50,
                        width: 73.333,
                        height: 100
                    }]
                },
                files: [{
                    expand: true,
                    src: [config.imgSrcDir + 'pizza.{png,gif}'],
                    cwd: '',
                    custom_dest: config.imgDistDir + '{%=width %}/'
                }, ]
            }
        }


    });

    grunt.registerTask('default', [
        'jshint',
        'cssmin',
        'uglify',
        'htmlmin',
        'responsive_images'

    ]);
};