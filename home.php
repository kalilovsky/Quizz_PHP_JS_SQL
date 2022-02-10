<?php 
session_start();

if (!isset($_SESSION["pseudo"])){
    header("location:index.php");
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <title>Quizz Home</title>
</head>
<body>
    <?php 
       echo( "<span> ".$_SESSION["nom"]."</span>");
    ?>
    <div class="dashboard" id="dashboard">   
         <div class="topBar" id="topBar">
            <p class="accountP button" data-info="accountP">Mon Compte
                <div class="myAccount hidden" id="myAccount">
                    <p class="myAccountInfo"></p>
                    <p class="myAccountInfo"></p>
                    <p class="myAccountInfo"></p>
                    <p class="myAccountInfo"></p>
                    <p class="myAccountInfo"></p>
                    <p class="myAccountInfo"></p>
                    <p class="myAccountInfo"></p>
                </div>
            </p>
            <a class="button" href="disconnect.php"  data-info="disconnect">Se Déconnecter</a>
            
        </div>
        <div class="resultPage hidden" id="resultPage">

        </div>
        <div class="themeChoose" id="allBoxes">
            <p>Choisissez le thème de votre quizz</p>
           <div class="allBoxes" >
            <div class="themeBox button" data-value="Technologie" data-info="themeBoxTech">
                <div class="themeBoxImg">
                    <i class="fas fa-microchip"></i>
                </div>
                <p>Technologie</p>
            </div>
            <div class="themeBox button" data-value="Cinema" data-info="themeBoxCinema">
                <div class="themeBoxImg">
                    <i class="fas fa-film"></i>
                </div>
                <p>Cinéma</p>
            </div>
            <div class="themeBox button" data-value="Gaming"data-info="themeBoxGaming">
                <div class="themeBoxImg">
                    <i class="fas fa-gamepad"></i>
                </div>
                <p>Gaming</p>
            </div>
            <div class="themeBox button" data-value="Animes" data-info="themeBoxAnimes">
                <div class="themeBoxImg" >
                    <i class="fab fa-mandalorian"></i>
                </div>
                <p>Animés</p>
            </div>
         </div>
        </div>
        <div class="quizz hidden" id="quizz">
            <p class="textAnswer" id="question">How many times did u  today?</p>
            <div class="quizzForm">
                
                <div>
                    <input type="radio" class="radioAnswer" id="r1" name="idk" value="1">
                    <label class="textAnswer" for="r1"></label>
                </div>
                <div>
                    <input type="radio" id="r2" class="radioAnswer" name="idk" value="2">
                    <label class="textAnswer" for="r2"></label>
                </div>
                <div>
                    <input type="radio" id="r3" class="radioAnswer" name="idk" value="3">
                    <label class="textAnswer" for="r3"></label>
                </div>
                <div>
                    <input type="radio" id="r4" class="radioAnswer" name="idk" value="4">
                    <label class="textAnswer" for="r4"></label>
                </div>
                
            </div>
            <input class="btn btn-primary button" type="button" value="Suivant"data-info="btnSubmitAnswer">
            <p id="pCurrentQ1">DEFE</p>
        </div>
        <div class="pageResultat hidden" id="pageResultat">
            
        </div>
    </div>
    <script src="./var.js"></script>
    <script src="./jscript.js"></script>
    <script src="https://kit.fontawesome.com/fca1edefcc.js" crossorigin="anonymous"></script>

</body>
</html>