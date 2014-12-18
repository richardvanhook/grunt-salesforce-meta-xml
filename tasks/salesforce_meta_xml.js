/*
 * grunt-salesforce-meta-xml
 *
 *
 * Copyright (c) 2014 Richard Vanhook
 * Licensed under the MIT license.
 */


module.exports = function(grunt) {
  'use strict';

  if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
      value: function(searchString, position) {
        var subjectString = this.toString();
        if (position === undefined || position > subjectString.length) {
          position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
      }
    });
  }

  var _         = require('lodash'   ),
      debug     = require('debug'    )('salesforcemetaxml'),
      path      = require('path'     ),
      minimatch = require('minimatch'),
      chalk     = require('chalk'    ),
      mmm       = require('mmmagic')            ,
      Magic     = mmm.Magic                     ,
      magic     = new Magic(mmm.MAGIC_MIME_TYPE);

  var DEFAULT_API_VERSION = '32.0';
  var METADATA_DB_PATH = 'lib/types.json';

  var template = _.template(
    '<?xml version="1.0" encoding="UTF-8"?>\n'+
    '<<%=type%> xmlns="http://soap.sforce.com/2006/04/metadata">\n'+
      '<%_.each(_.keys(attributes).sort(),function(attribute){%>' +
      '  <<%=attribute%>>' +
           '<%=attributes[attribute]%>' +
        '</<%=attribute%>>\n' +
      '<%});%>'+
    '</<%=type%>>\n'
  );

  function lowerKeys(object){
    var returnValue = {};
    _.each(_.keys(object),function(key){
      returnValue[_.isString(key) ? key.toLowerCase() : key] = object[key];
    });
    return returnValue;
  }

  grunt.registerMultiTask('salesforcemetaxml',
    'Dynamically generates -meta.xml files for salesforce metadata.  ' +
    'Should be used in conjunction with grunt-ant-sfdc.',

    function() {
      //load exhaustive and user defined metadata types
      var allMeta = grunt.file.readJSON(METADATA_DB_PATH);
      debug('Loaded %s metadata types from %s', chalk.cyan(_.size(allMeta)), METADATA_DB_PATH);
      //save case sensitive xmlName for later use
      _.each(_.keys(allMeta),function(key){allMeta[key].xmlName = key;});
      //lower case metadata type names
      allMeta = lowerKeys(allMeta);
      var userMeta = lowerKeys(this.options());
      debug('Options contain configuration for %s metadata types',chalk.cyan(_.size(userMeta)));

      //validate user defined metadata type names
      var invalidMetaNames = _.difference(_.keys(userMeta),_.keys(allMeta));
      if(invalidMetaNames.length > 0)
        grunt.fail.warn('Unrecognized metadata types: ['+invalidMetaNames.join(',')+']');

      //add required attributes not defined by user
      _.each(_.keys(allMeta),function(metaName){
        if(_.isUndefined(userMeta[metaName])) userMeta[metaName] = {};
        _.each(allMeta[metaName].attributes,function(attr){
          if(_.isString(attr.default) && _.isUndefined(userMeta[metaName][attr.name])){
            userMeta[metaName][attr.name] = attr.default;
            debug('Set %s.%s to %s',metaName,attr.name,attr.default);
          }
        });
      });

      //index patterns
      var filePatterns = {}, folderPatterns = {};
      _.each(_.keys(allMeta),function(metaName){
        var fileOrFolderTarget = allMeta[metaName].folder ? folderPatterns : filePatterns;
        fileOrFolderTarget[allMeta[metaName].pattern] = metaName;
      });
      debug(chalk.yellow('patterns'));
      debug(chalk.yellow(JSON.stringify(filePatterns,undefined,'  ')));
      debug(chalk.yellow(JSON.stringify(folderPatterns,undefined,'  ')));

      //templatize attributes
      _.each(_.keys(userMeta),function(metaName){
        var metaType = userMeta[metaName];
        _.each(_.keys(metaType),function(attrName){
          debug('Compiling %s.%s: %s',metaName,attrName,metaType[attrName]);
          metaType[attrName] = _.template(''+metaType[attrName]);
        });
      });

      //process files
      var filesSrc = this.filesSrc.slice();
      var created = [];
      var done = this.async();

      function process() {
        if(filesSrc.length <= 0) {
          done();
          grunt.log.writeln('Created ' + created.length + ' file'
            + (created.length === 1 ? '' : 's'));
          if(created.length > 0)
            grunt.verbose.writeln(chalk.yellow(created.join('\n')));
          return;
        }
        var filepath = filesSrc.pop();
        var patternMappings = grunt.file.isDir(filepath) ? folderPatterns : filePatterns;
        var typeName = patternMappings[_.find(_.keys(patternMappings),function(pattern){
          var returnValue = minimatch(filepath,pattern);
          debug('match? %s %s,%s',
            (returnValue ? chalk.green('true ') : chalk.red('false')),
            chalk.magenta(pattern),chalk.yellow(filepath));
          return returnValue;
        })];
        if(filepath.endsWith('-meta.xml') || _.isUndefined(typeName)){
          grunt.verbose.writeln(chalk.gray('Ignoring   ' +
            (grunt.file.isDir(filepath) ? 'folder' : 'file  ') + ' ' + filepath));
          process();
        } else {
          grunt.verbose.write(chalk.green('Processing') + ' ' +
            (grunt.file.isDir(filepath) ? chalk.blue('folder') : chalk.green('file  ')) +
            ' ' + chalk.yellow(filepath) + ' as ' + chalk.cyan(typeName) + '...');
          var substitutionVars = {
            name: path.basename(filepath).replace(/\.[^/.]+$/, ''),
            apiVersion: DEFAULT_API_VERSION
          };
          magic.detectFile(filepath,function(err, result){
            if (err) grunt.log.warn('Error computing mimetype for path ' +
              chalk.yellow(filepath) + '\n' + chalk.red(err)
            );
            else substitutionVars.mimetype = result;
            var metaAttributes = userMeta[typeName];
            var attributes = _.reduce(_.keys(metaAttributes),function(memo,metaAttributeName){
              memo[metaAttributeName] = metaAttributes[metaAttributeName](substitutionVars);
              return memo;
            },{});
            grunt.verbose.ok();
            debug('mimetype: %s',result);
            grunt.file.write(filepath + '-meta.xml',
              template({attributes:attributes,type:allMeta[typeName].xmlName}));
            created.push(filepath + '-meta.xml');
            process();
          });
        }
      }
      process();
    }
  );
};
