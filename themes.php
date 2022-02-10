<?php
session_start();
// include("initDB.php");
if (!isset($_SESSION["pseudo"])){
    return false;
}
try {
    $db = new PDO('mysql:host=localhost;dbname=QUIZZ;charset=utf8', 'root', 'root');
} catch (Exception $e) {
    die('Erreur : ' . $e->getMessage());
}
if (isset($_GET["themeChoice"])){
    
    echo(json_encode(loadQuestion($_GET["themeChoice"],$db)));
}

function loadQuestion($theme,$db1){
    
    //$sqlQuery = "SELECT * FROM THEMES WHERE themes_txt = :valeurThemes";
    $sqlQuery = "SELECT  themes_txt AS themes,qst_txt AS q FROM QUESTIONS INNER JOIN THEMES ON THEMES.id_themes = QUESTIONS.id_themes WHERE themes_txt = :valeurThemes";
    $sqlSelect = $db1->prepare($sqlQuery);
    $sqlSelect->execute([
        "valeurThemes"=>$theme
    ]);
    $sqlResult1 = $sqlSelect->fetchAll(PDO::FETCH_ASSOC);
    $sqlQuery = "SELECT answer_number,answer_txt FROM REPONSES WHERE id_qst IN (SELECT id_qst FROM QUESTIONS WHERE id_themes = (SELECT id_themes FROM THEMES WHERE themes_txt =:valeurThemes))";
    $sqlSelect = $db1->prepare($sqlQuery);
    $sqlSelect->execute([
        "valeurThemes"=>$theme
    ]);
    $sqlResult2 = $sqlSelect->fetchAll(PDO::FETCH_ASSOC);
    $x=0;
     for ($i=0; $i< count($sqlResult1);$i++){
        while ($x < count($sqlResult2)){
            $sqlResult1[$i][$sqlResult2[$x]["answer_number"]]=$sqlResult2[$x]["answer_txt"];
            $x++;
            $sqlResult1[$i][$sqlResult2[$x]["answer_number"]]=$sqlResult2[$x]["answer_txt"];
            $x++;
            $sqlResult1[$i][$sqlResult2[$x]["answer_number"]]=$sqlResult2[$x]["answer_txt"];
            $x++;
            $sqlResult1[$i][$sqlResult2[$x]["answer_number"]]=$sqlResult2[$x]["answer_txt"];
            $x++;
            $i++;
        }
    }
    return $sqlResult1;
}

?>