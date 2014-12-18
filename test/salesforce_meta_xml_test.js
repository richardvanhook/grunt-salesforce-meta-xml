var grunt = require('grunt');
var fs = require('fs');
var _ = require('lodash');

function assertFileEquals(test,num,path){
    var actualPath = actualFolder(num)+path;
    test.ok(grunt.file.isFile(actualPath),'expected file to exist at ' + actualPath);
    var expectedPath = expectedFolder(num)+path;
    test.ok(grunt.file.isFile(expectedPath),'expected file to exist at ' + expectedPath);
    var actual = grunt.file.read(actualPath);
    var expected = grunt.file.read(expectedPath);
    test.deepEqual(actual, expected, 'should be the same');
}

function assertFolderEquals(test,num,path){
    var actualPath = actualFolder(num)+path;
    test.equal(true,grunt.file.isDir(actualPath),'expected directory to exist at ' + actualPath);
    var expectedPath = expectedFolder(num)+path;
    test.equal(true,grunt.file.isDir(expectedPath),'expected directory to exist at ' + expectedPath);
    var actual = fs.readdirSync(actualPath).sort();
    var expected = fs.readdirSync(expectedPath).sort();
    test.deepEqual(actual, expected, 'should be the same');
}

function scenarioFolder(folder,num){
  return folder + '/scenario' + (num<10?'0':'') + num + '/';
}

function actualFolder(num){ return scenarioFolder('tmp',num); }
function expectedFolder(num){ return scenarioFolder('test/expected',num); }

exports.salesforcemetaxml = {
  scenario01a:function(test){ assertFolderEquals(test,1 ,'pages'                                );},
  scenario01b:function(test){ assertFileEquals  (test,1 ,'pages/Foo.page-meta.xml'              );},
  scenario02a:function(test){ assertFolderEquals(test,2 ,'pages'                                );},
  scenario02b:function(test){ assertFileEquals  (test,2 ,'pages/Foo.page-meta.xml'              );},
  scenario03a:function(test){ assertFolderEquals(test,3 ,'pages'                                );},
  scenario03b:function(test){ assertFileEquals  (test,3 ,'pages/Foo.page-meta.xml'              );},
  scenario04a:function(test){ assertFolderEquals(test,4 ,'classes'                              );},
  scenario04b:function(test){ assertFileEquals  (test,4 ,'classes/Foo.cls-meta.xml'             );},
  scenario05a:function(test){ assertFolderEquals(test,5 ,'triggers'                             );},
  scenario05b:function(test){ assertFileEquals  (test,5 ,'triggers/Foo.trigger-meta.xml'        );},
  scenario06a:function(test){ assertFolderEquals(test,6 ,'components'                           );},
  scenario06b:function(test){ assertFileEquals  (test,6 ,'components/Foo.component-meta.xml'    );},
  scenario07a:function(test){ assertFolderEquals(test,7 ,'staticresources'                      );},
  scenario07b:function(test){ assertFileEquals  (test,7 ,'staticresources/Foo.resource-meta.xml');},
  scenario07c:function(test){ assertFileEquals  (test,7 ,'staticresources/Bar.resource-meta.xml');},
  scenario08a:function(test){ assertFolderEquals(test,8 ,'dashboards'                           );},
  scenario08b:function(test){ assertFolderEquals(test,8 ,'dashboards/foo'                       );},
  scenario08c:function(test){ assertFileEquals  (test,8 ,'dashboards/foo-meta.xml'              );},
  scenario09a:function(test){ assertFolderEquals(test,9 ,'documents'                            );},
  scenario09b:function(test){ assertFolderEquals(test,9 ,'documents/foo'                        );},
  scenario09c:function(test){ assertFileEquals  (test,9 ,'documents/foo-meta.xml'               );},
  scenario09d:function(test){ assertFileEquals  (test,9 ,'documents/foo/bar.gif-meta.xml'       );},
  scenario10a:function(test){ assertFolderEquals(test,10,'email'                                );},
  scenario10b:function(test){ assertFolderEquals(test,10,'email/foo'                            );},
  scenario10c:function(test){ assertFileEquals  (test,10,'email/foo-meta.xml'                   );},
  scenario10d:function(test){ assertFileEquals  (test,10,'email/foo/bar.email-meta.xml'         );},
  scenario11a:function(test){ assertFolderEquals(test,11,'reports'                              );},
  scenario11b:function(test){ assertFolderEquals(test,11,'reports/foo'                          );},
  scenario11c:function(test){ assertFileEquals  (test,11,'reports/foo-meta.xml'                 );},
  scenario12a:function(test){ assertFolderEquals(test,12,'staticresources'                      );},
  scenario12b:function(test){ assertFileEquals  (test,12,'staticresources/gif.resource-meta.xml');},
  scenario12c:function(test){ assertFileEquals  (test,12,'staticresources/jpg.resource-meta.xml');},
  scenario12d:function(test){ assertFileEquals  (test,12,'staticresources/png.resource-meta.xml');},
  scenario12e:function(test){ assertFileEquals  (test,12,'staticresources/txt.resource-meta.xml');},
  scenario12f:function(test){ assertFileEquals  (test,12,'staticresources/zip.resource-meta.xml');},
};

_.each(_.keys(exports.salesforcemetaxml),function(name){
  exports.salesforcemetaxml[name] = _.wrap(exports.salesforcemetaxml[name],function(func,test){
    func(test);
    test.done();
  });
});
