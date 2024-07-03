document.addEventListener('DOMContentLoaded', function () {
    const categorySelect = document.getElementById('categorySelect');
    const mealsContainer = document.getElementById('mealsContainer');
   

    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => {
            data.categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.strCategory;
                option.textContent = category.strCategory;
                categorySelect.appendChild(option);
            });
        });

    categorySelect.addEventListener('change', function () {
        const selectedCategory = this.value;
        if (selectedCategory) {
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`)
                .then(response => response.json())
                .then(data => {
                    mealsContainer.innerHTML = '';
                    data.meals.forEach(meal => {
                        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                            .then(response => response.json())
                            .then(mealData => {
                                const mealDetails = mealData.meals[0];
                                const mealDiv = document.createElement('div');
                                mealDiv.classList.add('meal');
                                mealDiv.innerHTML = `
                                    <img src="${mealDetails.strMealThumb}" alt="${mealDetails.strMeal}">
                                    <h2>${mealDetails.strMeal}</h2>
                                    <p>${mealDetails.strArea ? `Origin: ${mealDetails.strArea}` : ''}</p>
                                    <ul>
                                        ${Array.from({ length: 20 }, (_, i) => i + 1)
                                            .map(i => {
                                                const ingredient = mealDetails[`strIngredient${i}`];
                                                const measure = mealDetails[`strMeasure${i}`];
                                                return ingredient && measure ? `<li>${ingredient} - ${measure}</li>` : '';
                                            })
                                            .join('')}
                                    </ul>
                                    <p>${mealDetails.strInstructions}</p>
                                    <a href="${mealDetails.strYoutube}" target="_blank">Video on YouTube</a><br>
                                    <button class="favorite-button" data-meal='${JSON.stringify(mealDetails)}'>Add to Favorites</button>
                                `;
                                mealsContainer.appendChild(mealDiv);
                            });
                    });
                });
        }
    });

    mealsContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('favorite-button')) {
            const mealData = JSON.parse(event.target.dataset.meal);
            addFavorite(mealData);
        }
    });

    function addFavorite(meal) {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favorites.push(meal);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert("Meal added to favorite");
    }
});
