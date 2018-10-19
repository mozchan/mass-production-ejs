# :bulb:準備 #
* 予めタスクランナー「Gulp」を実行できる環境を構築する
* 予め量産用HTMLファイルのテンプレートとなるEJSファイルを作成する
* HTMLファイルに記述するテキストデータをまとめたJSONファイルを作成する

# タスクランナー＆モジュール #
* [gulp](https://www.npmjs.com/package/gulp)
* [gulp-ejs](https://www.npmjs.com/package/gulp-ejs)
* [gulp-rename](https://www.npmjs.com/package/gulp-rename)
```
const gulp = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
```

# タスク #

## 変数 ##
### templateFile ###
量産用HTMLファイルのテンプレートファイル
```
const templateFile = 'src/ejs/_template.ejs';
```
### massProJson ###
各HTMLファイルに記述するテキストデータ
```
const massProJson = JSON.parse(fs.readFileSync('src/ejs/_mass_pro.json', 'utf-8'));
```
<参考>  
複数のJSONファイルで管理している場合
```
const json1 = JSON.parse(fs.readFileSync('src/ejs/_file_01.json', 'utf-8'));
const json2 = JSON.parse(fs.readFileSync('src/ejs/_file_02.json', 'utf-8'));

// マージ
const massProJson = Object.assign(json1,json2);
```

### page ###
JSONで取得したデータを Object → Array に変更。
```
const page = Object.keys(massProJson);
```

## 関数 ##
### onError ###
エラーが発生した場合の処理。意図しないHTMLファイルが生成されることを防ぐ。
```
const onError = (err) => {
  console.log(err.message);
  this.emit('end');
};
```

## HTMLファイルの生成 ##
変数`page`に代入されてる配列分、HTMLを生成する。  
HTMLファイルの生成は一度のみ。（監視`watch`は行わない）
```
page.forEach((page, i) => {
  const id = ++i;
  const adjustID = String(id).padStart(2,0);

  gulp.src(templateFile)
    .pipe(ejs({
      data: massProJson[page]
    }).on('error', onError))
    .pipe(rename(`page_${adjustID}.html`)) // htmlファイルの名前を変更
    .pipe(gulp.dest('dist/')); // 指定したフォルダに出力
})
```

### インクリメントの制御 ###
index番号の開始を`1`からに変更し、padStart()メソッドを使ってゼロパディングを追加する。
```
const id = ++i;
const adjustID = String(id).padStart(2,0);
```

### EJSファイルにJSONデータを渡す ###
```
.pipe(ejs({
  data: massProJson[page]
})
```
`data`に渡しているデータ
```
{ title: 'PAGE 1', discription: 'PAGE 1の説明文が入ります。' }
{ title: 'PAGE 2', discription: 'PAGE 2の説明文が入ります。' }
{ title: 'PAGE 3', discription: 'PAGE 3の説明文が入ります。' }
```
EJSファイル
```
<h1><%= data.title %></h1>
```
HTML生成後
```
<h1>PAGE 1</h1>
```

### HTMLファイル名の指定 ###
HTMLファイル名を`page_xx.html`となるように指定。
```
.pipe(rename(`page_${adjustID}.html`))
```
