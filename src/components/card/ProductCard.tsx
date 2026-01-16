"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/dist/client/components/navigation";

interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice?: number;
  discount?: number;
  productId?: number | string;
  onWishlistToggle?: () => void;
  isInWishlist?: boolean;
  availableStock?: number;
}

export default function ProductCard({
  image,
  title,
  description,
  originalPrice,
  discountedPrice,
  discount,
  productId = 1,
  onWishlistToggle,
  isInWishlist: isInWishlistProp,
  availableStock = 999,
}: ProductCardProps) {
  const isOutOfStock = availableStock === 0;
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(0); // Actual quantity in cart
  const [addingToCart, setAddingToCart] = useState(false);
  const router = useRouter();
  const {
    addToCart,
    cart,
    removeItem,
    updateQuantity: updateCartQuantity,
    localCart,
  } = useCart();
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist: checkIsInWishlist,
  } = useWishlist();
  const { user } = useAuth();

  // Check if product is in wishlist using context or prop
  const isInWishlist =
    isInWishlistProp !== undefined
      ? isInWishlistProp
      : checkIsInWishlist(Number(productId));

  // Fetch cart quantity for this product (check both database and localStorage)
  useEffect(() => {
    // For logged-in users, check database cart
    if (user && cart?.CartItems) {
      const cartItem = cart.CartItems.find(
        (item) => item.productId === Number(productId)
      );
      if (cartItem) {
        setCartQuantity(cartItem.quantity);
        setQuantity(cartItem.quantity);
      } else {
        setCartQuantity(0);
        setQuantity(1);
      }
    } else if (!user) {
      // For non-logged-in users, use localCart from context (reactive)
      const cartItem = localCart.find(
        (item) => item.productId === Number(productId)
      );
      if (cartItem) {
        setCartQuantity(cartItem.quantity);
        setQuantity(cartItem.quantity);
      } else {
        setCartQuantity(0);
        setQuantity(1);
      }
    } else {
      setCartQuantity(0);
      setQuantity(1);
    }
  }, [cart, productId, user, localCart]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await addToCart(Number(productId), quantity);
      setQuantity(1);
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartQuantity > 0) {
      router.push("/cart");
    } else {
      handleAddToCart();
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If parent provides wishlist handler, use it
    if (onWishlistToggle) {
      onWishlistToggle();
      return;
    }

    // Toggle wishlist: remove if already in wishlist, add if not
    try {
      if (isInWishlist) {
        await removeFromWishlist(Number(productId));
      } else {
        await addToWishlist(Number(productId));
      }
    } catch (error) {
      console.error("Wishlist error:", error);
    }
  };

  const incrementQuantity = () => {
    if (quantity < availableStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleDecrease = async () => {
    // If product is in cart, decrease quantity or remove
    if (cartQuantity > 0) {
      try {
        setAddingToCart(true);

        if (cartQuantity === 1) {
          // Remove item from cart if quantity is 1
          if (user && cart?.CartItems) {
            const cartItem = cart.CartItems.find(
              (item) => item.productId === Number(productId)
            );
            if (cartItem) {
              await removeItem(cartItem.id);
            }
          } else {
            // For non-logged-in users, use productId
            await removeItem(Number(productId), Number(productId));
          }
        } else {
          // Decrease quantity by 1
          if (user && cart?.CartItems) {
            const cartItem = cart.CartItems.find(
              (item) => item.productId === Number(productId)
            );
            if (cartItem) {
              await updateCartQuantity(cartItem.id, cartItem.quantity - 1);
            }
          } else {
            // For non-logged-in users, use productId
            await updateCartQuantity(Number(productId), cartQuantity - 1, Number(productId));
          }
        }
      } catch (error) {
        console.error("Error updating cart:", error);
      } finally {
        setAddingToCart(false);
      }
    } else {
      // Just decrease local quantity display if not in cart
      decrementQuantity();
    }
  };

  const handleIncrease = async () => {
    // If product is in cart, increase quantity in cart
    if (cartQuantity > 0 && cartQuantity < availableStock) {
      try {
        setAddingToCart(true);
        // Increase quantity by 1
        if (user && cart?.CartItems) {
          const cartItem = cart.CartItems.find(
            (item) => item.productId === Number(productId)
          );
          if (cartItem) {
            await updateCartQuantity(cartItem.id, cartItem.quantity + 1);
          }
        } else {
          // For non-logged-in users, use productId
          await updateCartQuantity(Number(productId), cartQuantity + 1, Number(productId));
        }
      } catch (error) {
        console.error("Error updating cart:", error);
      } finally {
        setAddingToCart(false);
      }
    } else {
      // Just increase local quantity display if not in cart
      incrementQuantity();
    }
  };

  return (
    // Compact mobile design with responsive sizing
    <div className="w-full p-1.5 md:p-2 border border-accent rounded-md overflow-hidden hover:shadow-md transition-shadow bg-white relative">
      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-0 left-0 right-0 bg-accent text-white text-center py-1 z-10">
          <span className="text-[10px] md:text-xs font-bold">OUT OF STOCK</span>
        </div>
      )}

      {/* Image - Smaller aspect ratio on mobile */}
      <Link href={`/product/${productId}`}>
        <div
          className={`relative aspect-square md:aspect-4/3 bg-secondary cursor-pointer overflow-hidden rounded-sm ${
            isOutOfStock ? "opacity-60" : ""
          }`}
        >
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
          
          <button
                onClick={handleAddToWishlist}
                className="absolute top-2 right-2 md:top-4 md:right-4 bg-white rounded-full p-1.5 md:p-2 shadow-md hover:bg-gray-100 transition-colors"
              >
                <Heart
                  size={16}
                  className={`transition-colors cursor-pointer ${
                    isInWishlist
                      ? "text-accent fill-accent"
                      : "text-accent hover:fill-accent"
                  }`}
                />
              </button>
        </div>
      </Link>

      {/* Product Info - Minimal padding */}
      <div className="p-1 md:p-2">
        {/* Title - Smaller text on mobile */}
        <Link href={`/product/${productId}`}>
          <h3 className="font-bold text-[11px] md:text-base lg:text-xl text-dark leading-tight mb-0.5 truncate hover:text-accent transition-colors">
            {title}
          </h3>
        </Link>

        {/* Description - Hide on extra small screens */}
        <p className="text-[9px] md:text-xs lg:text-sm text-gray-500 mb-1 md:mb-1.5 line-clamp-1">
          {description}
        </p>

        {/* Price - Compact on mobile */}
        <div className="flex items-center gap-1 md:gap-1.5 mb-1.5 md:mb-2 flex-wrap">
          <span className="text-xs md:text-sm lg:text-base font-extrabold text-dark">
            ₹{discountedPrice || originalPrice}
          </span>
          {discountedPrice && discountedPrice < originalPrice && (
            <>
              <span className="text-[9px] md:text-xs lg:text-sm text-gray-400 line-through">
                ₹{originalPrice}
              </span>
              {discount && (
                <span className="text-[9px] md:text-xs lg:text-sm text-green-600 font-semibold">
                  {discount}%
                </span>
              )}
            </>
          )}
        </div>
        {/* Cart Controls - Very compact on mobile */}
        {/* Unified Cart Controls Design */}
        <div className="flex items-center w-full mt-1.5 md:mt-2">
          <div
            className={`flex items-center w-full border-2 rounded-lg overflow-hidden h-8 md:h-9 lg:h-10 ${
              isOutOfStock
                ? "border-gray-300 bg-gray-100"
                : "border-accent bg-white"
            }`}
          >
            {/* Minus Button: Decrease Local or Cart Quantity */}
            <button
              onClick={handleDecrease}
              disabled={isOutOfStock || addingToCart || (cartQuantity === 0 && quantity <= 1)}
              className={`flex items-center justify-center px-1.5 md:px-2 lg:px-3 h-full border-r-2 transition-colors ${
                isOutOfStock
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "text-accent hover:bg-accent/5 border-accent"
              }`}
              aria-label="Decrease quantity"
            >
              <Minus size={14} strokeWidth={3} className="md:w-4 md:h-4" />
            </button>

          
            <button
              onClick={handleClick} // Use the new wrapper function
              disabled={
                addingToCart || isOutOfStock || cartQuantity >= availableStock
              }
              className={`flex-1 cursor-pointer h-full text-center text-[10px] md:text-xs lg:text-sm font-bold uppercase tracking-wide transition-colors ${
                isOutOfStock
                  ? " cursor-not-allowed bg-transparent hover:bg-accent/5 text-accent "
                  : addingToCart
                  ? "bg-accent/10 text-accent"
                  : cartQuantity > 0
                  ? "  hover:bg-accent/10 text-accent" 
                  : " hover:bg-accent/10 text-accent"
              }`}
            >
              {isOutOfStock ? (
                <span>UNAVAILABLE</span>
              ) : addingToCart ? (
                <span className="animate-pulse">ADDING...</span>
              ) : (
                <span className="flex items-center justify-center h-full">
                  {cartQuantity > 0
                    ? `VIEW Cart (${cartQuantity})`
                    : quantity > 1
                    ? `ADD ${quantity}`
                    : "ADD"}
                </span>
              )}
            </button>

            {/* Plus Button: Increase Local or Cart Quantity */}
            <button
              onClick={handleIncrease}
              disabled={
                isOutOfStock ||
                addingToCart ||
                cartQuantity >= availableStock ||
                quantity >= availableStock
              }
              className={`flex items-center justify-center px-1.5 md:px-2 lg:px-3 h-full border-l-2 transition-colors ${
                isOutOfStock
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "text-accent hover:bg-accent/5 border-accent"
              }`}
              aria-label="Increase quantity"
            >
              <Plus size={14} strokeWidth={3} className="md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
