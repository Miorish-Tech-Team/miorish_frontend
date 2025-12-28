"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  addToWishlist,
  removeFromWishlistByProductId,
  getUserWishlist,
} from "@/services/wishlistService";
import { toast } from "react-hot-toast";

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
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [cartQuantity, setCartQuantity] = useState(0); // Actual quantity in cart
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(isInWishlistProp || false);
  const [wishlistItemId, setWishlistItemId] = useState<number | null>(null);
  const { addToCart, cart, removeItem, updateQuantity: updateCartQuantity } = useCart();
  const { user } = useAuth();

  // Fetch cart quantity for this product
  useEffect(() => {
    if (cart?.CartItems) {
      const cartItem = cart.CartItems.find(item => item.productId === Number(productId));
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
  }, [cart, productId]);

  // Fetch wishlist status on mount if user is logged in and prop not provided
  useEffect(() => {
    if (isInWishlistProp !== undefined) {
      setIsInWishlist(isInWishlistProp);
      return;
    }

    if (user) {
      const checkWishlist = async () => {
        try {
          const response = await getUserWishlist();
          const wishlistItem = response.wishlist.find(
            (item) => item.productId === Number(productId)
          );
          if (wishlistItem) {
            setIsInWishlist(true);
            setWishlistItemId(wishlistItem.id);
          }
        } catch (error) {
          // Silently fail
        }
      };
      checkWishlist();
    }
  }, [user, productId, isInWishlistProp]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

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

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    // If parent provides wishlist handler, use it
    if (onWishlistToggle) {
      onWishlistToggle();
      return;
    }

    // Toggle wishlist: remove if already in wishlist, add if not
    try {
      if (isInWishlist) {
        // Remove from wishlist using product ID
        await removeFromWishlistByProductId(Number(productId));
        setIsInWishlist(false);
        setWishlistItemId(null);
        toast.success("Removed from wishlist!");
      } else {
        // Add to wishlist
        const response = await addToWishlist(Number(productId));
        setIsInWishlist(true);
        setWishlistItemId(response.wishlistItem.id);
        toast.success("Added to wishlist!");
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message = err.response?.data?.message;
      if (message?.includes("already in wishlist")) {
        setIsInWishlist(true);
        toast("Already in wishlist", { icon: "ℹ️" });
      } else {
        toast.error(message || "Failed to update wishlist");
      }
    }
  };

  const incrementQuantity = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    // Add to cart when clicking plus
    try {
      setAddingToCart(true);
      await addToCart(Number(productId), 1); // Add 1 more to cart
    } catch (error) {
      console.error("Add to cart error:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const decrementQuantity = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    // If product is in cart, decrease quantity or remove
    if (cartQuantity > 0 && cart?.CartItems) {
      const cartItem = cart.CartItems.find(item => item.productId === Number(productId));
      
      if (cartItem) {
        try {
          setAddingToCart(true);
          
          if (cartItem.quantity === 1) {
            // Remove item from cart if quantity is 1 (toast handled by CartContext)
            await removeItem(cartItem.id);
          } else {
            // Decrease quantity by 1 (toast handled by CartContext)
            await updateCartQuantity(cartItem.id, cartItem.quantity - 1);
          }
        } catch (error) {
          console.error("Error updating cart:", error);
        } finally {
          setAddingToCart(false);
        }
      }
    } else {
      // Just decrease local quantity display if not in cart
      setQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  return (
    // Reduced outer padding (p-1.5) and max-width to keep it compact
    <div className="min-w-[200px] max-w-[250px] p-1 border border-accent rounded-md overflow-hidden hover:shadow-md transition-shadow bg-white">
      {/* Image - Smaller aspect ratio/height */}
      <Link href={`/product/${productId}`}>
        <div className="relative aspect-4/3 bg-secondary cursor-pointer overflow-hidden rounded-sm">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
          <button
            className="bg-white/80 absolute top-1.5 right-1.5 rounded-full p-1 hover:bg-white transition-colors shadow-sm"
            onClick={handleAddToWishlist}
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

      {/* Content - Reduced padding and smaller typography */}
      <div className="pt-2 px-1">
        <Link href={`/product/${productId}`}>
          <h3 className="font-bold text-xs md:text-xl text-dark leading-tight mb-0.5 truncate hover:text-accent transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-[10px] md:text-sm text-gray-500 mb-1.5 line-clamp-1">
          {description}
        </p>

        {/* Price - Tightened spacing */}
        <div className="flex items-center gap-1.5 mb-2 flex-wrap">
          <span className="text-sm font-extrabold text-dark">
            ₹{discountedPrice || originalPrice}
          </span>
          {discountedPrice && discountedPrice < originalPrice && (
            <>
              <span className="text-[10px] md:text-sm text-gray-400 line-through">
                ₹{originalPrice}
              </span>
              {discount && (
                <span className="text-[10px] md:text-sm text-green-600 font-semibold">
                  {discount}%
                </span>
              )}
            </>
          )}
        </div>

        {/* Actions - More compact buttons */}
        {/* Actions Section */}
        <div className="flex items-center w-full mt-2">
          <div className="flex items-center w-full border-2 border-accent rounded-lg overflow-hidden bg-white h-9 md:h-10">
            {/* Minus Button */}
            <button
              onClick={decrementQuantity}
              className="flex items-center justify-center px-2 md:px-3 h-full text-accent hover:bg-accent/5 transition-colors border-r-2 border-accent"
              aria-label="Decrease quantity"
            >
              <Minus size={16} strokeWidth={3} />
            </button>

            {/* Center Action/Display */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className={`flex-1 h-full text-center text-xs md:text-sm font-bold uppercase tracking-wide transition-colors ${
                addingToCart
                  ? "bg-accent/10"
                  : "bg-transparent hover:bg-accent/5"
              } text-accent`}
            >
              {addingToCart ? (
                <span className="animate-pulse">...</span>
              ) : (
                <span className="flex items-center justify-center h-full">
                  {cartQuantity > 0 ? cartQuantity : "ADD"}
                </span>
              )}
            </button>

            {/* Plus Button */}
            <button
              onClick={incrementQuantity}
              className="flex items-center justify-center px-2 md:px-3 h-full text-accent hover:bg-accent/5 transition-colors border-l-2 border-accent"
              aria-label="Increase quantity"
            >
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
