# :bulb:準備 #
* 予めタスクランナー「Gulp」を実行できる環境を構築する
* 予め量産用HTMLファイルのテンプレートとなるEJSファイルを作成する
* HTMLファイルに記述するテキストデータをまとめたJSONファイルを作成する

# タスクランナー＆モジュール #
* [gulp](https://www.npmjs.com/package/gulp)
* [gulp-ejs](https://www.npmjs.com/package/gulp-ejs)
* [gulp-rename](https://www.npmjs.com/package/gulp-rename)
```
const gulp = require("gulp");
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
JSONデータの第一階層目を配列に代入。ページ数を取得するために使用。
```
let page = Object.keys(massProJson);
```

## 関数 ##
### onError ###
エラーが発生した場合の処理。意図しないHTMLファイルが生成されることを防ぐ。
```
let onError = (err) => {
  console.log(err.message); 
  this.emit('end');
};
```
### zeroPadding ###
引数`num`が2桁未満の場合、1桁目に`0`を代入する。  
例）`num`が`1`であった場合`01`と返す。
```
let zeroPadding = (num) => {
  const digit = 2; // ゼロパディングを含めた桁数を設定
  let length = String(num).length; 

  if(digit > length) {
    return (new Array(digit).join(0) + num);
  } else {
    return num;
  }
}
```

## HTMLファイルの生成 ##
変数`page`に代入されてる配列分、HTMLを生成する。  
HTMLファイルの生成は一度のみ。（監視`watch`は行わない）
```
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
```

### インクリメントの制御 ###
index番号の開始を`1`からに変更し、ゼロパディングを追加する。
```
let id = i + 1;
let adjustID = zeroPadding(id);
```

### EJSファイルにJSONデータを渡す ###
```
.pipe(ejs({
  data: massProJson[page[i]]
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
.pipe(rename('page_' + adjustID + '.html'))
```
