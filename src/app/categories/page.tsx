"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import ProductCard from "@/components/card/ProductCard";
import { ChevronRight, ChevronLeft, Minus, Plus } from "lucide-react";
import Link from "next/link";
import CandleLoader from "@/components/CandleLoader";
import {
  getAllProducts,
  getProductsByCategory,
  type Product,
  type GetAllProductsParams,
} from "@/services/productService";
import {
  getAllCategories,
  getAllSubCategories,
  type Category,
  type SubCategory,
} from "@/services/categoryService";
import { useSearchParams } from "next/navigation";

function CategoriesPageContent() {
  const searchParams = useSearchParams();

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<number[]>(
    []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 500]);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([
    100, 500,
  ]);
  const [sortBy, setSortBy] =
    useState<GetAllProductsParams["sortBy"]>("latest");
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, subCategoriesRes] =
          await Promise.all([
            getAllProducts({ sortBy: "latest" }),
            getAllCategories(),
            getAllSubCategories(),
          ]);

        setProducts(productsRes.products);
        setCategories(categoriesRes.categories);
        setSubCategories(subCategoriesRes.subCategories);

        // Check for category parameter in URL
        const categoryParam = searchParams.get("category");
        if (categoryParam && categoriesRes.categories) {
          const matchedCategory = categoriesRes.categories.find(
            (cat) =>
              cat.categoryName.toLowerCase() === categoryParam.toLowerCase()
          );
          if (matchedCategory) {
            setSelectedCategories([matchedCategory.id]);
            setExpandedCategories([matchedCategory.id]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [searchParams]);

  // Fetch products based on filters
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const params: GetAllProductsParams = {
          sortBy,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
        };

        // Add selected categories
        if (selectedCategories.length > 0) {
          const categoryNames = categories
            .filter((cat) => selectedCategories.includes(cat.id))
            .map((cat) => cat.categoryName);
          params.categories = categoryNames.join(",");
        }

        // Add selected brands
        if (selectedBrands.length > 0) {
          params.brands = selectedBrands.join(",");
        }

        const result = await getAllProducts(params);
        let filteredProducts = result.products;

        // Client-side filter for subcategories
        if (selectedSubCategories.length > 0) {
          filteredProducts = filteredProducts.filter((product) =>
            selectedSubCategories.includes(product.productSubCategoryId)
          );
        }

        setProducts(filteredProducts);
        setCurrentPage(1); // Reset to first page on filter change
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (!loading) {
      fetchFilteredProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCategories,
    selectedSubCategories,
    selectedBrands,
    priceRange,
    sortBy,
    loading,
  ]);

  // Get unique brands from all products
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((product) => {
      if (product.productBrand) {
        brands.add(product.productBrand);
      }
    });
    return Array.from(brands).sort();
  }, [products]);

  // Group subcategories by category
  const subcategoriesByCategory = useMemo(() => {
    const grouped: Record<number, SubCategory[]> = {};
    subCategories.forEach((sub) => {
      if (!grouped[sub.categoryId]) {
        grouped[sub.categoryId] = [];
      }
      grouped[sub.categoryId].push(sub);
    });
    return grouped;
  }, [subCategories]);

  // Pagination
  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return products.slice(startIndex, startIndex + productsPerPage);
  }, [products, currentPage, productsPerPage]);

  // Toggle handlers
  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSubCategory = (subCategoryId: number) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategoryId)
        ? prev.filter((id) => id !== subCategoryId)
        : [...prev, subCategoryId]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleCategoryExpand = (categoryId: number) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const applyFilters = () => {
    setPriceRange(tempPriceRange);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubCategories([]);
    setSelectedBrands([]);
    setPriceRange([100, 500]);
    setTempPriceRange([100, 500]);
    setSortBy("latest");
  };

  if (loading) {
    return <CandleLoader />;
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-3 sm:px-4 md:px-8 lg:px-12 xl:px-20 py-3 md:py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm mb-3 md:mb-6">
          <Link href="/" className="text-accent hover:underline font-medium">
            Home
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-700 font-medium">Products</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden w-full px-3 py-3 bg-accent text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors"
          >
            <span className="text-sm">
              {showMobileFilters ? "Hide Filters" : "Show Filters"}
            </span>
            <ChevronRight
              size={20}
              className={`transform transition-transform ${showMobileFilters ? "rotate-90" : ""
                }`}
            />
          </button>

          {/* Sidebar */}
          <aside
            className={`w-full lg:w-64 shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"
              }`}
          >
            <div className="py-2 md:py-3 rounded-lg shadow-sm border border-accent overflow-hidden">
              {/* Categories */}
              <div className="border-b border-accent">
                <h3 className="text-base md:text-xl font-semibold text-gray-900 px-3 md:px-4 py-2">
                  Categories
                </h3>
                <div className="px-4 md:px-8 py-1 max-h-64 md:max-h-80 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id}>
                      <div className="flex items-center justify-between py-1">
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className={`text-sm hover:text-accent transition-colors font-normal flex-1 text-left ${selectedCategories.includes(category.id)
                              ? "text-accent font-medium"
                              : "text-gray-700"
                            }`}
                        >
                          {category.categoryName}
                        </button>
                        <button
                          onClick={() => toggleCategoryExpand(category.id)}
                          className="p-1 rounded transition-colors"
                        >
                          {expandedCategories.includes(category.id) ? (
                            <Minus size={16} className="text-gray-600 hover:text-accent cursor-pointer" />
                          ) : (
                            <Plus size={16} className="text-gray-600 hover:text-accent cursor-pointer" />
                          )}
                        </button>
                      </div>
                      {/* Subcategories */}
                      {expandedCategories.includes(category.id) &&
                        subcategoriesByCategory[category.id] && (
                          <div className="ml-4 mt-1 space-y-1 pb-2">
                            {subcategoriesByCategory[category.id].map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => toggleSubCategory(sub.id)}
                                className={`block text-xs py-1 hover:text-accent transition-colors ${selectedSubCategories.includes(sub.id)
                                    ? "text-accent font-medium"
                                    : "text-gray-600"
                                  }`}
                              >
                                {sub.subCategoryName}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands */}
              {availableBrands.length > 0 && (
                <div className="border-b border-accent">
                  <h3 className="text-xl font-semibold text-gray-900 px-4 py-3">
                    Brands
                  </h3>
                  <div className="px-8 py-1 space-y-2 max-h-64 overflow-y-auto">
                    {availableBrands.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className={`block w-full text-left text-sm hover:text-accent transition-colors ${selectedBrands.includes(brand)
                            ? "text-accent font-bold"
                            : "text-gray-700 font-normal"
                          }`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div className="border-b border-accent">
                <h3 className="text-base md:text-xl font-semibold text-gray-900 px-3 md:px-4 py-2 md:py-3">
                  Price
                </h3>
                <div className="px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6">
                  {/* Dual Handle Range Slider */}
                  <div className="relative pt-2 pb-4">
                    {/* Track */}
                    <div className="relative h-2 bg-gray-300   rounded-full">
                      {/* Active Range */}
                      <div
                        className="absolute h-2 bg-accent rounded-full"
                        style={{
                          left: `${(tempPriceRange[0] / 10000) * 100}%`,
                          right: `${100 - (tempPriceRange[1] / 10000) * 100}%`,
                        }}
                      />
                    </div>
                    {/* Min Handle */}
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="50"
                      value={tempPriceRange[0]}
                      onChange={(e) => {
                        const newMin = parseInt(e.target.value);
                        if (newMin < tempPriceRange[1]) {
                          setTempPriceRange([newMin, tempPriceRange[1]]);
                        }
                      }}
                      className="absolute w-full -top-2 h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
                    />
                    {/* Max Handle */}
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="50"
                      value={tempPriceRange[1]}
                      onChange={(e) => {
                        const newMax = parseInt(e.target.value);
                        if (newMax > tempPriceRange[0]) {
                          setTempPriceRange([tempPriceRange[0], newMax]);
                        }
                      }}
                      className="absolute w-full -top-2 h-2 bg-transparent appearance-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-accent [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md"
                    />
                  </div>
                  {/* Price Display */}
                  <div className="text-center text-sm md:text-lg text-gray-900 font-medium">
                    ₹{tempPriceRange[0]} - ₹{tempPriceRange[1]}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 md:p-5 flex gap-2 md:gap-3">
                <button
                  onClick={applyFilters}
                  className="flex-1 px-3 md:px-4 py-2 md:py-2.5 text-accent border-2 border-accent rounded-lg hover:border-accent/10 hover:bg-accent/50 hover:text-white transition-all font-semibold text-xs md:text-sm"
                >
                  Apply
                </button>
                <button
                  onClick={clearFilters}
                  className="flex-1 px-3 md:px-4 py-2 md:py-2.5 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold text-xs md:text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
              <p className="text-xs md:text-sm text-gray-600 font-medium">
                Showing{" "}
                {paginatedProducts.length > 0
                  ? (currentPage - 1) * productsPerPage + 1
                  : 0}
                -{Math.min(currentPage * productsPerPage, products.length)} of{" "}
                <span className="text-gray-900 font-semibold">
                  {products.length}
                </span>{" "}
                products
              </p>

              {/* Sort */}
              <div className="relative w-full sm:w-56">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as GetAllProductsParams["sortBy"])
                  }
                  className="
                            appearance-none w-full
                            bg-transparent
                            border border-accent/40
                            text-accent
                            font-medium text-xs md:text-sm
                            px-4 py-2.5 pr-10
                            rounded-xl
                            cursor-pointer
                            transition-all
                            focus:outline-none focus:ring-2 focus:ring-accent/60
                            hover:border-accent
                          "
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="priceLowToHigh">Price: Low → High</option>
                  <option value="priceHighToLow">Price: High → Low</option>
                  <option value="discountHighToLow">Discount: High → Low</option>
                </select>

                {/* Custom Arrow */}
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-accent/70">
                  ▼
                </span>
              </div>

            </div>
            <>
              {/* Products Grid - All Screens */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    productId={product.id}
                    image={product.coverImageUrl}
                    title={product.productName || ""}
                    description={product.productDescription}
                    originalPrice={product.productPrice}
                    discountedPrice={
                      product.productDiscountPrice || product.productPrice
                    }
                    discount={product.productDiscountPercentage || 0}
                    availableStock={product.availableStockQuantity}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-6 md:mb-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className="p-1.5 md:p-2 bg-white hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm border border-gray-200"
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft
                      size={18}
                      className={
                        currentPage === 1 ? "text-gray-300" : "text-gray-700"
                      }
                    />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-7 md:min-w-8 h-7 md:h-8 px-2 md:px-3 rounded-lg text-xs md:text-sm font-medium transition-all ${currentPage === pageNum
                            ? "bg-accent text-white shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    className="p-1.5 md:p-2 bg-white hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm border border-gray-200"
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight
                      size={18}
                      className={
                        currentPage === totalPages
                          ? "text-gray-300"
                          : "text-gray-700"
                      }
                    />
                  </button>
                </div>
              )}
            </>
            {/* )} */}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={<CandleLoader />}>
      <CategoriesPageContent />
    </Suspense>
  );
}
