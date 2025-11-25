// ----- SPA Navigation -----
document.addEventListener("DOMContentLoaded", () => {
    let productData = []
    let cartData = []

    // ----- CART COUNTER -----
    let cartCount = 0;
    let selectedShippingMethod = "Standard"; 
    let selectedShippingDestination = "Canada";

    const cartCountBadge = document.querySelector("#cartCount");
    cartCountBadge.textContent = cartCount;
    const views = document.querySelectorAll(".spa-view");

    // helper to show a view
    function showView(name) {
		views.forEach(v => v.classList.add("hidden"));
		document.querySelector(`#view-${name}`).classList.remove("hidden");

        if (name === "women" || name === "men") {
            listCategory(name);
        } else if (name === "cart") {
            renderCart();
        }
    }

    // header nav buttons
    document.querySelectorAll("header [data-view]").forEach(btn => {
		btn.addEventListener("click", () => {
			const view = btn.dataset.view;   // no getAttribute
			showView(view);
		});
    });

    // ----- ABOUT MODAL -----
    const aboutModal = document.querySelector("#aboutModal");
    document.querySelector("#aboutBtn")
    .addEventListener("click", () => aboutModal.showModal());

    document.querySelector("#closeX")
    .addEventListener("click", () => aboutModal.close());

    document.querySelector("#closeAbout")
    .addEventListener("click", () => aboutModal.close());

    // ----- BROWSE CATEGORY NAV -----
    document.querySelectorAll("[data-browse-category]").forEach(btn => {
    btn.addEventListener("click", () => {
        showView("browse");
    });
    });

    // utility function to pick a random element
    const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

    // utility function to pick N random items
    const randomMany = (arr, count) => {
    const copy = [...arr];
    const selected = [];
    while (selected.length < count && copy.length > 0) {
        const index = Math.floor(Math.random() * copy.length);
        selected.push(copy.splice(index, 1)[0]);
    }
    return selected;
    };

    function renderCart() {
        const container = document.getElementById("cartContent");
        if (!container) return;
    
        // if cart is empty
        if (cartData.length === 0) {
            container.innerHTML = `
                <p class="text-sm text-gray-500 mt-4">
                    Your cart is empty.
                </p>
            `;
            cartCountBadge.textContent = 0;
            return;
        }
    
        let merchandiseTotal = 0;
    
        // ----- HEADER -----
        let html = `
            <!-- COLUMN HEADER -->
            <div class="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] text-sm font-semibold pb-3 border-b border-gray-300">
                <div>Items</div>
                <div class="text-center">Color</div>
                <div class="text-center">Size</div>
                <div class="text-center">Price</div>
                <div class="text-center">Quantity</div>
                <div class="text-center">Subtotal</div>
            </div>
        `;
    
        // ----- ITEM ROWS -----
        cartData.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            merchandiseTotal += subtotal;
    
            const colorHex = item.color || "#000000";
            const sizeLabel = item.size || "-";
    
            html += `
                <div class="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] text-sm items-center py-6 border-b border-gray-200">
                    <!-- Items column -->
                    <div class="flex items-center gap-4">
                        <button
                            class="border border-gray-400 px-2 py-1 leading-none"
                            data-remove-index="${index}">
                            -
                        </button>
    
                        <div class="border border-gray-400 w-20 h-24 flex items-center justify-center text-gray-400 text-xs">
                            placeholder
                        </div>
    
                        <span>${item.name}</span>
                    </div>
    
                    <!-- Color -->
                    <div class="flex justify-center">
                        <div class="w-5 h-5" style="background-color:${colorHex};"></div>
                    </div>
    
                    <!-- Size -->
                    <div class="flex justify-center">
                        <div class="border border-gray-400 px-3 py-1 text-xs">${sizeLabel}</div>
                    </div>
    
                    <!-- Price -->
                    <div class="text-center">$${item.price.toFixed(2)}</div>
    
                    <!-- Quantity -->
                    <div class="text-center">${item.quantity}</div>
    
                    <!-- Subtotal -->
                    <div class="text-center">$${subtotal.toFixed(2)}</div>
                </div>
            `;
        });
    
        // ----- BOTTOM SECTION (Shipping & Summary) -----
        html += `
            <!-- Bottom Section -->
            <div class="mt-10 flex flex-wrap gap-12 items-start">
    
                <!-- Shipping -->
                <div class="w-56">
                    <h3 class="font-semibold mb-3">Shipping</h3>
    
                    <div class="mb-4">
                        <label class="block text-xs mb-1">Method</label>
                        <select id="shippingMethodSelect" class="w-full border border-gray-400 px-3 py-2 text-sm bg-white">
                            <option value="Standard" ${selectedShippingMethod === "Standard" ? "selected" : ""}>Standard</option>
                            <option value="Express" ${selectedShippingMethod === "Express" ? "selected" : ""}>Express</option>
                            <option value="Priority" ${selectedShippingMethod === "Priority" ? "selected" : ""}>Priority</option>
                        </select>
                    </div>
    
                    <div>
                        <label class="block text-xs mb-1">Destination</label>
                        <select id="shippingDestinationSelect" class="w-full border border-gray-400 px-3 py-2 text-sm bg-white">
                            <option value="Canada" ${selectedShippingDestination === "Canada" ? "selected" : ""}>Canada</option>
                            <option value="United States" ${selectedShippingDestination === "United States" ? "selected" : ""}>United States</option>
                            <option value="International" ${selectedShippingDestination === "International" ? "selected" : ""}>International</option>
                        </select>
                    </div>
                </div>
    
                <!-- Summary -->
                <div class="flex-1 max-w-sm">
                    <h3 class="font-semibold mb-3">Summary</h3>
    
                    <div class="border border-gray-400 p-4 space-y-2">
                        <div class="flex justify-between">
                            <span>Merchandise</span><span id="summaryMerch">$${merchandiseTotal.toFixed(2)}</span>
                        </div>
    
                        <div class="flex justify-between">
                            <span>Shipping</span><span id="summaryShipping">$0.00</span>
                        </div>
    
                        <div class="flex justify-between">
                            <span>Tax</span><span id="summaryTax">$0.00</span>
                        </div>
    
                        <div class="flex justify-between font-semibold pt-2 border-t border-gray-300 mt-2">
                            <span>Total</span><span id="summaryTotal">$0.00</span>
                        </div>
                    </div>
    
                    <!-- Checkout Button -->
                    <div class="mt-4 flex justify-center">
                        <button class="border border-gray-500 px-8 py-2 font-semibold bg-gray-100">
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        `;
    
        // put it all into the container
        container.innerHTML = html;
    
        // ----- SHIPPING & TAX CALCULATION -----
        const methodSelect = container.querySelector("#shippingMethodSelect");
        const destSelect = container.querySelector("#shippingDestinationSelect");
        const shippingSpan = container.querySelector("#summaryShipping");
        const taxSpan = container.querySelector("#summaryTax");
        const totalSpan = container.querySelector("#summaryTotal");
    
        function computeShipping(method, destination) {
            // free shipping if merchandise over $500
            if (merchandiseTotal > 500) {
                return 0;
            }
    
            // costs by method & destination
            const table = {
                Standard: { "Canada": 10, "United States": 15, "International": 20 },
                Express:  { "Canada": 25, "United States": 25, "International": 30 },
                Priority: { "Canada": 35, "United States": 50, "International": 50 }
            };
    
            return table[method][destination];
        }
    
        function updateSummary() {
            const method = methodSelect.value;
            const destination = destSelect.value;
    
            // remember choices for next render
            selectedShippingMethod = method;
            selectedShippingDestination = destination;
    
            const shipping = computeShipping(method, destination);
    
            // tax 5% only if Canada
            const tax = destination === "Canada" ? merchandiseTotal * 0.05 : 0;
    
            const grandTotal = merchandiseTotal + shipping + tax;
    
            shippingSpan.textContent = `$${shipping.toFixed(2)}`;
            taxSpan.textContent = `$${tax.toFixed(2)}`;
            totalSpan.textContent = `$${grandTotal.toFixed(2)}`;
        }
    
        // initial calculation
        updateSummary();
    
        // update whenever user changes shipping options
        methodSelect.addEventListener("change", updateSummary);
        destSelect.addEventListener("change", updateSummary);
    
        // ----- REMOVE BUTTON HANDLERS -----
        container.querySelectorAll("[data-remove-index]").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = Number(btn.dataset.removeIndex);
                if (!isNaN(idx)) {
                    cartData.splice(idx, 1);
    
                    // update cart count
                    cartCount = cartData.reduce((sum, item) => sum + item.quantity, 0);
                    cartCountBadge.textContent = cartCount;
    
                    renderCart();
                }
            });
        });
    }
    
    function listCategory(gender) {
        const container = document.getElementById("list-" + gender + "-categories");
        if (!container) return;

        // collect unique categories
        const categorySet = new Set();
        productData.forEach(product => {
            if (product.category && product.gender === gender + "s") {
                categorySet.add(product.category);
            }
        });

        // sort alphabetically
        const categories = Array.from(categorySet).sort((a, b) =>
            a.localeCompare(b)
        );

        // clear existing content
        container.innerHTML = "";

        categories.forEach(p => {
            container.appendChild(createCategoryCard(gender, p));
        });

    }

    function createCategoryCard(gender, name) {
        const card = document.createElement("div");
        card.classList.add("text-center", gender + "-category-card", "cursor-pointer");
        card.setAttribute("data-category", name);
        card.setAttribute("data-gender", gender+"s");

        const placeholder = document.createElement("div");
        placeholder.classList.add("border", "h-40", "flex", "items-center", "justify-center");

        const placeholderSpan = document.createElement("span");
        placeholderSpan.classList.add("text-gray-400");
        placeholderSpan.textContent = name;

        placeholder.appendChild(placeholderSpan);

        const category = document.createElement("p");
        category.classList.add("mt-2", "font-medium");
        category.textContent = name;

        // Add to card
        card.appendChild(placeholder);
        card.appendChild(category);

        return card;
    }

    function createProductCard(product) {
        const card = document.createElement("div");
        card.classList.add(
            "p-4", "border", "rounded-lg", "shadow", "space-y-2",
            "bg-white", "w-60"
        );

        const name = document.createElement("h3");
        name.classList.add("font-bold", "text-lg");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.classList.add("text-green-700", "font-semibold");
        price.textContent = `$${product.price}`;

        const category = document.createElement("p");
        category.classList.add("text-sm", "text-gray-500");
        category.textContent = product.category;

        // add to card
        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(category);

        return card;
    }

    function loadHomeSections() {

        // -----------------------
        // Deal of the Week
        // -----------------------
        const dealProduct = [...productData].sort((a, b) => a.price - b.price)[0];
        const dealContainer = document.querySelector("#dealOfWeek");
        dealContainer.textContent = ""; // clear old content
        dealContainer.appendChild(createProductCard(dealProduct));

        // -----------------------
        // Featured Products
        // -----------------------
        const featuredPool = productData.filter(
            p => p.category === "Tops" || p.category === "Dresses"
        );
        const featured = randomMany(featuredPool, 3);

        const featuredContainer = document.querySelector("#featuredProducts");
        featuredContainer.textContent = "";

        featured.forEach(p => {
            featuredContainer.appendChild(createProductCard(p));
        });

        // -----------------------
        // Staff Picks (random 3)
        // -----------------------
        const staff = randomMany(productData, 3);

        const staffContainer = document.querySelector("#staffPicks");
        staffContainer.textContent = "";

        staff.forEach(p => {
            staffContainer.appendChild(createProductCard(p));
        });
    }

    // ----- CATEGORY CLICK -----
    document.addEventListener("click", (e) => {
		const card = e.target.closest(".women-category-card, .men-category-card");
		if (!card) return;

		const category = card.dataset.category;
        const gender   = card.dataset.gender;

		// switch view
		showView("browse");

		// clear all filters first
		document.querySelectorAll(".filter-checkbox").forEach(cb => cb.checked = false);

		// apply women filter
		document.querySelectorAll('.filter-checkbox[data-filter-type="gender"]').forEach(cb => {
			if (cb.dataset.filterValue === gender) cb.checked = true;
		});

		// apply category filter
		document.querySelectorAll('.filter-checkbox[data-filter-type="category"]').forEach(cb => {
			if (cb.dataset.filterValue === category) cb.checked = true;
		});

		// update UI & product grid
		refreshFiltersAndProducts();

		// scroll to top of browse view
		document.getElementById("productGrid")?.scrollIntoView({ behavior: "smooth" });
	});
	
    // ----- SIDEBAR FILTER -----

    function populateColorFilters(productData) {
        const container = document.getElementById("filterColors");
        if (!container) return;

        const colorMap = new Map();

        productData.forEach(product => {
            if (product.color) {
                product.color.forEach(c => {
                    if (!colorMap.has(c.name)) {
                        colorMap.set(c.name, c.hex);
                    }
                });
            }
        });

        container.innerHTML = "";

        colorMap.forEach((hex, name) => {
            const label = document.createElement("label");
            label.className = "flex items-center justify-between gap-2 cursor-pointer";

            label.innerHTML = `
                <div class="flex items-center gap-2">
                    <input type="checkbox"
                           class="w-4 h-4 filter-checkbox"
                           data-filter-type="color"
                           data-filter-value="${name}">
                    <span>${name}</span>
                </div>
                <div class="w-4 h-4 border border-gray-400" style="background-color:${hex};"></div>
            `;

            container.appendChild(label);
        });
    }

    function populateSizeFilters(productData) {
        const container = document.getElementById("filterSizes");
        if (!container) return;

        const sizeSet = new Set();
        productData.forEach(product => {
            if (product.sizes) {
                product.sizes.forEach(size => sizeSet.add(size));
            }
        });

        const sizes = Array.from(sizeSet);

        const letterOrder = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

        function sizeRank(size) {
            if (letterOrder.includes(size)) {
                return [1, letterOrder.indexOf(size)];
            }
            if (!isNaN(size)) {
                return [2, Number(size)];
            }
            if (size.includes("/")) {
                return [3, size];
            }
            return [4, size];
        }

        sizes.sort((a, b) => {
            const [ga, va] = sizeRank(a);
            const [gb, vb] = sizeRank(b);

            if (ga !== gb) return ga - gb;

            if (typeof va === "number" && typeof vb === "number") {
                return va - vb;
            }
            return String(va).localeCompare(String(vb));
        });

        container.innerHTML = "";

        sizes.forEach(size => {
            const label = document.createElement("label");
            label.className = "flex items-center gap-2 cursor-pointer";

            label.innerHTML = `
                <input type="checkbox"
                       class="w-4 h-4 filter-checkbox"
                       data-filter-type="size"
                       data-filter-value="${size}">
                <span>${size}</span>
            `;

            container.appendChild(label);
        });
    }

    function populateCategoryFilters(productData) {
        const container = document.getElementById("filterCategories");
        if (!container) return;

        const categorySet = new Set();
        productData.forEach(product => {
            if (product.category) {
                categorySet.add(product.category);
            }
        });

        const categories = Array.from(categorySet).sort((a, b) =>
            a.localeCompare(b)
        );

        container.innerHTML = "";

        categories.forEach(category => {
            const label = document.createElement("label");
            label.className = "flex items-center gap-2 cursor-pointer";

            label.innerHTML = `
                <input type="checkbox"
                       class="w-4 h-4 filter-checkbox"
                       data-filter-type="category"
                       data-filter-value="${category}">
                <span>${category}</span>`;

            container.appendChild(label);
        });
    }

    function populateGenderFilters(productData) {
        const container = document.getElementById("filterGender");
        if (!container) return;

        const genderSet = new Set();
        productData.forEach(product => {
            if (product.gender) {
                genderSet.add(product.gender);
            }
        });

        const genders = Array.from(genderSet).sort((a, b) =>
            a.localeCompare(b)
        );

        container.innerHTML = "";

        genders.forEach(gender => {
            const label = document.createElement("label");
            label.className = "flex items-center gap-2 cursor-pointer";

            label.innerHTML = `
                <input type="checkbox"
                       class="w-4 h-4 filter-checkbox"
                       data-filter-type="gender"
                       data-filter-value="${gender}">
                <span class="capitalize">${gender}</span>`;

            container.appendChild(label);
        });
    }

    // ----- PRODUCT GRID RENDER -----
    function renderProductGrid(products) {
        const grid = document.getElementById("productGrid");
        if (!grid) return;
    
        grid.innerHTML = "";
    
        products.forEach(product => {
            const card = document.createElement("div");
            card.className = "border rounded-lg shadow bg-white p-4 space-y-2 cursor-pointer";
    
            // clicking opens product page
            card.addEventListener("click", () => {
                openProductView(product);
            });
    
            const img = document.createElement("div");
            img.className = "w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500";
            img.textContent = "Image Placeholder";
    
            const name = document.createElement("h3");
            name.className = "font-bold text-lg";
            name.textContent = product.name;
    
            const price = document.createElement("p");
            price.className = "text-green-700 font-semibold";
            price.textContent = `$${product.price}`;
    
            // add to Cart button
            const addBtn = document.createElement("button");
            addBtn.className =
                "mt-auto bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition";
            addBtn.textContent = "Add to Cart";

            addBtn.addEventListener("click", () => {
                let qty = 1;

                addToCart(product, {
                    quantity: qty,
                    size: null,
                    color: null
                });

            });

            card.appendChild(img);
            card.appendChild(name);
            card.appendChild(price);
            card.appendChild(addBtn);
    
            grid.appendChild(card);
        });
    }


    function updateCartBadge() {
        cartCountBadge.textContent = cartCount;
    }


    function addToCart(product, { quantity = null, size = null, color = null } = {}) {
        // store a simple cart line item
        cartData.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            size,
            color
        });

        cartCount += quantity;
        updateCartBadge();
    }

    
    // ----- FILTER STATE & LOGIC -----
    const activeFilters = {
        gender: new Set(),
        category: new Set(),
        size: new Set(),
        color: new Set()
    };

    function recomputeActiveFilters() {
        activeFilters.gender.clear();
        activeFilters.category.clear();
        activeFilters.size.clear();
        activeFilters.color.clear();

        document.querySelectorAll(".filter-checkbox:checked").forEach(cb => {
            const type = cb.dataset.filterType;
            const value = cb.dataset.filterValue;

            if (!type || !value) return;

            if (type === "gender") activeFilters.gender.add(value);
            else if (type === "category") activeFilters.category.add(value);
            else if (type === "size") activeFilters.size.add(value);
            else if (type === "color") activeFilters.color.add(value);
        });
    }

    function filterProducts() {
        let filtered = [...productData];

        if (activeFilters.gender.size > 0) {
            filtered = filtered.filter(p => activeFilters.gender.has(p.gender));
        }

        if (activeFilters.category.size > 0) {
            filtered = filtered.filter(p => activeFilters.category.has(p.category));
        }

        if (activeFilters.size.size > 0) {
            filtered = filtered.filter(p =>
                p.sizes && p.sizes.some(size => activeFilters.size.has(size))
            );
        }

        if (activeFilters.color.size > 0) {
            filtered = filtered.filter(p =>
                p.color && p.color.some(c => activeFilters.color.has(c.name))
            );
        }

        renderProductGrid(filtered);
    }

    // ----- CURRENT FILTER CHIPS -----
    function updateCurrentFilterChips() {
        const container = document.getElementById("currentFilters");
        if (!container) return;

        container.innerHTML = "";

        const checked = document.querySelectorAll(".filter-checkbox:checked");

        checked.forEach(input => {
            const type = input.dataset.filterType;
            const value = input.dataset.filterValue;

            let label = value;
            if (value === "womens") label = "Womens";
            else if (value === "mens") label = "Mens";

            const chip = document.createElement("button");
            chip.className = "border px-3 py-1 text-sm flex items-center gap-1";
            chip.dataset.filterType = type;
            chip.dataset.filterValue = value;

            chip.innerHTML = `
                <span>${label}</span>
                <span class="text-xs">✕</span>`;

            chip.addEventListener("click", () => {
                document.querySelectorAll(".filter-checkbox").forEach(cb => {
                    if (
                        cb.dataset.filterType === type &&
                        cb.dataset.filterValue === value
                    ) {
                        cb.checked = false;
                    }
                });

                refreshFiltersAndProducts();
            });

            container.appendChild(chip);
        });
    }

    function refreshFiltersAndProducts() {
        recomputeActiveFilters();
        updateCurrentFilterChips();
        filterProducts();
    }

    // ----- CLEAR ALL BUTTON -----
    const clearAllBtn = document.getElementById("clearAllFilters");
    if (clearAllBtn) {
        clearAllBtn.addEventListener("click", () => {
            document.querySelectorAll(".filter-checkbox").forEach(cb => {
                cb.checked = false;
            });
            refreshFiltersAndProducts();
        });
    }

    let currentProduct = null;
    let selectedSize = null;
    let selectedColor = null;
    
    function openProductView(product) {
        currentProduct = product;
		selectedQuantity = null;
        selectedSize = null;
        selectedColor = null;
    
        // show single item view
        showView("product");
    
        // main product text
        document.getElementById("singleProductTitle").textContent = product.name;
        document.getElementById("singleProductPrice").textContent = `$${product.price}`;
        document.getElementById("singleProductDescription").textContent = product.description;
        document.getElementById("singleProductMaterial").textContent = product.material;
    
        // breadcrumbs
        const genderLabel = product.gender === "womens" ? "Women" : "Men";
        document.getElementById("crumbGender").textContent = genderLabel;
        document.getElementById("crumbCategory").textContent = product.category;
        document.getElementById("crumbTitle").textContent = product.name;
    
		// quantity
        const quantityContainer = document.getElementById("singleProductQuantity");
        quantityContainer.addEventListener("input", () => {
            selectedQuantity = parseInt(quantityContainer.value);
        });
	
        // sizes
        const sizeContainer = document.getElementById("singleProductSizes");
        sizeContainer.innerHTML = "";
    
        if (product.sizes && product.sizes.length > 0) {
            product.sizes.forEach(size => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = size;
                btn.className = "border border-gray-400 px-3 py-1 text-xs";
    
                btn.addEventListener("click", () => {
                    sizeContainer.querySelectorAll("button").forEach(b => {
                        b.classList.remove("bg-gray-900", "text-white");
                    });
                    btn.classList.add("bg-gray-900", "text-white");
                    selectedSize = size;
                });
    
                sizeContainer.appendChild(btn);
            });
        }
    
        // colors 
        const colorContainer = document.getElementById("singleProductColors");
        colorContainer.innerHTML = "";
    
        if (product.color && product.color.length > 0) {
            product.color.forEach(c => {
                const box = document.createElement("button");
                box.type = "button";
                box.className = "w-8 h-8 border border-gray-400";
                box.style.backgroundColor = c.hex;
                box.title = c.name;
    
                box.addEventListener("click", () => {
                    colorContainer.querySelectorAll("button").forEach(b => {
                        b.classList.remove("ring-2", "ring-gray-900");
                    });
                    box.classList.add("ring-2", "ring-gray-900");
                    selectedColor = c.hex;
                });
    
                colorContainer.appendChild(box);
            });
        }

        // add product to cart
        const addBtn = document.getElementById("btnAddProductToCart");
        addBtn.onclick = () => {
            addToCart(currentProduct, {
                quantity: selectedQuantity,
                size: selectedSize,
                color: selectedColor
            });
            updateCartBadge();
        };
            
        // related products 
        const relatedContainer = document.getElementById("relatedProducts");
        if (relatedContainer) {
            relatedContainer.innerHTML = "";
    
            // prefer same gender & category, excluding current product
            let pool = productData.filter(p =>
                p.id !== product.id &&
                p.gender === product.gender &&
                p.category === product.category
            );
    
            // but if not enough, fill with same gender (other categories)
            if (pool.length < 4) {
                const extras = productData.filter(p =>
                    p.id !== product.id &&
                    p.gender === product.gender &&
                    !pool.includes(p)
                );
                pool = pool.concat(extras);
            }
    
            const related = pool.slice(0, 4); // max 4 cards
    
            related.forEach(item => {
                const card = document.createElement("div");
                card.className = "cursor-pointer";
    
                // image placeholder
                const img = document.createElement("div");
                img.className = "border border-gray-300 h-40 flex items-center justify-center";
                img.innerHTML = `<span class="text-gray-400 text-xs">placeholder</span>`;
    
                // title, price, plus button
                const infoRow = document.createElement("div");
                infoRow.className = "mt-2 flex items-center justify-between";
    
                const textWrap = document.createElement("div");
                const titleEl = document.createElement("p");
                titleEl.textContent = item.name;
                const priceEl = document.createElement("span");
                priceEl.textContent = `$${item.price}`;
                textWrap.appendChild(titleEl);
                textWrap.appendChild(priceEl);
    
                const plusBtn = document.createElement("button");
                plusBtn.className = "border border-gray-400 px-2 py-1 text-base leading-none";
                plusBtn.textContent = "+";
    
                infoRow.appendChild(textWrap);
                infoRow.appendChild(plusBtn);
    
                card.addEventListener("click", () => openProductView(item));
    
                card.appendChild(img);
                card.appendChild(infoRow);
    
                relatedContainer.appendChild(card);
            });
        }
    }

    async function initProducts() {
        try {
            const response = await fetch(
              "https://gist.githubusercontent.com/rconnolly/d37a491b50203d66d043c26f33dbd798/raw/37b5b68c527ddbe824eaed12073d266d5455432a/clothing-compact.json"
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            productData = data;   

            populateColorFilters(productData);
            populateSizeFilters(productData);
            populateCategoryFilters(productData);
            populateGenderFilters(productData);

            renderProductGrid(productData);
            refreshFiltersAndProducts();

            loadHomeSections();
        } catch (err) {
            console.error("Failed to load product JSON:", err);
        }
    }

    // when any filter checkbox changes
    document.addEventListener("change", (e) => {
        if (e.target.classList.contains("filter-checkbox")) {
            refreshFiltersAndProducts();
        }
    });

    // load products from JSON
    initProducts();

});
