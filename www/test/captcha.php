<?php
/**
 * Created at: 2018/10/9 下午5:28
 */

$dbname = 'sonorous';
$host   = '10.47.105.170';
$user   = 'sonorous';
$pwd    = 'ktN^uYiq2iebVsrEefaca';


$pdo = new PDO("mysql:dbname={$dbname};host={$host}", $user, $pwd);
$pdo->exec('set names utf8mb4');

function get()
{
  $url = 'https://ibaotu.com/index.php?m=downVarify&a=index&id=215124';
  $ch  = curl_init($url);
  curl_setopt_array($ch, [
      CURLOPT_USERAGENT      => 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; WOW64; Trident/4.0; SLCC1)',
      CURLOPT_RETURNTRANSFER => true,
  ]);

  $html = curl_exec($ch);

  preg_match_all('/<img src="([^"]+)" data-key="([^"]+)">/', $html, $matches);

  $result = [];
  foreach ($matches[2] as $index => $hash) {
    $url = 'https:' . $matches[1][$index];
    curl_setopt($ch, CURLOPT_URL, $url);
    $img           = curl_exec($ch);
    $result[$hash] = base64_encode($img);
  }
  curl_close($ch);
  return $result;
}

if (isset($argv[1]) && $argv[1] === 'crawler') {
  $eol = "";
  while (true) {
    $data = get();

    foreach ($data as $hash => $img) {
      $stmt = $pdo->query('SELECT * from ibaotu_captcha WHERE hash=' . $pdo->quote($hash));

      if ($stmt && $stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row['data']) {
          echo ".";
          $eol = "\n";
          continue;
        }

        $pdo->exec('UPDATE ibaotu_captcha SET `data`=' . $pdo->quote($img) . ' WHERE hash=' . $pdo->quote($hash));
        echo "update [$hash]\n";
        continue;
      }

      echo $eol;

      $stmt = $pdo->prepare('INSERT INTO ibaotu_captcha (hash, `data`) VALUES (?, ?)');
      if ($stmt->execute([
          $hash,
          $img,
      ])) {
        echo "add [$hash]\n";
      } else {
        echo "db error.\n";
        var_export($pdo->errorInfo());
        echo PHP_EOL;
      }
    }

    sleep(1);
  }
} else {
  if (isset($_GET['render'])) {
    $hash = $_GET['render'];
    $url = 'https://ibaotu.com/index.php?m=downVarify&a=renderCode&k=' . $hash;
    $ch  = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_USERAGENT      => 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0; WOW64; Trident/4.0; SLCC1)',
        CURLOPT_RETURNTRANSFER => true,
    ]);
    $content = curl_exec($ch);
    curl_close($ch);
    header('Content-Type: image/png');
    echo $content;
    exit;
  }
  header('Content-Type: text/html; charset=utf8');

  $tail = '';
  if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $hash = trim($_POST['hash'] ?? '');
    $text = trim($_POST['text'] ?? '');

    if (!$hash || !$text || !is_string($text) || mb_strlen($text, 'utf-8') !== 1) {
      exit(1);
    }

    $stmt = $pdo->prepare('UPDATE ibaotu_captcha SET text=? WHERE hash=? AND (text IS NULL OR text="")');
    if (!$stmt->execute([
        $text,
        $hash,
    ])) {
      exit('内部出错');
    }

    $stmt  = $pdo->query('SELECT COUNT(*) FROM ibaotu_captcha WHERE text IS NULL OR text=""');
    $count = (int)$stmt->fetchColumn();
    $tail  = '<hr> <p style="color:#ff065e">加油，还剩 <b>' . $count . '</b> 个字</p>';
  }

  $stmt = $pdo->query('SELECT * FROM ibaotu_captcha WHERE text IS NULL OR text=""');
  $rows = $stmt ? $stmt->fetchAll(PDO::FETCH_ASSOC) : [];
  if (count($rows) === 0) {
    echo "没有了";
    exit(0);
  }
  shuffle($rows);
  $row = array_pop($rows);

  $html = <<<HTML
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                         <meta http-equiv="X-UA-Compatible" content="ie=edge">
             <title>这是什么字？</title>
</head>
<body>
  这是什么字[id={$row['id']}]？
  <img style="cursor: pointer;" onclick="changeImage(this)" id="img" src="data:image/png;base64,{$row['data']}" alt="" title="看不清？点击更换">
  <form action="" method="post">
    <input type="text" name="text">
    <input type="hidden" value="{$row['hash']}" name="hash">
    <button type="submit">提交</button>
  </form>
  {$tail}
  <script>
    function changeImage(img) {
      img.src = '?render={$row['hash']}&r=' + Math.random();
    }
  </script>
</body>
</html>
HTML;

  echo trim($html);
}

