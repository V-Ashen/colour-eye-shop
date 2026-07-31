import React from "react";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day hassle-free exchange policy for any damaged or defective items. Please contact our support team immediately upon receiving your order."
    },
    {
      question: "Do you offer Cash on Delivery (COD)?",
      answer: "Yes! We offer secure Cash on Delivery for all locations within Sri Lanka."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 2-4 business days depending on your location."
    },
    {
      question: "Can I customize a photo frame?",
      answer: "Absolutely! Many of our frames and products support custom reference image uploads during checkout. Just select a customizable product and upload your image."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-semibold text-[var(--foreground)] mb-4 tracking-wide text-center" style={{ fontFamily: "var(--font-serif)" }}>
          Frequently Asked Questions
        </h1>
        <p className="text-[var(--muted)] text-center mb-12 max-w-xl mx-auto">
          Find answers to common questions about our products, shipping, and return policies.
        </p>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-black/5 border border-[var(--border)] rounded-2xl p-6 transition-all hover:border-[var(--accent)]">
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                {faq.question}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
