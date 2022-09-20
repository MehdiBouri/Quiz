
start();


// Fonction de RÉCUPÉRATION DU FICHIER JSON contenant le quiz
// également en “async” car elle utilise fetch() et “await”
async function getJson()
{
   // Récupère les données avec la fonction fetch()
   // Ici le fichier s'appelle quiz.json et il est situé à la racine "/" du dossier projet
   const data = await fetch("/quiz.json");
   return data.json(); // Retourne les données au format Json
}



// FONCTION PRINCIPALE DE L'APPLICATION
// Il faut la définir en “async” (asynchrone)
// car elle utilise fetch() (et “await” pour attendre une réponse)
async function start()
{
   document.querySelector('form').addEventListener('submit', submit);

   // Récupère le tableau json
   allQuestions = await getJson();
   // Mélange le tableau json
   shuffleArray(allQuestions);
   // Sélectionne les 5 premières questions
   allQuestions = allQuestions.slice(0, 5);
   
   
   // Affiche les 5 questions avec leurs propositions
   showQuestions();

   // Affiche le bouton valider et le score
   showSubmit();

   // Meilleure Score
   showScore();
}



function showSubmit()
{
   document.querySelector('form').innerHTML += `
      <div id="result">
         <div id="score">
            <h3>TOP 5 des scores</h3>
         </div>
         <hr/>
         <input type="text" id="playerName" class="mb-3" placeholder="Votre Nom"/>
         <button type="submit" class="btn btn-lg btn-success">VALIDER</button>
      </div>`;
}




// * AFFICHAGE DES QUESTIONS *
function showQuestions()
{
   var form = document.querySelector('form');

   // Affiche les 5 questions avec leurs propositions
   for(i = 1; i < allQuestions.length + 1; i++)
   {
      question = allQuestions[i - 1];

      // Question
      var formText = `
      <div id="question${i}" class="question">
         <p class="questionText">${question.question}</p>`;

      // Propositions
      for (let a = 0; a <= 3; a++) {
         formText +=
            `<div class="answer">
               <input type="radio" name="question${i}" id="answer${i}-${(a + 1)}" value="${a}">
               <label for="answer${i}-${(a + 1)}">${question.propositions[a]}</label>
            </div>`;
      }

      formText += `
         <p class="anecdote"></p>
      </div>`;

      // Affichage
      form.innerHTML += formText;
   }
}



// * VALIDATION DES RÉPONSES *
function submit(event)
{
   event.preventDefault();

   var name = document.querySelector('#playerName').value;

   if (name) {
      var score = 0;

      // Vérifie les réponses à toutes les questions
      for(let i = 0; i < allQuestions.length; i++)
      {
         var answerNumber = radioValue('question' + (i + 1));

         var answer = allQuestions[i].propositions[answerNumber];
         var goodAnswer = allQuestions[i].reponse;
         
         var label = document.querySelectorAll('#question' + (i + 1) + ' label');

         // Réinitialise la couleur des réponses
         for(let l = 0; l < label.length; l++) {
            label[l].parentNode.classList.remove('good');
            label[l].parentNode.classList.remove('bad');
         }

         // Compte le score et applique les couleurs
         if (answerNumber) {
            if (answer == goodAnswer) {
               score++;
               label[answerNumber].parentNode.classList.add('good');
            }
            else {
               label[answerNumber].parentNode.classList.add('bad');
            }
         }

         // Affiche une anecdote
         var anecdote = document.querySelector('#question' + (i + 1) + ' .anecdote');

         anecdote.innerHTML = '<hr/>' + allQuestions[i].anecdote;
      }

      // Affiche le score
      document.getElementById('score').innerHTML = '<h2>VOTRE SCORE : ' + score + ' /5</h2>';

      saveScore(name, score);

      showScore();
   }
   else {
      document.getElementById('score').innerHTML += '<p class="alert-warning">Veuillez entrer un nom.</p>';
   }
}




function saveScore(name, score)
{
   var newScore = {'name': name, 'score': score}
   var oldScores = localStorage.getItem('score')
   
   // Récupère les anciens scores
   try {
      oldScores = JSON.parse(oldScores);

      // Nettoie le tableau des anciens scores s'ils ont un format incorrect
      for(let i = 0; i < oldScores.length; i++) {
         if (typeof oldScores[i]['name'] === 'undefined') {
            oldScores.splice(i, 1);
         }
      }
   } catch (e) {
      oldScores = null
   }


   // Ajoute le score du joueur
   if (oldScores && oldScores.length) {
      AllScores = oldScores
      AllScores.push(newScore)

      // Trie les scores par ordre décroissant
      AllScores.sort(function(a, b) { 
         return b.score - a.score;
      });
      AllScores = AllScores.slice(0,5); // Conserve les 5 meilleurs
   }
   // Si c'est le premier score
   else {
      AllScores = [newScore]
   }

   
   
   // Enregistre tous les scores
   localStorage.setItem('score', JSON.stringify(AllScores))
}



function showScore() {
   var scores = JSON.parse(localStorage.getItem('score'))

   var scoreEl = document.querySelector('#score');

   for(let i = 0; i < scores.length; i++) {
      scoreEl.innerHTML += '<b>' + (i+1) + '.</b> ' + scores[i]['name'] + '<br/>'
   }
}



// RÉCUPÉRER LA VALEUR D'UN CHAMPS RADIOS
function radioValue(name) {
   var radio = document.querySelector('input[name= ' + name + ']:checked');

   if (radio) {
      return radio.value;
   }
   return null;
}

// Fonction de MÉLANGE ALÉATOIRE d’un tableau
function shuffleArray(array) {
   return array.sort(() => 0.5 - Math.random());
}
