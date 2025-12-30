import Link from "next/link";

export default function RefundCancellationPage() {
  return (
    <main className=" bg-secondary px-4 py-16">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-10 shadow-lg">
        <h1 className="mb-2 text-4xl font-bold text-[var(--primary)]">
          Refund & Cancellation Policy
        </h1>

        <p className="mb-6 text-sm text-[var(--accent)]">Last Updated:</p>

        <p className="mb-6 leading-relaxed text-[var(--dark)]">
          This Refund & Cancellation Policy applies to purchases, orders, and
          enquiries made through{" "}
          <Link href="https://www.miorish.com" className="text-accent">
            www.miorish.com
          </Link>
          .
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            1. Nature of Products
          </h2>
          <p className="mb-3 text-[var(--dark)]">
            MIORISH offers premium, handcrafted candles including:
          </p>
          <ul className="mb-4 list-disc pl-6 text-[var(--dark)]">
            <li>Retail products</li>
            <li>Corporate gifting</li>
            <li>Hospitality supply</li>
            <li>Customised and bulk orders</li>
          </ul>
          <p className="text-[var(--dark)]">
            Due to the handcrafted and often customised nature of our products,
            certain conditions apply to refunds and cancellations.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            2. Order Cancellation
          </h2>

          <p className="mb-1 font-medium text-dark">
            a) Standard Orders
          </p>
          <p className="mb-4 text-dark">
            Cancellations may be requested within 24 hours of order placement,
            provided the order has not been processed or dispatched.
          </p>

          <p className="mb-1 font-medium text-dark">
            b) Custom / Bulk / B2B Orders
          </p>
          <p className="text-[var(--dark)]">
            Orders involving custom fragrances, branding, bulk quantities, or
            corporate gifting cannot be cancelled once confirmed.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            3. Refund Eligibility
          </h2>
          <p className="mb-3 text-[var(--dark)]">
            Refunds may be considered in the following cases:
          </p>
          <ul className="mb-4 list-disc pl-6 text-[var(--dark)]">
            <li>Product received is damaged during transit</li>
            <li>Product received is incorrect</li>
          </ul>
          <p className="text-[var(--dark)]">
            To be eligible, customers must notify MIORISH within 48 hours of
            delivery along with supporting images.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            4. Non-Refundable Cases
          </h2>
          <p className="mb-3 text-[var(--dark)]">
            Refunds will not be provided for:
          </p>
          <ul className="list-disc pl-6 text-[var(--dark)]">
            <li>Change of mind</li>
            <li>
              Minor variations in colour, fragrance, or finish (due to
              handcrafted nature)
            </li>
            <li>Products damaged due to misuse or mishandling</li>
            <li>Customised, bulk, or made-to-order items</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            5. Refund Process
          </h2>
          <p className="text-[var(--dark)]">
            Approved refunds will be processed using the original mode of
            payment within 7–10 business days, subject to banking timelines.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            6. Contact for Refund Requests
          </h2>
          <p className="text-[var(--dark)]">
            All refund or cancellation requests must be sent to:
          </p>
          <p className="mt-2 font-medium text-[var(--primary)]">
            support@miorish.com
          </p>
        </section>
      </div>
    </main>
  );
}
