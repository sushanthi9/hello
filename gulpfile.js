var pug = require("gulp-pug");
var less = require("gulp-less");
var watch= require("gulp-watch");
var minify= require("gulp-minify");
var prettify = require("gulp-prettify");
var gulp=require("gulp");
var browsersync = require('browser-sync');
var runsequence= require('run-sequence');

//create our first task.Each task has a name and a function attached to it

gulp.task('pug',function(){
    //alll pug files will be in templates folder with .pug extension
    return gulp.src('templates/*.pug')
   .pipe(pug())
    .pipe(prettify())
    .pipe(gulp.dest('build'))
    .pipe(browsersync.reload({
        stream:true
    }))
    
});

//for css we are going to create a new task in  a similar pattern
gulp.task('less',function(){
    
    //store less files in less folder
    return gulp.src('less/*.less')
    
    .pipe(less())
    .pipe(minify())
    .pipe(gulp.dest('build'))
    .pipe(browsersync.reload({
        stream:true
    }))
});

//another task for our java script
gulp.task('js',function(){
    
    //store java script files in scripts folder
    return gulp.src('scripts/*.js')
    .pipe(minify())
    .pipe(gulp.dest('build'))
    .pipe(browsersync.reload({
        stream:true
    }))
});


gulp.task('browsersync',function() {
    browsersync.init({server: {baseDir: 'build'},
    port: '8082'
    });
});

//copy changes to build to docs folder
gulp.task('publishchanges',function(){
    
    //store java script files in scripts folder
    return gulp.src('build/*.*')
    .pipe(gulp.dest('docs'))
    });

//create task for watch
gulp.task('watch',function(){
    runsequence('pug','less','js','browsersync','publishchanges',function(e){
       //not yey anything 
       
    });
    
    //semicolons are not mandatory in java script
    
    //runs the watch module on the folders and runs the corresponding tasks
    gulp.watch('templates/*.pug' ,['pug']);
    gulp.watch('less/*.less' ,['less']);
    gulp.watch('scripts/*.js', ['js']);
    gulp.watch('build/*.*',['publishchanges']);
});






