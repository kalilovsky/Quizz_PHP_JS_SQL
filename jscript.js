document.addEventListener('DOMContentLoaded', ()=>{
    let optionBtn = document.getElementsByTagName("input")
    let txtOptBtn = document.getElementsByClassName("textAnswer")
    let loginForm = document.getElementById("pageLogin")
    let pageLogReg = document.getElementById("pageLogReg")
    let pageAjoutQ = document.getElementById("pageAjoutQ")
    let registerForm = document.getElementById("pageRegister")
    let pageRes = document.getElementById("pageResultat");
    let themeSave =[{themes: "" , q1:"",q2:"",q3:"",q4:"",q5:"",repQ:"" }]
    let themeSaveParLot =[{themes: "" , q1:"",q2:"",q3:"",q4:"",q5:"",repQ:"" }]
    let dateGameSessionStart;
    let user = [{nom:"",prenom:"",age:"",pseudo:"",email:"",mdp:""}]
    let userTmp = [{nom:"medjahed",prenom:"khalil",age:"37",pseudo:"admin",email:"admin@quizz.com",mdp:"admin"}]
    let pageDash =document.getElementById("dashboard")
    let radioAnswer = document.getElementsByClassName("radioAnswer")
    let pCurrentQ = document.getElementById("pCurrentQ1")
    let currentQ, sessionScore,dbName;
    const qPerGame = 3;
    let themeSaveTemp;
    let connected = false
    let themeFocus = 0;
    let qRandomNbr = Math.floor(Math.random()*(qPerGame+1));
    let oldQRandomNbr;
    //lancement de l'initialisation
    if (!window.indexedDB) {
        window.alert("Votre navigateur ne supporte pas une version stable d'IndexedDB. Quelques fonctionnalités ne seront pas disponibles.")
    };
   // init();
    function init(){
        //préparer la liste de toutes les question et les mettere dans le tableau
        addAllQtoDB();
        dbName = "MyTestDatabase134";
        
        //verification de l'existance ou non de la base de données
        //si elle n'existe pas on la crée et on crée les table 'objectstore"
        //de nos données qui sont les questions, les users avec un user par défaut "Admin"
        //et ses statistiques
        checkBDD(dbName);
        defaultQuestionsInject("rien",true);
        adminScoreCreate("rien",true,scoreStatTmp[0]);

    }
    //Cette fonction est trés importante car elle permet de créer la base de données 
    //les tables et les enregistrement par défaut, cela va permettre de faire fonctionner
    //le quizz dans n'importe qu'elle navigateur et PC
    function checkBDD (nomBDD){
        let request = window.indexedDB.open(nomBDD);
        request.onsuccess = function(event){
            console.log("Base de donnés et 3 table avec leur données prêtes à l'emploi.")
        };
        request.onerror = function(event){
            alert(event.target.error);
        };
        //dans le cas ou il ne trouve pas la base de données il va détécter que c'est un upgrade
        //dans ce cas il va créer les table user themes et score par défaut
        request.onupgradeneeded = function(event){
           //alert("upgrade");
            let db = event.target.result;
            defaultQuestionsInject(db,false);
            adminUserCreate(db);
            //création uniquement de la table userscore car j'avais des erreurs que je n'ai pas
            // pu résoudre
            adminScoreCreate(db,false,scoreStatTmp[0]);
           
        };
    }
    function adminScoreCreate(dataBase,scoreInject,tableScore){
        if (scoreInject==false){
         //Création de la table user stat avec le pseudo comme key
         let objectStoreUserStat = dataBase.createObjectStore("userstat", {keyPath: 'date'});
         objectStoreUserStat.createIndex("pseudo", "pseudo", { unique: false });
        } else if (scoreInject==true){
            //Ouverture de la base de données
            let request = window.indexedDB.open(dbName);
            request.onsuccess = function(event){
                let db = event.target.result;
                let transaction = db.transaction("userstat","readwrite");
                let objectStore = transaction.objectStore("userstat");
                let request = objectStore.add(tableScore);
                console.log("Stat du User par défaut injécté dans la base de donnée")
            
            };
        }
    }
    function defaultQuestionsInject(dataBase,inject){
        if (inject==false){
            //création de l'objectstore qui corréspond à la table des questions
            let objectStore = dataBase.createObjectStore("themeSave", {keyPath: 'q1'});
            objectStore.createIndex("themes", "themes", { unique: false });
        } else if(inject==true){
            //Ouverture de la base de données
            let request = window.indexedDB.open(dbName);
            request.onsuccess = function(event){
                let db = event.target.result;
                let transaction = db.transaction("themeSave","readwrite");
                // Stocker les valeurs dans le nouvel objet de stockage.
                // et création de la transaction
                let objectStore = transaction.objectStore("themeSave");
                let request
                //rajout des questions par themes
                for (i in themeSaveParLot){
                    request = objectStore.add(themeSaveParLot[i]);
                }
                console.log("Question injécté dans la base de donnée")
            
            };
           
        }
    }
    function adminUserCreate(dataBase){
        //Création de la table users avec le pseudo en tant que Key
        let objectStoreUser = dataBase.createObjectStore("users", {keyPath: 'pseudo'});
        //Création d'un Index Email unique pour chaque enregistrement
        //objectStoreUser.createIndex("email", "email", { unique: true });
        //Quand il fini de créer l'objectstore il effectue les opérations suivantes
        objectStoreUser.transaction.oncomplete = function(event) {
            // Stocker les valeurs dans le nouvel objet de stockage.
            // et création de la transaction
            let customerObjectStoreUser = dataBase.transaction("users", "readwrite").objectStore("users");
            customerObjectStoreUser.add(userTmp[0]);
            console.log("User par défaut injécté dans la base de donnée")
            //création de la table du score pour sauvegarder le score des users
            
        };
    }
    function loadQuestions (dBase){
        let request = window.indexedDB.open(dBase);
        let themesSelected   = document.getElementById('themeSelect').value
            
        request.onerror = function(event) {
            // Gestion des erreurs.
          };
        request.onsuccess = function(event){
            
            let db = event.target.result;
            let transaction = db.transaction("themeSave");
            let objectStore = transaction.objectStore("themeSave");
            let test1 = objectStore.index("themes");
            let test = test1.getAll(themesSelected);
            test.onsuccess = function(){
                if (test.result){
                    let themeSaveTemp = test.result
                    if (themeSaveTemp.length > themeFocus){
                    document.getElementById('themeSelect').value = themeSaveTemp[themeFocus].themes
                    document.getElementById('questionAjout').value = themeSaveTemp[themeFocus].q1
                    document.getElementById('repAjout1').value = themeSaveTemp[themeFocus].q2
                    document.getElementById('repAjout2').value = themeSaveTemp[themeFocus].q3
                    document.getElementById('repAjout3').value = themeSaveTemp[themeFocus].q4
                    document.getElementById('repAjout4').value = themeSaveTemp[themeFocus].q5
                    document.getElementById('repAjout5').value = themeSaveTemp[themeFocus].repQ               
                } else if (themeSaveTemp.length == 0){
                    alert ("pas de données à afficher")
                } else if (themeSaveTemp.length < themeFocus ){
                    themeFocus = 0
                    document.getElementById('themeSelect').value = themeSaveTemp[themeFocus].themes
                    document.getElementById('questionAjout').value = themeSaveTemp[themeFocus].q1
                    document.getElementById('repAjout1').value = themeSaveTemp[themeFocus].q2
                    document.getElementById('repAjout2').value = themeSaveTemp[themeFocus].q3
                    document.getElementById('repAjout3').value = themeSaveTemp[themeFocus].q4
                    document.getElementById('repAjout4').value = themeSaveTemp[themeFocus].q5
                    document.getElementById('repAjout5').value = themeSaveTemp[themeFocus].repQ
                }
                    
                } else {
                    alert("Cet utilisateur n'existe pas, Veuillez réessayer.")
                }
            }
            test.onerror = function() {
                
                alert("MDP ou Pseudo réssayer!!")
            }
           
            };
    }
    //cette fonction vérifie si les radio sont chéqué ou pas, si une est checked
    //
    function checkAnswerAndSave(){
        for (i=0;i< radioAnswer.length;i++){
            if (radioAnswer[i].checked == true){
                
                break;
            }
        }
        //si pas de réponse donnés sortir de la fonction et retourner un false
        if (i>=radioAnswer.length){
            return false;
        } else {
            //enregistrer le score dans le tableau du score
            scoreStat.pseudo = user[0].pseudo;
            scoreStat.themes = themeSaveTemp[oldQRandomNbr].themes;
            scoreStat.date = dateGameSessionStart;
            scoreStat['q'+(currentQ+1)] = themeSaveTemp[oldQRandomNbr].q1;
            scoreStat["r"+(currentQ+1)] = txtOptBtn[i+1].innerHTML;
            scoreStat["repQ"+(currentQ+1)] = themeSaveTemp[oldQRandomNbr]['q'+(~~themeSaveTemp[oldQRandomNbr].repQ+1)];
            // console.log(scoreStat["r"+(i+1)])
            // console.log(themeSaveTemp[oldQRandomNbr]['q'+(~~themeSaveTemp[oldQRandomNbr].repQ+1)])
            //Vérifier les bonnes questions et stocker le score équivalents
             if (scoreStat["r"+(currentQ+1)]===themeSaveTemp[oldQRandomNbr]['q'+(~~themeSaveTemp[oldQRandomNbr].repQ+1)]) {
                    scoreStat["score"+(currentQ+1)]= 1;
                    sessionScore++;
            } else {
                scoreStat["score"+(currentQ+1)]= 0;
            }

            //dechecker les radio buttons
            for (i=0;i< radioAnswer.length;i++){
                radioAnswer[i].checked = false;
            }
            //enlenver la question qui a été deja posé du tableau charger de la base de données
            themeSaveTemp.splice(oldQRandomNbr,1);
            
        }
        // alert(i);
        // console.log(themeSaveTemp);
    }
    //Fonction qui permet de charger les questions selon le themes choisi
    //et d'enlever les question déja posées, et de verfier les bonnes réponses
    //et de sauvegarder les réponses donné la date le score .... dans le tableau de
    // l'utilisateur        
    function loadQuestionForQuizz(thmTxt,addQtoDB){
        let request = window.indexedDB.open(addQtoDB);
        currentQ =0;
        sessionScore = 0;
        dateGameSessionStart = new Date();
            
        request.onerror = function(event) {
            // Gestion des erreurs.
          };
        request.onsuccess = function(event){
            
            let db = event.target.result;
            let transaction = db.transaction("themeSave");
            let objectStore = transaction.objectStore("themeSave");
            let test1 = objectStore.index("themes");
            let test = test1.getAll(thmTxt);
            test.onsuccess = function(){
                if (test.result){
                    themeSaveTemp = test.result;
                    hideAllBoxesShowQuizz();
                    showQuestions(themeSaveTemp) ;                   
                } else {
                    alert("Cet utilisateur n'existe pas, Veuillez réessayer.")
                }
            }
            test.onerror = function() {
                
                alert("MDP ou Pseudo réssayer!!")
            }
           
            };
            
    }
    function loadOldScoreFromBD(addQtoDB,userPseudo){
        let request = window.indexedDB.open(addQtoDB);
        request.onerror = function(event) {
            // Gestion des erreurs.
          };
        request.onsuccess = function(event){
            let db = event.target.result;
            let transaction = db.transaction("userstat");
            let objectStore = transaction.objectStore("userstat");
            let test1 = objectStore.index("pseudo");
            let test = test1.getAll(userPseudo);
            test.onsuccess = function(){
                if (test.result){
                scoreStatTmp = test.result;                                   
                } else {
                    
                }
            }
            test.onerror = function() {
                
                
            }
        }
    }
    function hideAllBoxesShowQuizz(){
       document.getElementById("allBoxes").classList.toggle("hidden");
       document.getElementById("quizz").classList.toggle("hidden");
       
    }
    function showQuestions(tableTheme){
       
        
        oldQRandomNbr= qRandomNbr;
        pCurrentQ.innerHTML = (currentQ+1) +"/"+(qPerGame+1)
        txtOptBtn[0].innerHTML = tableTheme[qRandomNbr].q1;
        txtOptBtn[1].innerHTML = tableTheme[qRandomNbr].q2;
        txtOptBtn[2].innerHTML = tableTheme[qRandomNbr].q3;
        txtOptBtn[3].innerHTML = tableTheme[qRandomNbr].q4;
        txtOptBtn[4].innerHTML = tableTheme[qRandomNbr].q5;
            
        qRandomNbr = Math.floor(Math.random()*(tableTheme.length-1));   
       
    }    
    function addAllQtoDB(){
        let themesTxtTmp= themesTxt.split("-/");
        let q1TxtTmp= q1Txt.split("-/");
        let q2TxtTmp= q2Txt.split("-/");
        let q3TxtTmp= q3Txt.split("-/");
        let q4TxtTmp= q4Txt.split("-/");
        let q5TxtTmp= q5Txt.split("-/");
        let repQTmp= repTxt.split("-/");
        
        for(i=0; i<themesTxtTmp.length;i++){
            if (i!=0){
            themeSaveParLot.push({themes: "" , q1:"",q2:"",q3:"",q4:"",q5:"",repQ:"" })
            }
            themeSaveParLot[i]["themes"] = themesTxtTmp[i];
            themeSaveParLot[i]["q1"] =q1TxtTmp[i];
            themeSaveParLot[i]["q2"] =q2TxtTmp[i];
            themeSaveParLot[i]["q3"] =q3TxtTmp[i];
            themeSaveParLot[i]['q4'] =q4TxtTmp[i];
            themeSaveParLot[i]["q5"] =q5TxtTmp[i];
            themeSaveParLot[i]["repQ"] =repQTmp[i];

        }
    }
    function addQtoDB(dbNameLogin){
        let request = window.indexedDB.open(dbNameLogin);
        request.onsuccess = function(event){
            let db = event.target.result;
            let transaction = db.transaction("themeSave3","readwrite");
            var objectStore = transaction.objectStore("themeSave3");
            var request = objectStore.add(themeSave);
            request.onsuccess = function(event) {
                alert("Question ajouté")
            };
            request.onerror = function(event) {
                alert("Utilisateur déja présent, veuillez réessayer.")
            }
        }
    }
    function accountConnection(){
        
        if (connected != false){
            pageDash.classList.toggle("getOut")
            pageLogReg.classList.toggle("getOut")
            let userInfoP = document.getElementsByClassName("myAccountInfo");
            userInfoP[0].innerHTML = "Nom: " +user[0].nom
            userInfoP[1].innerHTML = "Prénom: "+user[0].prenom
            userInfoP[2].innerHTML = "Age : "+user[0].age+"ans"
            userInfoP[3].innerHTML = "Email : "+user[0].email
            userInfoP[4].innerHTML = "Pseudo : "+user[0].pseudo
            userInfoP[5].innerHTML = "Password : "+user[0].mdp
            userInfoP[6].innerHTML = "Historiques"  
            //Lors du clique pour afficher l'historique verrifier que l'on est pas entrain de jouer
            //et vérifier quel fenetre est active
            userInfoP[6].onclick = function(){
                
                if (!document.getElementById("quizz").classList.contains("hidden")){
                    alert("Veuillez finir votre activités avant de voir les ancien résultats.");
                } else if (!document.getElementById("pageResultat").classList.contains("hidden")) {
                    
                    pageResultatShow("scoreAllHide");
                }else if (!document.getElementById("allBoxes").classList.contains("hidden")){
                    document.getElementById("allBoxes").classList.toggle("hidden");
                    pageResultatShow("scoreAll");
                }
            }
            loadOldScoreFromBD(dbName,user[0].pseudo);  
                              
        }else {

        }
    }
    function login (dbNameLogin){
        let pseudoLoginValue = document.getElementById("pseudoLogin").value
        let mdpLoginValue = document.getElementById("mdpLogin").value
        let request = window.indexedDB.open(dbNameLogin);
       // connected=true
       // accountConnection()
            
        request.onerror = function(event) {
            // Gestion des erreurs.
          };
        request.onsuccess = function(event){
            
            let db = event.target.result;
            let transaction = db.transaction("users");
            let objectStore = transaction.objectStore("users");
            let test = objectStore.get(pseudoLoginValue);
            test.onsuccess = function(){
                if (test.result){
                    if (test.result.mdp=== mdpLoginValue){
                       
                        user[0].nom = test.result.nom;
                        user[0].prenom = test.result.prenom;
                        user[0].age = test.result.age;
                        user[0].email = test.result.email;
                        user[0].pseudo = test.result.pseudo;
                        user[0].mdp = test.result.mdp;
                        connected =true;
                        accountConnection()
                    } else {
                        alert("Mot de passe erroné veuillez réessayer.")
                    }
                } else {
                    alert("Cet utilisateur n'existe pas, Veuillez réessayer.")
                }
            }
            test.onerror = function() {
                
                alert("MDP ou Pseudo réssayer!!")
            }
           
        };
        
    }
    function ajouterUser(dbNameLogin){
        let request = window.indexedDB.open(dbNameLogin);
        request.onsuccess = function(event){
            let db = event.target.result;
            let transaction = db.transaction("users","readwrite");
            let objectStore = transaction.objectStore("users");
            let request = objectStore.add(user);
            request.onsuccess = function(event) {
                console.log("utilisateur ajouté")
                connected =true;
                accountConnection();
            }
            request.onerror = function(event) {
                alert("Utilisateur déja présent, veuillez réessayer.")
            }
        };
    }
    //afficher les résultats du jeux en cours ou des sessions précédentes.
    function pageResultatShow(typeOfShow){
        //Dans le cas d'un appel pour afficher le score de la session en cours 
        if (typeOfShow === "scoreSession"){
            pageRes.classList.toggle("hidden");
            let p = new Object();
            //Créer des élément P et les afficher dans la page pour afficher le résultat détaillé 
            //de la session du jeu qui vient de se finir
            p[0] = document.createElement("p");
            p[1] = document.createElement("p");
            p[0].innerHTML = "Votre score est de "+ sessionScore +"/"+ (qPerGame+1);
            p[1].innerHTML= "Voici le résultat dez vos question en détails "
            p[1].innerHTML+= "<br>Q1:"+scoreStat.q1 +"<br>"+ "Votre Réponses :"+scoreStat.r1+"<br>"+"La bonne Réponses :"+scoreStat.repQ1+"<br><br>"
            p[1].innerHTML+= "Q2:"+scoreStat.q2 +"<br>"+ "Votre Réponses :"+scoreStat.r2+"<br>"+"La bonne Réponses :"+scoreStat.repQ2+"<br><br>"
            p[1].innerHTML+= "Q3:"+scoreStat.q3 +"<br>"+ "Votre Réponses :"+scoreStat.r3+"<br>"+"La bonne Réponses :"+scoreStat.repQ3+"<br><br>"
            p[1].innerHTML+= "Q4:"+scoreStat.q4 +"<br>"+ "Votre Réponses :"+scoreStat.r4+"<br>"+"La bonne Réponses :"+scoreStat.repQ4+"<br><br>"
            pageRes.appendChild(p[0]);
            pageRes.appendChild(p[1]);
            //création du bouton retour à l'accueil
            let homeBtn = document.createElement("input");
            homeBtn.classList.value ="btn btn-primary";
            homeBtn.type="button";
            homeBtn.value="Retour à l'accueil";
            homeBtn.id="btnResultatHome"
            homeBtn.onclick = function(){
                //Lors du clique sur le bouton retour à l'accueil
                //afficher les bonnes div et remove les child de la div page resultat
                //et supprimer le tableau des questions restantes dans le tableau des questions
                //chargées
                document.getElementById("allBoxes").classList.toggle("hidden");
                pageRes.classList.toggle("hidden")
                
                for (i in themeSaveParLot){
                    themeSaveParLot.splice(i,1);
                }
                pageRes.removeChild(homeBtn);
                pageRes.removeChild(p[0]);
                pageRes.removeChild(p[1]);
            }
            pageRes.appendChild(homeBtn);
                  
        }else if(typeOfShow === "scoreAll"){
            pageRes.classList.toggle("hidden");
            scoreStatTmp.length;
            for (i =0; i< scoreStatTmp.length;i++)
            {scoreStatTmp.splice(i,1);}
            loadOldScoreFromBD(dbName, user[0].pseudo);
            let p;
            p = document.createElement("p");
            p.innerHTML = ""
            for (i in scoreStatTmp){
                p.innerHTML += "Votre Score de la session du " + scoreStatTmp[i].date +"<br>";
                p.innerHTML += "Thémes Choisi : "+scoreStatTmp[i].themes +"<br>";
                p.innerHTML += "Q1:"+scoreStatTmp[i].q1 +"<br>"+ "Votre Réponses :"+scoreStatTmp[i].r1+"<br>"+"La bonne Réponses :"+scoreStatTmp[i].repQ1+"<br><br>"
                p.innerHTML += "Q2:"+scoreStatTmp[i].q2 +"<br>"+ "Votre Réponses :"+scoreStatTmp[i].r2+"<br>"+"La bonne Réponses :"+scoreStatTmp[i].repQ2+"<br><br>"
                p.innerHTML += "Q3:"+scoreStatTmp[i].q3 +"<br>"+ "Votre Réponses :"+scoreStatTmp[i].r3+"<br>"+"La bonne Réponses :"+scoreStatTmp[i].repQ3+"<br><br>"
                p.innerHTML += "Q4:"+scoreStatTmp[i].q4 +"<br>"+ "Votre Réponses :"+scoreStatTmp[i].r4+"<br>"+"La bonne Réponses :"+scoreStatTmp[i].repQ4+"<br><br>"
                p.innerHTML += "Votre score était de :" +(scoreStatTmp[i].score1 +scoreStatTmp[i].score2 +scoreStatTmp[i].score3 +scoreStatTmp[i].score4 ) +"/4 <br>"
                pageRes.appendChild(p);
            }
            
        } else if (typeOfShow ==="scoreAllHide"){
            let p = pageRes.getElementsByTagName("p");
            for (i in p){
            p[i].innerHTML = "";
            
            }
            pageRes.classList.toggle("hidden");
            document.getElementById("allBoxes").classList.toggle("hidden");
        }
    }
    // document.addEventListener("keypress", function(e){
            
    //     if (e.code == "Equal"){
    //         pageLogReg.classList.toggle("toDown");
    //         pageAjoutQ.classList.toggle("toDown");
    //     }

    // });
    //gestion des evenement de click sur les bouton
    Array.from(document.getElementsByClassName("button")).forEach(e=>{
        e.addEventListener("click", ()=>{
            console.log(e.dataset.info);
            switch (e.dataset.info){
                //bouton Connect
                case "btnConnectSubmit":
                    login(dbName);
                    break;
                case "btnRegister":
                    loginForm.classList.toggle('hidden');
                    registerForm.classList.toggle('hidden');
                    break;
                case "btnRegisterSubmit":
                    user.nom = document.getElementById('nomRegister').value;
                    user.prenom = document.getElementById('prenomRegister').value;
                    user.age = document.getElementById('ageRegister').value;
                    user.pseudo = document.getElementById('pseudoRegister').value;
                    user.email = document.getElementById('mailRegister').value;
                    user.mdp = document.getElementById('mdpRegister').value;
                    
                    ajouterUser(dbName);
                    break;
                case "btnConnectR":
                    loginForm.classList.toggle('hidden');
                    registerForm.classList.toggle('hidden');
                    break;
                case "saveQuestion":
                    themeSave.themes = document.getElementById('themeSelect').value;
                    themeSave.q1 = document.getElementById('questionAjout').value;
                    themeSave.q2 = document.getElementById('repAjout1').value;
                    themeSave.q3 = document.getElementById('repAjout2').value;
                    themeSave.q4 = document.getElementById('repAjout3').value;
                    themeSave.q5 = document.getElementById('repAjout4').value;
                    themeSave.repQ = document.getElementById('repAjout5').value;
                    addQtoDB()
                    document.getElementById('themeSelect').value = "";
                    document.getElementById('questionAjout').value = "";
                    document.getElementById('repAjout1').value = "";
                    document.getElementById('repAjout2').value = "";
                    document.getElementById('repAjout3').value = "";
                    document.getElementById('repAjout4').value = "";
                    document.getElementById('repAjout5').value = "";
                    break;
                case "loadQuestion":
                    loadQuestions(dbName);
                    break;
                case "nextQuestion":
                    themeFocus++;;
                    loadQuestions(dbName);
                    break;
                case "previousQuestion":
                    themeFocus --;
                    loadQuestions(dbName);
                    break;
                case "themeBoxTech":
                    loadQuestionForQuizz("Technologie",dbName);
                    break;
                case "themeBoxCinema":
                    loadQuestionForQuizz("Cinéma",dbName);
                    break;
                case "themeBoxGaming":
                    loadQuestionForQuizz("Gaming",dbName);
                    break;
                case "themeBoxAnimes":
                    loadQuestionForQuizz("Animés",dbName);
                    break;
                case "btnSubmitAnswer":
                    if (currentQ <= qPerGame){
                        //vérifier qu'il y'a une réponse qui déja choisi
                        if( checkAnswerAndSave()!= false){
                            if (currentQ!=qPerGame){
                                currentQ++;
                                showQuestions(themeSaveTemp);
                                } else{
                                    //termnier le jeux et afficher et sauvegarder le résultat du game dans la base de donées
                                    //alert("Jeux terminé")
                                    document.getElementById("quizz").classList.toggle("hidden");
                                    
                                    //Sauvegarder le score dans la base de données
                                    adminScoreCreate("rien",true,scoreStat);
                                    pageResultatShow("scoreSession");
                                }
                        } else {
                            alert("Veuillez Choisir Une Réponse SVP")
                        } 
                        
                    } else {
                        //termnier le jeux et afficher et sauvegarder le résultat du game dans la base de donées
                        alert("Jeux terminé")
                        document.getElementById("quizz").classList.toggle("hidden");
                    }
                    break;
                case "disconnect":
                    pageDash.classList.toggle("getOut");
                    if (!document.getElementById("resultPage").classList.contains("hidden")){
                        document.getElementById("resultPage").classList.toggle("hidden");
                    }
                    if (document.getElementById("allBoxes").classList.contains("hidden")){
                        document.getElementById("allBoxes").classList.toggle("hidden");
                    }
                    if (!document.getElementById("quizz").classList.contains("hidden")){
                        document.getElementById("quizz").classList.toggle("hidden");
                    }
                    if (!document.getElementById("pageResultat").classList.contains("hidden")){
                        document.getElementById("pageResultat").classList.toggle("hidden");
                    }
                    pageLogReg.classList.toggle("getOut");
                    connected =false;
                    break;
                case "accountP":
                    document.getElementById('myAccount').classList.toggle("hidden");
                    break;
                default:
                    break;

            }
        })
    })
    
});