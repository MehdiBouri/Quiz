
start();


// Fonction de RÉCUPÉRATION DU FICHIER JSON contenant le quiz
// également en “async” car elle utilise fetch() et “await”
async function getJson()
{
   // Récupère les données avec la fonction fetch()
   // Ici le fichier s'appelle quiz.json et il est situé à la racine "/" du dossier projet
   const data = await fetch("http://localhost:5500/quiz.json");
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
   showResult();
}



function showResult()
{
   document.querySelector('form').innerHTML += `
   <div id="result">
      <div id="score"></div>
      <button type="submit" class="btn">Valider</button>
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

      form.innerHTML += `
      <div id="question${i}" class="question">
         <div class="questionText">${question.question}</div>
         <div class="answer">
               <input type="radio" name="question${i}" id="answer${i}-1" value="0">
               <label for="answer${i}-1">${question.propositions[0]}</label>
         </div>
         <div class="answer">
               <input type="radio" name="question${i}" id="answer${i}-2" value="1">
               <label for="answer${i}-2">${question.propositions[1]}</label>
         </div>
         <div class="answer">
               <input type="radio" name="question${i}" id="answer${i}-3" value="2">
               <label for="answer${i}-3">${question.propositions[2]}</label>
         </div>
         <div class="answer">
               <input type="radio" name="question${i}" id="answer${i}-4" value="3">
               <label for="answer${i}-4">${question.propositions[3]}</label>
         </div>
      </div>
      `;
   }
}


// * VALIDATION DES RÉPONSES *
function submit(event)
{
   event.preventDefault();

   var score = 0;

   // Vérifie les réponses à toutes les questions
   for(let i = 0; i < allQuestions.length; i++)
   {
      var answerNumber = radioValue('question' + (i +1));

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
   }

   // Affiche le score
   document.getElementById('score').innerHTML = '<h2>VOTRE SCORE : ' + score + ' /5</h2>';
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
