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
    function loadQuestionForQuizz(thmTxt,url){
        
        currentQ =0;
        sessionScore = 0;
        dateGameSessionStart = new Date();
        data = new FormData()
        data.append("themeChoice",thmTxt);
        
        url = "themes.php?themeChoice="+thmTxt;
        console.log(url);
        fetch(url)
        .then(answer=>answer.json())
        .then(answer=>{
            hideAllBoxesShowQuizz();
            themeSaveTemp = answer;
            console.log(themeSaveTemp);
            showQuestions(themeSaveTemp) ;
        } )

        // console.log(themeSaveTemp);
        // hideAllBoxesShowQuizz();
        // showQuestions(themeSaveTemp) ;                   
                
            
    }
    
    function hideAllBoxesShowQuizz(){
       document.getElementById("allBoxes").classList.toggle("hidden");
       document.getElementById("quizz").classList.toggle("hidden");
       
    }
    function showQuestions(tableTheme){
       
        
        oldQRandomNbr= qRandomNbr;
        pCurrentQ.innerHTML = (currentQ+1) +"/"+(qPerGame+1)
        txtOptBtn[0].innerHTML = tableTheme[qRandomNbr].q;
        txtOptBtn[1].innerHTML = tableTheme[qRandomNbr].r1;
        txtOptBtn[2].innerHTML = tableTheme[qRandomNbr].r2;
        txtOptBtn[3].innerHTML = tableTheme[qRandomNbr].r3;
        txtOptBtn[4].innerHTML = tableTheme[qRandomNbr].r4;
            
        qRandomNbr = Math.floor(Math.random()*(tableTheme.length-1));   
       
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
                    loadQuestionForQuizz("Technologie",e.baseURI);
                    
                    break;
                case "themeBoxCinema":
                    loadQuestionForQuizz("Cinéma",e.baseURI);
                    break;
                case "themeBoxGaming":
                    loadQuestionForQuizz("Gaming",e.baseURI);
                    break;
                case "themeBoxAnimes":
                    loadQuestionForQuizz("Animés",e.baseURI);
                    break;
                case "btnSubmitAnswer":
                    if (currentQ <= qPerGame){
                        //vérifier qu'il y'a une réponse qui déja choisi
                        //Ensuite vérifier la question actuelle pour savoir si le jeu est fini ou pas encore
                        if( checkAnswerAndSave()!= false){
                            if (currentQ!=qPerGame){
                                currentQ++;
                                showQuestions(themeSaveTemp);
                                } else{
                                    //termnier le jeux et afficher et sauvegarder le résultat du game dans la base de donées
                                    //alert("Jeux terminé")
                                    document.getElementById("quizz").classList.toggle("hidden");
                                    
                                    //Sauvegarder le score dans la base de données
                                    //adminScoreCreate("rien",true,scoreStat);
                                    //pageResultatShow("scoreSession");
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
                
                case "accountP":
                    document.getElementById('myAccount').classList.toggle("hidden");
                    break;
                default:
                    break;

            }
        })
    })

    document.getElementById("pageRegister").addEventListener("submit", function(e){
        //Annule tous les autres evenement 
        e.preventDefault();
        //initialiser la form dans l'element du clique
        const form = e.currentTarget;
        //avoir l'url ou la clique s'est produit
        const url = form.action;
        //création de l'objet FormData qui contiendra les data contenus dans les FORM
        const formData1 = new FormData(form);
        //et y rajouter l'information register qui sera vérifier sur le post du PHP
        formData1.append("register","Inscription");
        //création de l'objet qui sera passé en argument dans la procédure Fetch
        const options = {
            method : "post",
            body : formData1,
        }
        //Envoie de la données
        fetch(url,options)
        //il n'y pas encore de gestion d'erreur mais cela viendra ;)
            
            .then(data=>{
               console.log(data.url);
               window.location.replace(data.url);
                
            });
        
        
    })
    
});