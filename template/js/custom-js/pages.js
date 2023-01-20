// Add your custom JavaScript for storefront pages here.
storefront.on('widget:@ecomplus/widget-tag-manager', function () {
    const $searchInput = document.getElementById('search-input')
    console.log($searchInput)
    const $searchButton = document.querySelector('.header__search-btn')
    console.log($searchButton)
    let searchInputValue = $searchInput.value
    console.log(searchInputValue)
    $searchInput.addEventListener('keyup', e => {
        searchInputValue = e.target.value
        console.log($searchInput.classList)
        $searchInput.classList.remove('focus-input')
    })
    $searchButton.addEventListener('click', e => {
        if (!searchInputValue) {
            $searchInput.focus({focusVisible: true})
            $searchInput.classList.add('focus-input')
            e.preventDefault()
        }
    })

    ecomCart.on('change', ({ data }) => { console.log(data.items) })
})
