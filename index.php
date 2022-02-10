<?php
   
    include('initDB.php');
    include('log_reg.php');
    session_start();
    
     //echo("<h1>Hello Seb!</h1>");
    if (isset($_POST["login"])){
         //echo($_POST["pseudo"]);
         $error;
         loginFunction($db);
    }elseif (isset($_POST["register"])){
         //echo("khra");
         registrationFunction($db);
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
    <title>Quizz</title>
</head>
<body>
    <div class="container">
        <div class="pageLogin" id="pageLogReg">
               
            <form class="login" id="pageLogin" method="post" action="">
                <?php 
                if (isset($error)){
                    foreach($error as $errors)
                        echo("<span class='errorMsg'>" .$errors." </span>");
                    
                }
                ?>
                <div class="mb-3">
                    <label for="pseudoLogin" class="form-label">Pseudo "admin"</label>
                    <input type="pseudo" name="pseudo" class="form-control" id="pseudoLogin">
                </div>
                
                <div class="mb-3">
                    <label for="mdpLogin" class="form-label" id="pseudoLogin">Password "admin"</label>
                    <input type="Password" name="mdp" class="form-control" id="mdpLogin">
                </div>
                <div>
                <input class="btn btn-primary button" type="submit" name="login" value="Connexion" data-info="btnConnectSubmit">
                <input class="btn btn-primary button" type="button" value="Inscription"data-info="btnRegister">
                </div>
            </form>
            <form class="register hidden" id="pageRegister" method="post" action="" >
              <div class="regForm">  
                    <div>
                        <div class="mb-3">
                            <label for="nomRegister" class="form-label">Nom</label>
                            <input type="nom" name="nom" class="form-control" id="nomRegister"required>
                        </div>
                        <div class="mb-3">
                            <label for="prenomRegister" class="form-label">Prenom</label>
                            <input type="prenom" name="prenom" class="form-control" id="prenomRegister"required>
                        </div>
                        <div class="mb-3">
                            <label for="ageRegister" class="form-label">Age</label>
                            <input type="number" name="age" class="form-control" id="ageRegister"required>
                        </div>
                    </div>
                    <div>
                        <div class="mb-3">
                            <label for="pseudoRegister" class="form-label">Pseudo</label>
                            <input type="pseudo" name="pseudo" class="form-control" id="pseudoRegister"required>
                        </div>
                        <div class="mb-3">
                            <label for="mailRegister" class="form-label">Mail</label>
                            <input type="email" name="email" class="form-control" id="mailRegister" placeholder="name@example.com"required>
                        </div>
                        <div class="mb-3">
                            <label for="mdpRegister" class="form-label ">Password</label>
                            <input type="Password" name="mdp" class="form-control" id="mdpRegister"required>
                        </div>
                    </div>
                </div>
                <div class="btnReg">
                    <input class="btn btn-primary button" type="submit" name="register" value="Inscription"data-info="btnRegisterSubmit">
                    <input class="btn btn-primary button" type="button" value="Connexion" data-info="btnConnectR">
                </div>
                
            </form>
            
        </div>
    </div>
    <script src="./jscript.js"></script>
</body>
</html>



