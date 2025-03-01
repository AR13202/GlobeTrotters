function getRandomQuestions(dataArray, count) {
    // Function to get random elements from an array using Fisher-Yates shuffle
    function getRandomElements(arr, count) {
        let result = [];
        let tempArr = arr.slice(); // Clone the array to avoid modifying the original
        let len = tempArr.length;

        if (count >= len) return tempArr; // Return all elements if count exceeds array length

        while (result.length < count) {
            let randomIndex = Math.floor(Math.random() * len);
            result.push(tempArr[randomIndex]);
            tempArr.splice(randomIndex, 1); // Remove selected element
            len--; // Reduce length to prevent duplicates
        }
        return result;
    }

    // Ensure count does not exceed available data length
    const selectedItems = getRandomElements(dataArray, Math.min(count, dataArray.length));

    return selectedItems.map(item => {
        // Get 3 incorrect cities (excluding the correct one)
        let incorrectCities = dataArray
            .filter(other => other.city !== item.city) // Exclude correct answer
            .map(other => other.city); // Extract city names

        let incorrectOptions = getRandomElements(incorrectCities, Math.min(3, incorrectCities.length));

        // Combine correct city with incorrect ones and shuffle
        let options = getRandomElements([...incorrectOptions, item.city], 4);

        return {
            city: item.city,
            country: item.country,
            clues: getRandomElements(item.clues, Math.min(2, item.clues.length)), // Handle cases where clues < 2
            fun_fact: item.fun_fact,
            trivia: item.trivia,
            options: options // Multiple choice options
        };
    });
}

module.exports = { getRandomQuestions };
