import Link from "next/link";

export default function ShippingPage() {
  return (
    <main className="bg-secondary  px-4 py-16">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-10 shadow-lg">
        <h1 className="mb-2 text-4xl font-bold text-[var(--primary)]">
          Shipping & Delivery Policy
        </h1>

        <p className="mb-6 text-sm text-[var(--accent)]">Last Updated:</p>

        <p className="mb-6 leading-relaxed text-[var(--dark)]">
          This Shipping & Delivery Policy outlines how MIORISH processes and
          delivers orders placed through <Link href="https://www.miorish.com" className="text-accent">www.miorish.com</Link>.
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            1. Order Processing
          </h2>
          <ul className="list-disc pl-6 text-[var(--dark)]">
            <li>Orders are processed within <strong>2–5 business days</strong> after confirmation.</li>
            <li>
              Custom, bulk, or B2B orders may require additional processing time,
              which will be communicated separately.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            2. Shipping Coverage
          </h2>
          <p className="text-[var(--dark)]">
            MIORISH currently delivers across <strong>India</strong>.
          </p>
          <p className="mt-2 text-[var(--dark)]">
            International shipping, if applicable, will be handled on a
            case-by-case basis.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            3. Shipping Partners
          </h2>
          <p className="text-[var(--dark)]">
            MIORISH works with reliable third-party logistics providers to ensure
            safe and timely delivery. Delivery timelines may vary depending on
            location and external factors.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            4. Estimated Delivery Time
          </h2>
          <ul className="list-disc pl-6 text-[var(--dark)]">
            <li>Metro cities: <strong>3–7 business days</strong></li>
            <li>Non-metro / remote areas: <strong>5–10 business days</strong></li>
          </ul>
          <p className="mt-3 text-[var(--dark)]">
            Delivery timelines are indicative and may vary due to unforeseen
            circumstances.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            5. Shipping Charges
          </h2>
          <p className="text-[var(--dark)]">
            Shipping charges, if applicable, will be displayed at checkout or
            communicated during order confirmation for B2B and bulk orders.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            6. Damaged or Delayed Shipments
          </h2>
          <p className="mb-3 text-[var(--dark)]">
            In case of damaged delivery:
          </p>
          <ul className="list-disc pl-6 text-[var(--dark)]">
            <li>Notify MIORISH within <strong>48 hours</strong> of receipt</li>
            <li>Share clear images of the packaging and product</li>
          </ul>
          <p className="mt-3 text-[var(--dark)]">
            MIORISH will coordinate with the logistics partner to resolve the issue.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            7. Address Accuracy
          </h2>
          <p className="text-[var(--dark)]">
            Customers are responsible for providing accurate shipping details.
            MIORISH is not responsible for delays or non-delivery due to incorrect
            address information.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="mb-3 text-2xl font-semibold text-[var(--primary)]">
            8. Contact for Shipping Queries
          </h2>
          <p className="text-[var(--dark)]">
            For shipping-related questions, please contact:
          </p>
          <p className="mt-2 font-medium text-[var(--primary)]">
            support@miorish.com
          </p>
        </section>
      </div>
    </main>
  );
}
