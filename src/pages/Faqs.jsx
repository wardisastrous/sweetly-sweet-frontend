export default function Faqs() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl mb-8">
        Frequently Asked Questions
      </h1>

      <div className="space-y-6">
        <div>
          <h3 className="font-semibold">
            How long do chocolates stay fresh?
          </h3>
          <p>Most chocolates stay fresh for 2–4 weeks.</p>
        </div>

        <div>
          <h3 className="font-semibold">
            Do you deliver across India?
          </h3>
          <p>Yes, we deliver to most serviceable locations.</p>
        </div>

        <div>
          <h3 className="font-semibold">
            What payment methods do you accept?
          </h3>
          <p>UPI, cards, net banking, and Razorpay payments.</p>
        </div>
      </div>
    </div>
  );
}