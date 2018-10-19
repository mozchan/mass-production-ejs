const fs = require('fs');

const gulp = require('gulp');
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

  // ページの数だけループ
  page.forEach((page, i) => {
    const id = ++i;
    const adjustID = String(id).padStart(2,0);

    gulp.src(templateFile)
      .pipe(ejs({
        data: massProJson[page]
      }).on('error', onError))
      .pipe(rename(`page_${adjustID}.html`))
      .pipe(gulp.dest('dist/'));
  })
})
