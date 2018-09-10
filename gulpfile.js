const fs = require('fs');

const gulp = require("gulp");
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');

gulp.task('mass-pro', () => {
  const templateFile = 'src/ejs/_template.ejs';
  const massProJson = JSON.parse(fs.readFileSync('src/ejs/_mass_pro.json', 'utf-8'));
  let page = Object.keys(massProJson);
  let onError = (err) => {
    console.log(err.message);
    this.emit('end');
  };
  
  // ゼロパディングに変換
  let zeroPadding = (num) => {
    const digit = 2; // ゼロパディングを含めた桁数を設定
    let length = String(num).length; 
    
    if(digit > length) {
      return (new Array(digit).join(0) + num);
    } else {
      return num;
    }
  }

  // ページの数だけループ
  for (let i = 0; i < page.length; i++) {
    let id = i + 1;
    let adjustID = zeroPadding(id);

    gulp.src(templateFile)
    .pipe(ejs({
      data: massProJson[page[i]]
    }).on('error', onError))
    .pipe(rename('page_' + adjustID + '.html')) // htmlファイルの名前を変更
    .pipe(gulp.dest('dist/')); // 指定したフォルダに出力
  }
})
