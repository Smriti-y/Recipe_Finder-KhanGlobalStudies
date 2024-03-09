const appId = "84b73b6e";
const appKey = "346a47d714c7d9dd21f95ef0beb04d7d";
const baseUrl = "https://api.edamam.com/api/recipes/v2?type=public&app_id=84b73b6e&app_key=346a47d714c7d9dd21f95ef0beb04d7d";
const recipeContainer = document.querySelector("#recipe-container");
const txtSearch = document.querySelector("#txtSearch");
const btnFind = document.querySelector("#btnFind");
const loadingEle = document.querySelector("#loading");
const filterBtn = document.querySelector("#filterBtn");
const cuisineFilter = document.querySelector("#cuisine");
const dietFilter = document.querySelector("#diet");
const mealTypeFilter = document.querySelector("#mealType");
const favoritesContainer = document.querySelector("#favorites-list");

btnFind.addEventListener("click", () => loadRecipes(txtSearch.value));
filterBtn.addEventListener("click", () => applyFilters());

function applyFilters() {
    const cuisine = cuisineFilter.value;
    const diet = dietFilter.value;
    const mealType = mealTypeFilter.value;
    const query = `&q=${txtSearch.value}&cuisineType=${cuisine}&diet=${diet}&mealType=${mealType}`;
    loadRecipes(cuisine);
}
// --->
const addToFavorites = (recipeObj) => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(recipeObj);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
};

// --->
const toggleLoad = (element, isShow) => {
    element.classList.toggle("hide", isShow);
};

const setScrollPosition = () => {
    recipeContainer.scrollTo({ top: 0, behavior: "smooth" });
};

function loadRecipes(type = "paneer") {
    toggleLoad(loadingEle, false); // Show loading indicator
    const url = baseUrl + `&q=${type}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            renderRecipes(data.hits);
            toggleLoad(loadingEle, true); // Hide loading indicator
        })
        .catch((error) => {
            toggleLoad(loadingEle, true); // Hide loading indicator in case of error
            console.error("Error fetching recipes:", error);
        })
        .finally(() => {
            console.log("API request completed");
            setScrollPosition();
        });
}

loadRecipes();

const getRecipeStepsStr = (ingredientLines = []) => {
    let str = "";
    for (var step of ingredientLines) {
        str += `<li>${step}</li>`;
    }
    return str;
};

const renderRecipes = (recipeList = []) => {
    recipeContainer.innerHTML = " ";
    recipeList.forEach((recipeObj) => {
        const { label: recipeTitle, ingredientLines, image: recipeImage } = recipeObj.recipe;
        const stepsStr = getRecipeStepsStr(ingredientLines);
        const htmlStr = `<div class="recipe">
            <div class="recipe-title">${recipeTitle}</div>
            <div class="recipe-image">
                <img src ="${recipeImage}" />
            </div>
            <div class="recipe-text">
                <ul>
                    ${stepsStr}
                </ul>
            </div>
        </div>`;
        recipeContainer.insertAdjacentHTML("beforeend", htmlStr);
    });


};

// Render favorite recipes
const renderFavorites = () => {
    favoritesContainer.innerHTML = "";
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.forEach((favorite) => {
        const { label, image, ingredientLines } = favorite.recipe;
        const stepsStr = getRecipeStepsStr(ingredientLines);
        const htmlStr = `<div class="recipe">
            <div class="recipe-title">${label}</div>
            <div class="recipe-image">
                <img src="${image}" />
            </div>
            <div class="recipe-text">
                <ul>${stepsStr}</ul>
            </div>
            <button class="btn" onclick="removeFromFavorites('${label}')">Remove from Favorites</button>
        </div>`;
        favoritesContainer.insertAdjacentHTML("beforeend", htmlStr);
    });
};

// Remove a recipe from favorites
const removeFromFavorites = (label) => {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter((favorite) => favorite.recipe.label !== label);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
};

// Event listener for finding recipes
btnFind.addEventListener("click", () => loadRecipes(txtSearch.value));

// Event listener for applying filters
btnFilter.addEventListener("click", applyFilters);