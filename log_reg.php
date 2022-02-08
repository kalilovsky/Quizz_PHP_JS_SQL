<?php


//Fonction qui permet de faire le login
function loginFunction($dataBase){
    //utiliser la variable globale de la page index.php
    global $error;
    //affecter une varibale avec le contenu d'un éléments HTML qui vient par le POST
    //en prenant en compte le QUote pour sécuriser ce que l'utilisateur écrit
    $pseudo = $dataBase->quote($_POST['pseudo']);
    //Affecter et crypter le pass avec Crypt
    $pass = crypt($_POST['mdp'],md5($_POST['mdp']));
    //entamer la requete SQL
    $selectSql = "SELECT * FROM USER_INFO WHERE pseudo ={$pseudo} && mdp = '$pass'";
    //Faire le query
    $querySql = $dataBase->query($selectSql);
    //verifier qu'il y'a un résultat, si c'est le cas donc le mdp et le pseudo son bon
   if (($querySql->rowCount())>0){
       //mettre dans le tableau avec les nom dans le tableau
    $resultSql = $querySql->fetchAll(PDO::FETCH_ASSOC);
        //iniier la super variable Session avec les données utilisaterus
    $_SESSION["nom"]=$resultSql[0]['nom'];
    $_SESSION["prenom"] = $resultSql[0]["prenom"];
    $_SESSION["email"] = $resultSql[0]["email"];
    $_SESSION["age"] = $resultSql[0]["age"];
    $_SESSION["pseudo"] = $resultSql[0]["pseudo"];
    $_SESSION["mdp"]= $resultSql[0]["mdp"];
    //faire un petit coucou à notre user
    echo('Coucou '.$resultSql[0]["nom"].' <br>');
    // session_destroy();
  //  print_r($_SESSION);
   // print_r($resultSql);
    } else {
        $error[]= "Mauvais pseudo ou mots de passe.";
    }
}
//fonction qui permet d'enregistrer le user dans la database.
function registrationFunction($dataBase){
    //utiliser la variable globale de la page index.php
    global $error;
    //faire un quote de tous les post qui viennent de la form register
    //pour proteger contre les input de l'utilisateur
    $nom = $dataBase->quote($_POST['nom']);
    $prenom = $dataBase->quote($_POST['prenom']);
    $email = $dataBase->quote($_POST['email']);
    $age = $dataBase->quote($_POST['age']);
    $pseudo = $dataBase->quote($_POST['pseudo']);
    $pass = crypt($_POST['mdp'],md5($_POST['mdp']));
    // Check si le pseudo ou l'email sont unique
    $selectSql = "SELECT * FROM USER_INFO WHERE pseudo = {$pseudo} || email = {$email}";
    $querySql = $dataBase->query($selectSql);
    //si il ne détecte pas d'occurence dans les enregistrement de la table USER_INFO
    if (!($querySql->rowCount()>0)) {
    //preparer la requete SQL et l'exécuter
    $insertSql = "INSERT INTO USER_INFO(nom,prenom,age,email,pseudo,mdp) VALUES ({$nom},{$prenom},{$age},{$email},{$pseudo},'$pass')";
    $querySql = $dataBase->prepare($insertSql);
    $querySql->execute();
    // $tt = $querySql->errorInfo();
    // print_r($tt);
    } else {
        //si il y a des row lors du test c'est que l'utilisateur existe déja
        //$error[] = "Utilisateur existe déja!";
    }

}
?>