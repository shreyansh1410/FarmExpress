import React from 'react';
import { contactData } from '../utils/contact';
import { Mail, User, Send, Phone, MapPin } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const ContactUs = () => {
  const [form, setForm] = React.useState({ name: "", email: "", message: "" });
  const [status, setStatus] = React.useState({ loading: false, success: "", error: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: "", error: "" });
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      };
      const res = await axios.post(`${BASE_URL}/contact`, payload);
      setStatus({ loading: false, success: res.data.message || "Message sent successfully.", error: "" });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({
        loading: false,
        success: "",
        error: err?.response?.data?.error || "Failed to send message. Please try again.",
      });
    }
  };

  return (
    <section id="contact" className="px-4 py-14 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-base-content mb-2">Get in Touch</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-3 rounded-full"></div>
          <p className="text-base opacity-70">
            We're here to help and answer any questions you might have
          </p>
        </div>

        <div className="grid lg:grid-cols-7 gap-6 items-start">
          {/* Contact Cards */}
          <div className="lg:col-span-3 space-y-4">
            {contactData.map((item, index) => (
              <div
                key={index}
                className="glass-card apple-glass apple-glass-hover rounded-xl p-4 transition-all duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    {index === 0 ? (
                      <Phone className="w-5 h-5 text-primary" />
                    ) : index === 1 ? (
                      <Mail className="w-5 h-5 text-primary" />
                    ) : (
                      <MapPin className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-base-content mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm opacity-70 mb-2">
                      {item.description}
                    </p>
                    <div className="space-y-0.5">
                      <p className="text-primary font-medium text-sm">
                        {item.phone}
                      </p>
                      <p className="text-base-content/80 text-sm">
                        {item.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-4">
            <div className="glass-card apple-glass apple-glass-hover rounded-xl p-6 transition-all duration-300">
              <h2 className="text-xl font-semibold text-base-content mb-4">
                Send us a Message
              </h2>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-medium text-base-content/80 mb-1 block">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 opacity-50" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="glass-input block w-full pl-9 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 text-sm"
                      placeholder="Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-base-content/80 mb-1 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 opacity-50" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="glass-input block w-full pl-9 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 text-sm"
                      placeholder="Email Address"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-base-content/80 mb-1 block">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="glass-input block w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-200 resize-none text-sm"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                {status.success && (
                  <p className="text-success text-sm">{status.success}</p>
                )}
                {status.error && (
                  <p className="text-error text-sm">{status.error}</p>
                )}

                <button
                  type="submit"
                  disabled={status.loading}
                  className="inline-flex items-center justify-center gap-2 w-full btn btn-primary text-sm disabled:opacity-70"
                >
                  <Send className="w-4 h-4" />
                  {status.loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;