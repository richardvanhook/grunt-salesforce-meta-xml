# grunt-salesforce-meta-xml

> Dynamically generates accompanying metadata files (files ending with "-meta.xml") for salesforce metadata.  Should be used in conjunction with [grunt-ant-sfdc](https://github.com/kevinohara80/grunt-ant-sfdc).

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-salesforce-meta-xml --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-salesforce-meta-xml');
```

## The "salesforcemetaxml" task

### Overview

Per the [Salesforce Metadata API Developer’s Guide](https://www.salesforce.com/us/developer/docs/api_meta/), the following 11 metadata types require "an accompanying metadata file" ending in -meta.xml.  The purpose of this plugin is make generating those accompanying metadata files as simple as possible.  Metadata types not listed below do not require an accompanying metadata file.

+ [ApexClass](https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_classes.htm)
+ [ApexComponent](https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_component.htm)
+ [ApexPage](https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_pages.htm)
+ [ApexTrigger](https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_triggers.htm)
+ [DashboardFolder](https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_folder.htm)
+ [Document](https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_document.htm)
+ [DocumentFolder](https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_folder.htm)
+ [EmailFolder](https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_folder.htm)
+ [EmailTemplate](https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_emailtemplate.htm)
+ [ReportFolder](https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_folder.htm)
+ [StaticResource](https://www.salesforce.com/us/developer/docs/api_meta/Content/meta_staticresource.htm)

### Options

You can customize the values that appear in the accompanying metadata files by including one or more metadata types as options.  For example, if you'd like to specify an apiVersion for all ApexClass metadatat files, then do the following: 

```js
salesforcemetaxml: {
  options:{
    apexclass:{
      apiVersion: '25.0'
    }
  }
},
```
By default, this plugin will generate values for the required fields for each metadata type.

### Usage Examples

This task supports all the file mapping format Grunt supports. Please read [Globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns) and [Building the files object dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically) for additional details.

#### Static Resources

```shell
$ tree myfolder
.
myfolder
└── staticresources
    ├── gif.resource
    ├── jpg.resource
    ├── png.resource
    ├── txt.resource
    └── zip.resource

1 directory, 5 files
```
**Generate accompanying metadata files for all static resources in myfolder:**
```js
salesforcemetaxml: {
  main: {
    expand: true, 
    cwd: 'myfolder',
    src: '**'
  }
},
```

```shell
$ grunt salesforcemetaxml
Running "salesforcemetaxml:main" (salesforcemetaxml) task
Created 5 files

Done, without errors.

$ tree myfolder
.
myfolder
└── staticresources
    ├── gif.resource
    ├── gif.resource-meta.xml
    ├── jpg.resource
    ├── jpg.resource-meta.xml
    ├── png.resource
    ├── png.resource-meta.xml
    ├── txt.resource
    ├── txt.resource-meta.xml
    ├── zip.resource
    └── zip.resource-meta.xml

1 directory, 10 files
```
