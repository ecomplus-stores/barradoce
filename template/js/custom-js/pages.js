// Add your custom JavaScript for storefront pages here.
storefront.on('widget:@ecomplus/widget-fb-pixel', function () {
    const $searchInput = document.getElementById('search-input')
    const $searchButton = document.querySelector('.header__search-btn')
    let searchInputValue = $searchInput.value
    $searchInput.addEventListener('keyup', e => {
        searchInputValue = e.target.value
        $searchInput.classList.remove('focus-input')
    })
    $searchButton.addEventListener('click', e => {
        if (!searchInputValue) {
            $searchInput.focus({focusVisible: true})
            $searchInput.classList.add('focus-input')
            e.preventDefault()
        }
    })


})

if (window.location.href.includes('post')) {
    var anchorTags = document.querySelectorAll(".blog-post a");
    console.log(anchorTags)
    // Loop through each anchor tag
    for (var i = 0; i < anchorTags.length; i++) {
    var currentText = anchorTags[i].textContent.toLowerCase(); // Convert to lowercase for case-insensitive comparison

    // Check if the word "comprar" is present in the text content
    if (currentText.includes("comprar")) {
        // Add the 'buy' class to the anchor tag
        anchorTags[i].classList.add("buy");
    }
    }
}
