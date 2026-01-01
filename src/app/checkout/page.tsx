"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Loader2,
  MapPin,
  CreditCard,
  Check,
  Plus,
  Truck,
  Package,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getUserAddresses, type Address } from "@/services/addressService";
import {
  buyNow,
  placeOrderFromCart,
  createRazorpayOrderForBuyNow,
  createRazorpayOrderForCart,
  verifyRazorpayBuyNowPayment,
  verifyRazorpayCartPayment,
} from "@/services/orderService";
import { getDeliveryEstimate, type DeliveryEstimate } from "@/services/deliveryService";
import { toast } from "react-hot-toast";
import AddressFormModal from "@/components/modals/AddressFormModal";
import CandleLoader from "@/components/CandleLoader";

type PaymentMethod = "CashOnDelivery" | "Razorpay";

// Add interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

// Generate a unique idempotency key
const generateIdempotencyKey = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const checkoutType = searchParams.get("type"); // 'cart' or 'buynow'
  const { cart, summary, refreshCart } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("CashOnDelivery");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [showAddressManager, setShowAddressManager] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failure" | null
  >(null);
  const [completedOrderId, setCompletedOrderId] = useState<number | null>(null);
  
  // Delivery estimation state
  const [deliveryEstimate, setDeliveryEstimate] = useState<DeliveryEstimate | null>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);

  // Idempotency key for preventing duplicate orders
  const [idempotencyKey, setIdempotencyKey] = useState<string>("");

  // Buy Now data from session storage
  const [buyNowData, setBuyNowData] = useState<{
    productId: number;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
    product: {
      id: number;
      productName: string;
      coverImageUrl: string;
      productPrice: number;
      productDiscountPrice?: number;
    };
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // If buy now, get data from session storage
        if (checkoutType === "buynow") {
          const data = sessionStorage.getItem("buyNowData");
          if (data) {
            setBuyNowData(JSON.parse(data));
          } else {
            toast.error("No product data found");
            router.push("/categories");
            return;
          }
        }

        // Fetch addresses
        const addressesRes = await getUserAddresses();
        setAddresses(addressesRes.addresses);

        // Auto-select default address
        const defaultAddr = addressesRes.addresses.find(
          (addr) => addr.isDefault
        );
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (addressesRes.addresses.length > 0) {
          setSelectedAddressId(addressesRes.addresses[0].id);
        }
      } catch (error: unknown) {
        console.error("Error loading checkout data:", error);
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
            toast.error("Please login to continue");
            router.push("/auth/login");
          } else {
            toast.error("Failed to load checkout data");
          }
        } else {
          toast.error("Failed to load checkout data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [checkoutType, router]);

  // Calculate totals using useMemo
  const { itemsToShow, subtotal, total } = useMemo(() => {
    let items: Array<{
      id: number;
      name: string;
      image: string;
      price: number;
      quantity: number;
    }> = [];
    let sub = 0;

    if (checkoutType === "buynow" && buyNowData) {
      const product = buyNowData.product;
      const price = product.productDiscountPrice || product.productPrice;
      sub = price * buyNowData.quantity;
      items = [
        {
          id: product.id,
          name: product.productName,
          image: product.coverImageUrl,
          price,
          quantity: buyNowData.quantity,
        },
      ];
    } else {
      items = (cart?.CartItems || []).map((item) => ({
        id: item.Product.id,
        name: item.Product.productName,
        image: item.Product.coverImageUrl,
        price: item.Product.productDiscountPrice || item.Product.productPrice,
        quantity: item.quantity,
      }));
      sub = summary.totalPrice;
    }

    return {
      itemsToShow: items,
      subtotal: sub,
      total: sub,
    };
  }, [checkoutType, buyNowData, cart, summary]);

  // Fetch delivery estimate when address changes
  useEffect(() => {
    const fetchDeliveryEstimate = async () => {
      if (!selectedAddressId) {
        setDeliveryEstimate(null);
        return;
      }

      try {
        setLoadingEstimate(true);
        const orderTotal = total; // Use the calculated total
        const response = await getDeliveryEstimate(selectedAddressId, orderTotal);
        setDeliveryEstimate(response.estimate);
      } catch (error: any) {
        console.error("Error fetching delivery estimate:", error);
        // Don't show error toast for India-only restriction, handle silently
        if (error?.response?.data?.message?.includes("India")) {
          setDeliveryEstimate(null);
        } else {
          toast.error("Unable to calculate delivery estimate");
        }
      } finally {
        setLoadingEstimate(false);
      }
    };

    fetchDeliveryEstimate();
  }, [selectedAddressId, total]);

  // Refresh addresses when modal closes
  const handleAddressAdded = async () => {
    try {
      const addressesRes = await getUserAddresses();
      setAddresses(addressesRes.addresses);

      // Auto-select newly added address if it's default
      const defaultAddr = addressesRes.addresses.find((addr) => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else if (addressesRes.addresses.length > 0 && !selectedAddressId) {
        // If no address was selected, select the first one
        setSelectedAddressId(addressesRes.addresses[0].id);
      }
    } catch (error) {
      console.error("Error refreshing addresses:", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      setPlacing(true);

      // Generate idempotency key for this order attempt
      const orderIdempotencyKey = generateIdempotencyKey();
      setIdempotencyKey(orderIdempotencyKey);

      // If COD, place order directly
      if (paymentMethod === "CashOnDelivery") {
        if (checkoutType === "buynow" && buyNowData) {
          const response = await buyNow({
            productId: buyNowData.productId,
            quantity: buyNowData.quantity,
            addressId: selectedAddressId,
            paymentMethod: "CashOnDelivery",
            shippingCost: deliveryEstimate?.shippingCost || 0,
            idempotencyKey: orderIdempotencyKey,
          });

          toast.success(
            `Order placed successfully! Order ID: ${response.orderId}`
          );
          sessionStorage.removeItem("buyNowData");
          router.push(`/orders/${response.order.id}`);
        } else {
          const response = await placeOrderFromCart({
            addressId: selectedAddressId,
            paymentMethod: "CashOnDelivery",
            shippingCost: deliveryEstimate?.shippingCost || 0,
            idempotencyKey: orderIdempotencyKey,
          });

          toast.success(
            `Order placed successfully! Order ID: ${response.uniqueOrderId}`
          );
          await refreshCart();
          router.push(`/orders/${response.order.id}`);
        }
      } else {
        // Razorpay payment
        await handleRazorpayPayment();
      }
    } catch (error: unknown) {
      console.error("Error placing order:", error);
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      toast.error(message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      // Generate idempotency key for this order attempt
      const orderIdempotencyKey = generateIdempotencyKey();
      setIdempotencyKey(orderIdempotencyKey);

      let razorpayOrderData;

      // Create Razorpay order
      if (checkoutType === "buynow" && buyNowData) {
        razorpayOrderData = await createRazorpayOrderForBuyNow({
          productId: buyNowData.productId,
          quantity: buyNowData.quantity,
          addressId: selectedAddressId!,
          shippingCost: deliveryEstimate?.shippingCost || 0,
        });
      } else {
        razorpayOrderData = await createRazorpayOrderForCart({
          addressId: selectedAddressId!,
          shippingCost: deliveryEstimate?.shippingCost || 0,
        });
      }

      // Load Razorpay script if not loaded
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => {
          script.onload = resolve;
        });
      }

      // Configure Razorpay options
      const options = {
        key: razorpayOrderData.keyId,
        amount: razorpayOrderData.amount,
        currency: razorpayOrderData.currency,
        name: "Miorish",
        description:
          checkoutType === "buynow" ? "Product Purchase" : "Cart Checkout",
        order_id: razorpayOrderData.orderId,
        theme: {
          color: "#D4B996", // Your website's accent color
        },
        handler: async (response: any) => {
          // Payment successful
          try {
            let verifyResponse;

            if (checkoutType === "buynow" && buyNowData) {
              verifyResponse = await verifyRazorpayBuyNowPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                productId: buyNowData.productId,
                quantity: buyNowData.quantity,
                addressId: selectedAddressId!,
                shippingCost: deliveryEstimate?.shippingCost || 0,
                idempotencyKey: orderIdempotencyKey,
              });
              sessionStorage.removeItem("buyNowData");
            } else {
              verifyResponse = await verifyRazorpayCartPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                addressId: selectedAddressId!,
                shippingCost: deliveryEstimate?.shippingCost || 0,
                idempotencyKey: orderIdempotencyKey,
              });
              await refreshCart();
            }

            setCompletedOrderId(verifyResponse.order.id);
            setPaymentStatus("success");
            setShowPaymentModal(true);
            setPlacing(false);
          } catch (error) {
            console.error("Payment verification error:", error);
            setPaymentStatus("failure");
            setShowPaymentModal(true);
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPlacing(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      toast.error("Failed to initiate payment");
      setPlacing(false);
    }
  };

  if (loading) {
    return <CandleLoader />;
  }

  const shipping = deliveryEstimate?.shippingCost || 0;
  const finalTotal = subtotal + shipping;

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 md:px-8 lg:px-14 py-4 md:py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-accent hover:underline font-medium">
            Home
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
          {checkoutType === "cart" && (
            <>
              <Link
                href="/account/cart"
                className="text-accent hover:underline font-medium"
              >
                Cart
              </Link>
              <ChevronRight size={16} className="text-gray-400" />
            </>
          )}
          <span className="text-gray-700 font-medium">Checkout</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-serif text-gray-900 mb-6">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin size={20} className="text-accent" />
                  Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddressManager(true)}
                  className="text-sm text-accent hover:underline font-medium flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add New
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No addresses found</p>
                  <button
                    onClick={() => setShowAddressManager(true)}
                    className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? "border-accent bg-accent/5"
                          : "border-gray-200 hover:border-accent/50"
                      }`}
                      onClick={() => setSelectedAddressId(addr.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedAddressId === addr.id
                                ? "border-accent bg-accent"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedAddressId === addr.id && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {addr.recipientName}
                            </h3>
                            {addr.isDefault && (
                              <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {addr.street}, {addr.city}, {addr.state} -{" "}
                            {addr.postalCode}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Phone: {addr.phoneNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <CreditCard size={20} className="text-accent" />
                Payment Method
              </h2>

              <div className="space-y-3">
                {(["CashOnDelivery", "Razorpay"] as PaymentMethod[]).map(
                  (method) => {
                    const isOnlineDisabled = method === "Razorpay"; // Define the disabled condition

                    return (
                      <div
                        key={method}
                        className={`border-2 rounded-lg p-4 transition-all ${
                          isOnlineDisabled
                            ? "opacity-60 cursor-not-allowed border-gray-100 bg-gray-50" // Disabled Style
                            : paymentMethod === method
                            ? "border-accent bg-accent/5 cursor-pointer"
                            : "border-gray-200 hover:border-accent/50 cursor-pointer"
                        }`}
                        onClick={() =>
                          !isOnlineDisabled && setPaymentMethod(method)
                        } // Prevent selection
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                !isOnlineDisabled && paymentMethod === method
                                  ? "border-accent bg-accent"
                                  : "border-gray-300"
                              }`}
                            >
                              {!isOnlineDisabled &&
                                paymentMethod === method && (
                                  <Check size={14} className="text-white" />
                                )}
                            </div>
                            <span
                              className={`font-medium ${
                                isOnlineDisabled
                                  ? "text-gray-400"
                                  : "text-gray-900"
                              }`}
                            >
                              {method === "CashOnDelivery"
                                ? "Cash on Delivery (COD)"
                                : "Pay Online with Razorpay"}
                            </span>
                          </div>

                          {/* Optional: Add a small badge for the disabled state */}
                          {isOnlineDisabled && (
                            <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-1 rounded uppercase tracking-wider font-bold">
                              Temporarily Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-4 pb-4 border-b">
                {itemsToShow.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 shrink-0 bg-gray-100 rounded overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        Rs.{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="space-y-2 mb-4 pb-4 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-primary">
                    Rs.{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  {loadingEstimate ? (
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Calculating...
                    </span>
                  ) : deliveryEstimate ? (
                    <span className={deliveryEstimate.isFreeShipping ? "text-green-600 font-medium" : "text-gray-900 font-medium"}>
                      {deliveryEstimate.isFreeShipping ? "FREE" : `Rs.${deliveryEstimate.shippingCost.toFixed(2)}`}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Select address</span>
                  )}
                </div>
                {deliveryEstimate && (
                  <>
                    <div className="flex justify-between text-xs text-gray-500 items-center">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        Estimated Delivery
                      </span>
                      <span className="font-medium text-accent">
                        {deliveryEstimate.deliveryDays} {deliveryEstimate.deliveryDays === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                    {/* {deliveryEstimate.distanceText && (
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Distance</span>
                        <span>{deliveryEstimate.distanceText}</span>
                      </div>
                    )} */}
                  </>
                )}
                {deliveryEstimate && deliveryEstimate.isFreeShipping && subtotal < 1000 && (
                  <div className="text-xs text-green-600 mt-1">
                    🎉 You got free shipping!
                  </div>
                )}
                {!deliveryEstimate?.isFreeShipping && subtotal < 1000 && deliveryEstimate && (
                  <div className="text-xs text-gray-500 mt-1">
                    💡 Add Rs.{(1000 - subtotal).toFixed(2)} more for free shipping
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-2xl font-bold text-accent">
                  Rs.{finalTotal.toFixed(2)}
                </span>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={!selectedAddressId || placing}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  selectedAddressId && !placing
                    ? "bg-accent text-white hover:bg-opacity-90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {placing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
              <Link
                href="/policies/shipping_delivery"
                className="text-accent text-center text-sm block mt-2 hover:font-bold transition-all"
              >
                Read our Shipping and Delivery Policy.
              </Link>

              {!selectedAddressId && (
                <p className="text-xs text-red-600 text-center mt-2">
                  Please select a delivery address
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address Form Modal */}
        <AddressFormModal
          isOpen={showAddressManager}
          onClose={() => setShowAddressManager(false)}
          onAddressAdded={handleAddressAdded}
        />

        {/* Payment Status Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {paymentStatus === "success" ? (
                <>
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={40} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Successful!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your payment was successful and your order has been placed.
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        router.push(`/orders/${completedOrderId}`);
                      }}
                      className="w-full bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                    >
                      View Order
                    </button>
                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        router.push("/categories");
                      }}
                      className="w-full border-2 border-accent text-accent px-6 py-3 rounded-lg font-medium hover:bg-accent/5 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-10 h-10 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Failed!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Unfortunately, your payment could not be processed. Please
                    try again.
                  </p>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentStatus(null);
                    }}
                    className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CandleLoader />}>
      <CheckoutForm />
    </Suspense>
  );
}
