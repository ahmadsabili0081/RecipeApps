let container__meals = document.querySelector('.container__meals')
let favorite__meal = document.querySelector('.favorite__meal')
let container__favorite__meal = document.querySelector('.container__favorite__meal');
let searchBtn  = document.querySelector('.searchBtn');
let searchMealsInput = document.querySelector('.searchInput');
let mealEl = document.querySelector('.meal');
let mealCont = document.querySelector('.meals')
let ul = document.querySelector('ul');


async function getMealsRandom(){
 let resp =  await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
 let respData = await resp.json();
 let randomMeal = respData.meals[0];
 addMeals(randomMeal)
}
getMealsRandom()

async function getMeals(id){
  let resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+ id)
  let respDataId = await resp.json();
  let getMealsApi = respDataId.meals[0];
  return getMealsApi;
}
async function searchMeals(term){
 let searchResp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term)
 let respData = await searchResp.json();
 let getSearch = respData.meals;

 return getSearch;
}

function addMeals(mealData){

  let meal = document.createElement('div');
  meal.classList.add('meal');
  meal.innerHTML = `
                  <div class="meal__header">
                   <span class = "random"> Random Recipe </span>
                    <img class="gambar" src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
                  </div>
                  <div class="meal__body">
                    <h3>${mealData.strMeal}</h3>
                    <button class="heart" type="button"><i class="fa-solid fa-heart"></i></i></button>
                  </div>`;
 let buttonClick = meal.querySelector('.heart');
buttonClick.addEventListener('click', () => {
  if(buttonClick.classList.contains('active')){
    buttonClick.classList.remove('active');
    removeMealsLocalStorage(mealData.idMeal);
  }else{
    buttonClick.classList.add('active');
    addMealsLocalStorage(mealData.idMeal);
  }
  fetchFavMeals();

});
meal.addEventListener('click', (e) =>{
  let target = e.target;
  if(target.classList.contains('gambar')){
    mealInfo(mealData)
  }
})
 container__meals.appendChild(meal)
}

// local storage
function addMealsLocalStorage(mealId){
  let mealStr = getMealsLocalStorage();
  localStorage.setItem("mealStr",JSON.stringify([...mealStr,mealId]))
}
function removeMealsLocalStorage(mealId){
  let mealStr = getMealsLocalStorage()
  localStorage.setItem('mealStr',JSON.stringify(mealStr.filter((id) => id !== mealId)));
}

function getMealsLocalStorage(){
  let mealStr = JSON.parse(localStorage.getItem('mealStr'));

  return mealStr === null ? [] : mealStr
}
async function fetchFavMeals(){
  let mealStr = getMealsLocalStorage();
  ul.innerHTML = ""
  for(let i = 0; i < mealStr.length; i++){
      let mealIds = mealStr[i];
      getMealsApi = await getMeals(mealIds)
      adMealFavorite(getMealsApi);
  }

}
fetchFavMeals();


function adMealFavorite(mealGet){
  let liFav = document.createElement('li');
  liFav.innerHTML = `<img src="${mealGet.strMealThumb}"/><span>${mealGet.strMeal}</span>
  <button class = "deleteFav" type="submit"><i class="fa-solid fa-rectangle-xmark"></i></button>
  `
  let buttonFav = liFav.querySelector('.deleteFav');
  buttonFav.addEventListener('click',() => {
    removeMealsLocalStorage(mealGet.idMeal);
    fetchFavMeals();
  })
  ul.appendChild(liFav);
}

// search Btn
searchBtn.addEventListener('click', async () => {
  container__meals.innerHTML = "";
  let tampungSearch  = searchMealsInput.value;
  let mealsSearch = await searchMeals(tampungSearch)

  if(mealsSearch){
    mealsSearch.forEach((result) => {
      addMeals(result)
   })
  }else{
    window.alert("Makanan Yang anda cari tidak terdaftar dilist")
  }
})

let container__info = document.querySelector('.container__info');
function mealInfo(data){
  let mealIfoEl = document.createElement('div');
  mealIfoEl.classList.add('meal__info');
  let indgrident = []
  for(let i = 1; i < 20 ; i++ ){
    if(data['strIngredient' + i]){
      indgrident.push(`${data['strIngredient' + i]} / ${data['strMeasure' + i]}`);
    }else{
      break;
    }
  }
  mealIfoEl.innerHTML = `<div class = "mealBody">
                            <i class="fa fa-close" aria-hidden="true"></i>
                            <img src = "${data.strMealThumb}" />
                            <div class = "text__info">
                              <h3>${data.strMeal}</h3>

                              <p>${data.strInstructions}</p>
                              <h3>Ingredients : </h3>
                              <ul>
                                ${indgrident.map(result => `<li>${result}</li>` ).join('')}
                              </ul>
                            </div>
                         </div>`
                        
 container__info.appendChild(mealIfoEl)
 let closeClick = mealIfoEl.querySelector('.fa-close')
 closeClick.addEventListener('click', () => {
  mealIfoEl.style.display = "none";
 })
}

// media screen
let container = document.querySelector('.container')
let mediaScreen = matchMedia("(max-width:360px)");
mediaScreen.addListener(handleScreen)
function handleScreen(e){
  if(e.matches){
    container.style.display  = "none";
  }else{
    container.style.display = "block";
  }
}
