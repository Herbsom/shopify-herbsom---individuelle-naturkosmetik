import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useTranslation } from "react-i18next";

export default function Withdrawal() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    orderNumber: '',
    email: '',
    fullName: '',
    address: '',
    phone: '',
    reason: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just show a success message
      console.log('Withdrawal form submitted:', formData);
      
      toast.success('Widerrufsantrag erfolgreich eingereicht. Wir werden uns in Kürze bei Ihnen melden.');
      
      // Reset form
      setFormData({
        orderNumber: '',
        email: '',
        fullName: '',
        address: '',
        phone: '',
        reason: '',
        message: '',
      });
    } catch (error) {
      toast.error('Es gab einen Fehler beim Einreichen des Formulars. Bitte versuchen Sie es später erneut.');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-stone-50 to-background pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="container max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-light mb-4">Widerrufsformular</h1>
          <p className="text-lg text-muted-foreground">
            Nutzen Sie dieses Formular, um Ihre Bestellung zu widerrufen. Gemäß § 355 BGB haben Sie das Recht, Ihre Bestellung innerhalb von 14 Tagen ohne Angabe von Gründen zu widerrufen.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-2 md:py-3">
        <div className="container max-w-3xl">
          {/* Information Box */}
          <div className="bg-stone-50 p-6 rounded-lg border border-stone-200 mb-8">
            <h2 className="text-lg font-semibold mb-4">Wichtige Informationen</h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-semibold">•</span>
                <span><strong>Widerrufsfrist:</strong> 14 Tage ab Erhalt der Ware</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-semibold">•</span>
                <span><strong>Bedingung:</strong> Die Ware muss ungeöffnet und in Originalverpackung sein</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-semibold">•</span>
                <span><strong>Rücksendekosten:</strong> Der Kunde trägt die Kosten für die Rücksendung</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-semibold">•</span>
                <span><strong>Rückerstattung:</strong> Erfolgt auf das gleiche Zahlungsmittel innerhalb von 14 Tagen nach Erhalt der Rücksendung</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-semibold">•</span>
                <span><strong>Hygiene:</strong> Geöffnete oder benutzte Kosmetikprodukte können nicht zurückgenommen werden</span>
              </li>
            </ul>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Number */}
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-semibold mb-2">
                  Bestellnummer *
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  required
                  placeholder="z.B. #12345678"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  E-Mail-Adresse *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="ihre@email.de"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold mb-2">
                  Vollständiger Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Max Mustermann"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                  Telefonnummer
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+49 123 456789"
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-semibold mb-2">
                Lieferadresse *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Straße und Hausnummer, PLZ und Stadt"
                rows={3}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-semibold mb-2">
                Grund für den Widerruf
              </label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Bitte wählen Sie einen Grund --</option>
                <option value="changed_mind">Ich habe meine Meinung geändert</option>
                <option value="product_issue">Produktqualität nicht zufriedenstellend</option>
                <option value="different_expectations">Nicht meinen Erwartungen entsprechend</option>
                <option value="found_cheaper">Anderswo günstiger gefunden</option>
                <option value="other">Sonstiges</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-2">
                Zusätzliche Informationen
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Teilen Sie uns mit, wenn Sie weitere Informationen haben..."
                rows={4}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Consent */}
            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
              <p className="text-sm text-muted-foreground mb-4">
                Mit dem Absenden dieses Formulars erklären Sie, dass die oben angegebenen Informationen korrekt sind und Sie die Bedingungen für den Widerruf verstanden haben.
              </p>
              <p className="text-xs text-muted-foreground">
                * Pflichtfelder
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Wird eingereicht...' : 'Widerrufsantrag einreichen'}
            </button>
          </form>

          {/* Alternative Contact */}
          <div className="mt-12 p-6 bg-stone-50 rounded-lg border border-stone-200">
            <h3 className="text-lg font-semibold mb-3">Alternative Kontaktmöglichkeit</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sie können Ihren Widerruf auch direkt per E-Mail einreichen:
            </p>
            <div className="space-y-2 text-sm">
              <p>
                <strong>E-Mail:</strong>{' '}
                <a href="mailto:info@herbsom.de" className="text-primary hover:underline">
                  info@herbsom.de
                </a>
              </p>
              <p>
                <strong>Betreff:</strong> Widerruf Bestellung [Bestellnummer]
              </p>
              <p className="text-muted-foreground">
                Bitte geben Sie Ihre Bestellnummer und Ihre Kontaktdaten an.
              </p>
            </div>
          </div>

          {/* Legal Info */}
          <div className="mt-8 pt-8 border-t border-stone-200">
            <h3 className="text-lg font-semibold mb-4">Rechtliche Grundlagen</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Dieses Widerrufsformular basiert auf den Bestimmungen des § 355 BGB (Bürgerliches Gesetzbuch) und der Verordnung (EU) 2019/2161 (Omnibus-Richtlinie).
              </p>
              <p>
                <strong>Widerrufsrecht:</strong> Sie haben das Recht, Ihre Bestellung innerhalb von 14 Tagen ohne Angabe von Gründen zu widerrufen. Die Widerrufsfrist beginnt mit dem Tag, an dem Sie die Ware erhalten haben.
              </p>
              <p>
                <strong>Ausnahmen:</strong> Das Widerrufsrecht gilt nicht für Waren, die Sie geöffnet oder benutzt haben, insbesondere bei Kosmetikprodukten aus hygienischen Gründen.
              </p>
              <p>
                Für weitere Informationen lesen Sie bitte unsere{' '}
                <a href="/shipping" className="text-primary hover:underline">
                  Versand- und Rückgabebedingungen
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
