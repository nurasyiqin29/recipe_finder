document.addEventListener('DOMContentLoaded', function () {
    const favoritesContainer = document.getElementById('favoritesContainer');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    function displayFavorites() {
        favoritesContainer.innerHTML = '';
        favorites.forEach((meal, index) => {
            const mealDiv = document.createElement('div');
            mealDiv.classList.add('favorite-meal');
            mealDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h2>${meal.strMeal}</h2>
                <p>${meal.strArea ? `Origin: ${meal.strArea}` : ''}</p>
                <ul>
                    ${Array.from({ length: 20 }, (_, i) => i + 1)
                        .map(i => {
                            const ingredient = meal[`strIngredient${i}`];
                            const measure = meal[`strMeasure${i}`];
                            return ingredient && measure ? `<li>${ingredient} - ${measure}</li>` : '';
                        })
                        .join('')}
                </ul>
                <p>${meal.strInstructions}</p>
                <a href="${meal.strYoutube}" target="_blank">View preparation video on YouTube</a>
                <button class="remove-button" data-index="${index}">Delete from Favorites</button>
            `;
            favoritesContainer.appendChild(mealDiv);
        });
    }

    favoritesContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('remove-button')) {
            const index = event.target.dataset.index;
            removeFavorite(index);
        }
    });

    function removeFavorite(index) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
        alert("Meal deleted from favorite");
    }

    displayFavorites();
});
