
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
   var allQuestions = await getJson(); // Récupère le tableau json
   
   // Mélange le tableau json
   shuffleArray(allQuestions);

   // Sélectionne les 5 premières questions
   allQuestions = allQuestions.slice(0, 5);
   
   
   // Affiche les 5 questions avec leurs propositions
   allQuestions.forEach((question, i) => {
      showQuestion(i + 1, question);
   })



   var form = document.querySelector('form');

   form.innerHTML += `
   <div id="result">
      <button type="submit" class="btn">Valider</button>
   </div>`
}





function showQuestion(i, question)
{
   var form = document.querySelector('form');

   form.innerHTML += `
   <div id="question${i}" class="question">
      <div class="questionText">${question.question}</div>
      <div class="answer">
            <input type="radio" id="answer${i}-1" name="question${i}">
            <label for="answer${i}-1">${question.propositions[0]}</label>
      </div>
      <div class="answer">
            <input type="radio" id="answer${i}-2" name="question${i}">
            <label for="answer${i}-2">${question.propositions[1]}</label>
      </div>
      <div class="answer">
            <input type="radio" id="answer${i}-3" name="question${i}">
            <label for="answer${i}-3">${question.propositions[2]}</label>
      </div>
      <div class="answer">
            <input type="radio" id="answer${i}-4" name="question${i}">
            <label for="answer${i}-4">${question.propositions[3]}</label>
      </div>
   </div>
   `;
}



// Fonction de MÉLANGE ALÉATOIRE d’un tableau
function shuffleArray(array) {
   return array.sort(() => 0.5 - Math.random());
}
