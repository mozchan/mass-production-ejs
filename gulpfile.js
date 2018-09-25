const fs = require('fs');

const gulp = require("gulp");
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');

gulp.task('mass-pro', () => {
  const templateFile = 'src/ejs/_template.ejs';
  const massProJson = JSON.parse(fs.readFileSync('src/ejs/_mass_pro.json', 'utf-8'));
  const page = Object.keys(massProJson);
  const onError = (err) => {
    console.log(err.message);
    this.emit('end');
  };
  
  // ゼロパディングに変換
  const zeroPadding = (num) => {
    const digit = 2; // ゼロパディングを含めた桁数を設定
    const length = String(num).length; 
    
    if(digit > length) {
      return (new Array(digit).join(0) + num);
    } else {
      return num;
    }
  }

  // ページの数だけループ
  page.forEach((page, i) => {
    const id = ++i;
    const adjustID = zeroPadding(id);
    
    gulp.src(templateFile)
      .pipe(ejs({
        data: massProJson[page]
      }).on('error', onError))
      .pipe(rename(`page_${adjustID}.html`))
      .pipe(gulp.dest('dist/'));
  })
})
