export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-8">
        Shipping Policy
      </h1>

      <ul className="space-y-4 text-gray-700">
        <li>Orders are processed within 1–2 business days.</li>
        <li>Delivery takes 3–7 business days.</li>
        <li>Free shipping on orders above ₹499.</li>
        <li>Tracking details are shared after dispatch.</li>
      </ul>
    </div>
  );
}