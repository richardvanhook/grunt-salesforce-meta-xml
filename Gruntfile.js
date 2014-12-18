/*
 * grunt-salesforce-meta-xml
 *
 *
 * Copyright (c) 2014 Richard Vanhook
 * Licensed under the MIT license.
 */


module.exports = function(grunt) {

  'use strict';

  var _     = require('lodash'),
      chalk = require('chalk' );

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: { tests: ['tmp'] },

    copy: { scenario12: {files: [{
      expand: true, cwd: 'test/fixture/scenario12', src: '**', dest: 'tmp/scenario12'
    }]}},

    fixture: {
      scenario01:         { dest: 'tmp/scenario01/pages/Foo.page'              },
      scenario02:         { dest: 'tmp/scenario02/pages/Foo.page'              },
      scenario03: {files:[{ dest: 'tmp/scenario03/pages/Foo.page'              },
                          { dest: 'tmp/scenario03/pages/Bar.page'              }]},
      scenario04:         { dest: 'tmp/scenario04/classes/Foo.cls'             },
      scenario05:         { dest: 'tmp/scenario05/triggers/Foo.trigger'        },
      scenario06:         { dest: 'tmp/scenario06/components/Foo.component'    },
      scenario07: {files:[{ dest: 'tmp/scenario07/staticresources/Foo.resource'},
                          { dest: 'tmp/scenario07/staticresources/Bar.resource'}]},
      scenario08:         { dest: 'tmp/scenario08/dashboards/foo/bar.dashboard'},
      scenario09:         { dest: 'tmp/scenario09/documents/foo/bar.gif'       },
      scenario10:         { dest: 'tmp/scenario10/email/foo/bar.email'         },
      scenario11:         { dest: 'tmp/scenario11/reports/foo/bar.report'      }
    },

    salesforcemetaxml: {

      options:{
        'apexClASS':{}
      },

      scenario01: {
        files:[{
          expand: true,
          cwd: 'tmp/scenario01',
          src: '**'
        }]
      },

      scenario02: {
        options: {
          Apexpage:{
            apiVersion:               '30.0'    ,
            availableInTouch:         false      ,
            confirmationTokenRequired:true      ,
            description:              '<%=new Date(0).toISOString()%>'
          }
        },
        src: 'tmp/scenario02/pages/Foo.page'
      },

      scenario03: {
        expand: true,
        cwd: 'tmp/scenario03',
        src: 'pages/Foo.page'
      },

      scenario04: {
        options: {
          Apexclass:{
            apiVersion:'29.0'
          }
        },
        expand: true,
        cwd: 'tmp/scenario04',
        src: 'classes/Foo.cls'
      },

      scenario05: {
        options: {
          Apextrigger:{
            apiVersion:'28.0',
            status:'Inactive'
          }
        },
        expand: true,
        cwd: 'tmp/scenario05',
        src: 'triggers/Foo.trigger'
      },

      scenario06: {
        options: {
          ApexCOMPONENT:{
            apiVersion:'27.0',
            description:'test 123'
          }
        },
        expand: true,
        cwd: 'tmp/scenario06',
        src: 'components/Foo.component'
      },

      scenario07: {
        options: {
          StaticResource:{
            apiVersion:'26.0',
            description:'foo bar'
          }
        },
        expand: true,
        cwd: 'tmp/scenario07',
        src: '**/*.resource'
      },

      scenario08:{expand:true,cwd:'tmp/scenario08',src:'**'},
      scenario09:{expand:true,cwd:'tmp/scenario09',src:'**'},
      scenario10:{expand:true,cwd:'tmp/scenario10',src:'**'},
      scenario11:{expand:true,cwd:'tmp/scenario11',src:'**'},
      scenario12:{expand:true,cwd:'tmp/scenario12',src:'**'}

    },

    nodeunit: {
      tests: ['test/*_test.js']
    },

    markdown: {
      all: {
        files: [
          {
            expand: true,
            src: 'Readme.md',
            dest: 'tmp',
            ext: '.html'
          }
        ]
      }
    }

  });

  grunt.loadTasks('tasks');

  grunt.registerMultiTask('fixture', 'Creates an empty fixture file', function() {
    this.files.forEach(function(filepath) {
      grunt.verbose.writeln('Creating empty fixture file at '+chalk.yellow(filepath.dest));
      grunt.file.write(filepath.dest, 'contents of this file are irrelevant');
    });
  });

  grunt.registerTask('test', ['clean', 'fixture', 'copy','salesforcemetaxml', 'nodeunit']);
  grunt.registerTask('default', ['jshint', 'test']);

};
